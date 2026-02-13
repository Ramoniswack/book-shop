'use client'

import HeroSection from '@/components/HeroSection'
import ProductGrid from '@/components/ProductGrid'
import GenreSlider from '@/components/GenreSlider'
import BestsellingAuthors from '@/components/BestsellingAuthors'
import DealSection from '@/components/DealSection'
import DynamicSection from '@/components/DynamicSection'
import { DynamicBOGOBanner, DynamicFlashSaleBanner } from '@/components/PromotionalBanners'
import { Book, Genre, Author } from '@/types/book'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface Deal {
  _id: string
  title: string
  description: string
  type: 'FLASH_SALE' | 'BOGO' | 'LIMITED_TIME' | 'SEASONAL'
  discountPercentage: number
  buyQuantity?: number
  getQuantity?: number
  applicableBooks: any[]
  bannerImage?: string
  startDate: string
  endDate: string
}

interface HomepageSection {
  _id: string
  title: string
  books: Book[]
  displayType: 'grid' | 'slider'
}

interface HomePageClientProps {
  featuredBooks: Book[]
  bestsellers: Book[]
  genres: Genre[]
  newArrivals: Book[]
  authors: Author[]
  homeDeals: Deal[]
  homepageSections?: HomepageSection[]
}

const HomePageClient = ({ featuredBooks, bestsellers, genres, newArrivals, authors, homeDeals, homepageSections = [] }: HomePageClientProps) => {
  // Find BOGO and Flash Sale deals for promotional banners
  const bogoDeal = homeDeals.find(deal => deal.type === 'BOGO')
  const flashSaleDeal = homeDeals.find(deal => 
    deal.type === 'FLASH_SALE' || 
    deal.type === 'LIMITED_TIME' || 
    deal.type === 'SEASONAL'
  )

  // No dynamic deal sections on homepage - only promotional banners

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

      {/* Bestselling Authors */}
      <BestsellingAuthors authors={authors} />

      {/* Dynamic BOGO Banner - Uses actual BOGO deal data */}
      {bogoDeal && <DynamicBOGOBanner deal={bogoDeal} />}

      {/* Featured Books */}
      <ProductGrid
        books={featuredBooks}
        title="Featured Books"
        showViewAll={true}
        viewAllLink="/featured"
        className="bg-white dark:bg-gray-900"
      />

      {/* New Arrivals */}
      <ProductGrid
        books={newArrivals}
        title="New Arrivals"
        showViewAll={false}
        className="bg-gray-50 dark:bg-gray-900"
      />

      {/* Dynamic Flash Sale Banner - Uses actual Flash/Limited/Seasonal deal data */}
      {flashSaleDeal && <DynamicFlashSaleBanner deal={flashSaleDeal} />}

      {/* Bestsellers */}
      <ProductGrid
        books={bestsellers}
        title="Bestsellers"
        showViewAll={false}
        className="bg-white dark:bg-gray-900"
      />

      {/* Dynamic Homepage Sections - Rendered Below Bestsellers */}
      {homepageSections && homepageSections.length > 0 && homepageSections.map((section) => (
        <DynamicSection
          key={section._id}
          title={section.title}
          books={section.books || []}
          displayType="grid"
        />
      ))}
    </>
  )
}

export default HomePageClient