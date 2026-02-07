import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import MainLayout from '@/layouts/MainLayout'
import ProductGrid from '@/components/ProductGrid'
import { fetchBooksByGenre, fetchGenres } from '@/utils/fetcher'
import { GENRES } from '@/utils/constants'
import { BookCardSkeleton } from '@/components/LoadingSkeleton'

interface GenrePageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return GENRES.map((genre) => ({
    slug: genre.slug,
  }))
}

export default async function GenrePage({ params }: GenrePageProps) {
  const genre = GENRES.find(g => g.slug === params.slug)
  
  if (!genre) {
    notFound()
  }

  const books = await fetchBooksByGenre(params.slug)

  return (
    <MainLayout>
      <div className="bg-gray-50 dark:bg-gray-800 py-8 dark-transition">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 dark-transition">
              {genre.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 dark-transition">
              {genre.bookCount.toLocaleString()} books available
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
          books={books}
          className="py-8"
        />
      </Suspense>
    </MainLayout>
  )
}