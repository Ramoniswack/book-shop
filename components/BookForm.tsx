'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Plus } from 'lucide-react';
import { getAuthors, getGenres, createAuthor, createGenre, getHomepageSections } from '@/utils/seller';
import { useCurrency } from '@/contexts/CurrencyContext';
import toast from 'react-hot-toast';
import MultiImageUpload from './MultiImageUpload';
import ImageUpload from './ImageUpload';

interface BookFormData {
  title: string;
  description: string;
  author: string;
  genres: string[];
  subGenres: string[];
  price: string;
  discountPrice: string;
  discountPercentage: string;
  stock: string;
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
  customSections: string[];
}

interface BookFormProps {
  initialData?: Partial<BookFormData>;
  onSubmit: (data: BookFormData) => Promise<void>;
  submitLabel: string;
  isLoading: boolean;
  hideSubmitButton?: boolean;
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

interface HomepageSection {
  _id: string;
  title: string;
  isActive: boolean;
}

export default function BookForm({ initialData, onSubmit, submitLabel, isLoading, hideSubmitButton = false }: BookFormProps) {
  const { currency } = useCurrency();
  const [formData, setFormData] = useState<BookFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    author: initialData?.author || '',
    genres: initialData?.genres || [],
    subGenres: initialData?.subGenres || [],
    price: initialData?.price || '',
    discountPrice: initialData?.discountPrice || '',
    discountPercentage: initialData?.discountPercentage || '0',
    stock: initialData?.stock || '',
    images: initialData?.images || [],
    isUsedBook: initialData?.isUsedBook || false,
    condition: initialData?.condition || 'new',
    isFeatured: initialData?.isFeatured || false,
    isNewArrival: initialData?.isNewArrival || false,
    isNepaliBook: initialData?.isNepaliBook || false,
    isBestseller: initialData?.isBestseller || false,
    showInMegaMenuBestseller: initialData?.showInMegaMenuBestseller || false,
    showInMegaMenuNewArrival: initialData?.showInMegaMenuNewArrival || false,
    showInMegaMenuNepali: initialData?.showInMegaMenuNepali || false,
    customSections: initialData?.customSections || [],
  });

  const [authors, setAuthors] = useState<Author[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [homepageSections, setHomepageSections] = useState<HomepageSection[]>([]);
  const [loadingAuthors, setLoadingAuthors] = useState(true);
  const [loadingGenres, setLoadingGenres] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // New author/genre modals
  const [showNewAuthor, setShowNewAuthor] = useState(false);
  const [newAuthorName, setNewAuthorName] = useState('');
  const [newAuthorImage, setNewAuthorImage] = useState('');
  const [showNewGenre, setShowNewGenre] = useState(false);
  const [newGenreName, setNewGenreName] = useState('');
  const [newGenreImage, setNewGenreImage] = useState('');
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
    fetchHomepageSections();
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

  const fetchHomepageSections = async () => {
    try {
      const response = await getHomepageSections();
      if (response.success) {
        // Only show active sections
        setHomepageSections(response.data.filter((s: HomepageSection) => s.isActive));
      }
    } catch (err) {
      console.error('Failed to fetch homepage sections:', err);
    }
  };

  const handleCreateAuthor = async () => {
    if (!newAuthorName.trim()) {
      toast.error('Author name is required');
      return;
    }
    
    if (!newAuthorImage.trim()) {
      toast.error('Author image URL is required');
      return;
    }

    try {
      setCreatingAuthor(true);
      const response = await createAuthor({ name: newAuthorName.trim(), image: newAuthorImage.trim() });
      if (response.success) {
        setAuthors([...authors, response.data]);
        setFormData({ ...formData, author: response.data.name });
        setNewAuthorName('');
        setNewAuthorImage('');
        setShowNewAuthor(false);
        toast.success('Author created successfully');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to create author');
    } finally {
      setCreatingAuthor(false);
    }
  };

  const handleCreateGenre = async () => {
    if (!newGenreName.trim()) {
      toast.error('Genre name is required');
      return;
    }
    
    if (!newGenreImage.trim()) {
      toast.error('Genre image URL is required');
      return;
    }

    try {
      setCreatingGenre(true);
      const response = await createGenre({ 
        name: newGenreName.trim(),
        image: newGenreImage.trim(),
        subGenres: newGenreSubGenres.length > 0 ? newGenreSubGenres : undefined
      });
      if (response.success) {
        setGenres([...genres, response.data]);
        setFormData({ ...formData, genres: [...formData.genres, response.data.name] });
        setNewGenreName('');
        setNewGenreImage('');
        setNewGenreSubGenres([]);
        setNewSubGenreInput('');
        setShowNewGenre(false);
        toast.success('Genre created successfully');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to create genre');
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
        toast.success('Sub-genres added successfully');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to add sub-genres');
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

      {/* Price and Discount Percentage */}
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
            Discount % (Optional)
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              value={formData.discountPercentage}
              onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
          </div>
          {formData.discountPercentage && parseFloat(formData.discountPercentage) > 0 && formData.price && (
            <p className="text-xs text-green-600 mt-1">
              Discounted Price: {currency === 'NPR' ? 'Rs.' : '$'}
              {(parseFloat(formData.price) * (1 - parseFloat(formData.discountPercentage) / 100)).toFixed(2)}
            </p>
          )}
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
      <MultiImageUpload
        values={formData.images}
        onChange={(urls) => setFormData({ ...formData, images: urls })}
        type="books"
        label="Book Images"
        maxImages={5}
      />

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

      {/* Featured, New Arrival, Nepali Book, and Bestseller Toggles */}
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

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isBestseller}
            onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="ml-2 text-sm font-medium text-gray-700">Bestseller</span>
        </label>
      </div>

      {/* Custom Homepage Sections */}
      {homepageSections.length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Homepage Sections
          </label>
          {homepageSections.map((section) => (
            <label key={section._id} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.customSections.includes(section._id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData({ ...formData, customSections: [...formData.customSections, section._id] })
                  } else {
                    setFormData({ ...formData, customSections: formData.customSections.filter(id => id !== section._id) })
                  }
                }}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">{section.title}</span>
            </label>
          ))}
        </div>
      )}

      {/* Mega Menu Display Options */}
      <div className="border-t pt-4 mt-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Show in Mega Menu (Max 3 per section)</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.showInMegaMenuBestseller}
              onChange={(e) => setFormData({ ...formData, showInMegaMenuBestseller: e.target.checked })}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">Show in Bestsellers Section</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.showInMegaMenuNewArrival}
              onChange={(e) => setFormData({ ...formData, showInMegaMenuNewArrival: e.target.checked })}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">Show in New Arrivals Section</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.showInMegaMenuNepali}
              onChange={(e) => setFormData({ ...formData, showInMegaMenuNepali: e.target.checked })}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">Show in Nepali Books Section</span>
          </label>
        </div>
        <p className="text-xs text-gray-500 mt-2">Note: Only 3 books can be displayed in each mega menu section</p>
      </div>

      {/* Submit Button */}
      {!hideSubmitButton && (
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : submitLabel}
          </button>
        </div>
      )}

      {/* New Author Modal */}
      {showNewAuthor && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
          onClick={() => {
            setShowNewAuthor(false);
            setNewAuthorName('');
            setNewAuthorImage('');
          }}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Add New Author</h3>
                  <p className="text-sm text-gray-500">Create a new author profile</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowNewAuthor(false);
                  setNewAuthorName('');
                  setNewAuthorImage('');
                }}
                disabled={creatingAuthor}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-5">
              {/* Author Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newAuthorName}
                  onChange={(e) => setNewAuthorName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., James Clear"
                  autoFocus
                />
              </div>

              {/* Author Image */}
              <ImageUpload
                value={newAuthorImage}
                onChange={setNewAuthorImage}
                type="authors"
                label="Author Image"
                required
                aspectRatio="square"
              />
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
              <button
                type="button"
                onClick={() => {
                  setShowNewAuthor(false);
                  setNewAuthorName('');
                  setNewAuthorImage('');
                }}
                disabled={creatingAuthor}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-white transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateAuthor}
                disabled={creatingAuthor || !newAuthorName.trim() || !newAuthorImage.trim()}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {creatingAuthor ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating...</span>
                  </>
                ) : (
                  <span>Create Author</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Genre Modal */}
      {showNewGenre && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
          onClick={() => {
            setShowNewGenre(false);
            setNewGenreName('');
            setNewGenreImage('');
            setNewGenreSubGenres([]);
            setNewSubGenreInput('');
          }}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Add New Genre</h3>
                  <p className="text-sm text-gray-500">Create a new book genre</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowNewGenre(false);
                  setNewGenreName('');
                  setNewGenreImage('');
                  setNewGenreSubGenres([]);
                  setNewSubGenreInput('');
                }}
                disabled={creatingGenre}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-5">
              {/* Genre Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Genre Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newGenreName}
                  onChange={(e) => setNewGenreName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="e.g., Science Fiction"
                  autoFocus
                />
              </div>

              {/* Genre Image */}
              <ImageUpload
                value={newGenreImage}
                onChange={setNewGenreImage}
                type="genres"
                label="Genre Image"
                required
                aspectRatio="landscape"
              />

              {/* Sub-Genres (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sub-Genres (Optional)
                </label>
                <div className="flex gap-2 mb-3">
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
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    placeholder="e.g., Space Opera"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubGenreToNewGenre}
                    className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 text-sm font-medium transition-colors"
                  >
                    Add
                  </button>
                </div>
                
                {/* Sub-Genres List */}
                {newGenreSubGenres.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 font-medium">Added sub-genres:</p>
                    <div className="flex flex-wrap gap-2">
                      {newGenreSubGenres.map((sg, index) => (
                        <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm border border-purple-200">
                          <span>{sg}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSubGenreFromNewGenre(sg)}
                            className="text-purple-600 hover:text-purple-800 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
              <button
                type="button"
                onClick={() => {
                  setShowNewGenre(false);
                  setNewGenreName('');
                  setNewGenreImage('');
                  setNewGenreSubGenres([]);
                  setNewSubGenreInput('');
                }}
                disabled={creatingGenre}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-white transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateGenre}
                disabled={creatingGenre || !newGenreName.trim() || !newGenreImage.trim()}
                className="px-5 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {creatingGenre ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating...</span>
                  </>
                ) : (
                  <span>Create Genre</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Sub-Genre to Existing Genre Modal */}
      {showAddSubGenre && selectedGenreForSubGenre && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
          onClick={() => {
            setShowAddSubGenre(false);
            setSelectedGenreForSubGenre(null);
            setSubGenresToAdd([]);
            setSubGenreInput('');
          }}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Add Sub-Genres</h3>
                  <p className="text-sm text-gray-500">to "{selectedGenreForSubGenre.name}"</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAddSubGenre(false);
                  setSelectedGenreForSubGenre(null);
                  setSubGenresToAdd([]);
                  setSubGenreInput('');
                }}
                disabled={addingSubGenres}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-5">
              {/* Show existing sub-genres */}
              {selectedGenreForSubGenre.subGenres && selectedGenreForSubGenre.subGenres.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-xs font-medium text-blue-900 mb-2">Existing sub-genres:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedGenreForSubGenre.subGenres.map((sg, index) => (
                      <span key={index} className="px-3 py-1 bg-white text-blue-700 rounded-lg text-sm border border-blue-200">
                        {sg}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Add new sub-genres */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Sub-Genres
                </label>
                <div className="flex gap-2 mb-3">
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
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    placeholder="Enter sub-genre name and press Enter"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleAddSubGenreToList}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm font-medium transition-colors"
                  >
                    Add
                  </button>
                </div>
                
                {/* New Sub-Genres List */}
                {subGenresToAdd.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 font-medium">Sub-genres to add:</p>
                    <div className="flex flex-wrap gap-2">
                      {subGenresToAdd.map((sg, index) => (
                        <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm border border-green-200">
                          <span>{sg}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSubGenreFromList(sg)}
                            className="text-green-600 hover:text-green-800 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
              <button
                type="button"
                onClick={() => {
                  setShowAddSubGenre(false);
                  setSelectedGenreForSubGenre(null);
                  setSubGenresToAdd([]);
                  setSubGenreInput('');
                }}
                disabled={addingSubGenres}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-white transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveSubGenresToGenre}
                disabled={addingSubGenres || subGenresToAdd.length === 0}
                className="px-5 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {addingSubGenres ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Sub-Genres</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
