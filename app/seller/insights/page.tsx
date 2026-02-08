'use client';

import { useEffect, useState } from 'react';
import { ShoppingCart, Heart, TrendingUp, Users, Package, AlertTriangle } from 'lucide-react';
import apiRequest from '@/utils/api';

interface CartItem {
  book: {
    _id: string;
    title: string;
    author: string;
    price: number;
    images: string[];
  };
  quantity: number;
  price: number;
  subtotal: number;
}

interface CartInsight {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
}

interface WishlistBook {
  _id: string;
  title: string;
  author: string;
  price: number;
  discountPrice?: number;
  images: string[];
  stock: number;
  status: string;
}

interface WishlistInsight {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  books: WishlistBook[];
  itemCount: number;
}

interface MostWishlisted {
  book: {
    _id: string;
    title: string;
    author: string;
    price: number;
    images: string[];
    stock: number;
  };
  wishlistCount: number;
}

export default function SellerInsights() {
  const [activeTab, setActiveTab] = useState<'cart' | 'wishlist'>('cart');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cart data
  const [cartInsights, setCartInsights] = useState<CartInsight[]>([]);
  const [cartSummary, setCartSummary] = useState({
    totalUsers: 0,
    totalItems: 0,
    potentialRevenue: 0,
  });

  // Wishlist data
  const [wishlistInsights, setWishlistInsights] = useState<WishlistInsight[]>([]);
  const [wishlistSummary, setWishlistSummary] = useState({
    totalUsers: 0,
    totalBooks: 0,
  });
  const [mostWishlisted, setMostWishlisted] = useState<MostWishlisted[]>([]);

  useEffect(() => {
    if (activeTab === 'cart') {
      fetchCartInsights();
    } else {
      fetchWishlistInsights();
    }
  }, [activeTab]);

  const fetchCartInsights = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiRequest('/seller/analytics/cart-insights', {
        method: 'GET',
      });

      if (response.success) {
        setCartInsights(response.data.carts);
        setCartSummary(response.data.summary);
      } else {
        setError(response.message || 'Failed to fetch cart insights');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch cart insights');
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlistInsights = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiRequest('/seller/analytics/wishlist-insights', {
        method: 'GET',
      });

      if (response.success) {
        setWishlistInsights(response.data.wishlists);
        setWishlistSummary(response.data.summary);
        setMostWishlisted(response.data.mostWishlisted);
      } else {
        setError(response.message || 'Failed to fetch wishlist insights');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch wishlist insights');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Customer Insights</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-800 font-medium">Error loading insights</p>
          </div>
          <p className="text-red-600 mt-2">{error}</p>
          <button
            onClick={() => activeTab === 'cart' ? fetchCartInsights() : fetchWishlistInsights()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Customer Insights</h1>
        <p className="text-gray-600">See what customers want and what's in their carts</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('cart')}
              className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'cart'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              Cart Insights
            </button>
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'wishlist'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Heart className="w-5 h-5" />
              Wishlist Insights
            </button>
          </div>
        </div>
      </div>

      {/* Cart Tab */}
      {activeTab === 'cart' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Users with Cart Items</p>
                  <p className="text-3xl font-bold text-gray-900">{cartSummary.totalUsers}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Items in Carts</p>
                  <p className="text-3xl font-bold text-gray-900">{cartSummary.totalItems}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Potential Revenue</p>
                  <p className="text-3xl font-bold text-green-600">${cartSummary.potentialRevenue.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Cart Details */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : cartInsights.length > 0 ? (
            <div className="space-y-4">
              {cartInsights.map((cart) => (
                <div key={cart.user._id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {cart.user.firstName} {cart.user.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{cart.user.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{cart.itemCount} items</p>
                        <p className="text-lg font-bold text-gray-900">${cart.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="space-y-3">
                      {cart.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 pb-3 border-b border-gray-100 last:border-0">
                          <div className="w-16 h-20 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                            {item.book.images && item.book.images.length > 0 ? (
                              <img
                                src={item.book.images[0]}
                                alt={item.book.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.book.title}</p>
                            <p className="text-sm text-gray-600">{item.book.author}</p>
                            <p className="text-sm text-gray-700">
                              Qty: {item.quantity} × ${item.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">${item.subtotal.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No cart data available</p>
              <p className="text-gray-400 text-sm mt-2">
                Cart insights will appear when customers add your books to their carts
              </p>
            </div>
          )}
        </div>
      )}

      {/* Wishlist Tab */}
      {activeTab === 'wishlist' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Users with Wishlist Items</p>
                  <p className="text-3xl font-bold text-gray-900">{wishlistSummary.totalUsers}</p>
                </div>
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-pink-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Unique Books Wishlisted</p>
                  <p className="text-3xl font-bold text-gray-900">{wishlistSummary.totalBooks}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Most Wishlisted Books */}
          {mostWishlisted.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Most Wishlisted Books</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mostWishlisted.map((item, index) => (
                  <div key={item.book._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-16 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                        {item.book.images && item.book.images.length > 0 ? (
                          <img
                            src={item.book.images[0]}
                            alt={item.book.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{item.book.title}</p>
                        <p className="text-xs text-gray-600">{item.book.author}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                          <span className="text-sm font-semibold text-pink-600">
                            {item.wishlistCount} {item.wishlistCount === 1 ? 'user' : 'users'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Wishlist Details */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : wishlistInsights.length > 0 ? (
            <div className="space-y-4">
              {wishlistInsights.map((wishlist) => (
                <div key={wishlist.user._id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {wishlist.user.firstName} {wishlist.user.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{wishlist.user.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{wishlist.itemCount} books</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {wishlist.books.map((book) => (
                        <div key={book._id} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-16 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                              {book.images && book.images.length > 0 ? (
                                <img
                                  src={book.images[0]}
                                  alt={book.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 text-sm truncate">{book.title}</p>
                              <p className="text-xs text-gray-600">{book.author}</p>
                              <p className="text-sm font-semibold text-gray-900 mt-1">
                                ${book.discountPrice || book.price}
                              </p>
                              <p className="text-xs text-gray-500">Stock: {book.stock}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No wishlist data available</p>
              <p className="text-gray-400 text-sm mt-2">
                Wishlist insights will appear when customers add your books to their wishlists
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
