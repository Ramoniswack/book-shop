import SellerAuthGuard from '@/components/SellerAuthGuard';
import SellerSidebar from '@/components/SellerSidebar';
import SellerHeader from '@/components/SellerHeader';

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SellerAuthGuard>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <SellerSidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <SellerHeader />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SellerAuthGuard>
  );
}
