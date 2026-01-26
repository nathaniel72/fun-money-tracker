import { Trash2, Edit2 } from 'lucide-react';
import type { Expense } from '../lib/supabase';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  onEditExpense: (expense: Expense) => void;
}

export function ExpenseList({ expenses, onDeleteExpense, onEditExpense }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="px-6 py-12 text-center text-gray-400">
        No expenses yet. Start tracking your fun money!
      </div>
    );
  }

  return (
    <div className="px-6 pb-6">
      <h3 className="text-sm font-semibold text-gray-500 mb-4">Recent Expenses</h3>
      <div className="space-y-2">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="bg-white rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex-1">
              <div className="font-semibold text-gray-900">{expense.description}</div>
              <div className="text-sm text-gray-500">
                {new Date(expense.expense_date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-lg font-bold text-gray-900">
                ${expense.amount.toFixed(2)}
              </div>
              <button
                onClick={() => onEditExpense(expense)}
                className="text-gray-400 hover:text-emerald-500 transition-colors"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => onDeleteExpense(expense.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
