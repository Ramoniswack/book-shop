'use client';

import { useEffect, useState } from 'react';
import { BookOpen, ShoppingCart, DollarSign, AlertTriangle, Package } from 'lucide-react';
import StatCard from '@/components/StatCard';
import StatCardSkeleton from '@/components/StatCardSkeleton';
import { getAnalyticsOverview, getSellerOrders, getLowStockAlerts } from '@/utils/seller';
import { useCurrency } from '@/contexts/CurrencyContext';

interface AnalyticsData {
  revenue: {
    total: number;
    pending: number;
    avgOrderValue: number;
  };
  orders: {
    completed: number;
    pending: number;
    total: number;
  };
  books: {
    total: number;
    active: number;
    outOfStock: number;
    hidden: number;
  };
}

interface Order {
  _id: string;
  userId: {
    firstName: string;
    lastName: string;
    email: string;
  };
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
}

interface LowStockBook {
  _id: string;
  title: string;
  author: string;
  stock: number;
  price: number;
}

export default function SellerDashboard() {
  const { formatPrice } = useCurrency();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStockBooks, setLowStockBooks] = useState<LowStockBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch analytics overview
      const analyticsRes = await getAnalyticsOverview();
      if (analyticsRes.success) {
        setAnalytics(analyticsRes.data);
      }

      // Fetch recent orders
      const ordersRes = await getSellerOrders({ page: 1, limit: 5 });
      if (ordersRes.success) {
        setRecentOrders(ordersRes.data);
      }

      // Fetch low stock alerts
      const lowStockRes = await getLowStockAlerts(10);
      if (lowStockRes.success) {
        setLowStockBooks(lowStockRes.data.books);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-800 font-medium">Error loading dashboard</p>
          </div>
          <p className="text-red-600 mt-2">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : analytics ? (
          <>
            <StatCard
              title="Total Revenue"
              value={formatPrice(analytics.revenue.total)}
              icon={DollarSign}
              iconColor="text-green-600"
              iconBgColor="bg-green-100"
            />
            <StatCard
              title="Total Orders"
              value={analytics.orders.total}
              icon={ShoppingCart}
              iconColor="text-blue-600"
              iconBgColor="bg-blue-100"
            />
            <StatCard
              title="Total Books"
              value={analytics.books.total}
              icon={BookOpen}
              iconColor="text-purple-600"
              iconBgColor="bg-purple-100"
            />
            <StatCard
              title="Out of Stock"
              value={analytics.books.outOfStock}
              icon={Package}
              iconColor="text-red-600"
              iconBgColor="bg-red-100"
            />
          </>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.userId.firstName} {order.userId.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatPrice(order.totalAmount)}
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          order.orderStatus === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.orderStatus === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No orders yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h2>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : lowStockBooks.length > 0 ? (
              <div className="space-y-4">
                {lowStockBooks.slice(0, 5).map((book) => (
                  <div key={book._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">{book.title}</p>
                      <p className="text-sm text-gray-500">{book.author}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600">
                        {book.stock} left
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatPrice(book.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">All books are well stocked</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
