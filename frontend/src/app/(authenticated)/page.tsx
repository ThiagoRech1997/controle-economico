/**
 * Home Page (Dashboard)
 * Protected main page after authentication
 */
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Transactions Card */}
        <Link
          href="/transactions"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <h2 className="text-2xl font-semibold mb-2">Transactions</h2>
          <p className="text-gray-600">Manage your income and expenses</p>
        </Link>

        {/* Goals Card */}
        <Link
          href="/goals"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <h2 className="text-2xl font-semibold mb-2">Goals</h2>
          <p className="text-gray-600">Track and forecast your financial goals</p>
        </Link>

        {/* Accounts Card */}
        <Link
          href="/accounts"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <h2 className="text-2xl font-semibold mb-2">Accounts</h2>
          <p className="text-gray-600">Manage your bank accounts and wallets</p>
        </Link>

        {/* Categories Card */}
        <Link
          href="/categories"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <h2 className="text-2xl font-semibold mb-2">Categories</h2>
          <p className="text-gray-600">Organize your transaction categories</p>
        </Link>

        {/* Reports Card */}
        <Link
          href="/reports"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <h2 className="text-2xl font-semibold mb-2">Reports</h2>
          <p className="text-gray-600">View detailed financial reports and analytics</p>
        </Link>
      </div>
    </div>
  );
}
