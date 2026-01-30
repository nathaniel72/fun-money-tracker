import { useEffect, useState } from 'react';
import { supabase, getUserId } from './lib/supabase';
import type { Budget, Expense, Savings } from './lib/supabase';
import { BalanceDisplay } from './components/BalanceDisplay';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { SettingsModal } from './components/SettingsModal';
import { SavingsDisplay } from './components/SavingsDisplay';
import { SwipeContainer } from './components/SwipeContainer';
import { NewBudgetModal } from './components/NewBudgetModal';
import { EditExpenseModal } from './components/EditExpenseModal';

function App() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [currentBudgetIndex, setCurrentBudgetIndex] = useState(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [savings, setSavings] = useState<Savings[]>([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const userId = getUserId();

  const currentBudget = budgets[currentBudgetIndex];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (currentBudget) {
      loadBudgetData(currentBudget);
      checkAndRolloverPeriod(currentBudget);
    }
  }, [currentBudget]);

  const loadData = async () => {
    try {
      const { data: budgetsData, error: budgetsError } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (budgetsError) throw budgetsError;

      if (budgetsData && budgetsData.length > 0) {
        setBudgets(budgetsData);
        setCurrentBudgetIndex(0);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error loading budgets:', error);
      setLoading(false);
    }
  };

  const loadBudgetData = async (budget: Budget) => {
    try {
      const { data: expensesData } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId)
        .eq('budget_id', budget.id)
        .eq('pay_period_start', budget.current_period_start)
        .order('expense_date', { ascending: false });

      if (expensesData) {
        setExpenses(expensesData);
        const totalSpent = expensesData.reduce((sum, e) => sum + Number(e.amount), 0);
        setBalance(Number(budget.pay_period_amount) - totalSpent);
      } else {
        setBalance(Number(budget.pay_period_amount));
      }

      const { data: savingsData } = await supabase
        .from('savings')
        .select('*')
        .eq('user_id', userId)
        .eq('budget_id', budget.id)
        .order('created_at', { ascending: false });

      if (savingsData) {
        setSavings(savingsData);
      }
    } catch (error) {
      console.error('Error loading budget data:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAndRolloverPeriod = async (budget: Budget) => {
    const periodStart = new Date(budget.current_period_start);
    const periodEnd = new Date(periodStart);
    periodEnd.setDate(periodEnd.getDate() + budget.pay_period_days);
    const today = new Date();

    if (today >= periodEnd) {
      await rolloverPeriod(budget, periodStart, periodEnd);
    }
  };

  const rolloverPeriod = async (budget: Budget, oldStart: Date, oldEnd: Date) => {
    try {
      const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
      const leftover = Number(budget.pay_period_amount) - totalSpent;

      if (leftover > 0) {
        await supabase.from('savings').insert({
          user_id: userId,
          budget_id: budget.id,
          amount: leftover,
          period_start: oldStart.toISOString().split('T')[0],
          period_end: oldEnd.toISOString().split('T')[0],
        });
      }

      const newStart = new Date(oldEnd);
      newStart.setDate(newStart.getDate() + 1);

      await supabase
        .from('budgets')
        .update({
          current_period_start: newStart.toISOString().split('T')[0],
          updated_at: new Date().toISOString(),
        })
        .eq('id', budget.id)
        .eq('user_id', userId);

      const updatedBudgets = budgets.map((b) =>
        b.id === budget.id
          ? { ...b, current_period_start: newStart.toISOString().split('T')[0] }
          : b
      );
      setBudgets(updatedBudgets);
      loadBudgetData(updatedBudgets[currentBudgetIndex]);
    } catch (error) {
      console.error('Error rolling over period:', error);
    }
  };

  const handleAddExpense = async (amount: number, description: string, date: string) => {
    if (!currentBudget) return;

    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert({
          user_id: userId,
          budget_id: currentBudget.id,
          amount,
          description,
          expense_date: date,
          pay_period_start: currentBudget.current_period_start,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setExpenses([data, ...expenses]);
        setBalance(balance - amount);
      }
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      const expense = expenses.find((e) => e.id === id);
      if (!expense) return;

      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      setExpenses(expenses.filter((e) => e.id !== id));
      setBalance(balance + Number(expense.amount));
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleEditExpense = async (id: string, amount: number, description: string, date: string) => {
    try {
      const oldExpense = expenses.find((e) => e.id === id);
      if (!oldExpense) return;

      const { data, error } = await supabase
        .from('expenses')
        .update({
          amount,
          description,
          expense_date: date,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      const updatedExpense = data ?? { ...oldExpense, amount, description, expense_date: date };
      setExpenses((prevExpenses) => {
        const nextExpenses = prevExpenses
          .map((expense) => (expense.id === id ? updatedExpense : expense))
          .sort(
            (a, b) =>
              new Date(b.expense_date).getTime() - new Date(a.expense_date).getTime()
          );
        const totalSpent = nextExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
        setBalance(Number(currentBudget?.pay_period_amount ?? 0) - totalSpent);
        return nextExpenses;
      });

      setEditingExpense(null);
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const handleCreateBudget = async (
    name: string,
    amount: number,
    days: number,
    startDate: string
  ) => {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .insert({
          user_id: userId,
          name,
          pay_period_amount: amount,
          pay_period_days: days,
          current_period_start: startDate,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setBudgets([...budgets, data]);
      }
    } catch (error) {
      console.error('Error creating budget:', error);
    }
  };
  
  const handleDeleteBudget = async (budgetId: string) => {
    try {
      await supabase.from('expenses').delete().eq('user_id', userId).eq('budget_id', budgetId);
      await supabase.from('savings').delete().eq('user_id', userId).eq('budget_id', budgetId);

      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', budgetId)
        .eq('user_id', userId);

      if (error) throw error;

      const updatedBudgets = budgets.filter((budget) => budget.id !== budgetId);
      setBudgets(updatedBudgets);

      if (updatedBudgets.length === 0) {
        setCurrentBudgetIndex(0);
        setExpenses([]);
        setSavings([]);
        setBalance(0);
        return;
      }

      const nextIndex = Math.min(currentBudgetIndex, updatedBudgets.length - 1);
      setCurrentBudgetIndex(nextIndex);
      loadBudgetData(updatedBudgets[nextIndex]);
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  const handleSaveBudget = async (budgetId: string, amount: number) => {
    try {
      const { error } = await supabase
        .from('budgets')
        .update({
          pay_period_amount: amount,
          updated_at: new Date().toISOString(),
        })
        .eq('id', budgetId)
        .eq('user_id', userId);

      if (error) throw error;

      const updatedBudgets = budgets.map((budget) =>
        budget.id === budgetId ? { ...budget, pay_period_amount: amount } : budget
      );
      setBudgets(updatedBudgets);

      if (currentBudget?.id === budgetId) {
        const totalSpent = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
        setBalance(amount - totalSpent);
      }
    } catch (error) {
      console.error('Error updating budget:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (budgets.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-lg text-center">
          <h1 className="text-3xl font-bold mb-2">Welcome</h1>
          <p className="text-gray-600 mb-8">
            Create your first budget to start tracking your spending!
          </p>
          <NewBudgetModal onCreate={handleCreateBudget} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SwipeContainer
        onSwipeLeft={() =>
          setCurrentBudgetIndex(Math.min(currentBudgetIndex + 1, budgets.length - 1))
        }
        onSwipeRight={() => setCurrentBudgetIndex(Math.max(currentBudgetIndex - 1, 0))}
        canSwipeLeft={currentBudgetIndex < budgets.length - 1}
        canSwipeRight={currentBudgetIndex > 0}
      >
        <div className="min-h-screen bg-gray-50">
          <div className="text-center pt-6 pb-2">
            <h1 className="text-2xl font-bold text-gray-900">{currentBudget?.name}</h1>
          </div>

          <div className="flex justify-center gap-2 pb-6">
            {budgets.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBudgetIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentBudgetIndex
                    ? 'bg-black w-6'
                    : 'bg-gray-300 w-2'
                }`}
              />
            ))}
          </div>

          <div className="max-w-2xl mx-auto px-6">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <BalanceDisplay balance={balance} totalBudget={currentBudget?.pay_period_amount || 0} />
              <ExpenseForm onAddExpense={handleAddExpense} />

              <div className="mt-6">
                <SavingsDisplay savings={savings.filter((s) => s.budget_id === currentBudget?.id)} />
              </div>

              <div className="mt-6">
                <ExpenseList expenses={expenses} onDeleteExpense={handleDeleteExpense} onEditExpense={setEditingExpense} />
              </div>
            </div>
          </div>
        </div>
      </SwipeContainer>

      <SettingsModal
        settings={currentBudget}
        onDelete={handleDeleteBudget}
        onSave={handleSaveBudget}
      />
      <NewBudgetModal onCreate={handleCreateBudget} />
      <EditExpenseModal
        expense={editingExpense}
        isOpen={editingExpense !== null}
        onClose={() => setEditingExpense(null)}
        onSave={handleEditExpense}
      />
    </div>
  );
}

export default App;
