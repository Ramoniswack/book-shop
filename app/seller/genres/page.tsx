'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import { getGenres, createGenre, updateGenre, deleteGenre } from '@/utils/seller';
import Image from 'next/image';
import ImageUpload from '@/components/ImageUpload';

interface Genre {
  _id: string;
  name: string;
  image: string;
  subGenres: string[];
  createdAt: string;
}

export default function GenresPage() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    subGenres: [] as string[],
  });
  const [subGenreInput, setSubGenreInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      setLoading(true);
      const response = await getGenres({ limit: 100 });
      if (response.success) {
        setGenres(response.data);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch genres');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (genre?: Genre) => {
    if (genre) {
      setEditingGenre(genre);
      setFormData({
        name: genre.name,
        image: genre.image,
        subGenres: genre.subGenres || [],
      });
    } else {
      setEditingGenre(null);
      setFormData({ name: '', image: '', subGenres: [] });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingGenre(null);
    setFormData({ name: '', image: '', subGenres: [] });
    setSubGenreInput('');
  };

  const handleAddSubGenre = () => {
    if (subGenreInput.trim() && !formData.subGenres.includes(subGenreInput.trim())) {
      setFormData({
        ...formData,
        subGenres: [...formData.subGenres, subGenreInput.trim()],
      });
      setSubGenreInput('');
    }
  };

  const handleRemoveSubGenre = (subGenre: string) => {
    setFormData({
      ...formData,
      subGenres: formData.subGenres.filter((sg) => sg !== subGenre),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Genre name is required');
      return;
    }

    if (!formData.image.trim()) {
      toast.error('Genre image URL is required');
      return;
    }

    try {
      setSubmitting(true);
      if (editingGenre) {
        const response = await updateGenre(editingGenre._id, formData);
        if (response.success) {
          toast.success('Genre updated successfully');
          fetchGenres();
          handleCloseModal();
        }
      } else {
        const response = await createGenre(formData);
        if (response.success) {
          toast.success('Genre created successfully');
          fetchGenres();
          handleCloseModal();
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to save genre');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (genre: Genre) => {
    if (!confirm(`Are you sure you want to delete "${genre.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await deleteGenre(genre._id);
      if (response.success) {
        toast.success('Genre deleted successfully');
        fetchGenres();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete genre');
    }
  };

  const filteredGenres = genres.filter((genre) =>
    genre.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Genres Management</h1>
        <p className="text-gray-600">Manage genres and sub-genres for your bookstore</p>
      </div>

      {/* Search and Add */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search genres..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Genre
        </button>
      </div>

      {/* Genres Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading genres...</p>
        </div>
      ) : filteredGenres.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Tag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">
            {searchQuery ? 'No genres found matching your search' : 'No genres yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGenres.map((genre) => (
            <div
              key={genre._id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-40 bg-gray-100">
                <Image
                  src={genre.image}
                  alt={genre.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{genre.name}</h3>
                {genre.subGenres && genre.subGenres.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Sub-genres:</p>
                    <div className="flex flex-wrap gap-1">
                      {genre.subGenres.slice(0, 3).map((subGenre, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          {subGenre}
                        </span>
                      ))}
                      {genre.subGenres.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                          +{genre.subGenres.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleOpenModal(genre)}
                    className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(genre)}
                    className="flex-1 px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Tag className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {editingGenre ? 'Edit Genre' : 'Add New Genre'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {editingGenre ? 'Update genre information' : 'Create a new book genre'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={submitting}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit}>
              <div className="px-6 py-5 space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="e.g., Science Fiction"
                    autoFocus
                  />
                </div>

                {/* Image Upload */}
                <ImageUpload
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  type="genres"
                  label="Genre Image"
                  required
                  aspectRatio="landscape"
                />

                {/* Sub-Genres */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sub-Genres (Optional)
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={subGenreInput}
                      onChange={(e) => setSubGenreInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSubGenre();
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      placeholder="e.g., Space Opera"
                    />
                    <button
                      type="button"
                      onClick={handleAddSubGenre}
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 text-sm font-medium transition-colors"
                    >
                      Add
                    </button>
                  </div>

                  {formData.subGenres.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500 font-medium">Added sub-genres:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.subGenres.map((subGenre, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm border border-purple-200"
                          >
                            <span>{subGenre}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSubGenre(subGenre)}
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
                  onClick={handleCloseModal}
                  disabled={submitting}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-white transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !formData.name.trim() || !formData.image.trim()}
                  className="px-5 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>{editingGenre ? 'Updating...' : 'Creating...'}</span>
                    </>
                  ) : (
                    <span>{editingGenre ? 'Update Genre' : 'Create Genre'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
