import { Suspense } from 'react'
import MainLayout from '@/layouts/MainLayout'
import ProductGrid from '@/components/ProductGrid'
import { fetchAllBooks } from '@/utils/fetcher'
import { BookCardSkeleton } from '@/components/LoadingSkeleton'
import { Clock, Calendar, Bell } from 'lucide-react'

export default async function PreordersPage() {
  const allBooks = await fetchAllBooks()
  
  // Create preorder books (upcoming releases)
  const preorderBooks = allBooks.slice(0, 4).map((book, index) => ({
    ...book,
    id: `preorder-${book._id}`,
    title: `${book.title} (Upcoming Edition)`,
    description: 'Available for preorder - releasing soon',
  }))

  return (
    <MainLayout>
      <div className="bg-gray-50 dark:bg-gray-800 py-8 dark-transition">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="text-white" size={32} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 dark-transition">
              Preorders
            </h1>
            <p className="text-gray-600 dark:text-gray-300 dark-transition">
              Reserve your copy of upcoming book releases
            </p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <section className="py-8 bg-white dark:bg-gray-900 dark-transition">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-3 dark-transition">
                <Clock className="text-indigo-600 dark:text-indigo-400" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 dark-transition">Early Access</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm dark-transition">Be among the first to get new releases</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-3 dark-transition">
                <Bell className="text-indigo-600 dark:text-indigo-400" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 dark-transition">Notifications</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm dark-transition">Get notified when your preorder is ready</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-3 dark-transition">
                <Calendar className="text-indigo-600 dark:text-indigo-400" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 dark-transition">Guaranteed Copy</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm dark-transition">Secure your copy before general release</p>
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }>
        <ProductGrid
          books={preorderBooks}
          title="Available for Preorder"
          className="py-8"
        />
      </Suspense>
    </MainLayout>
  )
}