/**
 * Transaction Controller (HTTP Adapter)
 * NestJS Controller - Handles HTTP requests
 * Infrastructure layer - Framework specific
 */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateTransactionUseCase } from '../../../application/use-cases/transactions/create-transaction.use-case';
import { CreateTransactionDto } from '../../../application/dtos/transactions/create-transaction.dto';
import { TransactionResponseDto } from '../../../application/dtos/transactions/transaction-response.dto';

// Example query parameters for listing transactions
interface ListTransactionsQuery {
  accountId?: string;
  categoryId?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  isPaid?: string;
  page?: string;
  limit?: string;
}

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    // Add other use cases as needed
  ) {}

  /**
   * POST /transactions
   * Create a new transaction
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({
    status: 201,
    description: 'Transaction created successfully',
    type: TransactionResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    try {
      return await this.createTransactionUseCase.execute(createTransactionDto);
    } catch (error) {
      // Error handling should be done via NestJS exception filters
      throw error;
    }
  }

  /**
   * GET /transactions
   * List transactions with filters and pagination
   */
  @Get()
  @ApiOperation({ summary: 'List all transactions with filters' })
  @ApiQuery({ name: 'accountId', required: false, type: String })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  @ApiQuery({ name: 'type', required: false, enum: ['INCOME', 'EXPENSE'] })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiQuery({ name: 'isPaid', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'List of transactions' })
  async list(@Query() query: ListTransactionsQuery): Promise<any> {
    // This would use a ListTransactionsUseCase (not implemented in this example)
    // const filters = {
    //   accountId: query.accountId,
    //   categoryId: query.categoryId,
    //   type: query.type,
    //   startDate: query.startDate ? new Date(query.startDate) : undefined,
    //   endDate: query.endDate ? new Date(query.endDate) : undefined,
    //   isPaid: query.isPaid === 'true' ? true : query.isPaid === 'false' ? false : undefined,
    // };
    //
    // const pagination = {
    //   page: parseInt(query.page || '1'),
    //   limit: parseInt(query.limit || '10'),
    // };
    //
    // return await this.listTransactionsUseCase.execute(filters, pagination);

    return {
      message: 'List transactions endpoint - implement ListTransactionsUseCase',
    };
  }

  /**
   * GET /transactions/:id
   * Get a single transaction by ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a transaction by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Transaction ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Transaction found', type: TransactionResponseDto })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async findOne(@Param('id') id: string): Promise<any> {
    // This would use a GetTransactionByIdUseCase (not implemented in this example)
    return {
      message: `Get transaction ${id} - implement GetTransactionByIdUseCase`,
    };
  }

  /**
   * PUT /transactions/:id
   * Update a transaction
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update a transaction' })
  @ApiParam({ name: 'id', type: String, description: 'Transaction ID (UUID)' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({ status: 200, description: 'Transaction updated', type: TransactionResponseDto })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async update(
    @Param('id') id: string,
    @Body() updateTransactionDto: any,
  ): Promise<any> {
    // This would use an UpdateTransactionUseCase (not implemented in this example)
    return {
      message: `Update transaction ${id} - implement UpdateTransactionUseCase`,
    };
  }

  /**
   * DELETE /transactions/:id
   * Delete a transaction
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a transaction' })
  @ApiParam({ name: 'id', type: String, description: 'Transaction ID (UUID)' })
  @ApiResponse({ status: 204, description: 'Transaction deleted successfully' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async remove(@Param('id') id: string): Promise<void> {
    // This would use a DeleteTransactionUseCase (not implemented in this example)
  }
}
