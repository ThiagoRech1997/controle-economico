/**
 * Goals Widget Component
 * Displays active goals progress on dashboard
 */
'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { formatCurrency } from '@/shared/lib/utils';
import type { GoalProgress } from '../types/dashboard.types';

interface GoalsWidgetProps {
  goals: GoalProgress[];
}

export function GoalsWidget({ goals }: GoalsWidgetProps) {
  if (goals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🎯</span>
            Active Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No active goals
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🎯</span>
          Active Goals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{goal.name}</span>
                <span className="text-sm text-muted-foreground">
                  {goal.progressPercentage.toFixed(0)}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    goal.progressPercentage >= 100
                      ? 'bg-green-500'
                      : goal.progressPercentage >= 75
                        ? 'bg-blue-500'
                        : goal.progressPercentage >= 50
                          ? 'bg-yellow-500'
                          : 'bg-gray-400'
                  }`}
                  style={{ width: `${Math.min(goal.progressPercentage, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatCurrency(goal.currentValue, 'BRL')}</span>
                <span>{formatCurrency(goal.targetValue, 'BRL')}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
