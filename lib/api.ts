/**
 * Centralized API Configuration
 * 
 * This file configures a single Axios instance used across the entire application.
 * Benefits:
 * - Single source of truth for API configuration
 * - Automatic JWT token attachment
 * - Centralized error handling (401 redirects)
 * - Request/response interceptors
 */

import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Base API URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Create and configure Axios instance
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookies for CORS
});

/**
 * Request Interceptor
 * Automatically attaches JWT token to every request
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage (only on client side)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles global error responses (especially 401 Unauthorized)
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return successful response data
    return response;
  },
  (error: AxiosError) => {
    // Handle 401 Unauthorized - clear auth and redirect to login
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // Clear authentication data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirect to login page
        window.location.href = '/login';
      }
    }
    
    // Return error for component-level handling
    return Promise.reject(error);
  }
);

/**
 * Export configured Axios instance
 * Use this in all API service files
 */
export default apiClient;
