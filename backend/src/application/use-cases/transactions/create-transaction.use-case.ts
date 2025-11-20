/**
 * Create Transaction Use Case
 * Pure TypeScript - No framework dependencies
 * Orchestrates the business logic for creating a transaction
 */
import { Transaction } from '../../../domain/entities/transaction.entity';
import { ITransactionRepository } from '../../../domain/repositories/transaction.repository.interface';
import { Money } from '../../../domain/value-objects/money.vo';
import { TransactionType } from '../../../domain/value-objects/transaction-type.vo';
import { CreateTransactionDto } from '../../dtos/transactions/create-transaction.dto';
import { TransactionResponseDto } from '../../dtos/transactions/transaction-response.dto';
import { v4 as uuidv4 } from 'uuid';

/**
 * Use Case: Create a new transaction
 *
 * This use case:
 * 1. Receives input data (DTO)
 * 2. Creates a domain entity with business rules
 * 3. Persists via repository (port)
 * 4. Returns output data (DTO)
 */
export class CreateTransactionUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(input: CreateTransactionDto): Promise<TransactionResponseDto> {
    // 1. Validate input
    this.validateInput(input);

    // 2. Create value objects
    const money = new Money(input.amount, input.currency || 'BRL');
    const type = TransactionType.fromString(input.type);

    // 3. Parse date if string
    const date = typeof input.date === 'string' ? new Date(input.date) : input.date;

    // 4. Create domain entity (business rules are enforced here)
    const transaction = Transaction.create(
      uuidv4(),
      input.accountId,
      input.categoryId,
      type,
      money,
      date,
      input.isPaid ?? true,
      input.description,
      input.notes,
    );

    // 5. Persist via repository
    const savedTransaction = await this.transactionRepository.save(transaction);

    // 6. Map to output DTO
    return this.mapToDto(savedTransaction);
  }

  private validateInput(input: CreateTransactionDto): void {
    if (!input.accountId || input.accountId.trim() === '') {
      throw new Error('Account ID is required');
    }

    if (!input.categoryId || input.categoryId.trim() === '') {
      throw new Error('Category ID is required');
    }

    if (!input.type || !['INCOME', 'EXPENSE'].includes(input.type)) {
      throw new Error('Invalid transaction type');
    }

    if (!input.amount || input.amount <= 0) {
      throw new Error('Amount must be greater than zero');
    }

    if (!input.date) {
      throw new Error('Date is required');
    }
  }

  private mapToDto(transaction: Transaction): TransactionResponseDto {
    return {
      id: transaction.id,
      accountId: transaction.accountId,
      categoryId: transaction.categoryId,
      type: transaction.type.value,
      amount: transaction.amount.amount,
      currency: transaction.amount.currency,
      description: transaction.description,
      date: transaction.date,
      isPaid: transaction.isPaid,
      notes: transaction.notes,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    };
  }
}
