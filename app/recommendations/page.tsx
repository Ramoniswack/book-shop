import { Suspense } from 'react'
import MainLayout from '@/layouts/MainLayout'
import ProductGrid from '@/components/ProductGrid'
import { fetchFeaturedBooks, fetchBestsellers } from '@/utils/fetcher'
import { BookCardSkeleton } from '@/components/LoadingSkeleton'
import { Lightbulb, TrendingUp, Heart, Star } from 'lucide-react'

export default async function RecommendationsPage() {
  const [featuredBooks, bestsellers] = await Promise.all([
    fetchFeaturedBooks(),
    fetchBestsellers()
  ])

  // Create different recommendation categories
  const trendingBooks = featuredBooks.slice(0, 4)
  const popularBooks = bestsellers.slice(0, 4)
  const recommendedForYou = [...featuredBooks.slice(2, 4), ...bestsellers.slice(1, 3)]

  return (
    <MainLayout>
      {/* Recommendations Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lightbulb size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Book Recommendations
          </h1>
          <p className="text-xl mb-6 opacity-90 max-w-2xl mx-auto">
            Discover your next favorite book with our curated recommendations based on popular trends and reader preferences.
          </p>
        </div>
      </div>

      {/* Recommendation Categories */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800 dark-transition">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4 dark-transition">
                <TrendingUp className="text-purple-600 dark:text-purple-400" size={32} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 dark-transition">Trending Now</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm dark-transition">Books that are currently popular among readers</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4 dark-transition">
                <Star className="text-purple-600 dark:text-purple-400" size={32} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 dark-transition">Highly Rated</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm dark-transition">Top-rated books loved by our community</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4 dark-transition">
                <Heart className="text-purple-600 dark:text-purple-400" size={32} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 dark-transition">For You</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm dark-transition">Personalized picks based on your interests</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Books */}
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
          books={trendingBooks}
          title="Trending Now"
          className="py-8 bg-white dark:bg-gray-900 dark-transition"
        />
      </Suspense>

      {/* Popular Books */}
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
          books={popularBooks}
          title="Highly Rated Books"
          className="py-8 bg-gray-50 dark:bg-gray-800 dark-transition"
        />
      </Suspense>

      {/* Recommended For You */}
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
          books={recommendedForYou}
          title="Recommended For You"
          className="py-8 bg-white dark:bg-gray-900 dark-transition"
        />
      </Suspense>

    </MainLayout>
  )
}