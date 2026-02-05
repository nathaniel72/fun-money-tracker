import { Trash2 } from 'lucide-react';
import type { FixedExpense } from '../lib/supabase';

interface FixedExpensesListProps {
  fixedExpenses: FixedExpense[];
  onDeleteFixedExpense: (id: string) => void;
}

export function FixedExpensesList({ fixedExpenses, onDeleteFixedExpense }: FixedExpensesListProps) {
  if (fixedExpenses.length === 0) {
    return null;
  }

  const totalFixed = fixedExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-gray-900">Fixed Expenses</h2>
        <span className="text-sm font-semibold text-emerald-600">
          ${totalFixed.toFixed(2)}
        </span>
      </div>

      <div className="space-y-2">
        {fixedExpenses.map((expense) => (
          <div
            key={expense.id}
            className="flex items-center justify-between bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors"
          >
            <div className="flex-1">
              <p className="font-medium text-gray-900">{expense.name}</p>
              <p className="text-sm text-gray-600">Day {expense.charge_day}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-900">
                ${Number(expense.amount).toFixed(2)}
              </span>
              <button
                onClick={() => onDeleteFixedExpense(expense.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg p-2 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
