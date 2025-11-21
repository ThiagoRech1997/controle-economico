/**
 * Goal Form Component
 * Form for creating and editing goals
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
import { useCreateGoal } from '../hooks/use-create-goal';
import { useUpdateGoal } from '../hooks/use-goal-mutations';
import type { CreateGoalInput, UpdateGoalInput, Goal } from '../types/goal.types';

interface GoalFormProps {
  goal?: Goal;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function GoalForm({ goal, onSuccess, onCancel }: GoalFormProps) {
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!goal;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateGoalInput>({
    defaultValues: goal
      ? {
          name: goal.name,
          description: goal.description || '',
          targetValue: goal.targetValue,
          currentValue: goal.currentValue,
          targetDate: goal.targetDate
            ? new Date(goal.targetDate).toISOString().split('T')[0]
            : '',
        }
      : {
          name: '',
          description: '',
          targetValue: 1000,
          currentValue: 0,
          targetDate: '',
        },
  });

  const createMutation = useCreateGoal({
    onSuccess: () => {
      setError(null);
      reset();
      onSuccess?.();
    },
    onError: (err) => {
      setError(err.message || 'Failed to create goal');
    },
  });

  const updateMutation = useUpdateGoal({
    onSuccess: () => {
      setError(null);
      onSuccess?.();
    },
    onError: (err) => {
      setError(err.message || 'Failed to update goal');
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = async (data: CreateGoalInput) => {
    setError(null);

    if (isEditing && goal) {
      const updateData: UpdateGoalInput = {
        name: data.name,
        description: data.description,
        targetValue: data.targetValue,
        targetDate: data.targetDate || undefined,
      };
      await updateMutation.mutateAsync({ goalId: goal.id, data: updateData });
    } else {
      await createMutation.mutateAsync({
        ...data,
        targetDate: data.targetDate || undefined,
      });
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Goal' : 'New Goal'}</CardTitle>
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
              Goal Name
            </label>
            <Input
              id="name"
              placeholder="Emergency Fund"
              {...register('name', {
                required: 'Goal name is required',
                maxLength: {
                  value: 100,
                  message: 'Name must be less than 100 characters',
                },
              })}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description (optional)
            </label>
            <textarea
              id="description"
              className="w-full min-h-[80px] px-3 py-2 text-sm border rounded-md bg-background resize-none"
              placeholder="6 months of expenses saved for emergencies"
              {...register('description', {
                maxLength: {
                  value: 500,
                  message: 'Description must be less than 500 characters',
                },
              })}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="targetValue" className="text-sm font-medium">
              Target Value (R$)
            </label>
            <Input
              id="targetValue"
              type="number"
              step="0.01"
              placeholder="10000.00"
              {...register('targetValue', {
                required: 'Target value is required',
                min: { value: 0.01, message: 'Target must be at least R$ 0.01' },
                valueAsNumber: true,
              })}
            />
            {errors.targetValue && (
              <p className="text-sm text-red-500">{errors.targetValue.message}</p>
            )}
          </div>

          {!isEditing && (
            <div className="space-y-2">
              <label htmlFor="currentValue" className="text-sm font-medium">
                Current Value (R$)
              </label>
              <Input
                id="currentValue"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('currentValue', {
                  min: { value: 0, message: 'Value must be positive' },
                  valueAsNumber: true,
                })}
              />
              {errors.currentValue && (
                <p className="text-sm text-red-500">
                  {errors.currentValue.message}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="targetDate" className="text-sm font-medium">
              Target Date (optional)
            </label>
            <Input
              id="targetDate"
              type="date"
              {...register('targetDate')}
            />
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
                : 'Create Goal'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
