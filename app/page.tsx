import { Suspense } from 'react'
import MainLayout from '@/layouts/MainLayout'
import HomePageClient from '@/components/HomePageClient'
import { fetchFeaturedBooks, fetchBestsellers, fetchGenres, fetchNewArrivals, fetchBestsellingAuthors } from '@/utils/fetcher'
import { HomePageSkeleton } from '@/components/LoadingSkeleton'
import { normalizeBooks } from '@/utils/bookMapper'

// Fetch active deals for homepage
const fetchHomeDeals = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/deals/active?showOnHomepage=true`, {
      cache: 'no-store',
    })
    const data = await response.json()
    if (data.success && data.data) {
      // Normalize books in each deal
      return data.data.map((deal: any) => ({
        ...deal,
        applicableBooks: deal.applicableBooks ? normalizeBooks(deal.applicableBooks) : []
      }))
    }
    return []
  } catch (error) {
    console.error('Error fetching home deals:', error)
    return []
  }
}

// Fetch active homepage sections
const fetchHomepageSections = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/homepage-sections/active`, {
      cache: 'no-store',
    })
    const data = await response.json()
    if (data.success && data.data) {
      // Normalize books in each section
      return data.data.map((section: any) => ({
        ...section,
        books: section.books ? normalizeBooks(section.books) : []
      }))
    }
    return []
  } catch (error) {
    console.error('Error fetching homepage sections:', error)
    return []
  }
}

export default async function HomePage() {
  // Fetch data for SSR
  const [featuredBooks, bestsellers, allGenres, newArrivals, allAuthors, homeDeals, homepageSections] = await Promise.all([
    fetchFeaturedBooks(),
    fetchBestsellers(),
    fetchGenres(),
    fetchNewArrivals(),
    fetchBestsellingAuthors(),
    fetchHomeDeals(),
    fetchHomepageSections(),
  ])

  // Filter out genres and authors with no books
  const genres = allGenres.filter(genre => genre.bookCount && genre.bookCount > 0)
  const authors = allAuthors.filter(author => author.bookCount && author.bookCount > 0)

  return (
    <MainLayout>
      <Suspense fallback={<HomePageSkeleton />}>
        <HomePageClient 
          featuredBooks={featuredBooks}
          bestsellers={bestsellers}
          genres={genres}
          newArrivals={newArrivals}
          authors={authors}
          homeDeals={homeDeals}
          homepageSections={homepageSections}
        />
      </Suspense>
    </MainLayout>
  )
}