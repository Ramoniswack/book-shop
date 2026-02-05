'use client'

import BookCard from './BookCard'
import { Book } from '@/types/book'

interface ProductGridProps {
  books: Book[]
  title?: string
  className?: string
  showViewAll?: boolean
  viewAllLink?: string
}

const ProductGrid = ({ 
  books, 
  title, 
  className = '', 
  showViewAll = false, 
  viewAllLink = '#' 
}: ProductGridProps) => {
  return (
    <section className={`py-8 dark-transition ${className}`}>
      <div className="container mx-auto px-4">
        {title && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 dark-transition">{title}</h2>
            {showViewAll && (
              <a 
                href={viewAllLink}
                className="text-booksmandala-blue hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm md:text-base dark-transition"
              >
                View All →
              </a>
            )}
          </div>
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
        
        {books.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No books found.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductGrid