/**
 * API Endpoints Configuration
 * 
 * Centralized storage for all API endpoints.
 * Benefits:
 * - Easy to maintain and update
 * - Prevents typos in endpoint URLs
 * - Clear overview of all API routes
 * - Type-safe endpoint references
 */

/**
 * Authentication Endpoints
 */
export const AUTH_ENDPOINTS = {
  SIGNUP: '/auth/signup',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  PROFILE: '/auth/profile',
  PASSWORD: '/auth/password',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
} as const;

/**
 * User Endpoints
 */
export const USER_ENDPOINTS = {
  PROFILE: '/user/profile',
  ADDRESSES: '/user/addresses',
  ADDRESS_BY_ID: (id: string) => `/user/addresses/${id}`,
  ORDERS: '/user/orders',
  ORDER_BY_ID: (id: string) => `/user/orders/${id}`,
} as const;

/**
 * Seller Dashboard Endpoints
 */
export const SELLER_ENDPOINTS = {
  // Dashboard
  DASHBOARD_SUMMARY: '/seller/dashboard/summary',
  
  // Books Management
  BOOKS: '/seller/books',
  BOOK_BY_ID: (id: string) => `/seller/books/${id}`,
  BOOK_VISIBILITY: (id: string) => `/seller/analytics/books/${id}/visibility`,
  BOOK_FEATURED: (id: string) => `/seller/analytics/books/${id}/featured`,
  
  // Orders Management
  ORDERS: '/seller/orders',
  ORDER_BY_ID: (id: string) => `/seller/orders/${id}`,
  ORDER_STATUS: (id: string) => `/seller/orders/${id}/status`,
  
  // Deals Management
  DEALS: '/seller/deals',
  DEAL_BY_ID: (id: string) => `/seller/deals/${id}`,
  
  // Authors Management
  AUTHORS: '/seller/authors',
  AUTHOR_BY_ID: (id: string) => `/seller/authors/${id}`,
  
  // Genres Management
  GENRES: '/seller/genres',
  GENRE_BY_ID: (id: string) => `/seller/genres/${id}`,
  
  // Analytics
  ANALYTICS_OVERVIEW: '/seller/analytics/overview',
  ANALYTICS_BEST_SELLING: '/seller/analytics/best-selling',
  ANALYTICS_LOW_STOCK: '/seller/analytics/low-stock',
  ANALYTICS_REVENUE_TIMELINE: '/seller/analytics/revenue-timeline',
} as const;

/**
 * Public Book Endpoints
 */
export const BOOK_ENDPOINTS = {
  ALL_BOOKS: '/books',
  BOOK_BY_ID: (id: string) => `/books/${id}`,
  FEATURED_BOOKS: '/books/featured',
  NEW_ARRIVALS: '/books/new-arrivals',
  BESTSELLERS: '/books/bestsellers',
  USED_BOOKS: '/books/used',
  SEARCH: '/books/search',
  BY_GENRE: (slug: string) => `/books/genre/${slug}`,
  BY_AUTHOR: (id: string) => `/books/author/${id}`,
} as const;

/**
 * Cart Endpoints
 */
export const CART_ENDPOINTS = {
  CART: '/cart',
  ADD_ITEM: '/cart/add',
  UPDATE_ITEM: (itemId: string) => `/cart/item/${itemId}`,
  REMOVE_ITEM: (itemId: string) => `/cart/item/${itemId}`,
  CLEAR: '/cart/clear',
} as const;

/**
 * Wishlist Endpoints
 */
export const WISHLIST_ENDPOINTS = {
  WISHLIST: '/wishlist',
  ADD_ITEM: '/wishlist/add',
  REMOVE_ITEM: (bookId: string) => `/wishlist/${bookId}`,
  CLEAR: '/wishlist/clear',
} as const;

/**
 * Order Endpoints
 */
export const ORDER_ENDPOINTS = {
  CREATE: '/orders',
  MY_ORDERS: '/orders/my-orders',
  ORDER_BY_ID: (id: string) => `/orders/${id}`,
  CANCEL: (id: string) => `/orders/${id}/cancel`,
} as const;

/**
 * Deal Endpoints
 */
export const DEAL_ENDPOINTS = {
  ACTIVE_DEALS: '/deals/active',
  DEAL_BY_ID: (id: string) => `/deals/${id}`,
  BUNDLE_DEALS: '/deals/bundles',
} as const;

/**
 * Genre Endpoints
 */
export const GENRE_ENDPOINTS = {
  ALL_GENRES: '/genres',
  GENRE_BY_ID: (id: string) => `/genres/${id}`,
  GENRE_BY_SLUG: (slug: string) => `/genres/slug/${slug}`,
} as const;

/**
 * Author Endpoints
 */
export const AUTHOR_ENDPOINTS = {
  ALL_AUTHORS: '/authors',
  AUTHOR_BY_ID: (id: string) => `/authors/${id}`,
  BESTSELLING_AUTHORS: '/authors/bestselling',
} as const;

/**
 * Address Endpoints
 */
export const ADDRESS_ENDPOINTS = {
  ALL_ADDRESSES: '/addresses',
  ADDRESS_BY_ID: (id: string) => `/addresses/${id}`,
  SET_DEFAULT: (id: string) => `/addresses/${id}/default`,
} as const;
