/**
 * CLEAN IMPORTS EXAMPLE
 * 
 * This demonstrates the cleanest way to import from the lib folder
 * using the central index.ts export file.
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// ✨ CLEAN IMPORTS - Everything from one place!
import {
  // Types
  Book,
  BookQueryParams,
  
  // Auth helpers
  hasSellerAccess,
  getUser,
  getUserFullName,
  
  // API services
  getSellerBooks,
  deleteBook,
  toggleBookVisibility,
} from '@/lib';

/**
 * Example: Seller Books Page with Clean Imports
 */
export default function CleanSellerBooksPage() {
  const router = useRouter();
  
  // Type-safe state
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication
  useEffect(() => {
    if (!hasSellerAccess()) {
      router.push('/login');
      return;
    }
    
    // Display user info
    const userName = getUserFullName();
    console.log(`Welcome, ${userName}!`);
    
    fetchBooks();
  }, []);

  /**
   * Fetch books with type-safe parameters
   */
  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);

      // Type-safe query parameters
      const params: BookQueryParams = {
        page: 1,
        limit: 10,
        status: 'active',
      };

      // Clean API call
      const response = await getSellerBooks(params);

      if (response.success) {
        setBooks(response.data);
      } else {
        setError((response as any).message || 'Failed to fetch books');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete book
   */
  const handleDelete = async (bookId: string) => {
    if (!confirm('Delete this book?')) return;

    try {
      await deleteBook(bookId);
      fetchBooks(); // Refresh list
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete book');
    }
  };

  /**
   * Toggle visibility
   */
  const handleToggleVisibility = async (book: Book) => {
    const newStatus = book.status === 'active' ? 'hidden' : 'active';

    try {
      await toggleBookVisibility(book._id, newStatus);
      
      // Update local state
      setBooks(books.map(b => 
        b._id === book._id 
          ? { ...b, status: newStatus }
          : b
      ));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update visibility');
    }
  };

  // Render component
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Books</h1>
      
      <div className="space-y-4">
        {books.map((book) => (
          <div key={book._id} className="border rounded-lg p-4">
            <h3 className="font-semibold">{book.title}</h3>
            <p className="text-sm text-gray-600">
              {typeof book.author === 'object' ? book.author.name : 'Unknown'}
            </p>
            <p className="text-lg font-bold">${book.price.toFixed(2)}</p>
            <p className="text-sm">Stock: {book.stock}</p>
            <p className="text-sm">Status: {book.status}</p>
            
            <div className="mt-4 space-x-2">
              <button
                onClick={() => handleToggleVisibility(book)}
                className="px-3 py-1 bg-yellow-500 text-white rounded"
              >
                {book.status === 'active' ? 'Hide' : 'Show'}
              </button>
              <button
                onClick={() => handleDelete(book._id)}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * COMPARISON: Import Styles
 */

// ❌ OLD WAY - Multiple imports from different files
/*
import apiRequest from '@/utils/api';
import { getUser } from '@/utils/auth';
import { getSellerBooks } from '@/utils/seller';
*/

// ✅ NEW WAY - Single import from lib
/*
import { 
  Book, 
  hasSellerAccess, 
  getSellerBooks 
} from '@/lib';
*/

/**
 * BENEFITS:
 * 
 * 1. Single Import Source
 *    - All types, helpers, and services from one place
 *    - Cleaner import statements
 *    - Less cognitive load
 * 
 * 2. Better Organization
 *    - Clear separation: types, auth, services
 *    - Easy to find what you need
 *    - Consistent patterns
 * 
 * 3. Easier Refactoring
 *    - Change internal structure without affecting imports
 *    - Components don't need to know file locations
 *    - Centralized export management
 * 
 * 4. Better IDE Support
 *    - Autocomplete works better
 *    - Jump to definition works
 *    - Easier to discover available functions
 */
