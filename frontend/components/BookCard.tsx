'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Star, Heart, ShoppingCart } from 'lucide-react'
import { Book } from '@/types/book'
import { useCurrency } from '@/contexts/CurrencyContext'

interface BookCardProps {
  book: Book
  className?: string
}

const BookCard = ({ book, className = '' }: BookCardProps) => {
  const { formatPrice } = useCurrency()
  
  const discountPercentage = book.originalPrice 
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0

  return (
    <div className={`card hover:shadow-lg transition-shadow duration-300 group dark-transition ${className}`}>
      <div className="relative">
        <Link href={`/book/${book.id}`}>
          <div className="aspect-[2/3] relative overflow-hidden">
            <Image
              src={book.image}
              alt={book.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          </div>
        </Link>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1">
          {book.isNew && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">New</span>
          )}
          {book.isBestseller && (
            <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">Bestseller</span>
          )}
          {discountPercentage > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-700 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-50 dark:hover:bg-red-900">
          <Heart size={16} className="text-gray-600 dark:text-gray-300 hover:text-red-500" />
        </button>
      </div>

      <div className="p-3">
        <Link href={`/book/${book.id}`}>
          <h3 className="font-medium text-gray-900 dark:text-gray-100 hover:text-booksmandala-blue dark:hover:text-blue-400 transition-colors line-clamp-1 dark-transition">
            {book.title}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 dark-transition">{book.author}</p>
        
        {/* Rating */}
        <div className="flex items-center mt-2 space-x-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={`${
                  i < Math.floor(book.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">({book.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-2">
            <span className="text-base font-semibold text-gray-900 dark:text-gray-100 dark-transition">
              {formatPrice(book.price)}
            </span>
            {book.originalPrice && book.originalPrice > book.price && (
              <span className="text-xs text-gray-500 dark:text-gray-400 line-through">
                {formatPrice(book.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button - Always Visible */}
        <button className="w-full mt-2 bg-booksmandala-blue hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-sm">
          <ShoppingCart size={14} />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  )
}

export default BookCard