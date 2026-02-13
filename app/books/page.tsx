import { Suspense } from 'react'
import { Metadata } from 'next'
import MainLayout from '@/layouts/MainLayout'
import ProductGrid from '@/components/ProductGrid'
import { fetchAllBooks } from '@/utils/fetcher'
import { BookCardSkeleton } from '@/components/LoadingSkeleton'

export const metadata: Metadata = {
  title: 'All Books - Browse Our Complete Collection | BookStore Nepal',
  description: 'Browse our complete collection of books across all genres. Find bestsellers, new arrivals, classics, and more at BookStore Nepal.',
  keywords: 'all books, book collection, browse books, buy books online Nepal, book catalog',
  openGraph: {
    title: 'All Books - BookStore Nepal',
    description: 'Browse our complete collection of books across all genres.',
    type: 'website',
    url: 'https://bookstore.com/books',
    siteName: 'BookStore Nepal',
  },
  robots: {
    index: true,
    follow: true,
  },
}

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