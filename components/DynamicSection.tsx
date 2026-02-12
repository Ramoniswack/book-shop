'use client'

import BookCard from './BookCard'
import { Book } from '@/types/book'
import { getDealBadgeInfo } from '@/utils/bookMapper'

interface DynamicSectionProps {
  title: string
  books: Book[]
  displayType?: 'grid' | 'slider'
}

const DynamicSection = ({ title, books, displayType = 'grid' }: DynamicSectionProps) => {
  return (
    <section className="py-8 dark-transition bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 dark-transition">
            {title}
          </h2>
        </div>
        
        {books && books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {books.map((book) => (
              <BookCard 
                key={book._id || book.id} 
                book={book}
                dealInfo={getDealBadgeInfo(book)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No books available in this section yet</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default DynamicSection
