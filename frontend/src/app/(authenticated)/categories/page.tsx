/**
 * Categories Page
 * Manages transaction categories
 */
'use client';

import { useState } from 'react';
import { CategoryList } from '@/modules/categories/components/category-list';
import { CategoryForm } from '@/modules/categories/components/category-form';
import { Button } from '@/shared/components/ui/button';

export default function CategoriesPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Close Form' : 'New Category'}
        </Button>
      </div>

      <div className="space-y-6">
        {showForm && (
          <div className="flex justify-center">
            <CategoryForm
              onSuccess={() => setShowForm(false)}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        <CategoryList />
      </div>
    </div>
  );
}
