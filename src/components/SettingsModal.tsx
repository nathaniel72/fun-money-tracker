import { useEffect, useState } from 'react';
import { X, Settings as SettingsIcon } from 'lucide-react';
import type { Budget } from '../lib/supabase';

interface SettingsModalProps {
  settings: Budget | null;
  onDelete: (budgetId: string) => void;
  onSave: (budgetId: string, amount: number) => void;
}

export function SettingsModal({ settings, onDelete, onSave }: SettingsModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [amountInput, setAmountInput] = useState('');

  useEffect(() => {
    if (!settings) return;
    setAmountInput(settings.pay_period_amount.toFixed(2));
  }, [settings, isOpen]);

  if (!settings) {
    return null;
  }

  const parsedAmount = Number.parseFloat(amountInput);
  const isAmountValid = Number.isFinite(parsedAmount) && parsedAmount > 0;
  const hasAmountChanged =
    isAmountValid && parsedAmount !== Number(settings.pay_period_amount);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow z-40"
      >
        <SettingsIcon size={20} className="text-gray-700" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{settings.name}</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount Per Period
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amountInput}
                  onChange={(event) => setAmountInput(event.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-lg font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                />
                {!isAmountValid && (
                  <p className="text-sm text-red-500 mt-2">
                    Enter an amount greater than zero.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pay Period
                </label>
                <div className="text-lg text-gray-700">
                  {settings.pay_period_days} days
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Period Start
                </label>
                <div className="text-lg text-gray-700">
                  {new Date(settings.current_period_start).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (!isAmountValid || !hasAmountChanged) return;
                onSave(settings.id, parsedAmount);
                setIsOpen(false);
              }}
              disabled={!hasAmountChanged}
              className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors mt-6 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Save Budget
            </button>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors mt-3"
            >
              Close
            </button>

            <button
              onClick={() => {
                onDelete(settings.id);
                setIsOpen(false);
              }}
              className="w-full border border-red-200 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-50 transition-colors mt-3"
            >
              Delete Budget
            </button>
          </div>
        </div>
      )}
    </>
  );
}