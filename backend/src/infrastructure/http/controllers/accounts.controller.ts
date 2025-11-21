import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

import { CreateAccountDto } from '@/application/dtos/accounts/create-account.dto';
import { UpdateAccountDto } from '@/application/dtos/accounts/update-account.dto';
import {
  AccountResponseDto,
  AccountWithBalanceResponseDto,
  AccountBalanceResponseDto,
} from '@/application/dtos/accounts/account-response.dto';
import { CreateAccountUseCase } from '@/application/use-cases/accounts/create-account.use-case';
import { UpdateAccountUseCase } from '@/application/use-cases/accounts/update-account.use-case';
import { DeleteAccountUseCase } from '@/application/use-cases/accounts/delete-account.use-case';
import { ListAccountsUseCase } from '@/application/use-cases/accounts/list-accounts.use-case';
import { GetAccountBalanceUseCase } from '@/application/use-cases/accounts/get-account-balance.use-case';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

/**
 * Accounts Controller
 *
 * Handles all account-related HTTP endpoints:
 * - Create account
 * - List accounts
 * - Update account
 * - Delete account
 * - Get account balance
 */
@ApiTags('Accounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountsController {
  constructor(
    private readonly createAccountUseCase: CreateAccountUseCase,
    private readonly updateAccountUseCase: UpdateAccountUseCase,
    private readonly deleteAccountUseCase: DeleteAccountUseCase,
    private readonly listAccountsUseCase: ListAccountsUseCase,
    private readonly getAccountBalanceUseCase: GetAccountBalanceUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create new account',
    description: 'Creates a new financial account for the authenticated user',
  })
  @ApiResponse({
    status: 201,
    description: 'Account created successfully',
    type: AccountResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Account name already exists',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async create(
    @Request() req: any,
    @Body() dto: CreateAccountDto,
  ): Promise<AccountResponseDto> {
    return this.createAccountUseCase.execute(req.user.id, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List all accounts',
    description: 'Lists all accounts for the authenticated user',
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    type: Boolean,
    description: 'Filter by active status',
  })
  @ApiQuery({
    name: 'includeBalance',
    required: false,
    type: Boolean,
    description: 'Include current balance calculation',
  })
  @ApiResponse({
    status: 200,
    description: 'List of accounts',
    type: [AccountWithBalanceResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async list(
    @Request() req: any,
    @Query('isActive') isActive?: string,
    @Query('includeBalance') includeBalance?: string,
  ): Promise<AccountWithBalanceResponseDto[]> {
    return this.listAccountsUseCase.execute(req.user.id, {
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
      includeBalance: includeBalance === 'true',
    });
  }

  @Get(':id/balance')
  @ApiOperation({
    summary: 'Get account balance',
    description: 'Calculates and returns the current balance of an account',
  })
  @ApiResponse({
    status: 200,
    description: 'Account balance',
    type: AccountBalanceResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Account not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not account owner',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getBalance(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<AccountBalanceResponseDto> {
    return this.getAccountBalanceUseCase.execute(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update account',
    description: 'Updates an existing account',
  })
  @ApiResponse({
    status: 200,
    description: 'Account updated successfully',
    type: AccountResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Account not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not account owner',
  })
  @ApiResponse({
    status: 409,
    description: 'Account name already exists',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateAccountDto,
  ): Promise<AccountResponseDto> {
    return this.updateAccountUseCase.execute(id, req.user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete account',
    description:
      'Deletes an account (only if it has no transactions)',
  })
  @ApiResponse({
    status: 204,
    description: 'Account deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Account not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not account owner',
  })
  @ApiResponse({
    status: 409,
    description: 'Cannot delete account with transactions',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async delete(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<void> {
    return this.deleteAccountUseCase.execute(id, req.user.id);
  }
}
