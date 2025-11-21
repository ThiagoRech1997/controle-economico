/**
 * Category Pie Chart Component
 * Displays expenses breakdown by category
 */
'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { formatCurrency } from '@/shared/lib/utils';
import type { CategoryBreakdown } from '../types/dashboard.types';

interface CategoryPieChartProps {
  data: CategoryBreakdown[];
}

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  const total = data.reduce((sum, cat) => sum + cat.total, 0);

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📊</span>
            Expenses by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No expense data for this month
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>📊</span>
          Expenses by Category
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Visual representation */}
          <div className="flex h-4 rounded-full overflow-hidden">
            {data.map((cat, index) => (
              <div
                key={cat.categoryId}
                className="transition-all"
                style={{
                  width: `${cat.percentage}%`,
                  backgroundColor: cat.color || `hsl(${index * 40}, 70%, 50%)`,
                }}
                title={`${cat.categoryName}: ${cat.percentage.toFixed(1)}%`}
              />
            ))}
          </div>

          {/* Category list */}
          <div className="space-y-2">
            {data.slice(0, 8).map((cat, index) => (
              <div
                key={cat.categoryId}
                className="flex items-center justify-between p-2 rounded hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: cat.color || `hsl(${index * 40}, 70%, 50%)`,
                    }}
                  />
                  <span className="text-lg">{cat.icon || '📁'}</span>
                  <span className="font-medium">{cat.categoryName}</span>
                  <span className="text-xs text-muted-foreground">
                    ({cat.transactionCount} transactions)
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(cat.total, 'BRL')}</p>
                  <p className="text-xs text-muted-foreground">
                    {cat.percentage.toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="pt-2 border-t flex justify-between font-bold">
            <span>Total</span>
            <span>{formatCurrency(total, 'BRL')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
