/**
 * Goal Progress Bar Component
 * Visual progress indicator for goals
 */
'use client';

interface GoalProgressBarProps {
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function GoalProgressBar({
  percentage,
  size = 'md',
  showLabel = true,
}: GoalProgressBarProps) {
  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  const heights = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const getColor = () => {
    if (clampedPercentage >= 100) return 'bg-green-500';
    if (clampedPercentage >= 75) return 'bg-blue-500';
    if (clampedPercentage >= 50) return 'bg-yellow-500';
    if (clampedPercentage >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 rounded-full ${heights[size]} overflow-hidden`}>
        <div
          className={`${heights[size]} ${getColor()} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-sm text-muted-foreground mt-1 text-right">
          {clampedPercentage.toFixed(1)}%
        </p>
      )}
    </div>
  );
}
