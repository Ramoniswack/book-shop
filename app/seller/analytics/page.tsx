'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, Package, AlertTriangle, BookOpen, ShoppingCart } from 'lucide-react';
import { getAnalyticsOverview, getBestSellingBooks, getLowStockAlerts, getRevenueTimeline } from '@/utils/seller';
import StatCard from '@/components/StatCard';
import StatCardSkeleton from '@/components/StatCardSkeleton';

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

interface BestSellingBook {
  _id: string;
  title: string;
  author: string;
  price: number;
  images: string[];
  stock: number;
  totalQuantitySold: number;
  totalRevenue: number;
  orderCount: number;
}

interface LowStockBook {
  _id: string;
  title: string;
  author: string;
  price: number;
  stock: number;
  images: string[];
  status: string;
}

interface TimelineData {
  _id: {
    year: number;
    month?: number;
    day?: number;
    week?: number;
  };
  revenue: number;
  orders: number;
}

export default function SellerAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [bestSelling, setBestSelling] = useState<BestSellingBook[]>([]);
  const [lowStock, setLowStock] = useState<LowStockBook[]>([]);
  const [timeline, setTimeline] = useState<TimelineData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const [analyticsRes, bestSellingRes, lowStockRes, timelineRes] = await Promise.all([
        getAnalyticsOverview(),
        getBestSellingBooks(10),
        getLowStockAlerts(10),
        getRevenueTimeline(period),
      ]);

      if (analyticsRes.success) {
        setAnalytics(analyticsRes.data);
      }

      if (bestSellingRes.success) {
        setBestSelling(bestSellingRes.data);
      }

      if (lowStockRes.success) {
        setLowStock(lowStockRes.data.books);
      }

      if (timelineRes.success) {
        setTimeline(timelineRes.data.timeline);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (month: number) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1];
  };

  const formatTimelineLabel = (item: TimelineData) => {
    if (period === 'year') {
      return item._id.year.toString();
    } else if (period === 'month') {
      return `${getMonthName(item._id.month!)} ${item._id.year}`;
    } else if (period === 'week') {
      return `W${item._id.week} ${item._id.year}`;
    } else {
      return `${item._id.day}/${item._id.month}`;
    }
  };

  const maxRevenue = Math.max(...timeline.map(t => t.revenue), 1);

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-800 font-medium">Error loading analytics</p>
          </div>
          <p className="text-red-600 mt-2">{error}</p>
          <button
            onClick={fetchAnalytics}
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics & Insights</h1>

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
              value={`$${analytics.revenue.total.toFixed(2)}`}
              icon={DollarSign}
              iconColor="text-green-600"
              iconBgColor="bg-green-100"
            />
            <StatCard
              title="Pending Revenue"
              value={`$${analytics.revenue.pending.toFixed(2)}`}
              icon={TrendingUp}
              iconColor="text-blue-600"
              iconBgColor="bg-blue-100"
            />
            <StatCard
              title="Total Orders"
              value={analytics.orders.total}
              icon={ShoppingCart}
              iconColor="text-purple-600"
              iconBgColor="bg-purple-100"
            />
            <StatCard
              title="Active Books"
              value={analytics.books.active}
              icon={BookOpen}
              iconColor="text-indigo-600"
              iconBgColor="bg-indigo-100"
            />
          </>
        ) : null}
      </div>

      {/* Revenue Timeline */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Revenue Over Time</h2>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="day">Daily</option>
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
            <option value="year">Yearly</option>
          </select>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : timeline.length > 0 ? (
          <div className="space-y-4">
            {/* Simple Bar Chart */}
            <div className="flex items-end justify-between h-64 gap-2">
              {timeline.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col justify-end h-full">
                    <div
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t hover:from-blue-600 hover:to-blue-500 transition-all cursor-pointer relative group"
                      style={{ height: `${(item.revenue / maxRevenue) * 100}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        ${item.revenue.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2 text-center truncate w-full">
                    {formatTimelineLabel(item)}
                  </p>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span>Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Total:</span>
                <span>${timeline.reduce((sum, t) => sum + t.revenue, 0).toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Orders:</span>
                <span>{timeline.reduce((sum, t) => sum + t.orders, 0)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-gray-500">
            <TrendingUp className="w-12 h-12 mb-3 text-gray-300" />
            <p>No revenue data available for this period</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Selling Books */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Best Selling Books</h2>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center gap-3">
                    <div className="w-12 h-16 bg-gray-200 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : bestSelling.length > 0 ? (
              <div className="space-y-4">
                {bestSelling.map((book, index) => (
                  <div key={book._id} className="flex items-center gap-3 pb-4 border-b border-gray-100 last:border-0">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="w-12 h-16 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                      {book.images && book.images.length > 0 ? (
                        <img
                          src={book.images[0]}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{book.title}</p>
                      <p className="text-xs text-gray-500">{book.author}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                        <span>{book.totalQuantitySold} sold</span>
                        <span>•</span>
                        <span className="font-semibold text-green-600">${book.totalRevenue.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No sales data yet</p>
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
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center gap-3">
                    <div className="w-12 h-16 bg-gray-200 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : lowStock.length > 0 ? (
              <div className="space-y-4">
                {lowStock.map((book) => (
                  <div key={book._id} className="flex items-center gap-3 pb-4 border-b border-gray-100 last:border-0">
                    <div className="w-12 h-16 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                      {book.images && book.images.length > 0 ? (
                        <img
                          src={book.images[0]}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{book.title}</p>
                      <p className="text-xs text-gray-500">{book.author}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs font-semibold ${
                          book.stock <= 3 ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          Only {book.stock} left
                        </span>
                        <span className="text-xs text-gray-500">• ${book.price.toFixed(2)}</span>
                      </div>
                    </div>
                    <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${
                      book.stock <= 3 ? 'text-red-500' : 'text-yellow-500'
                    }`} />
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
