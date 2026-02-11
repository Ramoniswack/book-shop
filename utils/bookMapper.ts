import { Book } from '@/types/book';

/**
 * Normalize book data from backend to match frontend expectations
 * Adds backward compatibility fields
 */
export function normalizeBook(book: any): Book {
  return {
    ...book,
    id: book._id || book.id,
    image: book.images?.[0] || book.image || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
    genre: book.genres?.[0] || book.genre || 'General',
    originalPrice: book.discountPrice ? book.price : undefined,
    inStock: book.stock > 0,
    isNew: book.isNewArrival,
    reviewCount: book.reviews || book.reviewCount || 0,
    rating: book.rating || 0,
    language: book.language || 'English',
  };
}

/**
 * Normalize array of books
 */
export function normalizeBooks(books: any[]): Book[] {
  return books.map(normalizeBook);
}

/**
 * Check if book is in stock
 */
export function isBookInStock(book: Book): boolean {
  return book.stock > 0 && book.status === 'active';
}

/**
 * Get book display price (discounted or regular)
 */
export function getBookPrice(book: Book): number {
  return book.discountPrice || book.price;
}

/**
 * Calculate discount percentage
 */
export function getDiscountPercentage(book: Book): number {
  if (!book.discountPrice || book.discountPrice >= book.price) {
    return 0;
  }
  return Math.round(((book.price - book.discountPrice) / book.price) * 100);
}
