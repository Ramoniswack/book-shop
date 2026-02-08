'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { getSellerBooks, getGenres } from '@/utils/seller';

interface DealFormData {
  title: string;
  dealType: 'percentage' | 'flat' | 'bogo';
  discountValue: string;
  applicableBooks: string[];
  applicableGenres: string[];
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface DealFormProps {
  initialData?: Partial<DealFormData>;
  onSubmit: (data: DealFormData) => Promise<void>;
  submitLabel: string;
  isLoading: boolean;
}

interface Book {
  _id: string;
  title: string;
  author: string;
  price: number;
}

interface Genre {
  _id: string;
  name: string;
}

export default function DealForm({ initialData, onSubmit, submitLabel, isLoading }: DealFormProps) {
  const [formData, setFormData] = useState<DealFormData>({
    title: initialData?.title || '',
    dealType: initialData?.dealType || 'percentage',
    discountValue: initialData?.discountValue || '',
    applicableBooks: initialData?.applicableBooks || [],
    applicableGenres: initialData?.applicableGenres || [],
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
  });

  const [books, setBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingGenres, setLoadingGenres] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchBooks();
    fetchGenres();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoadingBooks(true);
      const response = await getSellerBooks({ limit: 100, status: 'active' });
      if (response.success) {
        setBooks(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch books:', err);
    } finally {
      setLoadingBooks(false);
    }
  };

  const fetchGenres = async () => {
    try {
      setLoadingGenres(true);
      const response = await getGenres({ limit: 100 });
      if (response.success) {
        setGenres(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch genres:', err);
    } finally {
      setLoadingGenres(false);
    }
  };

  const handleBookToggle = (bookId: string) => {
    const isSelected = formData.applicableBooks.includes(bookId);
    if (isSelected) {
      setFormData({
        ...formData,
        applicableBooks: formData.applicableBooks.filter(id => id !== bookId),
      });
    } else {
      setFormData({
        ...formData,
        applicableBooks: [...formData.applicableBooks, bookId],
      });
    }
  };

  const handleGenreToggle = (genreId: string) => {
    const isSelected = formData.applicableGenres.includes(genreId);
    if (isSelected) {
      setFormData({
        ...formData,
        applicableGenres: formData.applicableGenres.filter(id => id !== genreId),
      });
    } else {
      setFormData({
        ...formData,
        applicableGenres: [...formData.applicableGenres, genreId],
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.discountValue || parseFloat(formData.discountValue) <= 0) {
      newErrors.discountValue = 'Valid discount value is required';
    }

    if (formData.dealType === 'percentage' && parseFloat(formData.discountValue) > 100) {
      newErrors.discountValue = 'Percentage cannot exceed 100%';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end <= start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    if (formData.applicableBooks.length === 0 && formData.applicableGenres.length === 0) {
      newErrors.applicable = 'Select at least one book or genre';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Deal Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="e.g., Summer Sale 2024"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      {/* Deal Type and Discount Value */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deal Type <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.dealType}
            onChange={(e) => setFormData({ ...formData, dealType: e.target.value as any })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="percentage">Percentage Off (%)</option>
            <option value="flat">Flat Discount ($)</option>
            <option value="bogo">Buy One Get One</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Discount Value <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.discountValue}
            onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.discountValue ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={formData.dealType === 'percentage' ? '10' : '5.00'}
          />
          {errors.discountValue && <p className="text-red-500 text-sm mt-1">{errors.discountValue}</p>}
          <p className="text-xs text-gray-500 mt-1">
            {formData.dealType === 'percentage' && 'Enter percentage (0-100)'}
            {formData.dealType === 'flat' && 'Enter dollar amount'}
            {formData.dealType === 'bogo' && 'Enter 1 for standard BOGO'}
          </p>
        </div>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.startDate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.endDate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
        </div>
      </div>

      {/* Applicable Books */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Applicable Books
        </label>
        {loadingBooks ? (
          <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
            Loading books...
          </div>
        ) : (
          <div className="border border-gray-300 rounded-lg p-4 max-h-60 overflow-y-auto">
            {books.length > 0 ? (
              <div className="space-y-2">
                {books.map((book) => (
                  <label key={book._id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.applicableBooks.includes(book._id)}
                      onChange={() => handleBookToggle(book._id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {book.title} by {book.author} (${book.price.toFixed(2)})
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No active books available</p>
            )}
          </div>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Selected: {formData.applicableBooks.length} book(s)
        </p>
      </div>

      {/* Applicable Genres */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Applicable Genres
        </label>
        {loadingGenres ? (
          <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
            Loading genres...
          </div>
        ) : (
          <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto">
            {genres.length > 0 ? (
              <div className="space-y-2">
                {genres.map((genre) => (
                  <label key={genre._id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.applicableGenres.includes(genre._id)}
                      onChange={() => handleGenreToggle(genre._id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{genre.name}</span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No genres available</p>
            )}
          </div>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Selected: {formData.applicableGenres.length} genre(s)
        </p>
      </div>

      {errors.applicable && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center">
            <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
            <p className="text-red-800 text-sm">{errors.applicable}</p>
          </div>
        </div>
      )}

      {/* Active Toggle */}
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="ml-2 text-sm font-medium text-gray-700">Active Deal</span>
        </label>
        <p className="text-xs text-gray-500 mt-1">
          Inactive deals won't be visible to customers
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
