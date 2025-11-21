/**
 * Login Page
 * Next.js App Router Login Page
 */
'use client';

import { LoginForm } from '@/modules/auth/components/login-form';
import { GuestGuard } from '@/modules/auth/components/auth-guard';

export default function LoginPage() {
  return (
    <GuestGuard>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <LoginForm />
      </div>
    </GuestGuard>
  );
}
