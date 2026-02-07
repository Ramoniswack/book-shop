import { Suspense } from 'react'
import MainLayout from '@/layouts/MainLayout'
import HomePageClient from '@/components/HomePageClient'
import { fetchFeaturedBooks, fetchBestsellers, fetchGenres, fetchNewArrivals, fetchBestsellingAuthors } from '@/utils/fetcher'
import { HomePageSkeleton } from '@/components/LoadingSkeleton'

export default async function HomePage() {
  // Fetch data for SSR
  const [featuredBooks, bestsellers, genres, newArrivals, authors] = await Promise.all([
    fetchFeaturedBooks(),
    fetchBestsellers(),
    fetchGenres(),
    fetchNewArrivals(),
    fetchBestsellingAuthors()
  ])

  return (
    <MainLayout>
      <Suspense fallback={<HomePageSkeleton />}>
        <HomePageClient 
          featuredBooks={featuredBooks}
          bestsellers={bestsellers}
          genres={genres}
          newArrivals={newArrivals}
          authors={authors}
        />
      </Suspense>
    </MainLayout>
  )
}