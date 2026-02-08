/**
 * Shared TypeScript Types and Interfaces
 * 
 * Centralized type definitions used across the entire application.
 * Benefits:
 * - Type safety across components
 * - Single source of truth for data structures
 * - Easy to maintain and update
 * - Prevents type inconsistencies
 */

/**
 * User Role Types
 */
export type UserRole = 'user' | 'seller' | 'admin';

/**
 * Order Status Types
 */
export type OrderStatus = 'pending' | 'accepted' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

/**
 * Payment Status Types
 */
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

/**
 * Book Status Types
 */
export type BookStatus = 'active' | 'hidden' | 'out_of_stock';

/**
 * Book Condition Types
 */
export type BookCondition = 'new' | 'like-new' | 'good' | 'fair' | 'poor';

/**
 * Deal Types
 */
export type DealType = 'percentage' | 'flat' | 'bogo';

/**
 * Deal Status (computed)
 */
export type DealStatus = 'active' | 'upcoming' | 'expired' | 'inactive';

/**
 * User Interface
 */
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

/**
 * Author Interface
 */
export interface Author {
  _id: string;
  name: string;
  bio?: string;
  image?: string;
  bookCount?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Genre Interface
 */
export interface Genre {
  _id: string;
  name: string;
  slug: string;
  subGenres?: string[];
  bookCount?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Book Interface
 */
export interface Book {
  _id: string;
  title: string;
  description: string;
  author: Author | string; // Can be populated or just ID
  genres: Genre[] | string[]; // Can be populated or just IDs
  price: number;
  discountPrice?: number;
  stock: number;
  images: string[];
  isUsedBook: boolean;
  condition: BookCondition;
  isFeatured: boolean;
  isNewArrival: boolean;
  status: BookStatus;
  sellerId: User | string; // Can be populated or just ID
  rating?: number;
  reviewCount?: number;
  soldCount?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Cart Item Interface
 */
export interface CartItem {
  _id: string;
  book: Book;
  quantity: number;
  price: number; // Price at time of adding to cart
}

/**
 * Cart Interface
 */
export interface Cart {
  _id: string;
  user: User | string;
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Wishlist Item Interface
 */
export interface WishlistItem {
  _id: string;
  book: Book;
  addedAt: string;
}

/**
 * Wishlist Interface
 */
export interface Wishlist {
  _id: string;
  user: User | string;
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Order Item Interface
 */
export interface OrderItem {
  book: Book;
  quantity: number;
  price: number; // Price at time of order
  subtotal: number;
}

/**
 * Address Interface
 */
export interface Address {
  _id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

/**
 * Order Interface
 */
export interface Order {
  _id: string;
  user: User | string;
  items: OrderItem[];
  shippingAddress: Address;
  totalPrice: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  sellerId?: User | string; // For seller-specific orders
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Deal Interface
 */
export interface Deal {
  _id: string;
  title: string;
  dealType: DealType;
  discountValue: number;
  applicableBooks: Book[] | string[];
  applicableGenres: Genre[] | string[];
  startDate: string;
  endDate: string;
  isActive: boolean;
  sellerId: User | string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Dashboard Summary Interface
 */
export interface DashboardSummary {
  totalRevenue: number;
  totalOrders: number;
  totalBooks: number;
  outOfStockBooks: number;
  recentOrders: Order[];
  lowStockAlerts: Book[];
}

/**
 * Analytics Overview Interface
 */
export interface AnalyticsOverview {
  totalRevenue: number;
  pendingRevenue: number;
  totalOrders: number;
  activeBooks: number;
}

/**
 * Best Selling Book Interface
 */
export interface BestSellingBook {
  book: Book;
  totalSold: number;
  revenue: number;
}

/**
 * Revenue Timeline Data Point
 */
export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

/**
 * API Response Wrapper
 * Generic type for all API responses
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

/**
 * Paginated Response Interface
 */
export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems?: number;
    itemsPerPage: number;
  };
}

/**
 * Form Data Interfaces
 */

export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface BookFormData {
  title: string;
  description: string;
  author: string; // Author ID
  genres: string[]; // Genre IDs
  price: number;
  discountPrice?: number;
  stock: number;
  images: string[];
  isUsedBook: boolean;
  condition: BookCondition;
  isFeatured: boolean;
  isNewArrival: boolean;
}

export interface DealFormData {
  title: string;
  dealType: DealType;
  discountValue: number;
  applicableBooks: string[]; // Book IDs
  applicableGenres: string[]; // Genre IDs
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface AddressFormData {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

/**
 * Query Parameter Interfaces
 */

export interface BookQueryParams {
  page?: number;
  limit?: number;
  status?: BookStatus;
  isUsedBook?: boolean;
  condition?: BookCondition;
  search?: string;
  genre?: string;
  author?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price' | 'createdAt' | 'rating' | 'soldCount';
  sortOrder?: 'asc' | 'desc';
}

export interface OrderQueryParams {
  page?: number;
  limit?: number;
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
  startDate?: string;
  endDate?: string;
}

export interface DealQueryParams {
  page?: number;
  limit?: number;
  isActive?: boolean;
  dealType?: DealType;
}

export interface GenericQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}
