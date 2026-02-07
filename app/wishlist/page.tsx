'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MainLayout from '@/layouts/MainLayout'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { useCurrency } from '@/contexts/CurrencyContext'
import { useCart } from '@/contexts/CartContext'
import { isAuthenticated } from '@/utils/auth'
import { getWishlist, removeFromWishlist } from '@/utils/wishlist'
import Image from 'next/image'

interface WishlistItem {
  bookId: string
  title: string
  author: string
  price: number
  image: string
  addedAt: string
}

export default function WishlistPage() {
  const router = useRouter()
  const { formatPrice } = useCurrency()
  const { addToCart } = useCart()
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [removingId, setRemovingId] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }

    loadWishlist()
  }, [router])

  const loadWishlist = async () => {
    try {
      setIsLoading(true)
      const response = await getWishlist()
      if (response.success) {
        // Transform backend wishlist data to frontend format
        const transformedWishlist = (response.data.wishlist || []).map((book: any) => ({
          bookId: book._id,
          title: book.title || 'Unknown Title',
          author: book.author || 'Unknown Author',
          price: book.discountPrice || book.price || 0,
          image: book.imageUrl || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&h=300&fit=crop',
          addedAt: book.createdAt || new Date().toISOString()
        }))
        setWishlist(transformedWishlist)
      }
    } catch (error) {
      console.error('Error loading wishlist:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveFromWishlist = async (bookId: string) => {
    try {
      setRemovingId(bookId)
      const response = await removeFromWishlist(bookId)
      if (response.success) {
        setWishlist(wishlist.filter(item => item.bookId !== bookId))
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
    } finally {
      setRemovingId(null)
    }
  }

  const handleAddToCart = async (item: WishlistItem) => {
    try {
      await addToCart({
        bookId: item.bookId,
        title: item.title,
        author: item.author,
        price: item.price,
        image: item.image
      }, 1)
      // Optionally remove from wishlist after adding to cart
      await handleRemoveFromWishlist(item.bookId)
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Wishlist</h1>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Heart size={24} className="text-red-500" />
            <span className="text-lg font-medium">{wishlist.length} items</span>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bookStore-blue mx-auto"></div>
            <p className="text-gray-500 dark:text-gray-400 mt-4">Loading wishlist...</p>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="text-center py-12">
            <Heart size={64} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 dark:text-gray-500 mb-6">Add books you love to your wishlist</p>
            <a
              href="/"
              className="inline-block bg-bookStore-blue hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <div key={item.bookId} className="card p-4 dark:bg-gray-800 relative group">
                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveFromWishlist(item.bookId)}
                  disabled={removingId === item.bookId}
                  className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-700 rounded-full shadow-md hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                >
                  <Trash2 size={16} />
                </button>

                {/* Book Image */}
                <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Book Details */}
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.author}</p>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2 min-h-[2.5rem]">
                    {item.title}
                  </h3>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {formatPrice(item.price)}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Added {new Date(item.addedAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(item)}
                  className="w-full mt-4 bg-bookStore-blue hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
