import { Suspense } from 'react'
import MainLayout from '@/layouts/MainLayout'
import ProductGrid from '@/components/ProductGrid'
import { fetchAllBooks } from '@/utils/fetcher'
import { BookCardSkeleton } from '@/components/LoadingSkeleton'
import { Package, Gift, Percent } from 'lucide-react'

export default async function BundleDealsPage() {
  const allBooks = await fetchAllBooks()
  
  // Create bundle deals with multiple books
  const bundleDeals = allBooks.slice(0, 6).map((book, index) => ({
    ...book,
    id: `bundle-${book._id}`,
    title: `Bundle: ${book.title} + 2 More Books`,
    originalPrice: book.price * 3,
    price: Math.round(book.price * 2.2), // Save on bundle
  }))

  return (
    <MainLayout>
      <div className="bg-gray-50 dark:bg-gray-800 py-8 dark-transition">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="text-white" size={32} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 dark-transition">
              Bundle Deals
            </h1>
            <p className="text-gray-600 dark:text-gray-300 dark-transition">
              Save more with our carefully curated book bundles
            </p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <section className="py-8 bg-white dark:bg-gray-900 dark-transition">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3 dark-transition">
                <Percent className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 dark-transition">Save More</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm dark-transition">Get multiple books at discounted bundle prices</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3 dark-transition">
                <Gift className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 dark-transition">Curated Selection</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm dark-transition">Expertly chosen books that complement each other</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3 dark-transition">
                <Package className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 dark-transition">Complete Sets</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm dark-transition">Get complete series and themed collections</p>
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }>
        <ProductGrid
          books={bundleDeals}
          title="Available Bundle Deals"
          className="py-8"
        />
      </Suspense>
    </MainLayout>
  )
}