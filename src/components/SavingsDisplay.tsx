import { PiggyBank } from 'lucide-react';
import type { Savings } from '../lib/supabase';

interface SavingsDisplayProps {
  savings: Savings[];
}

export function SavingsDisplay({ savings }: SavingsDisplayProps) {
  const totalSavings = savings.reduce((sum, s) => sum + s.amount, 0);

  if (savings.length === 0) {
    return null;
  }

  return (
    <div className="px-6 py-6">
      <div className="bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <PiggyBank size={24} />
          <h3 className="text-lg font-semibold">Total Saved</h3>
        </div>
        <div className="text-4xl font-bold mb-4">${totalSavings.toFixed(2)}</div>
        <div className="text-sm opacity-90">
          {savings.length} pay period{savings.length !== 1 ? 's' : ''} completed
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {savings.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-xl p-4 flex items-center justify-between"
          >
            <div className="text-sm text-gray-600">
              {new Date(s.period_start).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}{' '}
              -{' '}
              {new Date(s.period_end).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </div>
            <div className="font-bold text-emerald-600">
              +${s.amount.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
