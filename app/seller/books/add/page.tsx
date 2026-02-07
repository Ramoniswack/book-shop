'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import BookForm from '@/components/BookForm';
import { addBook } from '@/utils/seller';

export default function AddBook() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: any) => {
    try {
      setIsLoading(true);
      setError(null);

      // Convert string values to appropriate types
      const bookData = {
        ...formData,
        price: parseFloat(formData.price),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : undefined,
        stock: parseInt(formData.stock),
      };

      const response = await addBook(bookData);

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/seller/books');
        }, 2000);
      } else {
        setError(response.message || 'Failed to add book');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add book');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/seller/books"
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Add New Book</h1>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <p className="text-green-800 font-medium">Book added successfully!</p>
          </div>
          <p className="text-green-600 text-sm mt-1">Redirecting to books list...</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-800 font-medium">Error adding book</p>
          </div>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <BookForm
          onSubmit={handleSubmit}
          submitLabel="Add Book"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
