import { Suspense } from 'react'
import MainLayout from '@/layouts/MainLayout'
import ProductGrid from '@/components/ProductGrid'
import { fetchAllBooks } from '@/utils/fetcher'
import { BookCardSkeleton } from '@/components/LoadingSkeleton'

export default async function BooksPage() {
  const books = await fetchAllBooks()

  return (
    <MainLayout>
      <div className="bg-gray-50 dark:bg-gray-800 py-8 dark-transition">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 dark-transition">
              All Books
            </h1>
            <p className="text-gray-600 dark:text-gray-300 dark-transition">
              Browse our complete collection of {books.length} books
            </p>
          </div>
        </div>
      </div>

      <Suspense fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(12)].map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }>
        <ProductGrid
          books={books}
          className="py-8"
        />
      </Suspense>
    </MainLayout>
  )
}