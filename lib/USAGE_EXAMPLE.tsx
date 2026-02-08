/**
 * USAGE EXAMPLE: Seller Books Page
 * 
 * This demonstrates how to use the centralized API pattern in a real component.
 * Notice how clean and maintainable the code is:
 * - No hardcoded URLs
 * - Type-safe API calls
 * - Clear separation of concerns
 * - Easy to test and maintain
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Import types
import { Book, BookQueryParams } from '@/lib/types';

// Import API service
import { getSellerBooks, deleteBook, toggleBookVisibility } from '@/lib/services/seller.service';

// Import auth helpers
import { hasSellerAccess } from '@/lib/auth';

export default function SellerBooksPage() {
  const router = useRouter();
  
  // State management
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filter state
  const [filters, setFilters] = useState<BookQueryParams>({
    page: 1,
    limit: 10,
    status: undefined,
    search: '',
  });

  // Check seller access on mount
  useEffect(() => {
    if (!hasSellerAccess()) {
      router.push('/login');
      return;
    }
    
    fetchBooks();
  }, [filters]);

  /**
   * Fetch books using the centralized API service
   * Notice: No axios or fetch calls here, just clean service usage
   */
  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);

      // Call the API service with type-safe parameters
      const response = await getSellerBooks(filters);

      if (response.success) {
        setBooks(response.data);
        setCurrentPage(response.pagination.currentPage);
        setTotalPages(response.pagination.totalPages);
      } else {
        setError(response.message || 'Failed to fetch books');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle book deletion
   */
  const handleDeleteBook = async (bookId: string) => {
    if (!confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      const response = await deleteBook(bookId);

      if (response.success) {
        // Refresh the list
        fetchBooks();
      } else {
        alert(response.message || 'Failed to delete book');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete book');
    }
  };

  /**
   * Handle visibility toggle
   */
  const handleToggleVisibility = async (bookId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'hidden' : 'active';

    try {
      const response = await toggleBookVisibility(bookId, newStatus);

      if (response.success) {
        // Update the book in the list
        setBooks(books.map(book => 
          book._id === bookId 
            ? { ...book, status: newStatus as any }
            : book
        ));
      } else {
        alert(response.message || 'Failed to update visibility');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update visibility');
    }
  };

  /**
   * Handle search
   */
  const handleSearch = (searchTerm: string) => {
    setFilters({
      ...filters,
      search: searchTerm,
      page: 1, // Reset to first page
    });
  };

  /**
   * Handle status filter
   */
  const handleStatusFilter = (status: string) => {
    setFilters({
      ...filters,
      status: status as any,
      page: 1,
    });
  };

  /**
   * Handle pagination
   */
  const handlePageChange = (page: number) => {
    setFilters({
      ...filters,
      page,
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Books</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Books</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={fetchBooks}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Books</h1>
        <button
          onClick={() => router.push('/seller/books/add')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add New Book
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search books..."
          value={filters.search}
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded"
        />
        <select
          value={filters.status || ''}
          onChange={(e) => handleStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="hidden">Hidden</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
      </div>

      {/* Books Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Book
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {books.map((book) => (
              <tr key={book._id}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img
                      src={book.images[0] || '/placeholder.png'}
                      alt={book.title}
                      className="w-12 h-16 object-cover rounded mr-4"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{book.title}</div>
                      <div className="text-sm text-gray-500">
                        {typeof book.author === 'object' ? book.author.name : 'Unknown'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">${book.price.toFixed(2)}</div>
                  {book.discountPrice && (
                    <div className="text-xs text-gray-500 line-through">
                      ${book.discountPrice.toFixed(2)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{book.stock}</div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      book.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : book.status === 'hidden'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {book.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => router.push(`/seller/books/edit/${book._id}`)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleVisibility(book._id, book.status)}
                    className="text-yellow-600 hover:text-yellow-800"
                  >
                    {book.status === 'active' ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() => handleDeleteBook(book._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * KEY BENEFITS OF THIS PATTERN:
 * 
 * 1. CLEAN CODE
 *    - No hardcoded URLs in components
 *    - No axios/fetch calls scattered everywhere
 *    - Easy to read and understand
 * 
 * 2. TYPE SAFETY
 *    - Full TypeScript support
 *    - Autocomplete for API parameters
 *    - Compile-time error checking
 * 
 * 3. MAINTAINABILITY
 *    - Change API endpoint once in endpoints.ts
 *    - Update types once in types.ts
 *    - All components automatically updated
 * 
 * 4. TESTABILITY
 *    - Easy to mock API services
 *    - Clear separation of concerns
 *    - Unit test components without API calls
 * 
 * 5. SCALABILITY
 *    - Add new endpoints easily
 *    - Reuse services across components
 *    - Consistent error handling
 */
