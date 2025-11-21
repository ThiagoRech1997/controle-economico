/**
 * Account Form Component
 * Form for creating and editing accounts
 */
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/shared/components/ui/card';
import { useCreateAccount } from '../hooks/use-create-account';
import { useUpdateAccount } from '../hooks/use-update-account';
import type {
  CreateAccountInput,
  UpdateAccountInput,
  Account,
  AccountType,
  Currency,
} from '../types/account.types';

interface AccountFormProps {
  account?: Account;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ACCOUNT_TYPES: { value: AccountType; label: string }[] = [
  { value: 'CHECKING', label: 'Checking Account' },
  { value: 'SAVINGS', label: 'Savings Account' },
  { value: 'CASH', label: 'Cash' },
  { value: 'INVESTMENT', label: 'Investment' },
];

const CURRENCIES: { value: Currency; label: string }[] = [
  { value: 'BRL', label: 'BRL - Brazilian Real' },
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
];

export function AccountForm({ account, onSuccess, onCancel }: AccountFormProps) {
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!account;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateAccountInput>({
    defaultValues: account
      ? {
          name: account.name,
          type: account.type,
          initialBalance: account.initialBalance,
          currency: account.currency,
          isActive: account.isActive,
        }
      : {
          name: '',
          type: 'CHECKING',
          initialBalance: 0,
          currency: 'BRL',
          isActive: true,
        },
  });

  const createMutation = useCreateAccount({
    onSuccess: () => {
      setError(null);
      reset();
      onSuccess?.();
    },
    onError: (err) => {
      setError(err.message || 'Failed to create account');
    },
  });

  const updateMutation = useUpdateAccount({
    onSuccess: () => {
      setError(null);
      onSuccess?.();
    },
    onError: (err) => {
      setError(err.message || 'Failed to update account');
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = async (data: CreateAccountInput) => {
    setError(null);

    if (isEditing && account) {
      const updateData: UpdateAccountInput = {
        name: data.name,
        type: data.type,
        isActive: data.isActive,
      };
      await updateMutation.mutateAsync({ accountId: account.id, data: updateData });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Account' : 'New Account'}</CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Account Name
            </label>
            <Input
              id="name"
              placeholder="Main Checking Account"
              {...register('name', {
                required: 'Account name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              })}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="type" className="text-sm font-medium">
              Account Type
            </label>
            <select
              id="type"
              className="w-full h-10 px-3 py-2 text-sm border rounded-md bg-background"
              {...register('type', { required: 'Account type is required' })}
            >
              {ACCOUNT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>

          {!isEditing && (
            <>
              <div className="space-y-2">
                <label htmlFor="initialBalance" className="text-sm font-medium">
                  Initial Balance
                </label>
                <Input
                  id="initialBalance"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('initialBalance', {
                    required: 'Initial balance is required',
                    min: { value: 0, message: 'Balance must be positive' },
                    valueAsNumber: true,
                  })}
                />
                {errors.initialBalance && (
                  <p className="text-sm text-red-500">
                    {errors.initialBalance.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="currency" className="text-sm font-medium">
                  Currency
                </label>
                <select
                  id="currency"
                  className="w-full h-10 px-3 py-2 text-sm border rounded-md bg-background"
                  {...register('currency')}
                >
                  {CURRENCIES.map((currency) => (
                    <option key={currency.value} value={currency.value}>
                      {currency.label}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div className="flex items-center space-x-2">
            <input
              id="isActive"
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300"
              {...register('isActive')}
            />
            <label htmlFor="isActive" className="text-sm font-medium">
              Active account
            </label>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isPending}>
            {isPending
              ? isEditing
                ? 'Saving...'
                : 'Creating...'
              : isEditing
                ? 'Save Changes'
                : 'Create Account'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
