import apiRequest from '@/utils/api';
import { normalizeBook, normalizeBooks } from '@/utils/bookMapper';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Book {
  _id: string;
  title: string;
  author: string;
  description?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images: string[];
  genres: string[];
  subGenres: string[];
  isUsedBook: boolean;
  condition: 'new' | 'like-new' | 'used';
  isFeatured: boolean;
  isNewArrival: boolean;
  isNepaliBook: boolean;
  status: 'active' | 'hidden' | 'out-of-stock';
  rating?: number;
  reviews?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Genre {
  _id: string;
  name: string;
  subGenres: string[];
  slug?: string;
  bookCount?: number;
  image?: string;
  description?: string;
}

export interface Author {
  _id: string;
  name: string;
  bio?: string;
  image?: string;
  bookCount?: number;
  description?: string;
}

/**
 * Fetch all books
 */
export const fetchAllBooks = async (): Promise<Book[]> => {
  try {
    const response = await fetch(`${API_URL}/books`, {
      cache: 'no-store'
    });
    const data = await response.json();
    
    if (data.success && data.data && data.data.books) {
      return normalizeBooks(data.data.books);
    }
    return [];
  } catch (error) {
    console.error('Error fetching all books:', error);
    return [];
  }
};

/**
 * Fetch featured books
 */
export const fetchFeaturedBooks = async (): Promise<Book[]> => {
  try {
    const response = await fetch(`${API_URL}/books/featured`, {
      cache: 'no-store'
    });
    const data = await response.json();
    
    if (data.success && data.data) {
      const books = Array.isArray(data.data) ? data.data : data.data.books || [];
      return normalizeBooks(books);
    }
    return [];
  } catch (error) {
    console.error('Error fetching featured books:', error);
    return [];
  }
};

/**
 * Fetch new arrivals
 */
export const fetchNewArrivals = async (): Promise<Book[]> => {
  try {
    const response = await fetch(`${API_URL}/books/new-arrivals`, {
      cache: 'no-store'
    });
    const data = await response.json();
    
    if (data.success && data.data) {
      const books = Array.isArray(data.data) ? data.data : data.data.books || [];
      return normalizeBooks(books);
    }
    return [];
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    return [];
  }
};

/**
 * Fetch bestsellers
 */
export const fetchBestsellers = async (): Promise<Book[]> => {
  try {
    const response = await fetch(`${API_URL}/books/bestsellers`, {
      cache: 'no-store'
    });
    const data = await response.json();
    
    if (data.success && data.data) {
      const books = Array.isArray(data.data) ? data.data : data.data.books || [];
      return normalizeBooks(books);
    }
    return [];
  } catch (error) {
    console.error('Error fetching bestsellers:', error);
    return [];
  }
};

/**
 * Fetch book by ID
 */
export const fetchBookById = async (id: string): Promise<Book | null> => {
  try {
    const response = await fetch(`${API_URL}/books/${id}`, {
      cache: 'no-store'
    });
    const data = await response.json();
    
    if (data.success && data.data) {
      const book = data.data.book || data.data;
      return normalizeBook(book);
    }
    return null;
  } catch (error) {
    console.error(`Error fetching book ${id}:`, error);
    return null;
  }
};

/**
 * Fetch all genres
 */
export const fetchGenres = async (): Promise<Genre[]> => {
  try {
    const [genresResponse, booksResponse] = await Promise.all([
      fetch(`${API_URL}/genres`),
      fetch(`${API_URL}/books`)
    ]);
    
    const genresData = await genresResponse.json();
    const booksData = await booksResponse.json();
    
    if (genresData.success && genresData.data) {
      const genres = Array.isArray(genresData.data) ? genresData.data : genresData.data.genres || [];
      const books = booksData.success && booksData.data ? (Array.isArray(booksData.data) ? booksData.data : booksData.data.books || []) : [];
      
      // Calculate book count for each genre
      return genres.map((genre: any) => {
        const bookCount = books.filter((book: any) => 
          book.genres && book.genres.some((g: string) => 
            g.toLowerCase() === genre.name.toLowerCase()
          )
        ).length;
        
        return {
          ...genre,
          id: genre._id || genre.id,
          slug: genre.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          bookCount
        };
      });
    }
    return [];
  } catch (error) {
    console.error('Error fetching genres:', error);
    return [];
  }
};

/**
 * Fetch books by genre
 */
export const fetchBooksByGenre = async (genreSlug: string): Promise<Book[]> => {
  try {
    const allBooks = await fetchAllBooks();
    // Filter books by genre name (case-insensitive)
    return allBooks.filter(book => 
      book.genres.some(genre => 
        genre.toLowerCase().replace(/[^a-z0-9]+/g, '-') === genreSlug.toLowerCase()
      )
    );
  } catch (error) {
    console.error(`Error fetching books for genre ${genreSlug}:`, error);
    return [];
  }
};

/**
 * Fetch all authors
 */
export const fetchBestsellingAuthors = async (): Promise<Author[]> => {
  try {
    const response = await fetch(`${API_URL}/authors/bestselling`);
    const data = await response.json();
    
    if (data.success && data.data) {
      const authors = Array.isArray(data.data) ? data.data : data.data.authors || [];
      return authors.map((author: any) => ({
        ...author,
        id: author._id || author.id,
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching bestselling authors:', error);
    return [];
  }
};

/**
 * Fetch books by author
 */
export const fetchBooksByAuthor = async (authorId: string): Promise<Book[]> => {
  try {
    const response = await fetch(`${API_URL}/authors/${authorId}/books`);
    const data = await response.json();
    
    if (data.success && data.data) {
      const books = Array.isArray(data.data) ? data.data : data.data.books || [];
      return normalizeBooks(books);
    }
    return [];
  } catch (error) {
    console.error(`Error fetching books for author ${authorId}:`, error);
    return [];
  }
};

/**
 * Search books
 */
export const searchBooks = async (query: string): Promise<Book[]> => {
  try {
    const response = await fetch(`${API_URL}/books/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    
    if (data.success && data.data) {
      const books = Array.isArray(data.data) ? data.data : data.data.books || [];
      return normalizeBooks(books);
    }
    return [];
  } catch (error) {
    console.error(`Error searching books with query "${query}":`, error);
    return [];
  }
};

/**
 * Fetch Nepali books
 */
export const fetchNepaliBooks = async (): Promise<Book[]> => {
  try {
    const allBooks = await fetchAllBooks();
    return allBooks.filter(book => book.isNepaliBook);
  } catch (error) {
    console.error('Error fetching Nepali books:', error);
    return [];
  }
};

/**
 * Fetch used books
 */
export const fetchUsedBooks = async (): Promise<Book[]> => {
  try {
    const allBooks = await fetchAllBooks();
    return allBooks.filter(book => book.isUsedBook);
  } catch (error) {
    console.error('Error fetching used books:', error);
    return [];
  }
};
