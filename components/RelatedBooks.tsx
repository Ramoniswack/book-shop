'use client'

import { useState, useEffect } from 'react'
import BookCard from './BookCard'
import { Book } from '@/types/book'
import { normalizeBook, getDealBadgeInfo } from '@/utils/bookMapper'

interface RelatedBooksProps {
  bookId: string
}

const RelatedBooks = ({ bookId }: RelatedBooksProps) => {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      fetchRelatedBooks()
    }
  }, [bookId, isClient])

  const fetchRelatedBooks = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/books/${bookId}/related?limit=4`
      )
      const data = await response.json()

      if (data.success && data.data.books.length > 0) {
        const normalizedBooks = data.data.books.map(normalizeBook)
        setBooks(normalizedBooks)
      }
    } catch (error) {
      console.error('Error fetching related books:', error)
    } finally {
      setLoading(false)
    }
  }

  // Don't render if no books
  if (!loading && books.length === 0) {
    return null
  }

  return (
    <div className="w-full max-w-7xl mx-auto mt-8 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 border-gray-200 dark:border-gray-700 p-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Related Books
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-gray-200 dark:bg-gray-700 rounded-lg h-96 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => {
              const dealInfo = getDealBadgeInfo(book)
              return (
                <BookCard
                  key={book._id || book.id}
                  book={book}
                  dealInfo={dealInfo || undefined}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default RelatedBooks
