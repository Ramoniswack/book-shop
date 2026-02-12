import { Book } from '@/types/book';

/**
 * Get deal badge information from book's deal data
 */
export function getDealBadgeInfo(book: any) {
  if (!book.hasDeal || !book.dealInfo) {
    return null;
  }

  const { type, discountValue, buyQuantity, getQuantity } = book.dealInfo;
  
  let badge = '';
  let color = '';
  
  switch (type) {
    case 'FLASH_SALE':
      badge = '🔥 FLASH';
      color = 'bg-red-500 text-white';
      break;
    case 'BOGO':
      badge = '🎁 BOGO';
      color = 'bg-green-500 text-white';
      break;
    case 'PERCENTAGE':
      badge = `${discountValue}% OFF`;
      color = 'bg-blue-500 text-white';
      break;
    case 'FIXED_DISCOUNT':
      badge = `${discountValue} OFF`;
      color = 'bg-purple-500 text-white';
      break;
    case 'LIMITED_TIME':
      badge = `⏰ ${discountValue}%`;
      color = 'bg-orange-500 text-white';
      break;
    case 'SEASONAL':
      badge = `🎉 ${discountValue}%`;
      color = 'bg-teal-500 text-white';
      break;
    default:
      badge = 'DEAL';
      color = 'bg-gray-500 text-white';
  }
  
  return { type, badge, color };
}

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
    // If book has deal, originalPrice is already set by backend
    // Otherwise, use discountPrice logic for backward compatibility
    originalPrice: book.originalPrice || (book.discountPrice && book.discountPrice < book.price ? book.price : undefined),
    inStock: book.stock > 0,
    isNew: book.isNewArrival,
    reviewCount: book.reviews || book.reviewCount || 0,
    rating: book.rating || 0,
    language: book.language || 'English',
    // Pass through deal information
    hasDeal: book.hasDeal || false,
    dealInfo: book.dealInfo || undefined,
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
