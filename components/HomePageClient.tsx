'use client'

import HeroSection from '@/components/HeroSection'
import ProductGrid from '@/components/ProductGrid'
import GenreSlider from '@/components/GenreSlider'
import BestsellingAuthors from '@/components/BestsellingAuthors'
import DealSection from '@/components/DealSection'
import { UsedBooksPromoBanner, RecommendationBanner } from '@/components/PromotionalBanners'
import { Book, Genre, Author } from '@/types/book'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface Deal {
  _id: string
  title: string
  description: string
  type: 'FLASH_SALE' | 'BOGO' | 'PERCENTAGE' | 'FIXED_DISCOUNT' | 'LIMITED_TIME' | 'SEASONAL'
  discountValue: number
  buyQuantity?: number
  getQuantity?: number
  applicableBooks: any[]
  bannerImage?: string
  startDate: string
  endDate: string
}

interface HomePageClientProps {
  featuredBooks: Book[]
  bestsellers: Book[]
  genres: Genre[]
  newArrivals: Book[]
  authors: Author[]
  homeDeals: Deal[]
}

const HomePageClient = ({ featuredBooks, bestsellers, genres, newArrivals, authors, homeDeals }: HomePageClientProps) => {
  return (
    <>
      {/* Hero Section with Rotating Featured Books */}
      <HeroSection featuredBooks={featuredBooks} />

      {/* Genres Section */}
      <section className="py-12 bg-white dark:bg-gray-900 dark-transition">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 dark-transition">Browse Genres</h2>
            <Link href="/genres" className="text-bookStore-blue hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center dark-transition">
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          <GenreSlider genres={genres} />
        </div>
      </section>

      {/* Dynamic Deals Sections */}
      {homeDeals && homeDeals.length > 0 && homeDeals.map((deal) => (
        <DealSection key={deal._id} deal={deal} />
      ))}

      {/* Bestselling Authors */}
      <BestsellingAuthors authors={authors} />

      {/* Featured Books */}
      <ProductGrid
        books={featuredBooks}
        title="Featured Books"
        showViewAll={true}
        viewAllLink="/featured"
        className="bg-white dark:bg-gray-900"
      />

      {/* Used Books Promo Banner */}
      <UsedBooksPromoBanner />

      {/* New Arrivals */}
      <ProductGrid
        books={newArrivals}
        title="New Arrivals"
        showViewAll={false}
        className="bg-gray-50 dark:bg-gray-900"
      />

      {/* Bestsellers */}
      <ProductGrid
        books={bestsellers}
        title="Bestsellers"
        showViewAll={false}
        className="bg-white dark:bg-gray-900"
      />

      {/* Recommendation Banner */}
      <RecommendationBanner />
    </>
  )
}

export default HomePageClient