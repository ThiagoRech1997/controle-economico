/**
 * Accounts Module - Main Barrel Export
 */

// Types
export type {
  Account,
  AccountWithBalance,
  AccountBalance,
  CreateAccountInput,
  UpdateAccountInput,
  AccountFilters,
  AccountType,
  Currency,
} from './types/account.types';

// Services
export { accountService } from './services/account.service';

// Hooks
export { useAccounts } from './hooks/use-accounts';
export { useCreateAccount } from './hooks/use-create-account';
export { useUpdateAccount } from './hooks/use-update-account';
export { useDeleteAccount } from './hooks/use-delete-account';

// Components
export { AccountForm } from './components/account-form';
export { AccountCard } from './components/account-card';
export { AccountList } from './components/account-list';
