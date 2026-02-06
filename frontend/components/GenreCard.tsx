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
      <div className={`card hover:shadow-lg transition-all duration-300 group cursor-pointer dark-transition ${className}`}>
        <div className="relative h-32 md:h-40 overflow-hidden">
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
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-bookStore-blue dark:group-hover:text-blue-400 transition-colors duration-200 dark-transition">
            {genre.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 dark-transition">
            {genre.bookCount.toLocaleString()} books
          </p>
          {genre.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 dark-transition">
              {genre.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

export default GenreCard