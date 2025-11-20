/**
 * Transaction Mapper
 * Converts between Prisma models and Domain entities
 * Infrastructure layer - Framework specific
 */
import { Transaction as PrismaTransaction } from '.prisma/client';
import { Transaction } from '../../../../domain/entities/transaction.entity';
import { Money } from '../../../../domain/value-objects/money.vo';
import { TransactionType } from '../../../../domain/value-objects/transaction-type.vo';

export class TransactionMapper {
  /**
   * Convert Prisma model to Domain entity
   */
  static toDomain(prismaTransaction: PrismaTransaction): Transaction {
    const money = new Money(
      Number(prismaTransaction.amount),
      'BRL', // Currency from account if needed
    );

    const type = TransactionType.fromString(prismaTransaction.type);

    return Transaction.reconstruct({
      id: prismaTransaction.id,
      accountId: prismaTransaction.accountId,
      categoryId: prismaTransaction.categoryId,
      type,
      amount: money,
      description: prismaTransaction.description || undefined,
      date: prismaTransaction.date,
      isPaid: prismaTransaction.isPaid,
      notes: prismaTransaction.notes || undefined,
      createdAt: prismaTransaction.createdAt,
      updatedAt: prismaTransaction.updatedAt,
    });
  }

  /**
   * Convert Domain entity to Prisma model data
   */
  static toPrisma(transaction: Transaction) {
    return {
      id: transaction.id,
      accountId: transaction.accountId,
      categoryId: transaction.categoryId,
      type: transaction.type.value,
      amount: transaction.amount.amount, // Prisma accepts number for Decimal fields
      description: transaction.description || null,
      date: transaction.date,
      isPaid: transaction.isPaid,
      notes: transaction.notes || null,
    };
  }

  /**
   * Convert array of Prisma models to Domain entities
   */
  static toDomainList(prismaTransactions: PrismaTransaction[]): Transaction[] {
    return prismaTransactions.map((pt) => this.toDomain(pt));
  }
}
