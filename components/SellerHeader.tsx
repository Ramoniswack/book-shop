'use client';

import { useEffect, useState } from 'react';
import { Bell, User } from 'lucide-react';
import { getUser } from '@/utils/auth';

export default function SellerHeader() {
  const [user, setUser] = useState<{ firstName: string; lastName: string; email: string } | null>(null);

  useEffect(() => {
    const userData = getUser();
    if (userData) {
      setUser(userData);
    }
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
      {/* Page Title - can be dynamic based on route */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Seller Portal</h2>
      </div>

      {/* Right side - Notifications and User */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          {/* Notification badge - can be dynamic */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Info */}
        <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-900">
              {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}
            </p>
            <p className="text-gray-500 text-xs">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
