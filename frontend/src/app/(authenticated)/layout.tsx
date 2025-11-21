/**
 * Authenticated Layout
 * Wraps all pages that require authentication
 */
'use client';

import { AuthGuard } from '@/modules/auth/components/auth-guard';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { Button } from '@/shared/components/ui/button';
import Link from 'next/link';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>{children}</main>
      </div>
    </AuthGuard>
  );
}

function Header() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">
            Financial Control
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/transactions"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Transactions
            </Link>
            <Link
              href="/accounts"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Accounts
            </Link>
            <Link
              href="/categories"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/goals"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Goals
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {user && (
              <span className="text-sm text-gray-600">
                Hello, {user.name}
              </span>
            )}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
