'use client';

import { useEffect, useState } from 'react';
import { BookOpen, ShoppingCart, DollarSign, AlertTriangle, Package, TrendingUp, Eye, ArrowRight } from 'lucide-react';
import Link from 'next/link';
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

      const [analyticsRes, ordersRes, lowStockRes] = await Promise.all([
        getAnalyticsOverview(),
        getSellerOrders({ page: 1, limit: 5 }),
        getLowStockAlerts(10),
      ]);

      if (analyticsRes.success) {
        setAnalytics(analyticsRes.data);
      }

      if (ordersRes.success) {
        setRecentOrders(ordersRes.data);
      }

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
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </>
        ) : analytics ? (
          <>
            {/* Total Revenue */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  Revenue
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{formatPrice(analytics.revenue.total)}</h3>
              <p className="text-sm text-gray-600 mt-1">Total Revenue</p>
              {analytics.revenue.pending > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  +{formatPrice(analytics.revenue.pending)} pending
                </p>
              )}
            </div>

            {/* Completed Orders */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  Orders
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{analytics.orders.completed}</h3>
              <p className="text-sm text-gray-600 mt-1">Completed Orders</p>
              {analytics.orders.pending > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  {analytics.orders.pending} pending
                </p>
              )}
            </div>

            {/* Total Books */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                  Books
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{analytics.books.total}</h3>
              <p className="text-sm text-gray-600 mt-1">Total Books</p>
              <p className="text-xs text-gray-500 mt-2">
                {analytics.books.active} active • {analytics.books.hidden} hidden
              </p>
            </div>

            {/* Out of Stock */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                  Stock
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{analytics.books.outOfStock}</h3>
              <p className="text-sm text-gray-600 mt-1">Out of Stock</p>
              {analytics.books.outOfStock > 0 && (
                <p className="text-xs text-orange-600 mt-2 font-medium">
                  Needs attention
                </p>
              )}
            </div>
          </>
        ) : null}
      </div>

      {/* Quick Stats Row */}
      {!loading && analytics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Order Value</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {formatPrice(analytics.revenue.avgOrderValue)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {analytics.orders.total}
                </p>
              </div>
              <ShoppingCart className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Books</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {analytics.books.active}
                </p>
              </div>
              <Eye className="w-8 h-8 text-gray-400" />
            </div>
          </div>
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <Link
                href="/seller/orders"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                View all
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
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
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">
                        {order.userId.firstName} {order.userId.lastName}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 text-sm">
                        {formatPrice(order.totalAmount)}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          order.orderStatus === 'delivered'
                            ? 'bg-green-100 text-green-700'
                            : order.orderStatus === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : order.orderStatus === 'shipped'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShoppingCart className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm">No orders yet</p>
                <p className="text-gray-400 text-xs mt-1">Orders will appear here once customers place them</p>
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h2>
              <Link
                href="/seller/books"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                Manage
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
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
              <div className="space-y-3">
                {lowStockBooks.slice(0, 5).map((book) => (
                  <div
                    key={book._id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{book.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{book.author}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p
                        className={`font-semibold text-sm ${
                          book.stock <= 3 ? 'text-red-600' : 'text-orange-600'
                        }`}
                      >
                        {book.stock} left
                      </p>
                      <p className="text-xs text-gray-500">{formatPrice(book.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm">All books are well stocked</p>
                <p className="text-gray-400 text-xs mt-1">You'll be notified when stock runs low</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
