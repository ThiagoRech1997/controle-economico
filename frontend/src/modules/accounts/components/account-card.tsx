/**
 * Account Card Component
 * Displays a single account with balance and actions
 */
'use client';

import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { formatCurrency } from '@/shared/lib/utils';
import { useDeleteAccount } from '../hooks/use-delete-account';
import type { AccountWithBalance, AccountType } from '../types/account.types';

interface AccountCardProps {
  account: AccountWithBalance;
  onEdit?: (account: AccountWithBalance) => void;
}

const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  CHECKING: 'Checking',
  SAVINGS: 'Savings',
  CASH: 'Cash',
  INVESTMENT: 'Investment',
};

const ACCOUNT_TYPE_ICONS: Record<AccountType, string> = {
  CHECKING: '🏦',
  SAVINGS: '💰',
  CASH: '💵',
  INVESTMENT: '📈',
};

export function AccountCard({ account, onEdit }: AccountCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const deleteMutation = useDeleteAccount({
    onSuccess: () => {
      setShowDeleteConfirm(false);
    },
    onError: (error) => {
      alert(error.message || 'Failed to delete account');
      setShowDeleteConfirm(false);
    },
  });

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(account.id);
  };

  const balanceColor =
    account.currentBalance >= 0 ? 'text-green-600' : 'text-red-600';

  return (
    <Card className={`relative ${!account.isActive ? 'opacity-60' : ''}`}>
      {!account.isActive && (
        <div className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-200 rounded">
          Inactive
        </div>
      )}

      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">
            {ACCOUNT_TYPE_ICONS[account.type]}
          </span>
          <div>
            <CardTitle className="text-lg">{account.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {ACCOUNT_TYPE_LABELS[account.type]}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          <div>
            <p className="text-sm text-muted-foreground">Current Balance</p>
            <p className={`text-2xl font-bold ${balanceColor}`}>
              {formatCurrency(account.currentBalance, account.currency)}
            </p>
          </div>

          <div className="text-sm text-muted-foreground">
            Initial: {formatCurrency(account.initialBalance, account.currency)}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end space-x-2 pt-0">
        {showDeleteConfirm ? (
          <>
            <span className="text-sm text-muted-foreground mr-2">
              Delete?
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Confirm'}
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit?.(account)}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
