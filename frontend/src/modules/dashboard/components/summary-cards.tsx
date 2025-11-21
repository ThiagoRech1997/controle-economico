/**
 * Summary Cards Component
 * Displays key financial metrics in cards
 */
'use client';

import { Card, CardContent } from '@/shared/components/ui/card';
import { formatCurrency } from '@/shared/lib/utils';
import type { DashboardSummary } from '../types/dashboard.types';

interface SummaryCardsProps {
  summary: DashboardSummary;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    {
      title: 'Total Balance',
      value: formatCurrency(summary.totalAccountsBalance, 'BRL'),
      subtitle: `${summary.activeAccounts} active accounts`,
      color: summary.totalAccountsBalance >= 0 ? 'text-green-600' : 'text-red-600',
      icon: '💰',
    },
    {
      title: 'Monthly Income',
      value: formatCurrency(summary.totalIncome, 'BRL'),
      subtitle: 'This month',
      color: 'text-green-600',
      icon: '📈',
    },
    {
      title: 'Monthly Expenses',
      value: formatCurrency(summary.totalExpenses, 'BRL'),
      subtitle: 'This month',
      color: 'text-red-600',
      icon: '📉',
    },
    {
      title: 'Monthly Balance',
      value: formatCurrency(summary.balance, 'BRL'),
      subtitle: summary.balance >= 0 ? 'Positive balance' : 'Negative balance',
      color: summary.balance >= 0 ? 'text-green-600' : 'text-red-600',
      icon: summary.balance >= 0 ? '✅' : '⚠️',
    },
    {
      title: 'Active Goals',
      value: summary.activeGoals.toString(),
      subtitle: 'In progress',
      color: 'text-blue-600',
      icon: '🎯',
    },
    {
      title: 'Pending',
      value: summary.pendingTransactions.toString(),
      subtitle: 'Unpaid transactions',
      color: summary.pendingTransactions > 0 ? 'text-yellow-600' : 'text-gray-600',
      icon: '⏳',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
              </div>
              <span className="text-2xl">{card.icon}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
