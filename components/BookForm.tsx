'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Plus } from 'lucide-react';
import { getAuthors, getGenres, createAuthor, createGenre } from '@/utils/seller';
import { useCurrency } from '@/contexts/CurrencyContext';

interface BookFormData {
  title: string;
  description: string;
  author: string;
  genres: string[];
  subGenres: string[];
  price: string;
  discountPrice: string;
  stock: string;
  images: string[];
  isUsedBook: boolean;
  condition: 'new' | 'like-new' | 'used';
  isFeatured: boolean;
  isNewArrival: boolean;
  isNepaliBook: boolean;
}

interface BookFormProps {
  initialData?: Partial<BookFormData>;
  onSubmit: (data: BookFormData) => Promise<void>;
  submitLabel: string;
  isLoading: boolean;
}

interface Author {
  _id: string;
  name: string;
}

interface Genre {
  _id: string;
  name: string;
  subGenres: string[];
}

export default function BookForm({ initialData, onSubmit, submitLabel, isLoading }: BookFormProps) {
  const { currency } = useCurrency();
  const [formData, setFormData] = useState<BookFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    author: initialData?.author || '',
    genres: initialData?.genres || [],
    subGenres: initialData?.subGenres || [],
    price: initialData?.price || '',
    discountPrice: initialData?.discountPrice || '',
    stock: initialData?.stock || '',
    images: initialData?.images || [],
    isUsedBook: initialData?.isUsedBook || false,
    condition: initialData?.condition || 'new',
    isFeatured: initialData?.isFeatured || false,
    isNewArrival: initialData?.isNewArrival || false,
    isNepaliBook: initialData?.isNepaliBook || false,
  });

  const [authors, setAuthors] = useState<Author[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loadingAuthors, setLoadingAuthors] = useState(true);
  const [loadingGenres, setLoadingGenres] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // New author/genre modals
  const [showNewAuthor, setShowNewAuthor] = useState(false);
  const [newAuthorName, setNewAuthorName] = useState('');
  const [showNewGenre, setShowNewGenre] = useState(false);
  const [newGenreName, setNewGenreName] = useState('');
  const [newGenreSubGenres, setNewGenreSubGenres] = useState<string[]>([]);
  const [newSubGenreInput, setNewSubGenreInput] = useState('');
  const [showAddSubGenre, setShowAddSubGenre] = useState(false);
  const [selectedGenreForSubGenre, setSelectedGenreForSubGenre] = useState<Genre | null>(null);
  const [subGenresToAdd, setSubGenresToAdd] = useState<string[]>([]);
  const [subGenreInput, setSubGenreInput] = useState('');
  const [creatingAuthor, setCreatingAuthor] = useState(false);
  const [creatingGenre, setCreatingGenre] = useState(false);
  const [addingSubGenres, setAddingSubGenres] = useState(false);

  // Track expanded genres to show sub-genres
  const [expandedGenres, setExpandedGenres] = useState<string[]>([]);

  // Image URL input
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    fetchAuthors();
    fetchGenres();
  }, []);

  const fetchAuthors = async () => {
    try {
      setLoadingAuthors(true);
      const response = await getAuthors({ limit: 100 });
      if (response.success) {
        setAuthors(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch authors:', err);
    } finally {
      setLoadingAuthors(false);
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

  const handleCreateAuthor = async () => {
    if (!newAuthorName.trim()) return;

    try {
      setCreatingAuthor(true);
      const response = await createAuthor({ name: newAuthorName.trim() });
      if (response.success) {
        setAuthors([...authors, response.data]);
        setFormData({ ...formData, author: response.data.name });
        setNewAuthorName('');
        setShowNewAuthor(false);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create author');
    } finally {
      setCreatingAuthor(false);
    }
  };

  const handleCreateGenre = async () => {
    if (!newGenreName.trim()) return;

    try {
      setCreatingGenre(true);
      const response = await createGenre({ 
        name: newGenreName.trim(),
        subGenres: newGenreSubGenres.length > 0 ? newGenreSubGenres : undefined
      });
      if (response.success) {
        setGenres([...genres, response.data]);
        setFormData({ ...formData, genres: [...formData.genres, response.data.name] });
        setNewGenreName('');
        setNewGenreSubGenres([]);
        setNewSubGenreInput('');
        setShowNewGenre(false);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create genre');
    } finally {
      setCreatingGenre(false);
    }
  };

  const handleAddSubGenreToNewGenre = () => {
    if (newSubGenreInput.trim() && !newGenreSubGenres.includes(newSubGenreInput.trim())) {
      setNewGenreSubGenres([...newGenreSubGenres, newSubGenreInput.trim()]);
      setNewSubGenreInput('');
    }
  };

  const handleRemoveSubGenreFromNewGenre = (subGenre: string) => {
    setNewGenreSubGenres(newGenreSubGenres.filter(sg => sg !== subGenre));
  };

  const handleOpenAddSubGenreModal = (genre: Genre) => {
    setSelectedGenreForSubGenre(genre);
    setSubGenresToAdd([]);
    setSubGenreInput('');
    setShowAddSubGenre(true);
  };

  const handleAddSubGenreToList = () => {
    if (subGenreInput.trim() && !subGenresToAdd.includes(subGenreInput.trim())) {
      setSubGenresToAdd([...subGenresToAdd, subGenreInput.trim()]);
      setSubGenreInput('');
    }
  };

  const handleRemoveSubGenreFromList = (subGenre: string) => {
    setSubGenresToAdd(subGenresToAdd.filter(sg => sg !== subGenre));
  };

  const handleSaveSubGenresToGenre = async () => {
    if (!selectedGenreForSubGenre || subGenresToAdd.length === 0) return;

    try {
      setAddingSubGenres(true);
      const { addSubGenresToGenre } = await import('@/utils/seller');
      const response = await addSubGenresToGenre(selectedGenreForSubGenre._id, subGenresToAdd);
      
      if (response.success) {
        // Update genres list with new sub-genres
        setGenres(genres.map(g => 
          g._id === selectedGenreForSubGenre._id 
            ? { ...g, subGenres: response.data.subGenres }
            : g
        ));
        setShowAddSubGenre(false);
        setSelectedGenreForSubGenre(null);
        setSubGenresToAdd([]);
        setSubGenreInput('');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to add sub-genres');
    } finally {
      setAddingSubGenres(false);
    }
  };

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, imageUrl.trim()],
      });
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleGenreChange = (genreName: string) => {
    const isSelected = formData.genres.includes(genreName);
    if (isSelected) {
      // Remove genre and its sub-genres
      const genre = genres.find(g => g.name === genreName);
      const subGenresToRemove = genre?.subGenres || [];
      setFormData({
        ...formData,
        genres: formData.genres.filter(g => g !== genreName),
        subGenres: formData.subGenres.filter(sg => !subGenresToRemove.includes(sg)),
      });
      // Collapse the genre when unchecked
      setExpandedGenres(expandedGenres.filter(g => g !== genreName));
    } else {
      setFormData({
        ...formData,
        genres: [...formData.genres, genreName],
      });
    }
  };

  const toggleGenreExpansion = (genreName: string) => {
    if (expandedGenres.includes(genreName)) {
      setExpandedGenres(expandedGenres.filter(g => g !== genreName));
    } else {
      setExpandedGenres([...expandedGenres, genreName]);
    }
  };

  const handleSubGenreChange = (subGenreName: string) => {
    const isSelected = formData.subGenres.includes(subGenreName);
    if (isSelected) {
      setFormData({
        ...formData,
        subGenres: formData.subGenres.filter(sg => sg !== subGenreName),
      });
    } else {
      setFormData({
        ...formData,
        subGenres: [...formData.subGenres, subGenreName],
      });
    }
  };

  // Get all available sub-genres from selected genres
  const getAvailableSubGenres = (): string[] => {
    const subGenres: string[] = [];
    formData.genres.forEach(genreName => {
      const genre = genres.find(g => g.name === genreName);
      if (genre && genre.subGenres) {
        subGenres.push(...genre.subGenres);
      }
    });
    return subGenres;
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Valid stock is required';
    }

    if (formData.discountPrice && parseFloat(formData.discountPrice) >= parseFloat(formData.price)) {
      newErrors.discountPrice = 'Discount price must be less than price';
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
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter book title"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter book description"
        />
      </div>

      {/* Author */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Author <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={() => setShowNewAuthor(true)}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add New
          </button>
        </div>
        {loadingAuthors ? (
          <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
            Loading authors...
          </div>
        ) : (
          <select
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.author ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select an author</option>
            {authors.map((author) => (
              <option key={author._id} value={author.name}>
                {author.name}
              </option>
            ))}
          </select>
        )}
        {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
      </div>

      {/* Genres */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Genres
          </label>
          <button
            type="button"
            onClick={() => setShowNewGenre(true)}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add New
          </button>
        </div>
        {loadingGenres ? (
          <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
            Loading genres...
          </div>
        ) : (
          <div className="border border-gray-300 rounded-lg p-4 max-h-96 overflow-y-auto">
            {genres.length > 0 ? (
              <div className="space-y-3">
                {genres.map((genre) => (
                  <div key={genre._id} className="space-y-2">
                    {/* Genre Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center flex-1">
                        <input
                          type="checkbox"
                          checked={formData.genres.includes(genre.name)}
                          onChange={() => handleGenreChange(genre.name)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 font-medium">
                          {genre.name}
                        </span>
                        {genre.subGenres && genre.subGenres.length > 0 && (
                          <button
                            type="button"
                            onClick={() => toggleGenreExpansion(genre.name)}
                            className="ml-2 text-gray-500 hover:text-gray-700 transition-transform"
                          >
                            <svg
                              className={`w-4 h-4 transition-transform ${
                                expandedGenres.includes(genre.name) ? 'rotate-180' : ''
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </button>
                        )}
                        <span className="ml-1 text-xs text-gray-500">
                          {genre.subGenres && genre.subGenres.length > 0
                            ? `(${genre.subGenres.length} sub-genres)`
                            : '(no sub-genres)'}
                        </span>
                      </div>
                      {formData.genres.includes(genre.name) && (
                        <button
                          type="button"
                          onClick={() => handleOpenAddSubGenreModal(genre)}
                          className="text-xs text-blue-600 hover:text-blue-700 ml-2 whitespace-nowrap"
                        >
                          + Sub-genre
                        </button>
                      )}
                    </div>

                    {/* Sub-Genres (Expandable) */}
                    {expandedGenres.includes(genre.name) &&
                      genre.subGenres &&
                      genre.subGenres.length > 0 && (
                        <div className="ml-6 pl-4 border-l-2 border-gray-200 space-y-1">
                          {genre.subGenres.map((subGenre, index) => (
                            <label key={index} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.subGenres.includes(subGenre)}
                                onChange={() => handleSubGenreChange(subGenre)}
                                disabled={!formData.genres.includes(genre.name)}
                                className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                              />
                              <span className="ml-2 text-sm text-gray-600">{subGenre}</span>
                            </label>
                          ))}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No genres available</p>
            )}
          </div>
        )}
      </div>

      {/* Price and Discount */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price ({currency === 'NPR' ? 'Rs.' : '$'}) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.price ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0.00"
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Discount Price ({currency === 'NPR' ? 'Rs.' : '$'}) (Optional)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.discountPrice}
            onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.discountPrice ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0.00"
          />
          {errors.discountPrice && <p className="text-red-500 text-sm mt-1">{errors.discountPrice}</p>}
        </div>
      </div>

      {/* Stock */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Stock <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.stock ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="0"
        />
        {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Images (URLs)
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com/image.jpg"
          />
          <button
            type="button"
            onClick={handleAddImage}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add
          </button>
        </div>
        {formData.images.length > 0 && (
          <div className="space-y-2">
            {formData.images.map((img, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <span className="flex-1 text-sm text-gray-700 truncate">{img}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Used Book Toggle */}
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isUsedBook}
            onChange={(e) => setFormData({ ...formData, isUsedBook: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="ml-2 text-sm font-medium text-gray-700">Used Book</span>
        </label>
      </div>

      {/* Condition (only if used book) */}
      {formData.isUsedBook && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Condition
          </label>
          <select
            value={formData.condition}
            onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="new">New</option>
            <option value="like-new">Like New</option>
            <option value="used">Used</option>
          </select>
        </div>
      )}

      {/* Featured, New Arrival, and Nepali Book Toggles */}
      <div className="space-y-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isFeatured}
            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="ml-2 text-sm font-medium text-gray-700">Featured Book</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isNewArrival}
            onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="ml-2 text-sm font-medium text-gray-700">New Arrival</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isNepaliBook}
            onChange={(e) => setFormData({ ...formData, isNepaliBook: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="ml-2 text-sm font-medium text-gray-700">Nepali Book</span>
        </label>
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

      {/* New Author Modal */}
      {showNewAuthor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Author</h3>
            <input
              type="text"
              value={newAuthorName}
              onChange={(e) => setNewAuthorName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              placeholder="Author name"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowNewAuthor(false);
                  setNewAuthorName('');
                }}
                disabled={creatingAuthor}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateAuthor}
                disabled={creatingAuthor || !newAuthorName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {creatingAuthor ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Genre Modal */}
      {showNewGenre && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Genre</h3>
            
            {/* Genre Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Genre Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newGenreName}
                onChange={(e) => setNewGenreName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Science Fiction"
                autoFocus
              />
            </div>

            {/* Sub-Genres (Optional) */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sub-Genres (Optional)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newSubGenreInput}
                  onChange={(e) => setNewSubGenreInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubGenreToNewGenre();
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="e.g., Space Opera"
                />
                <button
                  type="button"
                  onClick={handleAddSubGenreToNewGenre}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                >
                  Add
                </button>
              </div>
              
              {/* Sub-Genres List */}
              {newGenreSubGenres.length > 0 && (
                <div className="space-y-1 mt-2">
                  {newGenreSubGenres.map((sg, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded text-sm">
                      <span className="text-gray-700">{sg}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubGenreFromNewGenre(sg)}
                        className="text-red-600 hover:text-red-700 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowNewGenre(false);
                  setNewGenreName('');
                  setNewGenreSubGenres([]);
                  setNewSubGenreInput('');
                }}
                disabled={creatingGenre}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateGenre}
                disabled={creatingGenre || !newGenreName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {creatingGenre ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Sub-Genre to Existing Genre Modal */}
      {showAddSubGenre && selectedGenreForSubGenre && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Add Sub-Genres to "{selectedGenreForSubGenre.name}"
            </h3>
            
            {/* Show existing sub-genres */}
            {selectedGenreForSubGenre.subGenres && selectedGenreForSubGenre.subGenres.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Existing sub-genres:</p>
                <div className="flex flex-wrap gap-1">
                  {selectedGenreForSubGenre.subGenres.map((sg, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {sg}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Add new sub-genres */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Sub-Genres
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={subGenreInput}
                  onChange={(e) => setSubGenreInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubGenreToList();
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Enter sub-genre name"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleAddSubGenreToList}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                >
                  Add
                </button>
              </div>
              
              {/* New Sub-Genres List */}
              {subGenresToAdd.length > 0 && (
                <div className="space-y-1 mt-2">
                  {subGenresToAdd.map((sg, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded text-sm">
                      <span className="text-gray-700">{sg}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubGenreFromList(sg)}
                        className="text-red-600 hover:text-red-700 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddSubGenre(false);
                  setSelectedGenreForSubGenre(null);
                  setSubGenresToAdd([]);
                  setSubGenreInput('');
                }}
                disabled={addingSubGenres}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveSubGenresToGenre}
                disabled={addingSubGenres || subGenresToAdd.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {addingSubGenres ? 'Saving...' : 'Save Sub-Genres'}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
