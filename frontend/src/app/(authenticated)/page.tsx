/**
 * Home Page (Dashboard)
 * Protected main page after authentication
 */
import Link from 'next/link';
import { DashboardContainer } from '@/modules/dashboard';

export default function HomePage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Link
            href="/transactions"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            + New Transaction
          </Link>
        </div>
      </div>

      {/* Dashboard Widgets */}
      <DashboardContainer />

      {/* Quick Navigation */}
      <div className="mt-8 pt-6 border-t">
        <h2 className="text-lg font-semibold mb-4 text-muted-foreground">Quick Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/transactions"
            className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-center"
          >
            <span className="text-2xl">💳</span>
            <p className="mt-2 font-medium">Transactions</p>
          </Link>

          <Link
            href="/goals"
            className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-center"
          >
            <span className="text-2xl">🎯</span>
            <p className="mt-2 font-medium">Goals</p>
          </Link>

          <Link
            href="/accounts"
            className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-center"
          >
            <span className="text-2xl">🏦</span>
            <p className="mt-2 font-medium">Accounts</p>
          </Link>

          <Link
            href="/categories"
            className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-center"
          >
            <span className="text-2xl">📁</span>
            <p className="mt-2 font-medium">Categories</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
