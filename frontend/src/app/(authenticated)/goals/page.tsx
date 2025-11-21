/**
 * Goals Page
 * Manages financial goals with forecasting
 */
'use client';

import { useState } from 'react';
import { GoalList } from '@/modules/goals/components/goal-list';
import { GoalForm } from '@/modules/goals/components/goal-form';
import { Button } from '@/shared/components/ui/button';

export default function GoalsPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Goals</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Close Form' : 'New Goal'}
        </Button>
      </div>

      <div className="space-y-6">
        {showForm && (
          <div className="flex justify-center">
            <GoalForm
              onSuccess={() => setShowForm(false)}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        <GoalList />
      </div>
    </div>
  );
}
