/**
 * Category Badge Component
 * Displays a category as a compact badge
 */
'use client';

import type { Category } from '../types/category.types';

interface CategoryBadgeProps {
  category: Category;
  size?: 'sm' | 'md' | 'lg';
  showType?: boolean;
}

export function CategoryBadge({
  category,
  size = 'md',
  showType = false,
}: CategoryBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
  };

  const iconSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClasses[size]}`}
      style={{
        backgroundColor: category.color ? `${category.color}20` : '#e5e7eb',
        color: category.color || '#374151',
      }}
    >
      {category.icon && (
        <span className={iconSizes[size]}>{category.icon}</span>
      )}
      <span>{category.name}</span>
      {showType && (
        <span className="opacity-60">
          ({category.type === 'INCOME' ? 'Income' : 'Expense'})
        </span>
      )}
      {category.isEssential && (
        <span className="text-xs opacity-60" title="Essential">
          *
        </span>
      )}
    </span>
  );
}
