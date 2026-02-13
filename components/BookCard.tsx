'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Star, Heart, ShoppingCart, Plus, Minus } from 'lucide-react'
import { Book } from '@/types/book'
import { useCurrency } from '@/contexts/CurrencyContext'
import { useCart } from '@/contexts/CartContext'
import { addToWishlist, removeFromWishlist, getWishlist } from '@/utils/wishlist'
import { isAuthenticated } from '@/utils/auth'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

interface BookCardProps {
  book: Book
  className?: string
  dealInfo?: {
    type: string
    badge: string
    color: string
  }
}

const BookCard = ({ book, className = '', dealInfo }: BookCardProps) => {
  const { formatPrice } = useCurrency()
  const { addToCart, isLoading } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [isWishlistLoading, setIsWishlistLoading] = useState(false)
  const [checkingWishlist, setCheckingWishlist] = useState(true)
  
  // Calculate discount percentage from book's discountPercentage field or from price difference
  const discountPercentage = book.discountPercentage 
    ? book.discountPercentage
    : book.originalPrice 
      ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
      : 0

  // Check if book is in wishlist on mount
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!isAuthenticated()) {
        setCheckingWishlist(false)
        return
      }

      try {
        const response = await getWishlist()
        if (response.success) {
          const bookId = book._id || book.id
          const isInList = response.data.wishlist.some((item: any) => 
            (item._id || item.id) === bookId
          )
          setIsInWishlist(isInList)
        }
      } catch (error) {
        console.error('Error checking wishlist:', error)
      } finally {
        setCheckingWishlist(false)
      }
    }

    checkWishlistStatus()
  }, [book._id, book.id])

  const handleAddToCart = async () => {
    if (!isAuthenticated()) {
      toast.error('Please login to add items to cart')
      setTimeout(() => {
        window.location.href = '/login'
      }, 1000)
      return
    }

    try {
      setIsAdding(true)
      
      // Use the book's MongoDB ID (either _id or id field)
      const bookId = book._id || book.id
      
      if (!bookId) {
        toast.error('Invalid book ID')
        return
      }
      
      // Prepare cart item with deal information
      const cartItem: any = {
        bookId: bookId,
        title: book.title,
        author: book.author,
        price: book.price,
        image: book.image || ''
      }

      // Add deal information if available
      if (book.activeDeal) {
        cartItem.dealId = book.activeDeal._id
        cartItem.dealType = book.activeDeal.type
        cartItem.dealTitle = book.activeDeal.title
      }
      
      // Add to cart with MongoDB ID and deal info
      await addToCart(cartItem, quantity)
      
      setQuantity(1) // Reset quantity after adding
    } catch (error: any) {
      console.error('Failed to add to cart:', error)
      toast.error(error.message || 'Failed to add to cart')
    } finally {
      setIsAdding(false)
    }
  }

  const handleWishlistToggle = async () => {
    if (!isAuthenticated()) {
      toast.error('Please login to add to wishlist')
      setTimeout(() => {
        window.location.href = '/login'
      }, 1000)
      return
    }

    try {
      setIsWishlistLoading(true)
      
      // Use the book's MongoDB ID (either _id or id field)
      const bookId = book._id || book.id
      
      if (!bookId) {
        toast.error('Invalid book ID')
        return
      }
      
      if (isInWishlist) {
        const response = await removeFromWishlist(bookId)
        if (response.success) {
          setIsInWishlist(false)
          toast.success('Removed from wishlist')
        }
      } else {
        const response = await addToWishlist({
          bookId: bookId,
          title: book.title,
          author: book.author,
          price: book.price,
          image: book.image || ''
        })
        if (response.success) {
          setIsInWishlist(true)
          toast.success('Added to wishlist!')
        }
      }
    } catch (error: any) {
      console.error('Failed to update wishlist:', error)
      toast.error(error.message || 'Failed to update wishlist')
    } finally {
      setIsWishlistLoading(false)
    }
  }

  return (
    <div className={`bg-white dark:bg-gray-800 shadow-md rounded-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden dark-transition ${className}`}>
      {/* Image Section */}
      <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-900">
        <Link href={`/book/${book.id}`}>
          <Image
            src={book.image || '/placeholder-book.jpg'}
            alt={book.title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </Link>
        
        {/* Top Controls */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
          {/* Badges */}
          <div className="flex flex-col space-y-1">
            {dealInfo && (
              <span className={`uppercase text-xs px-1.5 py-0.5 rounded font-bold select-none shadow-md ${dealInfo.color}`}>
                {dealInfo.badge}
              </span>
            )}
            {book.isNew && (
              <span className="uppercase text-xs bg-green-50 dark:bg-green-900 px-1.5 py-0.5 border border-green-500 rounded text-green-700 dark:text-green-300 font-medium select-none">
                New
              </span>
            )}
            {book.isBestseller && (
              <span className="uppercase text-xs bg-yellow-50 dark:bg-yellow-900 px-1.5 py-0.5 border border-yellow-500 rounded text-yellow-700 dark:text-yellow-300 font-medium select-none">
                Bestseller
              </span>
            )}
            {discountPercentage > 0 && (
              <span className="uppercase text-xs bg-red-50 dark:bg-red-900 px-1.5 py-0.5 border border-red-500 rounded text-red-700 dark:text-red-300 font-medium select-none">
                -{discountPercentage}%
              </span>
            )}
          </div>
          
          {/* Wishlist Button */}
          <button 
            onClick={handleWishlistToggle}
            disabled={isWishlistLoading}
            className={`${
              isInWishlist ? 'text-red-500 bg-white/90' : 'text-white bg-black/20'
            } hover:text-red-500 hover:bg-white/90 p-1.5 rounded-full transition-all disabled:opacity-50`}
          >
            <Heart size={18} className={isInWishlist ? 'fill-current' : ''} />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col">
        {/* Author */}
        <p className="text-gray-400 dark:text-gray-500 font-light text-xs truncate w-full">
          {book.author}
        </p>
        
        {/* Title */}
        <Link href={`/book/${book.id}`}>
          <h3 className="text-gray-800 dark:text-gray-100 mt-1 font-medium hover:text-bookStore-blue dark:hover:text-blue-400 transition-colors truncate w-full text-sm">
            {book.title}
          </h3>
        </Link>
        
        {/* Rating */}
        <div className="flex items-center mt-1.5 space-x-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={`${
                  i < Math.floor(book.rating || 0)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] text-gray-500 dark:text-gray-400">({book.reviewCount})</span>
        </div>
        
        {/* Price and Quantity Row */}
        <div className="flex items-center justify-between gap-2 mt-2">
          {/* Price */}
          <div className="flex flex-col">
            {book.originalPrice && book.originalPrice > book.price ? (
              <>
                <p className="text-gray-800 dark:text-gray-100 font-semibold text-base">
                  {formatPrice(book.price)}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs line-through">
                  {formatPrice(book.originalPrice)}
                </p>
              </>
            ) : (
              <p className="text-gray-800 dark:text-gray-100 font-semibold text-base">
                {formatPrice(book.price)}
              </p>
            )}
          </div>
          
          {/* Quantity Controls - Compact */}
          <div className="inline-flex items-center border border-gray-200 dark:border-gray-600 rounded-md overflow-hidden bg-white dark:bg-gray-800">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 disabled:opacity-50 inline-flex items-center px-1.5 py-1 transition-colors"
            >
              <Minus size={14} />
            </button>
            <div className="border-l border-r border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 inline-flex items-center px-2.5 py-1 select-none min-w-[32px] justify-center font-medium text-sm">
              {quantity}
            </div>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 disabled:opacity-50 inline-flex items-center px-1.5 py-1 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
        
        {/* Add to Cart Button */}
        <button 
          onClick={handleAddToCart}
          disabled={isAdding || isLoading}
          className="py-2 px-4 bg-bookStore-blue text-white rounded-md hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed mt-3 w-full flex items-center justify-center transition-colors text-sm font-medium"
        >
          {isAdding ? 'Adding...' : 'Add to Cart'}
          <ShoppingCart size={16} className="ml-2" />
        </button>
      </div>
    </div>
  )
}

export default BookCard
