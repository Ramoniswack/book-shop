/**
 * Seller API Service
 * 
 * All seller-related API calls using the centralized API client.
 * This demonstrates the clean pattern for API integration.
 */

import apiClient from '../api';
import { SELLER_ENDPOINTS } from '../endpoints';
import {
  ApiResponse,
  PaginatedResponse,
  Book,
  Order,
  Deal,
  Author,
  Genre,
  DashboardSummary,
  AnalyticsOverview,
  BestSellingBook,
  RevenueDataPoint,
  BookQueryParams,
  OrderQueryParams,
  DealQueryParams,
  GenericQueryParams,
  BookFormData,
  DealFormData,
} from '../types';

/**
 * Build query string from params object
 */
const buildQueryString = (params?: Record<string, any>): string => {
  if (!params) return '';

  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, String(value));
    }
  });

  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : '';
};

/**
 * Dashboard APIs
 */
export const getDashboardSummary = async (): Promise<ApiResponse<DashboardSummary>> => {
  const response = await apiClient.get(SELLER_ENDPOINTS.DASHBOARD_SUMMARY);
  return response.data;
};

/**
 * Analytics APIs
 */
export const getAnalyticsOverview = async (): Promise<ApiResponse<AnalyticsOverview>> => {
  const response = await apiClient.get(SELLER_ENDPOINTS.ANALYTICS_OVERVIEW);
  return response.data;
};

export const getBestSellingBooks = async (limit: number = 10): Promise<ApiResponse<BestSellingBook[]>> => {
  const response = await apiClient.get(`${SELLER_ENDPOINTS.ANALYTICS_BEST_SELLING}?limit=${limit}`);
  return response.data;
};

export const getLowStockAlerts = async (threshold: number = 10): Promise<ApiResponse<Book[]>> => {
  const response = await apiClient.get(`${SELLER_ENDPOINTS.ANALYTICS_LOW_STOCK}?threshold=${threshold}`);
  return response.data;
};

export const getRevenueTimeline = async (
  period: 'day' | 'week' | 'month' | 'year' = 'month'
): Promise<ApiResponse<RevenueDataPoint[]>> => {
  const response = await apiClient.get(`${SELLER_ENDPOINTS.ANALYTICS_REVENUE_TIMELINE}?period=${period}`);
  return response.data;
};

/**
 * Books Management APIs
 */
export const getSellerBooks = async (params?: BookQueryParams): Promise<PaginatedResponse<Book>> => {
  const queryString = buildQueryString(params);
  const response = await apiClient.get(`${SELLER_ENDPOINTS.BOOKS}${queryString}`);
  return response.data;
};

export const getBookById = async (bookId: string): Promise<ApiResponse<Book>> => {
  const response = await apiClient.get(SELLER_ENDPOINTS.BOOK_BY_ID(bookId));
  return response.data;
};

export const createBook = async (bookData: BookFormData): Promise<ApiResponse<Book>> => {
  const response = await apiClient.post(SELLER_ENDPOINTS.BOOKS, bookData);
  return response.data;
};

export const updateBook = async (bookId: string, bookData: Partial<BookFormData>): Promise<ApiResponse<Book>> => {
  const response = await apiClient.put(SELLER_ENDPOINTS.BOOK_BY_ID(bookId), bookData);
  return response.data;
};

export const deleteBook = async (bookId: string): Promise<ApiResponse> => {
  const response = await apiClient.delete(SELLER_ENDPOINTS.BOOK_BY_ID(bookId));
  return response.data;
};

export const toggleBookVisibility = async (
  bookId: string,
  status: 'active' | 'hidden'
): Promise<ApiResponse<Book>> => {
  const response = await apiClient.put(SELLER_ENDPOINTS.BOOK_VISIBILITY(bookId), { status });
  return response.data;
};

export const toggleBookFeatured = async (bookId: string, isFeatured: boolean): Promise<ApiResponse<Book>> => {
  const response = await apiClient.put(SELLER_ENDPOINTS.BOOK_FEATURED(bookId), { isFeatured });
  return response.data;
};

/**
 * Orders Management APIs
 */
export const getSellerOrders = async (params?: OrderQueryParams): Promise<PaginatedResponse<Order>> => {
  const queryString = buildQueryString(params);
  const response = await apiClient.get(`${SELLER_ENDPOINTS.ORDERS}${queryString}`);
  return response.data;
};

export const getOrderById = async (orderId: string): Promise<ApiResponse<Order>> => {
  const response = await apiClient.get(SELLER_ENDPOINTS.ORDER_BY_ID(orderId));
  return response.data;
};

export const updateOrderStatus = async (
  orderId: string,
  orderStatus: string
): Promise<ApiResponse<Order>> => {
  const response = await apiClient.put(SELLER_ENDPOINTS.ORDER_STATUS(orderId), { orderStatus });
  return response.data;
};

/**
 * Deals Management APIs
 */
export const getSellerDeals = async (params?: DealQueryParams): Promise<PaginatedResponse<Deal>> => {
  const queryString = buildQueryString(params);
  const response = await apiClient.get(`${SELLER_ENDPOINTS.DEALS}${queryString}`);
  return response.data;
};

export const getDealById = async (dealId: string): Promise<ApiResponse<Deal>> => {
  const response = await apiClient.get(SELLER_ENDPOINTS.DEAL_BY_ID(dealId));
  return response.data;
};

export const createDeal = async (dealData: DealFormData): Promise<ApiResponse<Deal>> => {
  const response = await apiClient.post(SELLER_ENDPOINTS.DEALS, dealData);
  return response.data;
};

export const updateDeal = async (dealId: string, dealData: Partial<DealFormData>): Promise<ApiResponse<Deal>> => {
  const response = await apiClient.put(SELLER_ENDPOINTS.DEAL_BY_ID(dealId), dealData);
  return response.data;
};

export const deleteDeal = async (dealId: string): Promise<ApiResponse> => {
  const response = await apiClient.delete(SELLER_ENDPOINTS.DEAL_BY_ID(dealId));
  return response.data;
};

/**
 * Authors Management APIs
 */
export const getAuthors = async (params?: GenericQueryParams): Promise<PaginatedResponse<Author>> => {
  const queryString = buildQueryString(params);
  const response = await apiClient.get(`${SELLER_ENDPOINTS.AUTHORS}${queryString}`);
  return response.data;
};

export const createAuthor = async (authorData: {
  name: string;
  bio?: string;
  image?: string;
}): Promise<ApiResponse<Author>> => {
  const response = await apiClient.post(SELLER_ENDPOINTS.AUTHORS, authorData);
  return response.data;
};

/**
 * Genres Management APIs
 */
export const getGenres = async (params?: GenericQueryParams): Promise<PaginatedResponse<Genre>> => {
  const queryString = buildQueryString(params);
  const response = await apiClient.get(`${SELLER_ENDPOINTS.GENRES}${queryString}`);
  return response.data;
};

export const createGenre = async (genreData: {
  name: string;
  subGenres?: string[];
}): Promise<ApiResponse<Genre>> => {
  const response = await apiClient.post(SELLER_ENDPOINTS.GENRES, genreData);
  return response.data;
};
