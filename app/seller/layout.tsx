'use client';

import { useState } from 'react';
import SellerAuthGuard from '@/components/SellerAuthGuard';
import SellerSidebar from '@/components/SellerSidebar';
import SellerHeader from '@/components/SellerHeader';

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <SellerAuthGuard>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar - Hidden on mobile, slide in when open */}
        <div
          className={`fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:transform-none ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <SellerSidebar onClose={() => setIsSidebarOpen(false)} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden w-full">
          {/* Header */}
          <SellerHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </SellerAuthGuard>
  );
}
