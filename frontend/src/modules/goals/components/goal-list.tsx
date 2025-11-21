/**
 * Goal List Component
 * Displays all goals with filtering
 */
'use client';

import { useState } from 'react';
import { useGoals } from '../hooks/use-goals';
import { GoalCard } from './goal-card';
import { GoalForm } from './goal-form';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { formatCurrency } from '@/shared/lib/utils';
import type { Goal, GoalStatus } from '../types/goal.types';

export function GoalList() {
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [filterStatus, setFilterStatus] = useState<GoalStatus | 'ALL'>('ALL');

  const { data: goals, isLoading, error } = useGoals({
    filters: filterStatus === 'ALL' ? undefined : { status: filterStatus },
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
        Error loading goals: {error.message}
      </div>
    );
  }

  if (editingGoal) {
    return (
      <div className="max-w-md mx-auto">
        <GoalForm
          goal={editingGoal}
          onSuccess={() => setEditingGoal(null)}
          onCancel={() => setEditingGoal(null)}
        />
      </div>
    );
  }

  const activeGoals = goals?.filter((g) => g.status === 'IN_PROGRESS') ?? [];
  const completedGoals = goals?.filter((g) => g.status === 'COMPLETED') ?? [];

  const totalTarget = activeGoals.reduce((sum, g) => sum + g.targetValue, 0);
  const totalCurrent = activeGoals.reduce((sum, g) => sum + g.currentValue, 0);
  const overallProgress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Filter:</span>
        {(['ALL', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const).map((status) => (
          <Button
            key={status}
            variant={filterStatus === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus(status)}
          >
            {status === 'ALL'
              ? 'All'
              : status === 'IN_PROGRESS'
                ? 'In Progress'
                : status === 'COMPLETED'
                  ? 'Completed'
                  : 'Cancelled'}
          </Button>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Active Goals</p>
            <p className="text-3xl font-bold text-blue-600">{activeGoals.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-3xl font-bold text-green-600">{completedGoals.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Target</p>
            <p className="text-2xl font-bold">{formatCurrency(totalTarget, 'BRL')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Overall Progress</p>
            <p className="text-2xl font-bold">{overallProgress.toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Goal Grid */}
      {goals && goals.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} onEdit={setEditingGoal} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-muted-foreground">
            No goals found. Create your first goal to start tracking your progress.
          </p>
        </div>
      )}
    </div>
  );
}
