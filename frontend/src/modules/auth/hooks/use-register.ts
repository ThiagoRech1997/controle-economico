/**
 * Auth Module - Register Hook
 * React Query mutation for user registration
 */

import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/auth.store';
import type { RegisterInput, AuthResponse } from '../types/auth.types';

interface UseRegisterOptions {
  onSuccess?: (data: AuthResponse) => void;
  onError?: (error: Error) => void;
}

export function useRegister(options: UseRegisterOptions = {}) {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: RegisterInput) => authService.register(data),
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
