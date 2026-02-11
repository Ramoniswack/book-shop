'use client'

import { useState, Suspense } from 'react'
import Image from 'next/image'
import RatingStars from '@/components/RatingStars'
import { BookDetailSkeleton } from '@/components/LoadingSkeleton'
import { ShoppingCart, Heart, Share2, Plus, Minus, ChevronUp, ChevronDown, Facebook, Twitter, Instagram } from 'lucide-react'
import { Book } from '@/types/book'
import { useCurrency } from '@/contexts/CurrencyContext'
import { useCart } from '@/contexts/CartContext'
import { addToWishlist, removeFromWishlist, getWishlist } from '@/utils/wishlist'
import { isAuthenticated } from '@/utils/auth'
import toast from 'react-hot-toast'
import { useEffect } from 'react'

interface BookDetailClientProps {
  book: Book
}

const BookDetailClient = ({ book }: BookDetailClientProps) => {
  const { formatPrice } = useCurrency()
  const { addToCart, isLoading } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [isWishlistLoading, setIsWishlistLoading] = useState(false)

  // Check if book is in wishlist on mount
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!isAuthenticated()) return

      try {
        const response = await getWishlist()
        if (response.success) {
          const bookId = book._id || book.id
          const isInList = response.data.wishlist.some((item: any) => 
            (item._id || item.id) === bookId
          )
          setIsWishlisted(isInList)
        }
      } catch (error) {
        console.error('Error checking wishlist:', error)
      }
    }

    checkWishlistStatus()
  }, [book._id, book.id])

  // Generate multiple book images for gallery (using same image with different parameters for demo)
  const bookImages = [
    book.image,
    book.image.replace('w=400&h=600', 'w=400&h=600&sat=-100'), // B&W version
    book.image.replace('w=400&h=600', 'w=400&h=600&sepia=100'), // Sepia version
    book.image.replace('w=400&h=600', 'w=400&h=600&blur=1'), // Slightly blurred
  ]

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change))
  }

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
      
      // Add to cart with MongoDB ID
      await addToCart({
        bookId: bookId,
        title: book.title,
        author: book.author,
        price: book.price,
        image: book.image
      }, quantity)
      
      setQuantity(1) // Reset quantity after adding
    } catch (error: any) {
      console.error('Failed to add to cart:', error)
      toast.error(error.message || 'Failed to add to cart')
    } finally {
      setIsAdding(false)
    }
  }

  const handleWishlist = async () => {
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
      
      if (isWishlisted) {
        const response = await removeFromWishlist(bookId)
        if (response.success) {
          setIsWishlisted(false)
          toast.success('Removed from wishlist')
        }
      } else {
        const response = await addToWishlist({
          bookId: bookId,
          title: book.title,
          author: book.author,
          price: book.price,
          image: book.image
        })
        if (response.success) {
          setIsWishlisted(true)
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

  const discountPercentage = book.originalPrice && book.originalPrice > book.price 
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0

  return (
    <Suspense fallback={<BookDetailSkeleton />}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-8 px-4 dark-transition">
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 p-10 dark-transition">
            
            {/* Left Side - Image Gallery */}
            <div className="flex flex-col gap-14 items-center">
              {/* Navigation Up Arrow */}
              <button 
                onClick={() => setSelectedImageIndex(prev => prev > 0 ? prev - 1 : bookImages.length - 1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <ChevronUp className="w-4 h-2.5 text-gray-600" strokeWidth={1.5} />
              </button>

              {/* Thumbnail Images */}
              <div className="flex flex-col gap-3">
                {bookImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-20 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index 
                        ? 'border-bookStore-blue shadow-md' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${book.title} view ${index + 1}`}
                      width={80}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Navigation Down Arrow */}
              <button 
                onClick={() => setSelectedImageIndex(prev => prev < bookImages.length - 1 ? prev + 1 : 0)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <ChevronDown className="w-6 h-6 text-gray-600" strokeWidth={1.5} />
              </button>
            </div>

            {/* Main Book Image */}
            <div className="w-[278px] ml-3 mr-6 relative">
              <Image
                src={bookImages[selectedImageIndex]}
                alt={book.title}
                width={278}
                height={350}
                className="w-full h-auto object-cover rounded-lg"
                priority
              />
            </div>

            {/* Right Side - Book Details */}
            <div className="flex-1">
              {/* Title and Stock Status */}
              <div className="flex gap-2 items-center mb-3">
                <h1 className="text-4xl leading-11 font-semibold text-black dark:text-white dark-transition">{book.title}</h1>
                {book.inStock && (
                  <span className="text-sm text-green-700 dark:text-green-400 px-2 py-1 bg-green-500 bg-opacity-20 dark:bg-green-500 dark:bg-opacity-30 rounded">
                    In Stock
                  </span>
                )}
              </div>

              {/* Rating and Reviews */}
              <div className="flex items-center mt-3 text-sm leading-6">
                <div className="flex gap-0.5">
                  <RatingStars rating={book.rating} size={16} />
                </div>
                <span className="ml-1 mr-3 text-gray-700 dark:text-gray-300">{book.reviewCount} Review{book.reviewCount !== 1 ? 's' : ''}</span>
                <span className="font-medium mr-1 text-gray-700 dark:text-gray-300">ISBN:</span>
                <span className="text-gray-700 dark:text-gray-300">{book.isbn || '978-0-123456-78-9'}</span>
              </div>

              {/* Pricing */}
              <div className="h-9 mt-5 justify-start items-center gap-3 inline-flex">
                <div className="justify-start items-center gap-1 flex">
                  {book.originalPrice && book.originalPrice > book.price && (
                    <div className="text-gray-400 text-xl font-normal line-through leading-8">
                      {formatPrice(book.originalPrice)}
                    </div>
                  )}
                  <div className="text-green-700 text-2xl font-medium leading-9">
                    {formatPrice(book.price)}
                  </div>
                </div>
                {discountPercentage > 0 && (
                  <div className="px-2.5 py-1 bg-red-500 bg-opacity-10 rounded-full text-red-500 text-sm font-medium leading-5">
                    {discountPercentage}% Off
                  </div>
                )}
              </div>

              {/* Author and Share */}
              <div className="h-14 flex w-full justify-between items-center mt-6">
                <div className="justify-start items-center gap-2 flex">
                  <span className="text-gray-800 dark:text-gray-200 text-sm font-normal leading-5">Author:</span>
                  <div className="text-bookStore-blue dark:text-blue-400 font-medium">{book.author}</div>
                </div>
                <div className="justify-start items-center gap-2.5 flex">
                  <h2 className="text-gray-800 dark:text-gray-200 text-sm font-normal leading-5">Share item:</h2>
                  <div className="justify-start items-start gap-1 flex">
                    <button className="w-10 h-10 relative rounded-full bg-bookStore-blue hover:bg-blue-700 transition-colors flex items-center justify-center">
                      <Facebook className="w-4 h-4 text-white" />
                    </button>
                    <button className="w-10 h-10 relative rounded-full bg-gray-600 hover:bg-gray-700 transition-colors flex items-center justify-center">
                      <Twitter className="w-4 h-4 text-white" />
                    </button>
                    <button className="w-10 h-10 relative rounded-full bg-gray-600 hover:bg-gray-700 transition-colors flex items-center justify-center">
                      <Instagram className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="w-full max-w-lg text-justify text-gray-500 dark:text-gray-400 text-sm font-normal mt-4 leading-5">
                {book.description || 'Discover an engaging story that will captivate your imagination and take you on an unforgettable journey. This carefully crafted narrative combines compelling characters with thought-provoking themes that will resonate long after you turn the final page.'}
              </p>

              {/* Quantity and Add to Cart */}
              <div className="h-22 mt-6 py-4 bg-white dark:bg-gray-800 shadow-sm border-t border-b border-gray-200 dark:border-gray-600 justify-center items-center gap-3 flex dark-transition">
                <div className="p-2 bg-white dark:bg-gray-700 rounded-full border border-gray-200 dark:border-gray-600 justify-center items-center flex dark-transition">
                  <button 
                    onClick={() => handleQuantityChange(-1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 rounded-full transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" strokeWidth={1.5} />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-10 text-center text-gray-800 dark:text-gray-200 text-base font-normal leading-normal border-0 focus:outline-none bg-transparent"
                    min="1"
                  />
                  <button 
                    onClick={() => handleQuantityChange(1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 rounded-full transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-gray-800 dark:text-gray-200" strokeWidth={1.5} />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || !book.inStock}
                  className="h-12 px-20 py-4 bg-bookStore-blue hover:bg-blue-700 rounded-full justify-center items-center gap-4 flex transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-white text-base font-semibold leading-tight">
                    {isAdding ? 'Adding...' : 'Add to Cart'}
                  </span>
                  <ShoppingCart className="w-4 h-4 text-white" strokeWidth={1.3} />
                </button>

                <button
                  onClick={handleWishlist}
                  disabled={isWishlistLoading}
                  className="w-13 h-13 rounded-full bg-green-500 bg-opacity-10 hover:bg-opacity-20 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Heart 
                    className={`w-6 h-6 ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-green-700 dark:text-green-400'}`} 
                    strokeWidth={1.5} 
                  />
                </button>
              </div>

              {/* Book Information */}
              <div className="h-14 mt-6 flex-col justify-start items-start gap-3 inline-flex">
                <div className="justify-start items-start gap-1.5 inline-flex">
                  <span className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-5">Category:</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-5">{book.genre}</span>
                </div>
                <div className="justify-start items-start gap-1.5 inline-flex flex-wrap">
                  <span className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-5">Tags:</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-5">{book.genre}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-5">Literature</span>
                  <span className="text-gray-800 dark:text-gray-200 text-sm font-normal underline leading-5">{book.language}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-5">Fiction</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-5">Bestseller</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  )
}

export default BookDetailClient