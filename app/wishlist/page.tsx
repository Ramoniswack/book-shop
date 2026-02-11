'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MainLayout from '@/layouts/MainLayout'
import { Heart } from 'lucide-react'
import { isAuthenticated } from '@/utils/auth'
import { getWishlist } from '@/utils/wishlist'
import BookCard from '@/components/BookCard'
import { Book } from '@/types/book'

export default function WishlistPage() {
  const router = useRouter()
  const [wishlist, setWishlist] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
        // Backend returns populated book objects
        const books = (response.data.wishlist || []).map((book: any) => ({
          ...book,
          id: book._id,
          image: book.images?.[0] || book.image || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
          genre: book.genres?.[0] || 'General',
          inStock: book.stock > 0,
          isNew: book.isNewArrival,
          reviewCount: book.reviews || book.reviewCount || 0,
          rating: book.rating || 0,
        }))
        setWishlist(books)
      }
    } catch (error) {
      console.error('Error loading wishlist:', error)
    } finally {
      setIsLoading(false)
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {wishlist.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
