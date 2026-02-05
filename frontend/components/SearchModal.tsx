'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, BookOpen } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { searchBooks } from '@/utils/fetcher'
import { Book } from '@/types/book'
import { useCurrency } from '@/contexts/CurrencyContext'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { formatPrice } = useCurrency()
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.trim().length > 0) {
        setIsLoading(true)
        try {
          const searchResults = await searchBooks(query)
          setResults(searchResults)
        } catch (error) {
          console.error('Search error:', error)
          setResults([])
        } finally {
          setIsLoading(false)
        }
      } else {
        setResults([])
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black/50 dark:bg-black/80 z-50 flex items-start justify-center pt-20 dark-transition"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden dark-transition border dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-600 dark-transition">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white dark-transition">Search Books</h2>
            <button
              onClick={onClose}
              className="text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-400" size={20} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search By Title, Author, Keyword or ISBN"
              className="w-full pl-10 pr-16 py-3 border border-gray-300 dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-booksmandala-blue dark:focus:ring-blue-400 focus:border-transparent text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 dark-transition"
            />
            <button
              onClick={onClose}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded transition-colors"
            >
              esc
            </button>
          </div>
        </div>

        {/* Search Results */}
        <div className="p-6 overflow-y-auto max-h-96 bg-white dark:bg-gray-900 dark-transition">
          {!query ? (
            <div className="text-center py-12">
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-booksmandala-blue to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-full flex items-center justify-center">
                  <Search className="text-white" size={32} />
                </div>
                <h3 className="text-lg font-semibold text-booksmandala-blue dark:text-blue-300 mb-2 dark-transition">
                  Discover Your Next Great Read
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm dark-transition">
                  Search through our vast collection of over 35,000 books. Find bestsellers, new releases, and hidden gems.
                </p>
              </div>
            </div>
          ) : isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-booksmandala-blue dark:border-blue-300 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400 dark-transition">Searching for "{query}"...</p>
            </div>
          ) : results.length > 0 ? (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 dark-transition">
                Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
              </p>
              <div className="grid grid-cols-1 gap-4">
                {results.map((book) => (
                  <Link
                    key={book.id}
                    href={`/book/${book.id}`}
                    onClick={onClose}
                    className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors dark-transition"
                  >
                    <Image
                      src={book.image}
                      alt={book.title}
                      width={60}
                      height={80}
                      className="rounded object-cover flex-shrink-0"
                    />
                    <div className="ml-4 flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-white line-clamp-1 mb-1 dark-transition">
                        {book.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 dark-transition">by {book.author}</p>
                      <p className="text-sm font-semibold text-booksmandala-blue dark:text-blue-300 dark-transition">
                        {formatPrice(book.price)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 dark-transition">{book.genre}</p>
                    </div>
                  </Link>
                ))}
              </div>
              
              {results.length > 5 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 dark-transition">
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}`}
                    onClick={onClose}
                    className="text-booksmandala-blue dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200 font-medium text-sm dark-transition"
                  >
                    View all {results.length} results →
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center dark-transition">
                <BookOpen className="text-gray-400 dark:text-gray-500" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 dark-transition">No results found</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm dark-transition">
                No books found for "{query}". Try different keywords or check spelling.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchModal