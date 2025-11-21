/**
 * Goal Status Enum
 *
 * Represents the possible states of a financial goal
 */
export enum GoalStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

/**
 * Goal Entity
 *
 * Domain entity representing a financial goal.
 * Contains business rules for goal management.
 */
export class Goal {
  private constructor(
    private readonly id: string,
    private readonly userId: string,
    private name: string,
    private description: string | null,
    private targetValue: number,
    private currentValue: number,
    private targetDate: Date | null,
    private status: GoalStatus,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {}

  /**
   * Factory method to create a Goal entity
   */
  static create(props: {
    id: string;
    userId: string;
    name: string;
    description?: string | null;
    targetValue: number;
    currentValue?: number;
    targetDate?: Date | null;
    status?: GoalStatus;
    createdAt?: Date;
    updatedAt?: Date;
  }): Goal {
    const now = new Date();

    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Goal name is required');
    }

    if (props.targetValue <= 0) {
      throw new Error('Target value must be greater than zero');
    }

    const currentValue = props.currentValue ?? 0;
    if (currentValue < 0) {
      throw new Error('Current value cannot be negative');
    }

    return new Goal(
      props.id,
      props.userId,
      props.name.trim(),
      props.description?.trim() || null,
      props.targetValue,
      currentValue,
      props.targetDate ?? null,
      props.status ?? GoalStatus.IN_PROGRESS,
      props.createdAt ?? now,
      props.updatedAt ?? now,
    );
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

  getDescription(): string | null {
    return this.description;
  }

  getTargetValue(): number {
    return this.targetValue;
  }

  getCurrentValue(): number {
    return this.currentValue;
  }

  getTargetDate(): Date | null {
    return this.targetDate;
  }

  getStatus(): GoalStatus {
    return this.status;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  /**
   * Calculate progress percentage
   */
  getProgressPercentage(): number {
    if (this.targetValue === 0) return 100;
    const percentage = (this.currentValue / this.targetValue) * 100;
    return Math.min(percentage, 100);
  }

  /**
   * Calculate remaining amount to reach the goal
   */
  getRemainingAmount(): number {
    return Math.max(this.targetValue - this.currentValue, 0);
  }

  /**
   * Check if goal is achieved
   */
  isAchieved(): boolean {
    return this.currentValue >= this.targetValue;
  }

  /**
   * Update goal details
   */
  update(props: {
    name?: string;
    description?: string | null;
    targetValue?: number;
    targetDate?: Date | null;
  }): void {
    if (props.name !== undefined) {
      if (!props.name || props.name.trim().length === 0) {
        throw new Error('Goal name is required');
      }
      this.name = props.name.trim();
    }

    if (props.description !== undefined) {
      this.description = props.description?.trim() || null;
    }

    if (props.targetValue !== undefined) {
      if (props.targetValue <= 0) {
        throw new Error('Target value must be greater than zero');
      }
      this.targetValue = props.targetValue;
    }

    if (props.targetDate !== undefined) {
      this.targetDate = props.targetDate;
    }

    this.updatedAt = new Date();
  }

  /**
   * Update current progress value
   */
  updateProgress(newValue: number): void {
    if (newValue < 0) {
      throw new Error('Current value cannot be negative');
    }

    this.currentValue = newValue;
    this.updatedAt = new Date();

    // Auto-complete if target reached
    if (this.isAchieved() && this.status === GoalStatus.IN_PROGRESS) {
      this.status = GoalStatus.COMPLETED;
    }
  }

  /**
   * Add to current progress
   */
  addProgress(amount: number): void {
    if (amount < 0) {
      throw new Error('Amount to add cannot be negative');
    }

    this.updateProgress(this.currentValue + amount);
  }

  /**
   * Mark goal as completed manually
   */
  complete(): void {
    if (this.status === GoalStatus.CANCELLED) {
      throw new Error('Cannot complete a cancelled goal');
    }

    this.status = GoalStatus.COMPLETED;
    this.updatedAt = new Date();
  }

  /**
   * Cancel the goal
   */
  cancel(): void {
    if (this.status === GoalStatus.COMPLETED) {
      throw new Error('Cannot cancel a completed goal');
    }

    this.status = GoalStatus.CANCELLED;
    this.updatedAt = new Date();
  }

  /**
   * Reactivate a cancelled goal
   */
  reactivate(): void {
    if (this.status !== GoalStatus.CANCELLED) {
      throw new Error('Can only reactivate cancelled goals');
    }

    this.status = GoalStatus.IN_PROGRESS;
    this.updatedAt = new Date();
  }

  /**
   * Convert to plain object for persistence
   */
  toObject(): {
    id: string;
    userId: string;
    name: string;
    description: string | null;
    targetValue: number;
    currentValue: number;
    targetDate: Date | null;
    status: GoalStatus;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
      description: this.description,
      targetValue: this.targetValue,
      currentValue: this.currentValue,
      targetDate: this.targetDate,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
