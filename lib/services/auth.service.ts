/**
 * Authentication API Service
 * 
 * All authentication-related API calls.
 */

import apiClient from '../api';
import { AUTH_ENDPOINTS } from '../endpoints';
import { ApiResponse, User, SignupFormData, LoginFormData } from '../types';
import { saveAuthData, clearAuthData } from '../auth';

/**
 * Authentication Response Interface
 */
interface AuthResponse {
  user: User;
  token: string;
}

/**
 * Sign up a new user
 */
export const signup = async (userData: SignupFormData): Promise<ApiResponse<AuthResponse>> => {
  const response = await apiClient.post(AUTH_ENDPOINTS.SIGNUP, userData);
  
  // Save auth data to localStorage on success
  if (response.data.success && response.data.data) {
    const { user, token } = response.data.data;
    saveAuthData(user, token);
  }
  
  return response.data;
};

/**
 * Login user
 */
export const login = async (credentials: LoginFormData): Promise<ApiResponse<AuthResponse>> => {
  const response = await apiClient.post(AUTH_ENDPOINTS.LOGIN, credentials);
  
  // Save auth data to localStorage on success
  if (response.data.success && response.data.data) {
    const { user, token } = response.data.data;
    saveAuthData(user, token);
  }
  
  return response.data;
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  try {
    await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear auth data regardless of API response
    clearAuthData();
    
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (profileData: {
  firstName: string;
  lastName: string;
  email: string;
}): Promise<ApiResponse<{ user: User }>> => {
  const response = await apiClient.put(AUTH_ENDPOINTS.PROFILE, profileData);
  
  // Update user in localStorage on success
  if (response.data.success && response.data.data?.user) {
    const { saveUser } = await import('../auth');
    saveUser(response.data.data.user);
  }
  
  return response.data;
};

/**
 * Update user password
 */
export const updatePassword = async (passwordData: {
  currentPassword: string;
  newPassword: string;
}): Promise<ApiResponse> => {
  const response = await apiClient.put(AUTH_ENDPOINTS.PASSWORD, passwordData);
  return response.data;
};

/**
 * Request password reset
 */
export const forgotPassword = async (email: string): Promise<ApiResponse> => {
  const response = await apiClient.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
  return response.data;
};

/**
 * Reset password with token
 */
export const resetPassword = async (token: string, newPassword: string): Promise<ApiResponse> => {
  const response = await apiClient.post(AUTH_ENDPOINTS.RESET_PASSWORD, { token, newPassword });
  return response.data;
};
