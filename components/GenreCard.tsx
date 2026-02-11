import Image from 'next/image'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'

interface GenreCardProps {
  genre: {
    id: string
    name: string
    slug: string
    image?: string
    bookCount: number
    description?: string
  }
  className?: string
}

const GenreCard = ({ genre, className = '' }: GenreCardProps) => {
  return (
    <Link href={`/genre/${genre.slug}`}>
      <div className={`card hover:shadow-lg transition-all duration-300 group cursor-pointer dark-transition overflow-hidden ${className}`}>
        <div className="relative h-48 md:h-56 overflow-hidden">
          {genre.image ? (
            <Image
              src={genre.image}
              alt={genre.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center">
              <BookOpen size={48} className="text-bookStore-blue dark:text-blue-400" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-colors duration-300"></div>
          
          {/* Title and book count overlay on image */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="font-semibold text-lg group-hover:text-blue-300 transition-colors duration-200">
              {genre.name}
            </h3>
            <p className="text-sm text-gray-200 mt-1">
              {genre.bookCount.toLocaleString()} {genre.bookCount === 1 ? 'book' : 'books'} available
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default GenreCard