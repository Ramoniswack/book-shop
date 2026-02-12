'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { searchBooks } from '@/utils/fetcher'
import { Book } from '@/types/book'
import { useCurrency } from '@/contexts/CurrencyContext'

interface SearchComponentProps {
  className?: string
  placeholder?: string
}

const SearchComponent = ({ 
  className = '', 
  placeholder = "What do you want to read ?" 
}: SearchComponentProps) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { formatPrice } = useCurrency()
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.trim().length > 2) {
        setIsLoading(true)
        try {
          const searchResults = await searchBooks(query)
          setResults(searchResults.slice(0, 6)) // Limit to 6 results
          setIsOpen(true)
        } catch (error) {
          console.error('Search error:', error)
          setResults([])
        } finally {
          setIsLoading(false)
        }
      } else {
        setResults([])
        setIsOpen(false)
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(timeoutId)
  }, [query])

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleClear = () => {
    setQuery('')
    setResults([])
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const handleResultClick = () => {
    setIsOpen(false)
    setQuery('')
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 2 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bookStore-blue text-sm"
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {query && (
            <button
              onClick={handleClear}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={16} />
            </button>
          )}
          <button className="p-1 text-gray-400 hover:text-bookStore-blue transition-colors">
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-bookStore-blue mx-auto"></div>
              <p className="mt-2 text-sm">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="p-3 border-b border-gray-100">
                <p className="text-sm text-gray-600">
                  Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
                </p>
              </div>
              <div className="py-2">
                {results.map((book) => (
                  <Link
                    key={book.id}
                    href={`/book/${book.id}`}
                    onClick={handleResultClick}
                    className="flex items-center p-3 hover:bg-gray-50 transition-colors"
                  >
                    <Image
                      src={book.image || '/placeholder-book.jpg'}
                      alt={book.title}
                      width={40}
                      height={50}
                      className="rounded object-cover flex-shrink-0"
                    />
                    <div className="ml-3 flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                        {book.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">by {book.author}</p>
                      <p className="text-sm font-semibold text-bookStore-blue mt-1">
                        {formatPrice(book.price)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="p-3 border-t border-gray-100">
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  onClick={handleResultClick}
                  className="text-sm text-bookStore-blue hover:text-blue-700 font-medium"
                >
                  View all results for "{query}" →
                </Link>
              </div>
            </>
          ) : query.length > 2 ? (
            <div className="p-4 text-center text-gray-500">
              <p className="text-sm">No results found for "{query}"</p>
              <p className="text-xs mt-1">Try different keywords or check spelling</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default SearchComponent