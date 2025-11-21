/**
 * Account List Component
 * Displays all accounts with summary
 */
'use client';

import { useState } from 'react';
import { useAccounts } from '../hooks/use-accounts';
import { AccountCard } from './account-card';
import { AccountForm } from './account-form';
import { formatCurrency } from '@/shared/lib/utils';
import type { AccountWithBalance } from '../types/account.types';

export function AccountList() {
  const [editingAccount, setEditingAccount] = useState<AccountWithBalance | null>(
    null
  );
  const [showInactive, setShowInactive] = useState(false);

  const { data: accounts, isLoading, error } = useAccounts({
    filters: {
      includeBalance: true,
      isActive: showInactive ? undefined : true,
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 border border-red-200 rounded-md">
        Error loading accounts: {error.message}
      </div>
    );
  }

  const totalBalance =
    accounts?.reduce((sum, acc) => {
      // Only sum BRL accounts for simplicity
      if (acc.currency === 'BRL' && acc.isActive) {
        return sum + acc.currentBalance;
      }
      return sum;
    }, 0) ?? 0;

  const activeAccounts = accounts?.filter((acc) => acc.isActive) ?? [];

  if (editingAccount) {
    return (
      <div className="max-w-md mx-auto">
        <AccountForm
          account={editingAccount}
          onSuccess={() => setEditingAccount(null)}
          onCancel={() => setEditingAccount(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Balance (BRL)</p>
            <p
              className={`text-3xl font-bold ${
                totalBalance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {formatCurrency(totalBalance, 'BRL')}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Active Accounts</p>
            <p className="text-3xl font-bold">{activeAccounts.length}</p>
          </div>
          <div className="flex items-end">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm">Show inactive accounts</span>
            </label>
          </div>
        </div>
      </div>

      {/* Account Grid */}
      {accounts && accounts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              onEdit={setEditingAccount}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-muted-foreground">
            No accounts found. Create your first account to get started.
          </p>
        </div>
      )}
    </div>
  );
}
