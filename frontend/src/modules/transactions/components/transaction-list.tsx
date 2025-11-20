/**
 * Transaction List Component
 * Displays a paginated list of transactions
 * Uses React Query for data fetching
 */
'use client';

import { useState } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { useTransactions } from '../hooks/use-transactions';
import { TransactionFilters } from '../types/transaction.types';

interface TransactionListProps {
  accountId?: string;
  initialFilters?: TransactionFilters;
}

export function TransactionList({ accountId, initialFilters }: TransactionListProps) {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<TransactionFilters>({
    ...initialFilters,
    accountId,
  });

  const { data, isLoading, error, isError } = useTransactions({
    filters,
    page,
    limit: 10,
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <p>Loading transactions...</p>
        </div>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="p-6">
        <div className="text-red-500">
          <p>Error loading transactions:</p>
          <p>{error?.message}</p>
        </div>
      </Card>
    );
  }

  const transactions = data?.data || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Transactions</h2>

        {/* Filter Options (simplified) */}
        <div className="mb-6 flex gap-4">
          <select
            value={filters.type || ''}
            onChange={(e) =>
              setFilters({ ...filters, type: e.target.value as any || undefined })
            }
            className="p-2 border rounded"
          >
            <option value="">All Types</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>

          <select
            value={filters.isPaid === undefined ? '' : filters.isPaid ? 'true' : 'false'}
            onChange={(e) => {
              const value = e.target.value;
              setFilters({
                ...filters,
                isPaid: value === '' ? undefined : value === 'true',
              });
            }}
            className="p-2 border rounded"
          >
            <option value="">All Status</option>
            <option value="true">Paid</option>
            <option value="false">Pending</option>
          </select>
        </div>

        {/* Transaction List */}
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No transactions found</p>
        ) : (
          <div className="space-y-2">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded hover:bg-gray-50"
              >
                <div className="flex-1">
                  <p className="font-medium">
                    {transaction.description || 'No description'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString()} •{' '}
                    {transaction.isPaid ? 'Paid' : 'Pending'}
                  </p>
                </div>

                <div className="text-right">
                  <p
                    className={`font-bold ${
                      transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'INCOME' ? '+' : '-'}
                    {transaction.currency} {transaction.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>

            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>

            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
