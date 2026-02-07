'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import BookForm from '@/components/BookForm';
import { updateBook } from '@/utils/seller';
import apiRequest from '@/utils/api';

interface Book {
  _id: string;
  title: string;
  description: string;
  author: string;
  genres: string[];
  subGenres: string[];
  price: number;
  discountPrice?: number;
  stock: number;
  images: string[];
  isUsedBook: boolean;
  condition: 'new' | 'like-new' | 'used';
  isFeatured: boolean;
  isNewArrival: boolean;
}

export default function EditBook() {
  const router = useRouter();
  const params = useParams();
  const bookId = params.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    fetchBook();
  }, [bookId]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      setFetchError(null);

      // Fetch book details
      const response = await apiRequest(`/books/${bookId}`, {
        method: 'GET',
      });

      if (response.success) {
        setBook(response.data);
      } else {
        setFetchError(response.message || 'Failed to fetch book');
      }
    } catch (err: any) {
      setFetchError(err.message || 'Failed to fetch book');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Convert string values to appropriate types
      const bookData = {
        ...formData,
        price: parseFloat(formData.price),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : undefined,
        stock: parseInt(formData.stock),
      };

      const response = await updateBook(bookId, bookData);

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/seller/books');
        }, 2000);
      } else {
        setError(response.message || 'Failed to update book');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update book');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-center gap-4 mb-6">
          <Link href="/seller/books" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit Book</h1>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded w-full"></div>
            <div className="h-32 bg-gray-200 rounded w-full"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div>
        <div className="flex items-center gap-4 mb-6">
          <Link href="/seller/books" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit Book</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-800 font-medium">Error loading book</p>
          </div>
          <p className="text-red-600 mt-2">{fetchError}</p>
          <button
            onClick={fetchBook}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div>
        <div className="flex items-center gap-4 mb-6">
          <Link href="/seller/books" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit Book</h1>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800">Book not found</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/seller/books" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit Book</h1>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <p className="text-green-800 font-medium">Book updated successfully!</p>
          </div>
          <p className="text-green-600 text-sm mt-1">Redirecting to books list...</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-800 font-medium">Error updating book</p>
          </div>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <BookForm
          initialData={{
            title: book.title,
            description: book.description,
            author: book.author,
            genres: book.genres,
            subGenres: book.subGenres,
            price: book.price.toString(),
            discountPrice: book.discountPrice?.toString() || '',
            stock: book.stock.toString(),
            images: book.images,
            isUsedBook: book.isUsedBook,
            condition: book.condition,
            isFeatured: book.isFeatured,
            isNewArrival: book.isNewArrival,
          }}
          onSubmit={handleSubmit}
          submitLabel="Update Book"
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}
