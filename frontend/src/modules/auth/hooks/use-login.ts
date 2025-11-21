/**
 * Auth Module - Login Hook
 * React Query mutation for user login
 */

import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/auth.store';
import type { LoginInput, AuthResponse } from '../types/auth.types';

interface UseLoginOptions {
  onSuccess?: (data: AuthResponse) => void;
  onError?: (error: Error) => void;
}

export function useLogin(options: UseLoginOptions = {}) {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: LoginInput) => authService.login(data),
    onSuccess: (data) => {
      // Update auth store with tokens and user
      setAuth(data);
      options.onSuccess?.(data);
    },
    onError: (error: Error) => {
      options.onError?.(error);
    },
  });
}
