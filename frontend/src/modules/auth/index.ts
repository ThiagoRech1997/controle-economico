/**
 * Auth Module - Main Barrel Export
 */

// Types
export type {
  User,
  LoginInput,
  RegisterInput,
  AuthResponse,
  RefreshTokenInput,
  AuthState,
  AuthActions,
  AuthStore,
} from './types/auth.types';

// Services
export { authService } from './services/auth.service';

// Store
export { useAuthStore } from './store/auth.store';

// Hooks
export { useLogin } from './hooks/use-login';
export { useRegister } from './hooks/use-register';
export { useAuth, useRequireAuth, useRedirectIfAuthenticated } from './hooks/use-auth';

// Components
export { LoginForm } from './components/login-form';
export { RegisterForm } from './components/register-form';
export { AuthGuard, GuestGuard } from './components/auth-guard';
