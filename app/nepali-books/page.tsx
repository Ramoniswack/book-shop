import { Suspense } from 'react'
import MainLayout from '@/layouts/MainLayout'
import ProductGrid from '@/components/ProductGrid'
import { BookCardSkeleton } from '@/components/LoadingSkeleton'
import { Globe } from 'lucide-react'

export default async function NepaliBooksPage() {
  // Fetch Nepali books from the database
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/books?isNepaliBook=true&limit=100`, {
    cache: 'no-store',
    next: { revalidate: 0 }
  })
  
  let nepaliBooks = []
  if (response.ok) {
    const data = await response.json()
    nepaliBooks = data.data?.books || []
  }

  return (
    <MainLayout>
      <div className="bg-gray-50 dark:bg-gray-800 py-8 dark-transition">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="text-white" size={32} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 dark-transition">
              Nepali Books
            </h1>
            <p className="text-gray-600 dark:text-gray-300 dark-transition">
              Explore our rich collection of Nepali literature and books ({nepaliBooks.length} books)
            </p>
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
        <ProductGrid
          books={nepaliBooks}
          className="py-8"
        />
      </Suspense>
    </MainLayout>
  )
}
