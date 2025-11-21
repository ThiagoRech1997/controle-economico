/**
 * Category Form Component
 * Form for creating and editing categories
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
import { useCreateCategory } from '../hooks/use-create-category';
import { useUpdateCategory } from '../hooks/use-update-category';
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
  Category,
  CategoryType,
} from '../types/category.types';

interface CategoryFormProps {
  category?: Category;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CATEGORY_TYPES: { value: CategoryType; label: string }[] = [
  { value: 'EXPENSE', label: 'Expense' },
  { value: 'INCOME', label: 'Income' },
];

const SUGGESTED_ICONS = ['🛒', '🏠', '🚗', '💊', '🎮', '📚', '✈️', '🍔', '💼', '💰', '📱', '🎁'];
const SUGGESTED_COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#E91E63', '#9C27B0', '#00BCD4', '#795548', '#607D8B'];

export function CategoryForm({ category, onSuccess, onCancel }: CategoryFormProps) {
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!category;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CreateCategoryInput>({
    defaultValues: category
      ? {
          name: category.name,
          type: category.type,
          icon: category.icon || '',
          color: category.color || '#4CAF50',
          isEssential: category.isEssential,
        }
      : {
          name: '',
          type: 'EXPENSE',
          icon: '🛒',
          color: '#4CAF50',
          isEssential: false,
        },
  });

  const selectedIcon = watch('icon');
  const selectedColor = watch('color');

  const createMutation = useCreateCategory({
    onSuccess: () => {
      setError(null);
      reset();
      onSuccess?.();
    },
    onError: (err) => {
      setError(err.message || 'Failed to create category');
    },
  });

  const updateMutation = useUpdateCategory({
    onSuccess: () => {
      setError(null);
      onSuccess?.();
    },
    onError: (err) => {
      setError(err.message || 'Failed to update category');
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = async (data: CreateCategoryInput) => {
    setError(null);

    if (isEditing && category) {
      const updateData: UpdateCategoryInput = {
        name: data.name,
        icon: data.icon,
        color: data.color,
        isEssential: data.isEssential,
      };
      await updateMutation.mutateAsync({ categoryId: category.id, data: updateData });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Category' : 'New Category'}</CardTitle>
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
              Category Name
            </label>
            <Input
              id="name"
              placeholder="Groceries"
              {...register('name', {
                required: 'Category name is required',
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

          {!isEditing && (
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">
                Category Type
              </label>
              <select
                id="type"
                className="w-full h-10 px-3 py-2 text-sm border rounded-md bg-background"
                {...register('type', { required: 'Category type is required' })}
              >
                {CATEGORY_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Icon</label>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setValue('icon', icon)}
                  className={`w-10 h-10 text-xl rounded-md border-2 transition-colors ${
                    selectedIcon === icon
                      ? 'border-primary bg-primary/10'
                      : 'border-transparent hover:bg-gray-100'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
            <Input
              placeholder="Or enter custom icon/emoji"
              {...register('icon')}
              className="mt-2"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Color</label>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setValue('color', color)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${
                    selectedColor === color
                      ? 'border-gray-800 scale-110'
                      : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <Input
              type="color"
              {...register('color')}
              className="mt-2 h-10 cursor-pointer"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="isEssential"
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300"
              {...register('isEssential')}
            />
            <label htmlFor="isEssential" className="text-sm font-medium">
              Essential (fixed cost)
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
                : 'Create Category'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
