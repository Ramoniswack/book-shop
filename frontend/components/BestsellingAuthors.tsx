import Image from 'next/image'
import Link from 'next/link'
import { Author } from '@/types/book'

interface BestsellingAuthorsProps {
  authors?: Author[]
  className?: string
}

const BestsellingAuthors = ({ authors, className = '' }: BestsellingAuthorsProps) => {
  // Default authors data with real images
  const defaultAuthors: Author[] = [
    {
      id: '1',
      name: 'Fyodor Dostoyevsky',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      bookCount: 45,
      description: 'Russian novelist and philosopher'
    },
    {
      id: '2', 
      name: 'Buddhisagar',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      bookCount: 23,
      description: 'Nepali author'
    },
    {
      id: '3',
      name: 'Robert Greene',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
      bookCount: 12,
      description: 'American author'
    },
    {
      id: '4',
      name: 'A.C. Bhaktivedanta',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
      bookCount: 67,
      description: 'Spiritual teacher'
    },
    {
      id: '5',
      name: 'Franz Kafka',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
      bookCount: 34,
      description: 'Czech writer'
    },
    {
      id: '6',
      name: 'Subin Bhattarai',
      image: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face',
      bookCount: 18,
      description: 'Nepali novelist'
    },
    {
      id: '7',
      name: 'Colleen Hoover',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      bookCount: 29,
      description: 'American author'
    },
    {
      id: '8',
      name: 'Haruki Murakami',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      bookCount: 41,
      description: 'Japanese writer'
    },
    {
      id: '9',
      name: 'Morgan Housel',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      bookCount: 8,
      description: 'Financial writer'
    }
  ]

  const displayAuthors = authors || defaultAuthors

  return (
    <section className={`py-8 bg-gray-50 dark:bg-gray-800 dark-transition ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 dark-transition">
            Bestselling Authors
          </h2>
          <p className="text-gray-600 dark:text-gray-300 dark-transition">
            Discover Books by Bestselling Authors in Our Collection, Ranked by Popularity.
          </p>
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-4 md:gap-6">
          {displayAuthors.map((author) => (
            <Link 
              key={author.id} 
              href={`/author/${author.id}`}
              className="text-center group"
            >
              <div className="relative mb-3">
                <Image
                  src={author.image}
                  alt={author.name}
                  width={80}
                  height={80}
                  className="rounded-full mx-auto object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm group-hover:text-booksmandala-blue dark:group-hover:text-blue-400 transition-colors line-clamp-1 dark-transition">
                {author.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 dark-transition">
                {author.bookCount} books
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BestsellingAuthors