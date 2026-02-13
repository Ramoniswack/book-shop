'use client'

import { useRouter } from 'next/navigation'
import MainLayout from '@/layouts/MainLayout'
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react'
import { useCurrency } from '@/contexts/CurrencyContext'
import { useCart } from '@/contexts/CartContext'
import { isAuthenticated } from '@/utils/auth'
import { useEffect } from 'react'
import Image from 'next/image'

export default function CartPage() {
  const router = useRouter()
  const { formatPrice } = useCurrency()
  const { cart, updateQuantity, removeItem, isLoading } = useCart()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
    }
  }, [router])

  // Group cart items by book and deal to show BOGO properly
  const displayCart = cart.reduce((acc: any[], item) => {
    if (item.dealType === 'BOGO') {
      // Find if we already have this book (paid version)
      const existingIndex = acc.findIndex(
        (i) => i.bookId === item.bookId && !i.isFreeItem && i.dealId === item.dealId
      )
      
      if (item.isFreeItem) {
        // This is a free item, add to existing paid item's free quantity
        if (existingIndex >= 0) {
          acc[existingIndex].freeQuantity = (acc[existingIndex].freeQuantity || 0) + item.quantity
        }
      } else {
        // This is a paid item
        if (existingIndex >= 0) {
          acc[existingIndex].quantity += item.quantity
        } else {
          acc.push({ ...item, freeQuantity: 0 })
        }
      }
    } else {
      // Non-BOGO items, add as is
      acc.push({ ...item, freeQuantity: 0 })
    }
    return acc
  }, [])

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = subtotal > 0 ? 150 : 0
  const total = subtotal + shipping

  const handleUpdateQuantity = async (bookId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    try {
      await updateQuantity(bookId, newQuantity)
    } catch (error) {
      console.error('Failed to update quantity:', error)
    }
  }

  const handleRemoveItem = async (bookId: string) => {
    try {
      await removeItem(bookId)
    } catch (error) {
      console.error('Failed to remove item:', error)
    }
  }

  const handleCheckout = () => {
    router.push('/checkout')
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart size={64} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 dark:text-gray-500 mb-6">Add some books to get started</p>
            <a href="/" className="bg-bookStore-blue hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200">
              Continue Shopping
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {displayCart.map((item) => (
                <div key={`${item.bookId}-${item.dealId || 'no-deal'}`} className="card p-4 dark:bg-gray-800">
                  <div className="flex items-center space-x-4">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={64}
                      height={80}
                      className="object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">{item.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.author}</p>
                      
                      {/* Deal Badge */}
                      {item.dealTitle && (
                        <div className="mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            item.dealType === 'FLASH_SALE'
                              ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                              : item.dealType === 'BOGO'
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                          }`}>
                            {item.dealTitle}
                          </span>
                        </div>
                      )}
                      
                      <div className="mt-1">
                        {item.discountApplied && item.discountApplied > 0 ? (
                          <div className="flex items-center gap-2">
                            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              {formatPrice(item.price)}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-through">
                              {formatPrice(item.price + item.discountApplied)}
                            </p>
                          </div>
                        ) : (
                          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {formatPrice(item.price)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleUpdateQuantity(item.bookId, item.quantity - 1)}
                        disabled={isLoading || item.quantity <= 1}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-50"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-12 text-center dark:text-gray-100 font-medium">
                        {item.freeQuantity > 0 ? (
                          <span className="text-sm">
                            {item.quantity}
                            <span className="text-green-600 dark:text-green-400">+{item.freeQuantity}</span>
                          </span>
                        ) : (
                          item.quantity
                        )}
                      </span>
                      <button 
                        onClick={() => handleUpdateQuantity(item.bookId, item.quantity + 1)}
                        disabled={isLoading}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-50"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button 
                      onClick={() => handleRemoveItem(item.bookId)}
                      disabled={isLoading}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="card p-6 h-fit dark:bg-gray-800">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between dark:text-gray-300">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between dark:text-gray-300">
                  <span>Shipping</span>
                  <span>{formatPrice(shipping)}</span>
                </div>
                <div className="border-t dark:border-gray-700 pt-3">
                  <div className="flex justify-between font-semibold text-lg dark:text-gray-100">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full bg-bookStore-blue hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 mt-6 disabled:opacity-50"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
