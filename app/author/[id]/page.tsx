import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import Image from 'next/image'
import MainLayout from '@/layouts/MainLayout'
import ProductGrid from '@/components/ProductGrid'
import { fetchBooksByAuthor, fetchBestsellingAuthors } from '@/utils/fetcher'
import { BookCardSkeleton } from '@/components/LoadingSkeleton'

interface AuthorPageProps {
  params: {
    id: string
  }
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const [authors, books] = await Promise.all([
    fetchBestsellingAuthors(),
    fetchBooksByAuthor(params.id)
  ])
  
  const author = authors.find(a => a.id === params.id)
  
  if (!author) {
    notFound()
  }

  return (
    <MainLayout>
      {/* Author Header */}
      <div className="bg-gray-50 dark:bg-gray-900 py-12 dark-transition">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            <Image
              src={author.image}
              alt={author.name}
              width={150}
              height={150}
              className="rounded-full object-cover"
            />
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 dark-transition">
                {author.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-4 dark-transition">{author.description}</p>
              <p className="text-booksmandala-blue dark:text-blue-400 font-semibold dark-transition">
                {author.bookCount} books available
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Author's Books */}
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
          title={`Books by ${author.name}`}
          className="py-8"
        />
      </Suspense>
    </MainLayout>
  )
}