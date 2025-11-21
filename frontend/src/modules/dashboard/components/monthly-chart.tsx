/**
 * Monthly Chart Component
 * Displays income vs expenses over the last 6 months
 */
'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { formatCurrency } from '@/shared/lib/utils';
import type { MonthlyData } from '../types/dashboard.types';

interface MonthlyChartProps {
  data: MonthlyData[];
}

export function MonthlyChart({ data }: MonthlyChartProps) {
  const maxValue = Math.max(
    ...data.flatMap((d) => [d.income, d.expenses]),
    1
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>📊</span>
          Monthly Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Legend */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500"></div>
              <span>Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-500"></div>
              <span>Expenses</span>
            </div>
          </div>

          {/* Chart */}
          <div className="space-y-3">
            {data.map((month) => (
              <div key={`${month.year}-${month.month}`} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">
                    {month.monthName} {month.year}
                  </span>
                  <span
                    className={
                      month.balance >= 0 ? 'text-green-600' : 'text-red-600'
                    }
                  >
                    {month.balance >= 0 ? '+' : ''}
                    {formatCurrency(month.balance, 'BRL')}
                  </span>
                </div>
                <div className="flex gap-1 h-6">
                  {/* Income bar */}
                  <div
                    className="bg-green-500 rounded-l transition-all"
                    style={{
                      width: `${(month.income / maxValue) * 50}%`,
                    }}
                    title={`Income: ${formatCurrency(month.income, 'BRL')}`}
                  />
                  {/* Expenses bar */}
                  <div
                    className="bg-red-500 rounded-r transition-all"
                    style={{
                      width: `${(month.expenses / maxValue) * 50}%`,
                    }}
                    title={`Expenses: ${formatCurrency(month.expenses, 'BRL')}`}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatCurrency(month.income, 'BRL')}</span>
                  <span>{formatCurrency(month.expenses, 'BRL')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
