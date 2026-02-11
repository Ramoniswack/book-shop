import apiRequest from './api';

// Dashboard Summary
export const getDashboardSummary = async () => {
  return await apiRequest('/seller/dashboard/summary', {
    method: 'GET',
  });
};

// Analytics
export const getAnalyticsOverview = async () => {
  return await apiRequest('/seller/analytics/overview', {
    method: 'GET',
  });
};

export const getBestSellingBooks = async (limit: number = 10) => {
  return await apiRequest(`/seller/analytics/best-selling?limit=${limit}`, {
    method: 'GET',
  });
};

export const getLowStockAlerts = async (threshold: number = 10) => {
  return await apiRequest(`/seller/analytics/low-stock?threshold=${threshold}`, {
    method: 'GET',
  });
};

export const getRevenueTimeline = async (period: 'day' | 'week' | 'month' | 'year' = 'month') => {
  return await apiRequest(`/seller/analytics/revenue-timeline?period=${period}`, {
    method: 'GET',
  });
};

// Orders
export const getSellerOrders = async (params?: {
  page?: number;
  limit?: number;
  orderStatus?: string;
  paymentStatus?: string;
}) => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.orderStatus) queryParams.append('orderStatus', params.orderStatus);
  if (params?.paymentStatus) queryParams.append('paymentStatus', params.paymentStatus);

  const queryString = queryParams.toString();
  const url = `/seller/orders${queryString ? `?${queryString}` : ''}`;

  return await apiRequest(url, {
    method: 'GET',
  });
};

export const updateOrderStatus = async (orderId: string, orderStatus: string) => {
  return await apiRequest(`/seller/orders/${orderId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ orderStatus }),
  });
};

// Books Management
export const getSellerBooks = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  isUsedBook?: boolean;
  condition?: string;
  search?: string;
}) => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.status) queryParams.append('status', params.status);
  if (params?.isUsedBook !== undefined) queryParams.append('isUsedBook', params.isUsedBook.toString());
  if (params?.condition) queryParams.append('condition', params.condition);
  if (params?.search) queryParams.append('search', params.search);

  const queryString = queryParams.toString();
  const url = `/seller/books${queryString ? `?${queryString}` : ''}`;

  return await apiRequest(url, {
    method: 'GET',
  });
};

export const toggleBookVisibility = async (bookId: string, status: 'active' | 'hidden') => {
  return await apiRequest(`/seller/analytics/books/${bookId}/visibility`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
};

export const toggleBookFeatured = async (bookId: string, isFeatured: boolean) => {
  return await apiRequest(`/seller/analytics/books/${bookId}/featured`, {
    method: 'PUT',
    body: JSON.stringify({ isFeatured }),
  });
};

export const deleteBook = async (bookId: string) => {
  return await apiRequest(`/seller/books/${bookId}`, {
    method: 'DELETE',
  });
};

export const getBookById = async (bookId: string) => {
  return await apiRequest(`/seller/books/${bookId}`, {
    method: 'GET',
  });
};

export const addBook = async (bookData: any) => {
  return await apiRequest('/seller/books', {
    method: 'POST',
    body: JSON.stringify(bookData),
  });
};

export const updateBook = async (bookId: string, bookData: any) => {
  return await apiRequest(`/seller/books/${bookId}`, {
    method: 'PUT',
    body: JSON.stringify(bookData),
  });
};

// Authors
export const getAuthors = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.search) queryParams.append('search', params.search);

  const queryString = queryParams.toString();
  const url = `/seller/authors${queryString ? `?${queryString}` : ''}`;

  return await apiRequest(url, {
    method: 'GET',
  });
};

export const createAuthor = async (authorData: { name: string; bio?: string; image: string }) => {
  return await apiRequest('/seller/authors', {
    method: 'POST',
    body: JSON.stringify(authorData),
  });
};

export const updateAuthor = async (authorId: string, authorData: { name: string; bio?: string; image: string }) => {
  return await apiRequest(`/seller/authors/${authorId}`, {
    method: 'PUT',
    body: JSON.stringify(authorData),
  });
};

export const deleteAuthor = async (authorId: string) => {
  return await apiRequest(`/seller/authors/${authorId}`, {
    method: 'DELETE',
  });
};

// Genres
export const getGenres = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.search) queryParams.append('search', params.search);

  const queryString = queryParams.toString();
  const url = `/seller/genres${queryString ? `?${queryString}` : ''}`;

  return await apiRequest(url, {
    method: 'GET',
  });
};

export const createGenre = async (genreData: { name: string; image: string; subGenres?: string[] }) => {
  return await apiRequest('/seller/genres', {
    method: 'POST',
    body: JSON.stringify(genreData),
  });
};

export const updateGenre = async (genreId: string, genreData: { name: string; image: string; subGenres?: string[] }) => {
  return await apiRequest(`/seller/genres/${genreId}`, {
    method: 'PUT',
    body: JSON.stringify(genreData),
  });
};

export const deleteGenre = async (genreId: string) => {
  return await apiRequest(`/seller/genres/${genreId}`, {
    method: 'DELETE',
  });
};

export const addSubGenresToGenre = async (genreId: string, subGenres: string[]) => {
  return await apiRequest(`/seller/genres/${genreId}/subgenres`, {
    method: 'PUT',
    body: JSON.stringify({ subGenres }),
  });
};

// Deals
export const getSellerDeals = async (params?: {
  page?: number;
  limit?: number;
  isActive?: boolean;
  type?: string;
}) => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
  if (params?.type) queryParams.append('type', params.type);

  const queryString = queryParams.toString();
  const url = `/seller/deals${queryString ? `?${queryString}` : ''}`;

  return await apiRequest(url, {
    method: 'GET',
  });
};

export const createDeal = async (dealData: any) => {
  return await apiRequest('/seller/deals', {
    method: 'POST',
    body: JSON.stringify(dealData),
  });
};

export const updateDeal = async (dealId: string, dealData: any) => {
  return await apiRequest(`/seller/deals/${dealId}`, {
    method: 'PUT',
    body: JSON.stringify(dealData),
  });
};

export const deleteDeal = async (dealId: string) => {
  return await apiRequest(`/seller/deals/${dealId}`, {
    method: 'DELETE',
  });
};

export const getDealById = async (dealId: string) => {
  return await apiRequest(`/seller/deals/${dealId}`, {
    method: 'GET',
  });
};

export const toggleDealStatus = async (dealId: string) => {
  return await apiRequest(`/seller/deals/${dealId}/toggle`, {
    method: 'PATCH',
  });
};
