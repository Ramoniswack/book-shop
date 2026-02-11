'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  ShoppingCart,
  Tag,
  BarChart3,
  TrendingUp,
  Settings,
  LogOut,
  User,
  Layers,
} from 'lucide-react';
import { logout } from '@/utils/auth';

const navigation = [
  { name: 'Dashboard', href: '/seller', icon: LayoutDashboard },
  { name: 'Books', href: '/seller/books', icon: BookOpen },
  { name: 'Authors', href: '/seller/authors', icon: User },
  { name: 'Genres', href: '/seller/genres', icon: Layers },
  { name: 'Orders', href: '/seller/orders', icon: ShoppingCart },
  { name: 'Deals', href: '/seller/deals', icon: Tag },
  { name: 'Analytics', href: '/seller/analytics', icon: BarChart3 },
  { name: 'Insights', href: '/seller/insights', icon: TrendingUp },
  { name: 'Settings', href: '/seller/settings', icon: Settings },
];

export default function SellerSidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white w-64">
      {/* Logo/Brand */}
      <div className="flex items-center justify-center h-16 border-b border-gray-800">
        <h1 className="text-xl font-bold">Seller Dashboard</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/seller' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 py-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
}
