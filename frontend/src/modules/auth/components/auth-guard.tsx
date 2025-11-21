/**
 * Auth Guard Component
 * Protects routes that require authentication
 */
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/auth.store';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

/**
 * Component that wraps protected routes
 * Redirects to login if user is not authenticated
 */
export function AuthGuard({
  children,
  redirectTo = '/login',
  fallback = <AuthLoadingFallback />,
}: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, initialize } = useAuthStore();

  // Initialize auth state on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, redirectTo, router]);

  // Show loading state
  if (isLoading) {
    return <>{fallback}</>;
  }

  // Show nothing while redirecting
  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  // Render children if authenticated
  return <>{children}</>;
}

/**
 * Default loading fallback component
 */
function AuthLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

/**
 * Component that redirects authenticated users away
 * Use on login/register pages
 */
export function GuestGuard({
  children,
  redirectTo = '/',
  fallback = <AuthLoadingFallback />,
}: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, initialize } = useAuthStore();

  // Initialize auth state on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, redirectTo, router]);

  // Show loading state
  if (isLoading) {
    return <>{fallback}</>;
  }

  // Show nothing while redirecting
  if (isAuthenticated) {
    return <>{fallback}</>;
  }

  // Render children if not authenticated
  return <>{children}</>;
}
