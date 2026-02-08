/**
 * Authentication Helper Functions
 * 
 * Reusable utilities for authentication and authorization.
 * Benefits:
 * - Centralized auth logic
 * - Type-safe user operations
 * - Easy to test and maintain
 */

import { User, UserRole } from './types';

/**
 * Get the currently logged-in user from localStorage
 * @returns User object or null if not authenticated
 */
export const getUser = (): User | null => {
  if (typeof window === 'undefined') {
    return null; // Server-side rendering
  }

  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    const user = JSON.parse(userStr) as User;
    return user;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
};

/**
 * Get the JWT token from localStorage
 * @returns Token string or null
 */
export const getToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem('token');
};

/**
 * Check if user is authenticated
 * @returns true if user has a valid token
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

/**
 * Check if user has a specific role
 * @param role - Role to check
 * @returns true if user has the specified role
 */
export const hasRole = (role: UserRole): boolean => {
  const user = getUser();
  return user?.role === role;
};

/**
 * Check if user is a seller
 * @returns true if user role is 'seller'
 */
export const isSeller = (): boolean => {
  return hasRole('seller');
};

/**
 * Check if user is an admin
 * @returns true if user role is 'admin'
 */
export const isAdmin = (): boolean => {
  return hasRole('admin');
};

/**
 * Check if user is a seller or admin (has seller privileges)
 * @returns true if user is seller or admin
 */
export const hasSellerAccess = (): boolean => {
  return isSeller() || isAdmin();
};

/**
 * Check if user is a regular user (not seller or admin)
 * @returns true if user role is 'user'
 */
export const isRegularUser = (): boolean => {
  return hasRole('user');
};

/**
 * Save user data to localStorage
 * @param user - User object to save
 */
export const saveUser = (user: User): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user to localStorage:', error);
  }
};

/**
 * Save JWT token to localStorage
 * @param token - JWT token string
 */
export const saveToken = (token: string): void => {
  if (typeof window === 'undefined') return;

  localStorage.setItem('token', token);
};

/**
 * Save both user and token to localStorage
 * @param user - User object
 * @param token - JWT token string
 */
export const saveAuthData = (user: User, token: string): void => {
  saveUser(user);
  saveToken(token);
};

/**
 * Clear all authentication data from localStorage
 */
export const clearAuthData = (): void => {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

/**
 * Logout user and redirect to login page
 */
export const logout = (): void => {
  clearAuthData();
  
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

/**
 * Get user's full name
 * @returns Full name or 'Guest' if not authenticated
 */
export const getUserFullName = (): string => {
  const user = getUser();
  if (!user) return 'Guest';

  return `${user.firstName} ${user.lastName}`.trim();
};

/**
 * Get user's initials for avatar
 * @returns User initials (e.g., 'JD' for John Doe)
 */
export const getUserInitials = (): string => {
  const user = getUser();
  if (!user) return 'G';

  const firstInitial = user.firstName?.charAt(0) || '';
  const lastInitial = user.lastName?.charAt(0) || '';

  return `${firstInitial}${lastInitial}`.toUpperCase();
};
