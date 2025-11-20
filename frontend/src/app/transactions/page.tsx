/**
 * Transactions Page
 * Next.js App Router Page - Routing Only
 * Delegates to feature module components
 */
'use client';

import { useState } from 'react';
import { TransactionList } from '@/modules/transactions/components/transaction-list';
import { TransactionForm } from '@/modules/transactions/components/transaction-form';
import { Button } from '@/shared/components/ui/button';

export default function TransactionsPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Close Form' : 'New Transaction'}
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Transaction Form */}
        {showForm && (
          <TransactionForm
            onSuccess={() => setShowForm(false)}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* Transaction List */}
        <TransactionList />
      </div>
    </div>
  );
}
