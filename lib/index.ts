/**
 * Central Export File
 * 
 * This file re-exports all commonly used items from the lib folder.
 * Allows for cleaner imports in components.
 * 
 * Usage:
 * import { getUser, hasSellerAccess, Book, getSellerBooks } from '@/lib';
 */

// Export all types
export * from './types';

// Export all auth helpers
export * from './auth';

// Export all endpoints (optional, usually not needed in components)
export * from './endpoints';

// Export API client (for advanced usage)
export { default as apiClient } from './api';

// Export all services
export * from './services/auth.service';
export * from './services/seller.service';
