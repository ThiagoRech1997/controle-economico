/**
 * Accounts Page
 * Manages user bank accounts and wallets
 */
'use client';

import { useState } from 'react';
import { AccountList } from '@/modules/accounts/components/account-list';
import { AccountForm } from '@/modules/accounts/components/account-form';
import { Button } from '@/shared/components/ui/button';

export default function AccountsPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Accounts</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Close Form' : 'New Account'}
        </Button>
      </div>

      <div className="space-y-6">
        {showForm && (
          <div className="flex justify-center">
            <AccountForm
              onSuccess={() => setShowForm(false)}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        <AccountList />
      </div>
    </div>
  );
}
