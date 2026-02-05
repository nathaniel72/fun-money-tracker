import { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface FixedExpenseFormProps {
  onAddFixedExpense: (name: string, amount: number, chargeDay: number) => void;
}

export function FixedExpenseForm({ onAddFixedExpense }: FixedExpenseFormProps) {
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [chargeDay, setChargeDay] = useState('1');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && name && chargeDay) {
      onAddFixedExpense(name, parseFloat(amount), parseInt(chargeDay));
      setAmount('');
      setName('');
      setChargeDay('1');
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
      >
        <Plus size={16} />
        Add Fixed Expense
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Add Fixed Expense</h2>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

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
            onClick={() => setIsOpen(false)}
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
    </div>
  );
}
