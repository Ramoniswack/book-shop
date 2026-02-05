export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  image: string;
  genre: string;
  isbn?: string;
  description?: string;
  publisher?: string;
  publishedDate?: string;
  pages?: number;
  language: string;
  inStock: boolean;
  isFeatured?: boolean;
  isBestseller?: boolean;
  isNew?: boolean;
}

export interface Author {
  id: string;
  name: string;
  image: string;
  bookCount: number;
  description?: string;
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
  image?: string;
  bookCount: number;
  description?: string;
}