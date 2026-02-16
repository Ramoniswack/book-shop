'use client';

import { useEffect, useState } from 'react';
import { Package, AlertTriangle, CheckCircle, XCircle, Truck, Clock } from 'lucide-react';
import { getSellerOrders, updateOrderStatus } from '@/utils/admin';
import { useCurrency } from '@/contexts/CurrencyContext';

interface OrderItem {
  bookId: {
    _id: string;
    title: string;
    author: string;
    images: string[];
  };
  title: string;
  quantity: number;
  price: number;
  dealId?: string;
  dealType?: string;
  dealTitle?: string;
  isFreeItem?: boolean;
}

interface Order {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'pending' | 'accepted' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  deliveryMethod: string;
  shippingAddress: string;
  phone?: string;
  orderNote?: string;
  createdAt: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  ordersPerPage: number;
}

export default function SellerOrders() {
  const { formatPrice } = useCurrency();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  // Filters
  const [orderStatusFilter, setOrderStatusFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Status update
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    orderId: string;
    status: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, orderStatusFilter, paymentStatusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        page: currentPage,
        limit: 10,
      };

      if (orderStatusFilter) {
        params.orderStatus = orderStatusFilter;
      }

      if (paymentStatusFilter) {
        params.paymentStatus = paymentStatusFilter;
      }

      const response = await getSellerOrders(params);

      if (response.success) {
        setOrders(response.data);
        setPagination(response.pagination);
      } else {
        setError(response.message || 'Failed to fetch orders');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrderId(orderId);
      const response = await updateOrderStatus(orderId, newStatus);

      if (response.success) {
        // Update local state
        setOrders(orders.map(order =>
          order._id === orderId ? { ...order, orderStatus: newStatus as any } : order
        ));
        setConfirmAction(null);
      } else {
        alert(response.message || 'Failed to update order status');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const openConfirmation = (orderId: string, status: string, message: string) => {
    setConfirmAction({ orderId, status, message });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentBadgeColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canAccept = (order: Order) => order.orderStatus === 'pending';
  const canShip = (order: Order) => order.orderStatus === 'accepted' || order.orderStatus === 'processing';
  const canDeliver = (order: Order) => order.orderStatus === 'shipped';
  const canCancel = (order: Order) => order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled';

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders Management</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-800 font-medium">Error loading orders</p>
          </div>
          <p className="text-red-600 mt-2">{error}</p>
          <button
            onClick={fetchOrders}
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders Management</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Order Status Filter */}
          <select
            value={orderStatusFilter}
            onChange={(e) => {
              setOrderStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Order Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Payment Status Filter */}
          <select
            value={paymentStatusFilter}
            onChange={(e) => {
              setPaymentStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Payment Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : orders.length > 0 ? (
          <>
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Order ID</p>
                      <p className="font-mono text-sm font-medium text-gray-900">{order._id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentBadgeColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Customer Details */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Customer Details</h3>
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-700">
                          <span className="font-medium">Name:</span> {order.userId.firstName} {order.userId.lastName}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Email:</span> {order.userId.email}
                        </p>
                        {order.phone && (
                          <p className="text-gray-700">
                            <span className="font-medium">Phone:</span> {order.phone}
                          </p>
                        )}
                        <p className="text-gray-700">
                          <span className="font-medium">Address:</span> {order.shippingAddress}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Delivery:</span> {order.deliveryMethod}
                        </p>
                        {order.orderNote && (
                          <p className="text-gray-700">
                            <span className="font-medium">Note:</span> {order.orderNote}
                          </p>
                        )}
                        <p className="text-gray-500 text-xs">
                          Ordered on {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Order Items</h3>
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0">
                            <div className="w-12 h-16 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                              {item.bookId?.images && item.bookId.images.length > 0 ? (
                                <img
                                  src={item.bookId.images[0]}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                              <p className="text-xs text-gray-500">{item.bookId?.author}</p>
                              {item.dealTitle && (
                                <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded ${
                                  item.isFreeItem
                                    ? 'bg-green-100 text-green-700'
                                    : item.dealType === 'BOGO'
                                    ? 'bg-purple-100 text-purple-700'
                                    : item.dealType === 'FLASH_SALE'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {item.isFreeItem ? 'FREE (BOGO)' : item.dealTitle}
                                </span>
                              )}
                              <p className="text-xs text-gray-600 mt-1">
                                {item.isFreeItem ? (
                                  <span className="text-green-600 font-medium">Qty: {item.quantity} × FREE</span>
                                ) : (
                                  <>Qty: {item.quantity} × {formatPrice(item.price)}</>
                                )}
                              </p>
                            </div>
                            <div className="text-sm font-semibold text-gray-900">
                              {item.isFreeItem ? (
                                <span className="text-green-600">FREE</span>
                              ) : (
                                formatPrice(item.quantity * item.price)
                              )}
                            </div>
                          </div>
                        ))}
                        <div className="flex items-center justify-between pt-3 border-t-2 border-gray-200">
                          <span className="text-base font-semibold text-gray-900">Total</span>
                          <span className="text-lg font-bold text-gray-900">{formatPrice(order.totalAmount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      {canAccept(order) && (
                        <button
                          onClick={() => openConfirmation(order._id, 'accepted', 'Accept this order? Stock will be deducted.')}
                          disabled={updatingOrderId === order._id}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Accept Order
                        </button>
                      )}

                      {canShip(order) && (
                        <button
                          onClick={() => openConfirmation(order._id, 'shipped', 'Mark this order as shipped?')}
                          disabled={updatingOrderId === order._id}
                          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Truck className="w-4 h-4" />
                          Mark as Shipped
                        </button>
                      )}

                      {canDeliver(order) && (
                        <button
                          onClick={() => openConfirmation(order._id, 'delivered', 'Mark this order as delivered?')}
                          disabled={updatingOrderId === order._id}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Mark as Delivered
                        </button>
                      )}

                      {canCancel(order) && (
                        <button
                          onClick={() => openConfirmation(order._id, 'cancelled', 'Cancel this order? This action cannot be undone.')}
                          disabled={updatingOrderId === order._id}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <XCircle className="w-4 h-4" />
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="bg-white rounded-lg shadow px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalOrders} total orders)
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === pagination.totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No orders found</p>
            <p className="text-gray-400 text-sm">
              {orderStatusFilter || paymentStatusFilter
                ? 'Try adjusting your filters'
                : 'Orders will appear here when customers place them'}
            </p>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Confirm Action</h3>
            </div>
            <p className="text-gray-600 mb-6">{confirmAction.message}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmAction(null)}
                disabled={updatingOrderId !== null}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStatusUpdate(confirmAction.orderId, confirmAction.status)}
                disabled={updatingOrderId !== null}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {updatingOrderId ? 'Updating...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
