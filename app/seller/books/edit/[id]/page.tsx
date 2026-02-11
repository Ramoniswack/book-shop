'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
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
  isNepaliBook: boolean;
  isBestseller: boolean;
  showInMegaMenuBestseller: boolean;
  showInMegaMenuNewArrival: boolean;
  showInMegaMenuNepali: boolean;
}

export default function EditBook() {
  const router = useRouter();
  const params = useParams();
  const bookId = params.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        // Response structure is { success: true, data: { book: {...} } }
        setBook(response.data.book || response.data);
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
    const toastId = toast.loading('Updating book...');
    
    try {
      setIsSubmitting(true);

      // Convert string values to appropriate types
      const bookData = {
        ...formData,
        price: parseFloat(formData.price),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : undefined,
        stock: parseInt(formData.stock),
      };

      const response = await updateBook(bookId, bookData);

      if (response.success) {
        toast.success('Book updated successfully!', { id: toastId });
        setTimeout(() => {
          router.push('/seller/books');
        }, 1500);
      } else {
        toast.error(response.message || 'Failed to update book', { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update book', { id: toastId });
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
          <p className="text-red-800 font-medium">Error loading book</p>
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
    <div className="-m-6 pb-20">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <Link href="/seller/books" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit Book</h1>
        </div>
      </div>

      {/* Form */}
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <BookForm
            initialData={{
              title: book.title,
              description: book.description,
              author: book.author,
              genres: book.genres,
              subGenres: book.subGenres,
              price: book.price?.toString() || '',
              discountPrice: book.discountPrice?.toString() || '',
              stock: book.stock?.toString() || '',
              images: book.images,
              isUsedBook: book.isUsedBook,
              condition: book.condition,
              isFeatured: book.isFeatured,
              isNewArrival: book.isNewArrival,
              isNepaliBook: book.isNepaliBook,
              isBestseller: book.isBestseller,
              showInMegaMenuBestseller: book.showInMegaMenuBestseller,
              showInMegaMenuNewArrival: book.showInMegaMenuNewArrival,
              showInMegaMenuNepali: book.showInMegaMenuNepali,
            }}
            onSubmit={handleSubmit}
            submitLabel="Update Book"
            isLoading={isSubmitting}
            hideSubmitButton={true}
          />
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/seller/books"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cancel
            </Link>
            <button
              onClick={() => {
                const form = document.querySelector('form');
                if (form) {
                  form.requestSubmit();
                }
              }}
              disabled={isSubmitting}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-md"
            >
              {isSubmitting ? 'Updating...' : 'Update Book'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
