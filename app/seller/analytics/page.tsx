'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, Package, AlertTriangle, BookOpen, ShoppingCart, BarChart3 } from 'lucide-react';
import { getAnalyticsOverview, getBestSellingBooks, getLowStockAlerts, getRevenueTimeline } from '@/utils/admin';
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
  const { formatPrice } = useCurrency();
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
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Analytics</h1>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
        <p className="text-gray-600 mt-1">Track your performance and sales metrics.</p>
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
            </div>

            {/* Pending Revenue */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  Pending
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{formatPrice(analytics.revenue.pending)}</h3>
              <p className="text-sm text-gray-600 mt-1">Pending Revenue</p>
            </div>

            {/* Completed Orders */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                  Orders
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{analytics.orders.completed}</h3>
              <p className="text-sm text-gray-600 mt-1">Completed Orders</p>
            </div>

            {/* Active Books */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                  Books
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{analytics.books.active}</h3>
              <p className="text-sm text-gray-600 mt-1">Active Books</p>
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
                <p className="text-sm text-gray-600">Pending Orders</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {analytics.orders.pending}
                </p>
              </div>
              <Package className="w-8 h-8 text-gray-400" />
            </div>
          </div>
        </div>
      )}

      {/* Revenue Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Revenue Over Time</h2>
                <p className="text-xs text-gray-500">Track your revenue trends</p>
              </div>
            </div>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as any)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white hover:border-gray-300 transition-colors"
            >
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
            </select>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : timeline.length > 0 ? (
            <div className="space-y-6">
              {/* Bar Chart */}
              <div className="flex items-end justify-between h-64 gap-2">
                {timeline.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex flex-col justify-end h-full">
                      <div
                        className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg hover:from-blue-700 hover:to-blue-500 transition-all cursor-pointer relative group"
                        style={{ height: `${(item.revenue / maxRevenue) * 100}%`, minHeight: item.revenue > 0 ? '4px' : '0' }}
                      >
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg z-10">
                          <div className="font-semibold">{formatPrice(item.revenue)}</div>
                          <div className="text-gray-300">{item.orders} orders</div>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 text-center truncate w-full font-medium">
                      {formatTimelineLabel(item)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Total Revenue</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatPrice(timeline.reduce((sum, t) => sum + t.revenue, 0))}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Total Orders</p>
                  <p className="text-lg font-bold text-gray-900">
                    {timeline.reduce((sum, t) => sum + t.orders, 0)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Average</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatPrice(timeline.reduce((sum, t) => sum + t.revenue, 0) / timeline.length)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <BarChart3 className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">No revenue data available</p>
              <p className="text-gray-400 text-xs mt-1">Data will appear once you start making sales</p>
            </div>
          )}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Selling Books */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Best Selling Books</h2>
                <p className="text-xs text-gray-500">Top performers by revenue</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="w-12 h-16 bg-gray-200 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : bestSelling.length > 0 ? (
              <div className="space-y-3">
                {bestSelling.map((book, index) => (
                  <div key={book._id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 text-green-700 font-bold text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="w-12 h-16 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
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
                      <p className="text-xs text-gray-500 truncate">{book.author}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs">
                        <span className="text-gray-600">{book.totalQuantitySold} sold</span>
                        <span className="text-gray-400">•</span>
                        <span className="font-semibold text-green-600">{formatPrice(book.totalRevenue)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm">No sales data yet</p>
                <p className="text-gray-400 text-xs mt-1">Your best sellers will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h2>
                <p className="text-xs text-gray-500">Books running low on inventory</p>
              </div>
            </div>
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
              <div className="space-y-3">
                {lowStock.map((book) => (
                  <div key={book._id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-12 h-16 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
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
                      <p className="text-xs text-gray-500 truncate">{book.author}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          book.stock <= 3 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {book.stock} left
                        </span>
                        <span className="text-xs text-gray-500">{formatPrice(book.price)}</span>
                      </div>
                    </div>
                    <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${
                      book.stock <= 3 ? 'text-red-500' : 'text-orange-500'
                    }`} />
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
