'use client'

import MainLayout from '@/layouts/MainLayout'
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react'
import { useCurrency } from '@/contexts/CurrencyContext'

export default function CartPage() {
  const { formatPrice } = useCurrency()
  
  // Mock cart data - in real app, this would come from state management
  const cartItems = [
    {
      id: '1',
      title: 'The Seven Husbands of Evelyn Hugo',
      author: 'Taylor Jenkins Reid',
      price: 1250,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=80&h=100&fit=crop'
    },
    {
      id: '2',
      title: 'Atomic Habits',
      author: 'James Clear',
      price: 1800,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=80&h=100&fit=crop'
    }
  ]

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = 150
  const total = subtotal + shipping

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart size={64} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some books to get started</p>
            <a href="/" className="bg-bookStore-blue hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200">
              Continue Shopping
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="card p-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.author}</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Plus size={16} />
                      </button>
                    </div>
                    <button className="p-2 text-red-500 hover:bg-red-50 rounded">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="card p-6 h-fit">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{formatPrice(shipping)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
              <button className="w-full bg-bookStore-blue hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 mt-6">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}