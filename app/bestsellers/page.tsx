import { Suspense } from 'react'
import { Metadata } from 'next'
import MainLayout from '@/layouts/MainLayout'
import ProductGrid from '@/components/ProductGrid'
import { fetchBestsellers } from '@/utils/fetcher'
import { BookCardSkeleton } from '@/components/LoadingSkeleton'
import { TrendingUp, Award, Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Bestselling Books - Most Popular Titles | BookStore Nepal',
  description: 'Discover the most popular and bestselling books loved by readers worldwide. Shop trending titles across all genres at BookStore Nepal.',
  keywords: 'bestselling books, popular books, trending books, top books Nepal, bestsellers',
  openGraph: {
    title: 'Bestselling Books - BookStore Nepal',
    description: 'Discover the most popular books loved by readers worldwide.',
    type: 'website',
    url: 'https://bookstore.com/bestsellers',
    siteName: 'BookStore Nepal',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function BestsellersPage() {
  const bestsellers = await fetchBestsellers()

  return (
    <MainLayout>
      <div className="bg-gray-50 dark:bg-gray-800 py-8 dark-transition">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-bookStore-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="text-white" size={32} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 dark-transition">
              Bestselling Books
            </h1>
            <p className="text-gray-600 dark:text-gray-300 dark-transition">
              Discover the most popular books loved by readers worldwide
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
          books={bestsellers}
          className="py-8"
        />
      </Suspense>
    </MainLayout>
  )
}