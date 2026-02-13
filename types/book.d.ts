export interface Book {
  _id: string;
  id?: string; // For backward compatibility
  title: string;
  author: string;
  description?: string;
  price: number;
  originalPrice?: number;
  discountPrice?: number;
  discountPercentage?: number; // NEW: Percentage discount (0-100)
  discount?: number;
  stock: number;
  inStock?: boolean; // Computed from stock
  images: string[];
  image?: string; // First image for backward compatibility
  genres: string[];
  genre?: string; // First genre for backward compatibility
  subGenres: string[];
  isUsedBook: boolean;
  condition: 'new' | 'like-new' | 'used';
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestseller?: boolean;
  isNew?: boolean; // Alias for isNewArrival
  isNepaliBook: boolean;
  status: 'active' | 'hidden' | 'out-of-stock';
  rating?: number;
  reviewCount?: number;
  reviews?: number;
  averageRating?: number; // NEW: Average rating from reviews
  totalReviews?: number; // NEW: Total number of reviews
  isbn?: string;
  publisher?: string;
  publishedDate?: string;
  pages?: number;
  language?: string;
  createdAt: string;
  updatedAt: string;
  // Deal information
  hasDeal?: boolean;
  dealInfo?: {
    _id: string;
    title: string;
    type: string;
    discountPercentage: number; // Changed from discountValue
    buyQuantity?: number;
    getQuantity?: number;
  };
}

export interface Author {
  _id: string;
  id?: string; // For backward compatibility
  name: string;
  bio?: string;
  image?: string;
  bookCount?: number;
  description?: string;
}

export interface Genre {
  _id: string;
  id?: string; // For backward compatibility
  name: string;
  slug?: string;
  subGenres: string[];
  image?: string;
  bookCount?: number;
  description?: string;
}