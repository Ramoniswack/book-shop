import { Suspense } from 'react'
import MainLayout from '@/layouts/MainLayout'
import HomePageClient from '@/components/HomePageClient'
import { fetchFeaturedBooks, fetchBestsellers, fetchGenres, fetchNewArrivals, fetchBestsellingAuthors } from '@/utils/fetcher'
import { HomePageSkeleton } from '@/components/LoadingSkeleton'

// Fetch active deals for homepage
const fetchHomeDeals = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/deals/active?showOnHomepage=true`, {
      cache: 'no-store',
    })
    const data = await response.json()
    return data.success ? data.data : []
  } catch (error) {
    console.error('Error fetching home deals:', error)
    return []
  }
}

export default async function HomePage() {
  // Fetch data for SSR
  const [featuredBooks, bestsellers, allGenres, newArrivals, allAuthors, homeDeals] = await Promise.all([
    fetchFeaturedBooks(),
    fetchBestsellers(),
    fetchGenres(),
    fetchNewArrivals(),
    fetchBestsellingAuthors(),
    fetchHomeDeals(),
  ])

  // Filter out genres and authors with no books
  const genres = allGenres.filter(genre => genre.bookCount > 0)
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
        />
      </Suspense>
    </MainLayout>
  )
}