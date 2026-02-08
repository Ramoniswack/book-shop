# Frontend API Integration Library

This folder contains the centralized API integration pattern for the entire frontend application. It provides a clean, scalable, and type-safe way to interact with the backend API.

## 📁 Folder Structure

```
lib/
├── api.ts                      # Centralized Axios instance with interceptors
├── endpoints.ts                # All API endpoint constants
├── types.ts                    # Shared TypeScript interfaces
├── auth.ts                     # Authentication helper functions
├── services/
│   ├── auth.service.ts        # Authentication API calls
│   ├── seller.service.ts      # Seller dashboard API calls
│   └── [other services]       # Additional service files
├── USAGE_EXAMPLE.tsx          # Complete usage example
└── README.md                  # This file
```

## 🎯 Key Benefits

### 1. **Centralized Configuration**
- Single Axios instance for all API calls
- Automatic JWT token attachment
- Global error handling (401 redirects)
- Consistent request/response format

### 2. **Type Safety**
- Full TypeScript support
- Autocomplete for API parameters
- Compile-time error checking
- No `any` types

### 3. **Maintainability**
- Change endpoint once, update everywhere
- Clear separation of concerns
- Easy to refactor and update
- Consistent code patterns

### 4. **Scalability**
- Easy to add new endpoints
- Reusable service functions
- Modular architecture
- Clean code organization

### 5. **Developer Experience**
- No hardcoded URLs in components
- Clear API documentation
- Easy to test and mock
- Consistent error handling

## 🚀 Quick Start

### 1. Import What You Need

**Option A: Clean Imports (Recommended)**
```typescript
// Import everything from one place using index.ts
import { 
  Book, 
  User, 
  ApiResponse,
  getSellerBooks, 
  createBook,
  getUser, 
  hasSellerAccess 
} from '@/lib';
```

**Option B: Specific Imports**
```typescript
// Import from specific files
import { Book, User, ApiResponse } from '@/lib/types';
import { getSellerBooks, createBook } from '@/lib/services/seller.service';
import { getUser, hasSellerAccess } from '@/lib/auth';
```

### 2. Make API Calls

```typescript
// Fetch data with type safety
const fetchBooks = async () => {
  try {
    const response = await getSellerBooks({
      page: 1,
      limit: 10,
      status: 'active',
    });

    if (response.success) {
      setBooks(response.data);
    }
  } catch (error) {
    console.error('Error fetching books:', error);
  }
};
```

### 3. Use Auth Helpers

```typescript
// Check authentication
if (!hasSellerAccess()) {
  router.push('/login');
  return;
}

// Get current user
const user = getUser();
console.log(user?.firstName);
```

## 📚 Core Files

### `api.ts` - Axios Instance

Configured Axios instance with:
- Base URL from environment variables
- Automatic JWT token attachment
- 401 error handling (auto-logout)
- Request/response interceptors

```typescript
import apiClient from '@/lib/api';

// Use in service files
const response = await apiClient.get('/endpoint');
```

### `endpoints.ts` - API Endpoints

All API endpoints organized by feature:

```typescript
import { SELLER_ENDPOINTS } from '@/lib/endpoints';

// Use endpoint constants
const url = SELLER_ENDPOINTS.BOOKS;
const bookUrl = SELLER_ENDPOINTS.BOOK_BY_ID('123');
```

Available endpoint groups:
- `AUTH_ENDPOINTS` - Authentication
- `USER_ENDPOINTS` - User profile
- `SELLER_ENDPOINTS` - Seller dashboard
- `BOOK_ENDPOINTS` - Public books
- `CART_ENDPOINTS` - Shopping cart
- `WISHLIST_ENDPOINTS` - Wishlist
- `ORDER_ENDPOINTS` - Orders
- `DEAL_ENDPOINTS` - Deals
- `GENRE_ENDPOINTS` - Genres
- `AUTHOR_ENDPOINTS` - Authors
- `ADDRESS_ENDPOINTS` - Addresses

### `types.ts` - TypeScript Types

Comprehensive type definitions:

```typescript
import { Book, User, Order, Deal } from '@/lib/types';

// Use in components
const [books, setBooks] = useState<Book[]>([]);
const [user, setUser] = useState<User | null>(null);
```

Available types:
- **Entities**: `User`, `Book`, `Order`, `Deal`, `Author`, `Genre`, etc.
- **Form Data**: `SignupFormData`, `LoginFormData`, `BookFormData`, etc.
- **Query Params**: `BookQueryParams`, `OrderQueryParams`, etc.
- **Responses**: `ApiResponse<T>`, `PaginatedResponse<T>`
- **Enums**: `UserRole`, `OrderStatus`, `BookStatus`, etc.

### `auth.ts` - Auth Helpers

Reusable authentication utilities:

```typescript
import { getUser, hasSellerAccess, logout } from '@/lib/auth';

// Check user role
if (hasSellerAccess()) {
  // Show seller features
}

// Get user info
const user = getUser();
const fullName = getUserFullName();
const initials = getUserInitials();

// Logout
logout();
```

Available functions:
- `getUser()` - Get current user
- `getToken()` - Get JWT token
- `isAuthenticated()` - Check if logged in
- `hasRole(role)` - Check specific role
- `isSeller()` - Check if seller
- `isAdmin()` - Check if admin
- `hasSellerAccess()` - Check seller or admin
- `saveAuthData(user, token)` - Save auth data
- `clearAuthData()` - Clear auth data
- `logout()` - Logout and redirect
- `getUserFullName()` - Get full name
- `getUserInitials()` - Get initials

## 🔧 Service Files

Service files contain all API calls for a specific feature area.

### Example: `seller.service.ts`

```typescript
import { getSellerBooks, createBook, updateBook } from '@/lib/services/seller.service';

// Fetch books
const response = await getSellerBooks({ page: 1, limit: 10 });

// Create book
const newBook = await createBook({
  title: 'Book Title',
  author: 'author-id',
  price: 29.99,
  // ... other fields
});

// Update book
const updated = await updateBook('book-id', {
  price: 24.99,
});
```

Available services:
- `auth.service.ts` - Authentication
- `seller.service.ts` - Seller dashboard
- Add more as needed

## 📖 Usage Patterns

### Pattern 1: Fetch Data

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Book } from '@/lib/types';
import { getSellerBooks } from '@/lib/services/seller.service';

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await getSellerBooks({ limit: 10 });
      
      if (response.success) {
        setBooks(response.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // ... render
}
```

### Pattern 2: Create/Update Data

```typescript
const handleSubmit = async (formData: BookFormData) => {
  try {
    const response = await createBook(formData);
    
    if (response.success) {
      router.push('/seller/books');
    } else {
      setError(response.message);
    }
  } catch (error: any) {
    setError(error.response?.data?.message || 'Failed to create book');
  }
};
```

### Pattern 3: Delete Data

```typescript
const handleDelete = async (bookId: string) => {
  if (!confirm('Are you sure?')) return;

  try {
    const response = await deleteBook(bookId);
    
    if (response.success) {
      // Refresh list
      fetchBooks();
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Pattern 4: Protected Routes

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { hasSellerAccess } from '@/lib/auth';

export default function SellerPage() {
  const router = useRouter();

  useEffect(() => {
    if (!hasSellerAccess()) {
      router.push('/login');
    }
  }, []);

  // ... rest of component
}
```

## 🧪 Testing

### Mock API Services

```typescript
// In your test file
jest.mock('@/lib/services/seller.service', () => ({
  getSellerBooks: jest.fn(),
  createBook: jest.fn(),
}));

// In your test
import { getSellerBooks } from '@/lib/services/seller.service';

(getSellerBooks as jest.Mock).mockResolvedValue({
  success: true,
  data: [/* mock books */],
});
```

### Mock Auth Helpers

```typescript
jest.mock('@/lib/auth', () => ({
  getUser: jest.fn(),
  hasSellerAccess: jest.fn(),
}));

import { hasSellerAccess } from '@/lib/auth';

(hasSellerAccess as jest.Mock).mockReturnValue(true);
```

## 🔐 Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 📝 Adding New Features

### 1. Add Endpoint

```typescript
// lib/endpoints.ts
export const NEW_ENDPOINTS = {
  LIST: '/new-feature',
  BY_ID: (id: string) => `/new-feature/${id}`,
} as const;
```

### 2. Add Types

```typescript
// lib/types.ts
export interface NewFeature {
  _id: string;
  name: string;
  // ... other fields
}
```

### 3. Create Service

```typescript
// lib/services/new-feature.service.ts
import apiClient from '../api';
import { NEW_ENDPOINTS } from '../endpoints';
import { NewFeature, ApiResponse } from '../types';

export const getNewFeatures = async (): Promise<ApiResponse<NewFeature[]>> => {
  const response = await apiClient.get(NEW_ENDPOINTS.LIST);
  return response.data;
};
```

### 4. Use in Component

```typescript
import { NewFeature } from '@/lib/types';
import { getNewFeatures } from '@/lib/services/new-feature.service';

// Use in component
const [features, setFeatures] = useState<NewFeature[]>([]);
```

## 🎨 Best Practices

### ✅ DO

- Use service functions in components
- Import types for type safety
- Handle errors gracefully
- Use auth helpers for role checks
- Keep services focused and modular

### ❌ DON'T

- Make direct axios/fetch calls in components
- Hardcode API URLs
- Use `any` types
- Duplicate API logic
- Skip error handling

## 🔗 Related Files

- `/utils/api.ts` - Legacy API helper (to be migrated)
- `/utils/auth.ts` - Legacy auth helper (to be migrated)
- `/utils/seller.ts` - Legacy seller helper (to be migrated)

## 📚 Additional Resources

- [Axios Documentation](https://axios-http.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Next.js App Router](https://nextjs.org/docs/app)

---

**Note**: This is a production-ready pattern. All new API integrations should follow this structure for consistency and maintainability.
