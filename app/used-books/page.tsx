import { Suspense } from 'react'
import MainLayout from '@/layouts/MainLayout'
import ProductGrid from '@/components/ProductGrid'
import UsedBooksBanner from '@/components/UsedBooksBanner'
import { BookCardSkeleton } from '@/components/LoadingSkeleton'

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
      // Normalize books to ensure they have proper structure
      const books = data.data.books.map((book: any) => ({
        ...book,
        id: book._id || book.id,
        image: book.images?.[0] || book.image || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
        inStock: book.stock > 0,
      }))
      return books
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
      {/* Used Books Banner */}
      <UsedBooksBanner />

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
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
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