import apiRequest from './api';

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export const signup = async (userData: SignupData) => {
  const data = await apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  });

  // Store token and user data
  if (data.success) {
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
  }

  return data;
};

export const login = async (credentials: LoginData) => {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  // Store token and user data
  if (data.success) {
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
  }

  return data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export const getUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem('token');
  }
  return false;
};
