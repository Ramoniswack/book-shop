// Mock data fetcher functions for SSR
import { Book, Genre, Author } from '@/types/book'
import { FEATURED_BOOKS, BESTSELLERS, GENRES, NEW_ARRIVALS, ALL_BOOKS } from './constants'

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const fetchFeaturedBooks = async (): Promise<Book[]> => {
  await delay(100) // Simulate network delay
  return FEATURED_BOOKS as Book[]
}

export const fetchBestsellers = async (): Promise<Book[]> => {
  await delay(100)
  return BESTSELLERS as Book[]
}

export const fetchNewArrivals = async (): Promise<Book[]> => {
  await delay(100)
  return NEW_ARRIVALS as Book[]
}

export const fetchAllBooks = async (): Promise<Book[]> => {
  await delay(100)
  return ALL_BOOKS as Book[]
}

export const fetchGenres = async (): Promise<Genre[]> => {
  await delay(100)
  return GENRES as Genre[]
}

export const fetchBooksByGenre = async (genreSlug: string): Promise<Book[]> => {
  await delay(200)
  // Filter books by genre (mock implementation)
  return ALL_BOOKS.filter(book => 
    book.genre.toLowerCase().replace(/[^a-z0-9]+/g, '-') === genreSlug
  ) as Book[]
}

export const fetchBooksByAuthor = async (authorId: string): Promise<Book[]> => {
  await delay(200)
  // Mock implementation - in real app, filter by author ID
  const authorNames = {
    '1': 'Fyodor Dostoyevsky',
    '2': 'Buddhisagar', 
    '3': 'Robert Greene',
    '4': 'A.C. Bhaktivedanta',
    '5': 'Franz Kafka',
    '6': 'Subin Bhattarai',
    '7': 'Colleen Hoover',
    '8': 'Haruki Murakami',
    '9': 'Morgan Housel'
  }
  
  const authorName = authorNames[authorId as keyof typeof authorNames]
  if (!authorName) return []
  
  return ALL_BOOKS.filter(book => 
    book.author.toLowerCase().includes(authorName.toLowerCase())
  ) as Book[]
}

export const fetchBookById = async (id: string): Promise<Book | null> => {
  await delay(150)
  return ALL_BOOKS.find(book => book.id === id) as Book || null
}

export const searchBooks = async (query: string): Promise<Book[]> => {
  await delay(300)
  return ALL_BOOKS.filter(book =>
    book.title.toLowerCase().includes(query.toLowerCase()) ||
    book.author.toLowerCase().includes(query.toLowerCase())
  ) as Book[]
}

export const fetchBestsellingAuthors = async (): Promise<Author[]> => {
  await delay(100)
  // Mock bestselling authors data
  return [
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
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
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
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      bookCount: 29,
      description: 'American author'
    },
    {
      id: '8',
      name: 'Haruki Murakami',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
      bookCount: 41,
      description: 'Japanese writer'
    },
    {
      id: '9',
      name: 'Morgan Housel',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      bookCount: 8,
      description: 'Financial writer'
    }
  ]
}