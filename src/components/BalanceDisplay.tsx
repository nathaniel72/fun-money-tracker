interface BalanceDisplayProps {
  balance: number;
  totalBudget: number;
}

export function BalanceDisplay({ balance, totalBudget }: BalanceDisplayProps) {
  const percentage = totalBudget > 0 ? (balance / totalBudget) * 100 : 0;
    const spentRatio = totalBudget > 0 ? (totalBudget - balance) / totalBudget : 0;
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  const barColorClass =
    spentRatio >= 0.75
      ? 'from-red-400 to-red-500'
      : spentRatio >= 0.5
        ? 'from-amber-400 to-amber-500'
        : 'from-emerald-400 to-emerald-500';

  return (
    <div className="text-center py-12">
      <div className="text-gray-500 text-sm font-medium mb-2">Fun Money</div>
      <div className="text-6xl font-bold mb-8">
        ${balance.toFixed(2)}
      </div>
      <div className="max-w-md mx-auto px-6">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${barColorClass} transition-all duration-500`}
            style={{ width: `${clampedPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>${(totalBudget - balance).toFixed(2)} spent</span>
          <span>${totalBudget.toFixed(2)} budget</span>
        </div>
      </div>
    </div>
  );
}
