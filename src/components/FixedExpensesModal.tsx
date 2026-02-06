import { useState } from 'react';
import { X, Menu, Plus, Trash2 } from 'lucide-react';
import type { FixedExpense } from '../lib/supabase';

interface FixedExpensesModalProps {
  fixedExpenses: FixedExpense[];
  onAddFixedExpense: (name: string, amount: number, chargeDay: number) => void;
  onDeleteFixedExpense: (id: string) => void;
}

export function FixedExpensesModal({
  fixedExpenses,
  onAddFixedExpense,
  onDeleteFixedExpense,
}: FixedExpensesModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [chargeDay, setChargeDay] = useState('1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && name && chargeDay) {
      onAddFixedExpense(name, parseFloat(amount), parseInt(chargeDay));
      setAmount('');
      setName('');
      setChargeDay('1');
      setIsAddingExpense(false);
    }
  };

  const totalFixed = fixedExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-32 right-6 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow z-40"
      >
        <Menu size={20} className="text-gray-700" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Fixed Expenses</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            {!isAddingExpense ? (
              <>
                {fixedExpenses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No fixed expenses yet</p>
                  </div>
                ) : (
                  <>
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                      <p className="text-sm text-gray-600 mb-1">Total Fixed Expenses</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${totalFixed.toFixed(2)}
                      </p>
                    </div>

                    <div className="space-y-2 mb-6">
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
                  </>
                )}

                <button
                  onClick={() => setIsAddingExpense(true)}
                  className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Add Fixed Expense
                </button>
              </>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expense Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    placeholder="Rent, Insurance, etc."
                    required
                    autoFocus
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Day of Month Charged
                  </label>
                  <select
                    value={chargeDay}
                    onChange={(e) => setChargeDay(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    required
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <option key={day} value={day}>
                        Day {day}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddingExpense(false)}
                    className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
