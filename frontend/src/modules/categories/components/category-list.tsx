/**
 * Category List Component
 * Displays all categories grouped by type
 */
'use client';

import { useState } from 'react';
import { useCategories } from '../hooks/use-categories';
import { useDeleteCategory } from '../hooks/use-delete-category';
import { CategoryBadge } from './category-badge';
import { CategoryForm } from './category-form';
import { Button } from '@/shared/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import type { Category, CategoryType } from '../types/category.types';

export function CategoryList() {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [filterType, setFilterType] = useState<CategoryType | 'ALL'>('ALL');

  const { data: categories, isLoading, error } = useCategories({
    filters: filterType === 'ALL' ? undefined : { type: filterType },
  });

  const deleteMutation = useDeleteCategory({
    onError: (error) => {
      alert(error.message || 'Failed to delete category');
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
        Error loading categories: {error.message}
      </div>
    );
  }

  if (editingCategory) {
    return (
      <div className="max-w-md mx-auto">
        <CategoryForm
          category={editingCategory}
          onSuccess={() => setEditingCategory(null)}
          onCancel={() => setEditingCategory(null)}
        />
      </div>
    );
  }

  const incomeCategories = categories?.filter((c) => c.type === 'INCOME') ?? [];
  const expenseCategories = categories?.filter((c) => c.type === 'EXPENSE') ?? [];

  const handleDelete = async (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      await deleteMutation.mutateAsync(categoryId);
    }
  };

  const renderCategoryItem = (category: Category) => (
    <div
      key={category.id}
      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <div className="flex items-center gap-3">
        <span
          className="w-10 h-10 flex items-center justify-center text-xl rounded-lg"
          style={{ backgroundColor: category.color ? `${category.color}30` : '#e5e7eb' }}
        >
          {category.icon || '📁'}
        </span>
        <div>
          <p className="font-medium">{category.name}</p>
          <p className="text-sm text-muted-foreground">
            {category.isEssential ? 'Essential (fixed cost)' : 'Discretionary'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setEditingCategory(category)}
        >
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDelete(category.id)}
          disabled={deleteMutation.isPending}
        >
          Delete
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Filter:</span>
        {(['ALL', 'EXPENSE', 'INCOME'] as const).map((type) => (
          <Button
            key={type}
            variant={filterType === type ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType(type)}
          >
            {type === 'ALL' ? 'All' : type === 'EXPENSE' ? 'Expenses' : 'Income'}
          </Button>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Categories</p>
            <p className="text-3xl font-bold">{categories?.length ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Expense Categories</p>
            <p className="text-3xl font-bold text-red-600">{expenseCategories.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Income Categories</p>
            <p className="text-3xl font-bold text-green-600">{incomeCategories.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Categories */}
        {(filterType === 'ALL' || filterType === 'EXPENSE') && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-red-600">📉</span>
                Expense Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {expenseCategories.length > 0 ? (
                expenseCategories.map(renderCategoryItem)
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No expense categories yet
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Income Categories */}
        {(filterType === 'ALL' || filterType === 'INCOME') && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-green-600">📈</span>
                Income Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {incomeCategories.length > 0 ? (
                incomeCategories.map(renderCategoryItem)
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No income categories yet
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
