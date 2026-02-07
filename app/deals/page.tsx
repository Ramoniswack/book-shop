import { Suspense } from 'react'
import MainLayout from '@/layouts/MainLayout'
import ProductGrid from '@/components/ProductGrid'
import { fetchAllBooks } from '@/utils/fetcher'
import { BookCardSkeleton } from '@/components/LoadingSkeleton'
import { Tag, Clock, Percent, Gift, Recycle, ShoppingBag } from 'lucide-react'

export default async function DealsPage() {
  const allBooks = await fetchAllBooks()
  
  // Filter books with discounts for deals
  const discountDeals = allBooks.filter(book => book.originalPrice && book.originalPrice > book.price)
  
  // Create different deal categories
  const buyOneGetOneBooks = allBooks.slice(0, 4).map(book => ({
    ...book,
    id: `bogo-${book.id}`,
    title: book.title,
    originalPrice: book.price * 2,
    price: book.price
  }))

  const usedBooks = allBooks.slice(4, 8).map(book => ({
    ...book,
    id: `used-${book.id}`,
    title: book.title,
    originalPrice: book.price,
    price: Math.round(book.price * 0.6) // 40% off for used books
  }))

  return (
    <MainLayout>
      {/* Deals Header */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 dark:from-gray-900 dark:to-black text-white py-12 dark-transition">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Special Deals & Offers
          </h1>
          <p className="text-xl mb-6 opacity-90">
            Save big on your favorite books with our limited-time offers
          </p>
          <div className="flex justify-center items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <Percent size={20} />
              <span>Up to 50% OFF</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock size={20} />
              <span>Limited Time</span>
            </div>
            <div className="flex items-center space-x-2">
              <Tag size={20} />
              <span>Best Prices</span>
            </div>
          </div>
        </div>
      </div>

      {/* Deal Categories Menu */}
      <section className="py-8 bg-gray-50 dark:bg-gray-900 dark-transition">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8 dark-transition">Choose Your Deal Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <a href="#discount-deals" className="group">
              <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-lg text-center border-2 border-red-200 dark:border-red-400 hover:border-red-400 dark:hover:border-red-300 transition-all duration-300 transform hover:scale-105 dark-transition">
                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-200 dark:group-hover:bg-red-800/50 transition-colors">
                  <Percent className="text-red-500 dark:text-red-400" size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 dark-transition">Discount Deals</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 dark-transition">Up to 50% off on selected books</p>
                <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {discountDeals.length} Books Available
                </span>
              </div>
            </a>
            
            <a href="#bogo-deals" className="group">
              <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-lg text-center border-2 border-green-200 dark:border-green-400 hover:border-green-400 dark:hover:border-green-300 transition-all duration-300 transform hover:scale-105 dark-transition">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 dark:group-hover:bg-green-800/50 transition-colors">
                  <Gift className="text-green-500 dark:text-green-400" size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 dark-transition">Buy One Get One</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 dark-transition">Buy one book, get another free</p>
                <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {buyOneGetOneBooks.length} Offers Available
                </span>
              </div>
            </a>
            
            <a href="#used-books" className="group">
              <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-lg text-center border-2 border-blue-200 dark:border-blue-400 hover:border-blue-400 dark:hover:border-blue-300 transition-all duration-300 transform hover:scale-105 dark-transition">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                  <Recycle className="text-blue-500 dark:text-blue-400" size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 dark-transition">Used Books</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 dark-transition">Quality pre-owned books at great prices</p>
                <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {usedBooks.length} Books Available
                </span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Discount Deals */}
      <div id="discount-deals">
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
            books={discountDeals}
            title="Discount Deals"
            className="py-8 bg-white dark:bg-gray-900 dark-transition"
          />
        </Suspense>
      </div>

      {/* Buy One Get One Offers */}
      <div id="bogo-deals">
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
            books={buyOneGetOneBooks}
            title="Buy One Get One Free"
            className="py-8 bg-gray-50 dark:bg-gray-900 dark-transition"
          />
        </Suspense>
      </div>

      {/* Used Books */}
      <div id="used-books">
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
            books={usedBooks}
            title="Quality Used Books"
            className="py-8 bg-white dark:bg-gray-900 dark-transition"
            showViewAll={true}
            viewAllLink="/used-books"
          />
        </Suspense>
      </div>

      {/* Newsletter Signup for Deals */}
      <section className="py-12 bg-bookStore-blue dark:bg-gray-900 dark-transition">
        <div className="container mx-auto px-4 text-center text-white">
          <ShoppingBag size={48} className="mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">
            Never Miss a Deal
          </h2>
          <p className="text-xl mb-6 opacity-90">
            Subscribe to get notified about exclusive deals and flash sales
          </p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email for deals"
              className="flex-1 px-4 py-3 rounded-l-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none dark-transition"
            />
            <button className="px-6 py-3 bg-white dark:bg-blue-600 text-bookStore-blue dark:text-white font-semibold rounded-r-lg hover:bg-gray-100 dark:hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}