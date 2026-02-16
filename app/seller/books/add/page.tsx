'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import BookForm from '@/components/BookForm';
import { addBook } from '@/utils/admin';

export default function AddBook() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: any) => {
    const toastId = toast.loading('Adding book...');
    
    try {
      setIsLoading(true);

      // Convert string values to appropriate types
      const bookData = {
        ...formData,
        price: parseFloat(formData.price),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : undefined,
        stock: parseInt(formData.stock),
      };

      const response = await addBook(bookData);

      if (response.success) {
        toast.success('Book added successfully!', { id: toastId });
        setTimeout(() => {
          router.push('/seller/books');
        }, 1500);
      } else {
        toast.error(response.message || 'Failed to add book', { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to add book', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="-m-6 pb-20">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
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

      {/* Form */}
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <BookForm
            onSubmit={handleSubmit}
            submitLabel="Add Book"
            isLoading={isLoading}
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
              disabled={isLoading}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-md"
            >
              {isLoading ? 'Adding...' : 'Add Book'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
