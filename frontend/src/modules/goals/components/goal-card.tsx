/**
 * Goal Card Component
 * Displays a single goal with progress and actions
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
import { Input } from '@/shared/components/ui/input';
import { formatCurrency, formatDate } from '@/shared/lib/utils';
import { GoalProgressBar } from './goal-progress-bar';
import {
  useUpdateProgress,
  useCompleteGoal,
  useCancelGoal,
  useDeleteGoal,
} from '../hooks/use-goal-mutations';
import { useGoalForecast } from '../hooks/use-goal-forecast';
import type { Goal, GoalStatus } from '../types/goal.types';

interface GoalCardProps {
  goal: Goal;
  onEdit?: (goal: Goal) => void;
}

const STATUS_LABELS: Record<GoalStatus, string> = {
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

const STATUS_COLORS: Record<GoalStatus, string> = {
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
};

export function GoalCard({ goal, onEdit }: GoalCardProps) {
  const [showActions, setShowActions] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showForecast, setShowForecast] = useState(false);
  const [newProgress, setNewProgress] = useState(goal.currentValue.toString());

  const { data: forecast, isLoading: forecastLoading } = useGoalForecast({
    goalId: goal.id,
    enabled: showForecast,
  });

  const updateProgress = useUpdateProgress({
    onSuccess: () => setShowProgress(false),
    onError: (error) => alert(error.message),
  });

  const completeGoal = useCompleteGoal({
    onError: (error) => alert(error.message),
  });

  const cancelGoal = useCancelGoal({
    onError: (error) => alert(error.message),
  });

  const deleteGoal = useDeleteGoal({
    onError: (error) => alert(error.message),
  });

  const handleUpdateProgress = async () => {
    const value = parseFloat(newProgress);
    if (isNaN(value) || value < 0) {
      alert('Please enter a valid positive number');
      return;
    }
    await updateProgress.mutateAsync({
      goalId: goal.id,
      data: { currentValue: value },
    });
  };

  const isActive = goal.status === 'IN_PROGRESS';

  return (
    <Card className={`${!isActive ? 'opacity-75' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{goal.name}</CardTitle>
            {goal.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {goal.description}
              </p>
            )}
          </div>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              STATUS_COLORS[goal.status]
            }`}
          >
            {STATUS_LABELS[goal.status]}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>{formatCurrency(goal.currentValue, 'BRL')}</span>
            <span className="text-muted-foreground">
              of {formatCurrency(goal.targetValue, 'BRL')}
            </span>
          </div>
          <GoalProgressBar percentage={goal.progressPercentage} />
        </div>

        {/* Remaining */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Remaining</span>
          <span className="font-medium">
            {formatCurrency(goal.remainingAmount, 'BRL')}
          </span>
        </div>

        {/* Target Date */}
        {goal.targetDate && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Target Date</span>
            <span>{formatDate(goal.targetDate)}</span>
          </div>
        )}

        {/* Update Progress Form */}
        {showProgress && isActive && (
          <div className="pt-2 border-t space-y-2">
            <label className="text-sm font-medium">Update Progress</label>
            <div className="flex gap-2">
              <Input
                type="number"
                step="0.01"
                value={newProgress}
                onChange={(e) => setNewProgress(e.target.value)}
                placeholder="New value"
              />
              <Button
                size="sm"
                onClick={handleUpdateProgress}
                disabled={updateProgress.isPending}
              >
                {updateProgress.isPending ? '...' : 'Save'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowProgress(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Forecast */}
        {showForecast && (
          <div className="pt-2 border-t">
            <h4 className="text-sm font-medium mb-2">Forecast</h4>
            {forecastLoading ? (
              <p className="text-sm text-muted-foreground">Loading forecast...</p>
            ) : forecast ? (
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">Monthly Surplus: </span>
                  <span className={forecast.averageMonthlySurplus >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(forecast.averageMonthlySurplus, 'BRL')}
                  </span>
                </p>
                {forecast.isAchievable ? (
                  <>
                    <p>
                      <span className="text-muted-foreground">Est. Months: </span>
                      <span>{forecast.estimatedMonths}</span>
                    </p>
                    {forecast.estimatedDate && (
                      <p>
                        <span className="text-muted-foreground">Est. Date: </span>
                        <span>{formatDate(forecast.estimatedDate)}</span>
                      </p>
                    )}
                  </>
                ) : null}
                <p className="text-muted-foreground italic">{forecast.message}</p>
              </div>
            ) : null}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2 pt-0">
        {isActive && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowProgress(!showProgress)}
            >
              {showProgress ? 'Hide' : 'Update Progress'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowForecast(!showForecast)}
            >
              {showForecast ? 'Hide' : 'Forecast'}
            </Button>
          </>
        )}

        {showActions ? (
          <>
            {isActive && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit?.(goal)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  onClick={() => completeGoal.mutateAsync(goal.id)}
                  disabled={completeGoal.isPending}
                >
                  Complete
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => cancelGoal.mutateAsync(goal.id)}
                  disabled={cancelGoal.isPending}
                >
                  Cancel Goal
                </Button>
              </>
            )}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (confirm('Delete this goal?')) {
                  deleteGoal.mutateAsync(goal.id);
                }
              }}
              disabled={deleteGoal.isPending}
            >
              Delete
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowActions(false)}
            >
              Close
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowActions(true)}
          >
            More Actions
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
