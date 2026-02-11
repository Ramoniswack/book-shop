'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { addToCart as addToCartAPI, getCart, updateCartItem, removeFromCart as removeFromCartAPI } from '@/utils/cart'
import { isAuthenticated } from '@/utils/auth'
import toast from 'react-hot-toast'

interface CartItem {
  bookId: string
  title: string
  author: string
  price: number
  image: string
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  cartCount: number
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity: number) => Promise<void>
  updateQuantity: (bookId: string, quantity: number) => Promise<void>
  removeItem: (bookId: string) => Promise<void>
  clearCart: () => void
  refreshCart: () => Promise<void>
  isLoading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load cart on mount
  useEffect(() => {
    if (isAuthenticated()) {
      refreshCart()
    }
  }, [])

  const refreshCart = async () => {
    if (!isAuthenticated()) return
    
    try {
      setIsLoading(true)
      const response = await getCart()
      if (response.success) {
        // Transform backend cart data to frontend format
        const transformedCart = (response.data.cart || []).map((item: any) => ({
          bookId: item.bookId._id || item.bookId,
          title: item.bookId.title || 'Unknown Title',
          author: item.bookId.author || 'Unknown Author',
          price: item.price,
          image: item.bookId.images?.[0] || item.bookId.image || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&h=300&fit=crop',
          quantity: item.quantity
        }))
        setCart(transformedCart)
      }
    } catch (error: any) {
      console.error('Error loading cart:', error)
      // Don't show error toast on initial load
    } finally {
      setIsLoading(false)
    }
  }

  const addToCart = async (item: Omit<CartItem, 'quantity'>, quantity: number) => {
    if (!isAuthenticated()) {
      toast.error('Please login to add items to cart')
      setTimeout(() => {
        window.location.href = '/login'
      }, 1000)
      return
    }

    try {
      setIsLoading(true)
      const response = await addToCartAPI({
        bookId: item.bookId,
        title: item.title,
        author: item.author,
        price: item.price,
        image: item.image,
        quantity
      })

      if (response.success) {
        await refreshCart()
        toast.success('Added to cart successfully!')
      }
    } catch (error: any) {
      console.error('Error adding to cart:', error)
      toast.error(error.message || 'Failed to add to cart')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuantity = async (bookId: string, quantity: number) => {
    if (!isAuthenticated()) return

    try {
      setIsLoading(true)
      const response = await updateCartItem(bookId, quantity)
      
      if (response.success) {
        await refreshCart()
        toast.success('Cart updated')
      }
    } catch (error: any) {
      console.error('Error updating cart:', error)
      toast.error(error.message || 'Failed to update cart')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const removeItem = async (bookId: string) => {
    if (!isAuthenticated()) return

    try {
      setIsLoading(true)
      const response = await removeFromCartAPI(bookId)
      
      if (response.success) {
        await refreshCart()
        toast.success('Item removed from cart')
      }
    } catch (error: any) {
      console.error('Error removing from cart:', error)
      toast.error(error.message || 'Failed to remove item')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const clearCart = () => {
    setCart([])
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
        isLoading
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
