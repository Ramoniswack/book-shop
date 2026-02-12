import { Suspense } from 'react'
import MainLayout from '@/layouts/MainLayout'
import ProductGrid from '@/components/ProductGrid'
import { BookCardSkeleton } from '@/components/LoadingSkeleton'
import { Recycle, CheckCircle, DollarSign, Leaf } from 'lucide-react'

// Fetch only used books from the API
const fetchUsedBooks = async () => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/books/used`
    console.log('🔍 Fetching used books from:', url)
    
    const response = await fetch(url, { cache: 'no-store' })
    const data = await response.json()
    
    console.log('📦 API Response:', {
      success: data.success,
      hasData: !!data.data,
      hasBooks: !!(data.data && data.data.books),
      booksCount: data.data?.books?.length || 0
    })
    
    // Handle the nested structure: data.data.books
    if (data.success && data.data && data.data.books) {
      console.log('✅ Returning', data.data.books.length, 'used books')
      return data.data.books
    }
    
    console.log('❌ No books found in response')
    return []
  } catch (error) {
    console.error('❌ Error fetching used books:', error)
    return []
  }
}

export default async function UsedBooksPage() {
  const usedBooks = await fetchUsedBooks()
  
  console.log('📚 UsedBooksPage rendering with', usedBooks.length, 'books')

  return (
    <MainLayout>
      {/* Used Books Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Recycle size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Quality Used Books
          </h1>
          <p className="text-xl mb-6 opacity-90 max-w-2xl mx-auto">
            Discover amazing books at unbeatable prices. All our used books are carefully inspected for quality and condition.
          </p>
        </div>
      </div>

      {/* Benefits Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900 dark-transition">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8 dark-transition">
            Why Choose Used Books?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 dark-transition">
                <DollarSign className="text-green-600 dark:text-green-400" size={32} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 dark-transition">Save Money</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm dark-transition">Get quality used books at discounted prices</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 dark-transition">
                <Leaf className="text-green-600 dark:text-green-400" size={32} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 dark-transition">Eco-Friendly</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm dark-transition">Give books a second life and reduce environmental impact</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 dark-transition">
                <CheckCircle className="text-green-600 dark:text-green-400" size={32} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 dark-transition">Quality Assured</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm dark-transition">All books are inspected and guaranteed to be in good condition</p>
            </div>
          </div>
        </div>
      </section>

      {/* Used Books Grid */}
      {usedBooks.length > 0 ? (
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
            books={usedBooks}
            title="Available Used Books"
            className="py-8"
          />
        </Suspense>
      ) : (
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Recycle className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No Used Books Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Check back soon for quality pre-owned books at great prices!
          </p>
        </div>
      )}

    </MainLayout>
  )
}