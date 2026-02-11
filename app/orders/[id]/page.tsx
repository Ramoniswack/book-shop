'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import MainLayout from '@/layouts/MainLayout'
import { ArrowLeft, Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react'
import { useCurrency } from '@/contexts/CurrencyContext'
import { isAuthenticated } from '@/utils/auth'
import { getOrderById, cancelOrder } from '@/utils/order'
import Image from 'next/image'
import toast from 'react-hot-toast'

interface OrderItem {
  bookId: any
  title: string
  author?: string
  price: number
  quantity: number
  image?: string
}

interface Order {
  _id: string
  items: OrderItem[]
  totalAmount: number
  paymentStatus: string
  orderStatus: string
  shippingAddress: string
  deliveryMethod: string
  orderNote?: string
  createdAt: string
  updatedAt: string
}

export default function OrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { formatPrice } = useCurrency()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }

    if (params.id) {
      loadOrder(params.id as string)
    }
  }, [params.id, router])

  const loadOrder = async (orderId: string) => {
    try {
      setIsLoading(true)
      const response = await getOrderById(orderId)
      if (response.success) {
        setOrder(response.data.order)
      }
    } catch (error) {
      console.error('Error loading order:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelOrder = async () => {
    if (!order?._id) return
    
    if (!confirm('Are you sure you want to cancel this order?')) return

    try {
      setIsCancelling(true)
      const response = await cancelOrder(order._id)
      if (response.success) {
        setOrder(response.data.order)
        toast.success('Order cancelled successfully!')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel order')
    } finally {
      setIsCancelling(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'shipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bookStore-blue mx-auto"></div>
            <p className="text-gray-500 dark:text-gray-400 mt-4">Loading order details...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!order) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Package size={64} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">Order not found</h2>
            <button
              onClick={() => router.push('/orders')}
              className="mt-4 bg-bookStore-blue hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </MainLayout>
    )
  }

  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = order.deliveryMethod === 'delivery' ? 150 : 0

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push('/orders')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Order #{order._id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
            {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Timeline */}
            <div className="card p-6 dark:bg-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Order Status</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    ['pending', 'accepted', 'processing', 'shipped', 'delivered'].includes(order.orderStatus)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                  }`}>
                    <CheckCircle size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">Order Placed</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    ['accepted', 'processing', 'shipped', 'delivered'].includes(order.orderStatus)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                  }`}>
                    <CheckCircle size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">Accepted</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Your order has been accepted</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    ['processing', 'shipped', 'delivered'].includes(order.orderStatus)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                  }`}>
                    <Clock size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">Processing</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Your order is being prepared</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    ['shipped', 'delivered'].includes(order.orderStatus)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                  }`}>
                    <Truck size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">Shipped</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Your order is on the way</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    order.orderStatus === 'delivered'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                  }`}>
                    <Package size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">Delivered</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Order has been delivered</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="card p-6 dark:bg-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Order Items ({order.items.length})
              </h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 pb-4 border-b dark:border-gray-700 last:border-0">
                    <Image
                      src={item.bookId?.images?.[0] || item.image || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&h=300&fit=crop'}
                      alt={item.title}
                      width={64}
                      height={80}
                      className="rounded object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">{item.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.bookId?.author || item.author || 'Unknown Author'}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatPrice(item.price)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Information */}
            <div className="card p-6 dark:bg-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Delivery Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Delivery Method</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {order.deliveryMethod === 'delivery' ? 'Home Delivery' : 'Store Pickup'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Shipping Address</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{order.shippingAddress}</p>
                </div>
                {order.orderNote && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Order Note</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{order.orderNote}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24 dark:bg-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Shipping</span>
                  <span className="font-medium">{formatPrice(shipping)}</span>
                </div>
                <div className="border-t dark:border-gray-700 pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-gray-100">
                    <span>Total</span>
                    <span>{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t dark:border-gray-700">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Payment Status</span>
                    <span className={`font-medium ${
                      order.paymentStatus === 'paid'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-yellow-600 dark:text-yellow-400'
                    }`}>
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Order ID</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      #{order._id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push('/orders')}
                className="w-full mt-6 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium py-3 rounded-lg transition-colors"
              >
                Back to Orders
              </button>

              {/* Cancel Order Button */}
              {(order.orderStatus === 'pending' || order.orderStatus === 'processing') && (
                <button
                  onClick={handleCancelOrder}
                  disabled={isCancelling}
                  className="w-full mt-3 bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <XCircle size={20} />
                  {isCancelling ? 'Cancelling...' : 'Cancel Order'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
