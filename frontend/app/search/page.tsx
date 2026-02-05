import { Suspense } from 'react'
import MainLayout from '@/layouts/MainLayout'
import ProductGrid from '@/components/ProductGrid'
import { searchBooks } from '@/utils/fetcher'
import { BookCardSkeleton } from '@/components/LoadingSkeleton'

interface SearchPageProps {
  searchParams: {
    q?: string
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ''
  const books = query ? await searchBooks(query) : []

  return (
    <MainLayout>
      <div className="bg-gray-50 dark:bg-gray-800 py-8 dark-transition">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 dark-transition">
              Search Results
            </h1>
            {query && (
              <p className="text-gray-600 dark:text-gray-300 dark-transition">
                {books.length} result{books.length !== 1 ? 's' : ''} found for "{query}"
              </p>
            )}
          </div>
        </div>
      </div>

      <Suspense fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }>
        {books.length > 0 ? (
          <ProductGrid
            books={books}
            className="py-8"
          />
        ) : query ? (
          <div className="container mx-auto px-4 py-16 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg dark-transition">No books found for "{query}"</p>
            <p className="text-gray-400 dark:text-gray-500 mt-2 dark-transition">Try different keywords or browse our genres</p>
          </div>
        ) : (
          <div className="container mx-auto px-4 py-16 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg dark-transition">Enter a search term to find books</p>
          </div>
        )}
      </Suspense>
    </MainLayout>
  )
}