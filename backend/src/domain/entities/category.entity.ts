/**
 * Category Type Enum
 */
export enum CategoryType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

/**
 * Category Entity
 *
 * Represents a transaction category (income or expense).
 * Categories can be marked as essential (fixed costs) or non-essential (discretionary).
 * Pure domain entity with no framework dependencies.
 */
export class Category {
  private id: string;
  private userId: string;
  private name: string;
  private icon: string | null;
  private color: string | null;
  private isEssential: boolean;
  private type: CategoryType;
  private createdAt: Date;
  private updatedAt: Date;

  private constructor(props: {
    id: string;
    userId: string;
    name: string;
    icon: string | null;
    color: string | null;
    isEssential: boolean;
    type: CategoryType;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id;
    this.userId = props.userId;
    this.name = props.name;
    this.icon = props.icon;
    this.color = props.color;
    this.isEssential = props.isEssential;
    this.type = props.type;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Creates a new Category entity
   */
  static create(props: {
    id: string;
    userId: string;
    name: string;
    type: string | CategoryType;
    icon?: string | null;
    color?: string | null;
    isEssential?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }): Category {
    // Validate userId
    if (!props.userId) {
      throw new Error('User ID is required');
    }

    // Validate name
    if (!props.name || props.name.trim().length < 2) {
      throw new Error('Category name must be at least 2 characters long');
    }

    // Validate and convert type
    const type = Category.validateType(props.type);

    // Validate color format if provided
    if (props.color && !Category.isValidColor(props.color)) {
      throw new Error('Invalid color format. Use hex format (e.g., #FF5733)');
    }

    const now = new Date();

    return new Category({
      id: props.id,
      userId: props.userId,
      name: props.name.trim(),
      icon: props.icon || null,
      color: props.color || null,
      isEssential: props.isEssential ?? false,
      type,
      createdAt: props.createdAt || now,
      updatedAt: props.updatedAt || now,
    });
  }

  private static validateType(type: string | CategoryType): CategoryType {
    if (!type) {
      throw new Error('Category type is required');
    }

    const upperType = typeof type === 'string' ? type.toUpperCase() : type;

    if (!Object.values(CategoryType).includes(upperType as CategoryType)) {
      throw new Error(
        `Invalid category type: ${type}. Valid types are: ${Object.values(CategoryType).join(', ')}`,
      );
    }

    return upperType as CategoryType;
  }

  private static isValidColor(color: string): boolean {
    // Validate hex color format
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexColorRegex.test(color);
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
  }

  getName(): string {
    return this.name;
  }

  getIcon(): string | null {
    return this.icon;
  }

  getColor(): string | null {
    return this.color;
  }

  getIsEssential(): boolean {
    return this.isEssential;
  }

  getType(): CategoryType {
    return this.type;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Business methods
  updateName(newName: string): void {
    if (!newName || newName.trim().length < 2) {
      throw new Error('Category name must be at least 2 characters long');
    }
    this.name = newName.trim();
    this.updatedAt = new Date();
  }

  updateIcon(newIcon: string | null): void {
    this.icon = newIcon;
    this.updatedAt = new Date();
  }

  updateColor(newColor: string | null): void {
    if (newColor && !Category.isValidColor(newColor)) {
      throw new Error('Invalid color format. Use hex format (e.g., #FF5733)');
    }
    this.color = newColor;
    this.updatedAt = new Date();
  }

  markAsEssential(): void {
    this.isEssential = true;
    this.updatedAt = new Date();
  }

  markAsNonEssential(): void {
    this.isEssential = false;
    this.updatedAt = new Date();
  }

  /**
   * Checks if category is for income transactions
   */
  isIncomeCategory(): boolean {
    return this.type === CategoryType.INCOME;
  }

  /**
   * Checks if category is for expense transactions
   */
  isExpenseCategory(): boolean {
    return this.type === CategoryType.EXPENSE;
  }

  /**
   * Checks if the category can be deleted
   * Business rule: categories in use cannot be deleted
   */
  canBeDeleted(hasTransactions: boolean): boolean {
    return !hasTransactions;
  }

  /**
   * Converts entity to plain object for persistence
   */
  toObject(): {
    id: string;
    userId: string;
    name: string;
    icon: string | null;
    color: string | null;
    isEssential: boolean;
    type: string;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
      icon: this.icon,
      color: this.color,
      isEssential: this.isEssential,
      type: this.type,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
