'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import { getGenres, createGenre, updateGenre, deleteGenre } from '@/utils/seller';
import Image from 'next/image';

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingGenre ? 'Edit Genre' : 'Add New Genre'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Science Fiction"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/genre-image.jpg"
                />
                {formData.image && (
                  <div className="mt-2">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-32 h-20 object-cover rounded border-2 border-gray-200"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/128x80?text=Invalid';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Sub-Genres */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sub-Genres (Optional)
                </label>
                <div className="flex gap-2 mb-2">
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
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="e.g., Space Opera"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubGenre}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                  >
                    Add
                  </button>
                </div>

                {formData.subGenres.length > 0 && (
                  <div className="space-y-1">
                    {formData.subGenres.map((subGenre, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-blue-50 rounded text-sm"
                      >
                        <span className="text-gray-700">{subGenre}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubGenre(subGenre)}
                          className="text-red-600 hover:text-red-700 text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingGenre ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
