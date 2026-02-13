import { Metadata } from 'next'
import MainLayout from '@/layouts/MainLayout'
import GenreCard from '@/components/GenreCard'
import { fetchGenres } from '@/utils/fetcher'

export const metadata: Metadata = {
  title: 'Book Genres - Explore All Categories | BookStore Nepal',
  description: 'Explore our complete collection of book genres. Find fiction, non-fiction, mystery, romance, sci-fi, and more at BookStore Nepal.',
  keywords: 'book genres, book categories, fiction, non-fiction, mystery, romance, sci-fi, fantasy',
  openGraph: {
    title: 'Book Genres - BookStore Nepal',
    description: 'Explore our complete collection of book genres.',
    type: 'website',
    url: 'https://bookstore.com/genres',
    siteName: 'BookStore Nepal',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function GenresPage() {
  const allGenres = await fetchGenres()
  
  // Filter out genres with no books
  const genres = allGenres.filter(genre => genre.bookCount && genre.bookCount > 0)

  return (
    <MainLayout>
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              All Genres
            </h1>
            <p className="text-gray-600">
              Explore our complete collection of book genres
            </p>
          </div>
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {genres.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {genres.map((genre) => (
                <GenreCard key={genre._id} genre={genre} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No genres available at the moment</p>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  )
}