'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MainLayout from '@/layouts/MainLayout'
import { Package, Clock, CheckCircle, XCircle, Eye } from 'lucide-react'
import { useCurrency } from '@/contexts/CurrencyContext'
import { isAuthenticated } from '@/utils/auth'
import { getOrders } from '@/utils/order'
import Image from 'next/image'

interface Order {
  _id: string
  items: Array<{
    bookId: any
    title: string
    author?: string
    price: number
    quantity: number
    image?: string
  }>
  totalAmount: number
  paymentStatus: string
  orderStatus: string
  shippingAddress: string
  deliveryMethod: string
  createdAt: string
}

export default function OrdersPage() {
  const router = useRouter()
  const { formatPrice } = useCurrency()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all')

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }

    loadOrders()
  }, [router])

  const loadOrders = async () => {
    try {
      setIsLoading(true)
      const response = await getOrders()
      if (response.success) {
        setOrders(response.data.orders || [])
      }
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-500" size={20} />
      case 'completed':
        return <CheckCircle className="text-green-500" size={20} />
      case 'cancelled':
        return <XCircle className="text-red-500" size={20} />
      default:
        return <Package className="text-gray-500" size={20} />
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

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true
    return order.orderStatus === filter
  })

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Orders</h1>
          
          {/* Filter Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-bookStore-blue text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'pending'
                  ? 'bg-bookStore-blue text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'completed'
                  ? 'bg-bookStore-blue text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'cancelled'
                  ? 'bg-bookStore-blue text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Cancelled
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bookStore-blue mx-auto"></div>
            <p className="text-gray-500 dark:text-gray-400 mt-4">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package size={64} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              {filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
            </h2>
            <p className="text-gray-500 dark:text-gray-500 mb-6">
              {filter === 'all' ? 'Start shopping to see your orders here' : `You don't have any ${filter} orders`}
            </p>
            <a
              href="/"
              className="inline-block bg-bookStore-blue hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order._id} className="card p-6 dark:bg-gray-800">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(order.orderStatus)}
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                    </span>
                    <button
                      onClick={() => router.push(`/orders/${order._id}`)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {order.items.slice(0, 2).map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <Image
                        src={item.bookId?.imageUrl || item.image || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&h=300&fit=crop'}
                        alt={item.title}
                        width={48}
                        height={60}
                        className="rounded object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.bookId?.author || item.author || 'Unknown Author'}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          Qty: {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 pl-16">
                      +{order.items.length - 2} more item(s)
                    </p>
                  )}
                </div>

                {/* Order Footer */}
                <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Delivery:</span> {order.deliveryMethod === 'delivery' ? 'Home Delivery' : 'Store Pickup'}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {formatPrice(order.totalAmount)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
