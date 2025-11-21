/**
 * Register Page
 * Next.js App Router Registration Page
 */
'use client';

import { RegisterForm } from '@/modules/auth/components/register-form';
import { GuestGuard } from '@/modules/auth/components/auth-guard';

export default function RegisterPage() {
  return (
    <GuestGuard>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <RegisterForm />
      </div>
    </GuestGuard>
  );
}
