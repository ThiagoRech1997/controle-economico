/**
 * Transaction Form Component
 * Isolated component for creating/editing transactions
 * Uses Shadcn/UI components and React Hook Form
 */
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Card } from '@/shared/components/ui/card';
import { Select } from '@/shared/components/ui/select';
import { useCreateTransaction } from '../hooks/use-create-transaction';
import { CreateTransactionInput, TransactionType } from '../types/transaction.types';

interface TransactionFormProps {
  accountId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function TransactionForm({ accountId, onSuccess, onCancel }: TransactionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTransactionInput>({
    defaultValues: {
      accountId: accountId || '',
      type: 'EXPENSE',
      isPaid: true,
      currency: 'BRL',
    },
  });

  const createMutation = useCreateTransaction({
    onSuccess: (data) => {
      console.log('Transaction created:', data);
      reset();
      onSuccess?.();
    },
    onError: (error) => {
      console.error('Error creating transaction:', error);
      alert('Error creating transaction: ' + error.message);
    },
  });

  const onSubmit = async (data: CreateTransactionInput) => {
    setIsSubmitting(true);
    try {
      await createMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">New Transaction</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Transaction Type */}
        <div>
          <label className="block text-sm font-medium mb-2">Type</label>
          <select
            {...register('type', { required: 'Type is required' })}
            className="w-full p-2 border rounded"
          >
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
          {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium mb-2">Amount</label>
          <Input
            type="number"
            step="0.01"
            {...register('amount', {
              required: 'Amount is required',
              min: { value: 0.01, message: 'Amount must be greater than 0' },
              valueAsNumber: true,
            })}
            placeholder="0.00"
          />
          {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
        </div>

        {/* Account ID (if not pre-selected) */}
        {!accountId && (
          <div>
            <label className="block text-sm font-medium mb-2">Account</label>
            <Input
              {...register('accountId', { required: 'Account is required' })}
              placeholder="Select account..."
            />
            {errors.accountId && (
              <p className="text-red-500 text-sm mt-1">{errors.accountId.message}</p>
            )}
          </div>
        )}

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <Input
            {...register('categoryId', { required: 'Category is required' })}
            placeholder="Select category..."
          />
          {errors.categoryId && (
            <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <Input {...register('description')} placeholder="Optional description..." />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium mb-2">Date</label>
          <Input
            type="date"
            {...register('date', { required: 'Date is required' })}
            defaultValue={new Date().toISOString().split('T')[0]}
          />
          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
        </div>

        {/* Is Paid */}
        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('isPaid')}
            className="w-4 h-4 mr-2"
            defaultChecked
          />
          <label className="text-sm font-medium">Mark as paid</label>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium mb-2">Notes</label>
          <textarea
            {...register('notes')}
            className="w-full p-2 border rounded"
            rows={3}
            placeholder="Optional notes..."
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Transaction'}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
