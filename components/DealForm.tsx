'use client'

import { useState, useEffect } from 'react'
import { X, Search, Calendar, Image as ImageIcon, Eye, EyeOff, Flame, Gift, Percent, Clock, Tag as TagIcon, Sparkles } from 'lucide-react'
import { getSellerBooks } from '@/utils/seller'

interface DealFormData {
  title: string
  description: string
  type: 'FLASH_SALE' | 'BOGO' | 'PERCENTAGE' | 'FIXED_DISCOUNT' | 'LIMITED_TIME' | 'SEASONAL'
  discountValue: number
  buyQuantity: number
  getQuantity: number
  applicableBooks: string[]
  bannerImage: string
  startDate: string
  endDate: string
  isActive: boolean
  showOnHomepage: boolean
  showOnDealsPage: boolean
}

interface DealFormProps {
  initialData?: any
  onSubmit: (data: DealFormData) => void
  loading: boolean
  isEdit?: boolean
}

const DealForm = ({ initialData, onSubmit, loading, isEdit = false }: DealFormProps) => {
  const [formData, setFormData] = useState<DealFormData>({
    title: '',
    description: '',
    type: 'PERCENTAGE',
    discountValue: 0,
    buyQuantity: 1,
    getQuantity: 1,
    applicableBooks: [],
    bannerImage: '',
    startDate: '',
    endDate: '',
    isActive: false,
    showOnHomepage: false,
    showOnDealsPage: true,
  })

  const [books, setBooks] = useState<any[]>([])
  const [filteredBooks, setFilteredBooks] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showBookSelector, setShowBookSelector] = useState(false)
  const [loadingBooks, setLoadingBooks] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        type: initialData.type || 'PERCENTAGE',
        discountValue: initialData.discountValue || 0,
        buyQuantity: initialData.buyQuantity || 1,
        getQuantity: initialData.getQuantity || 1,
        applicableBooks: initialData.applicableBooks?.map((b: any) => b._id || b) || [],
        bannerImage: initialData.bannerImage || '',
        startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().slice(0, 16) : '',
        endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().slice(0, 16) : '',
        isActive: initialData.isActive || false,
        showOnHomepage: initialData.showOnHomepage || false,
        showOnDealsPage: initialData.showOnDealsPage !== undefined ? initialData.showOnDealsPage : true,
      })
    }
  }, [initialData])

  useEffect(() => {
    fetchBooks()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = books.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredBooks(filtered)
    } else {
      setFilteredBooks(books)
    }
  }, [searchQuery, books])

  const fetchBooks = async () => {
    try {
      setLoadingBooks(true)
      const response = await getSellerBooks({ page: 1, limit: 100 })
      if (response.success) {
        setBooks(response.data)
        setFilteredBooks(response.data)
      }
    } catch (error) {
      console.error('Error fetching books:', error)
    } finally {
      setLoadingBooks(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const toggleBookSelection = (bookId: string) => {
    setFormData(prev => ({
      ...prev,
      applicableBooks: prev.applicableBooks.includes(bookId)
        ? prev.applicableBooks.filter(id => id !== bookId)
        : [...prev.applicableBooks, bookId]
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const getDealTypeIcon = (type: string) => {
    switch (type) {
      case 'FLASH_SALE': return <Flame className="w-5 h-5" />
      case 'BOGO': return <Gift className="w-5 h-5" />
      case 'LIMITED_TIME': return <Clock className="w-5 h-5" />
      case 'SEASONAL': return <Sparkles className="w-5 h-5" />
      case 'PERCENTAGE': return <Percent className="w-5 h-5" />
      case 'FIXED_DISCOUNT': return <TagIcon className="w-5 h-5" />
      default: return <Percent className="w-5 h-5" />
    }
  }

  const selectedBooks = books.filter(book => formData.applicableBooks.includes(book._id))

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
        
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deal Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Flash Sale - 20% Off Technology Books"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe your deal..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Deal Type & Value */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Deal Configuration</h2>
        
        <div className="space-y-4">
          {/* Deal Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deal Type *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { value: 'FLASH_SALE', label: 'Flash Sale', icon: <Flame className="w-4 h-4" />, color: 'red' },
                { value: 'BOGO', label: 'Buy One Get One', icon: <Gift className="w-4 h-4" />, color: 'green' },
                { value: 'PERCENTAGE', label: 'Percentage Off', icon: <Percent className="w-4 h-4" />, color: 'blue' },
                { value: 'FIXED_DISCOUNT', label: 'Fixed Discount', icon: <TagIcon className="w-4 h-4" />, color: 'purple' },
                { value: 'LIMITED_TIME', label: 'Limited Time', icon: <Clock className="w-4 h-4" />, color: 'orange' },
                { value: 'SEASONAL', label: 'Seasonal', icon: <Sparkles className="w-4 h-4" />, color: 'teal' },
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: type.value as any }))}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 transition-all ${
                    formData.type === type.value
                      ? `border-${type.color}-500 bg-${type.color}-50 text-${type.color}-700`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {type.icon}
                  <span className="text-sm font-medium">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Discount Value (for non-BOGO) */}
          {formData.type !== 'BOGO' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.type === 'FIXED_DISCOUNT' ? 'Discount Amount ($) *' : 'Discount Percentage (%) *'}
              </label>
              <input
                type="number"
                name="discountValue"
                value={formData.discountValue}
                onChange={handleChange}
                required
                min="0"
                max={formData.type === 'FIXED_DISCOUNT' ? undefined : 100}
                step={formData.type === 'FIXED_DISCOUNT' ? '0.01' : '1'}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* BOGO Quantities */}
          {formData.type === 'BOGO' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buy Quantity *
                </label>
                <input
                  type="number"
                  name="buyQuantity"
                  value={formData.buyQuantity}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Get Quantity (Free) *
                </label>
                <input
                  type="number"
                  name="getQuantity"
                  value={formData.getQuantity}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Applicable Books */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Applicable Books</h2>
          <button
            type="button"
            onClick={() => setShowBookSelector(!showBookSelector)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>Select Books</span>
          </button>
        </div>

        {/* Selected Books */}
        {selectedBooks.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">{selectedBooks.length} books selected</p>
            <div className="flex flex-wrap gap-2">
              {selectedBooks.map(book => (
                <div key={book._id} className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm">
                  <span>{book.title}</span>
                  <button
                    type="button"
                    onClick={() => toggleBookSelection(book._id)}
                    className="hover:text-blue-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Book Selector Modal */}
        {showBookSelector && (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search books..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {loadingBooks ? (
                <p className="text-center text-gray-500 py-4">Loading books...</p>
              ) : filteredBooks.length > 0 ? (
                filteredBooks.map(book => (
                  <label
                    key={book._id}
                    className="flex items-center space-x-3 p-3 hover:bg-white rounded-lg cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={formData.applicableBooks.includes(book._id)}
                      onChange={() => toggleBookSelection(book._id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{book.title}</p>
                      <p className="text-sm text-gray-500">{book.author} • ${book.price}</p>
                    </div>
                  </label>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">No books found</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Banner Image */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Banner Image (Optional)</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image URL
          </label>
          <input
            type="url"
            name="bannerImage"
            value={formData.bannerImage}
            onChange={handleChange}
            placeholder="https://example.com/banner.jpg"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {formData.bannerImage && (
            <div className="mt-3">
              <img
                src={formData.bannerImage}
                alt="Banner preview"
                className="w-full h-32 object-cover rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL'
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Date Range */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Schedule</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date & Time *
            </label>
            <input
              type="datetime-local"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date & Time *
            </label>
            <input
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Visibility Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Visibility & Status</h2>
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <div>
              <p className="font-medium text-gray-900">Active</p>
              <p className="text-sm text-gray-500">Deal is live and can be used by customers</p>
            </div>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="showOnHomepage"
              checked={formData.showOnHomepage}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <div>
              <p className="font-medium text-gray-900">Show on Homepage</p>
              <p className="text-sm text-gray-500">Display this deal on the homepage</p>
            </div>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="showOnDealsPage"
              checked={formData.showOnDealsPage}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <div>
              <p className="font-medium text-gray-900">Show on Deals Page</p>
              <p className="text-sm text-gray-500">Display this deal on the deals page</p>
            </div>
          </label>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => window.history.back()}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || formData.applicableBooks.length === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : isEdit ? 'Update Deal' : 'Create Deal'}
          </button>
        </div>
      </div>

      {/* Preview */}
      {showPreview && (
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                formData.type === 'FLASH_SALE' ? 'bg-red-100 text-red-600' :
                formData.type === 'BOGO' ? 'bg-green-100 text-green-600' :
                formData.type === 'LIMITED_TIME' ? 'bg-orange-100 text-orange-600' :
                formData.type === 'SEASONAL' ? 'bg-teal-100 text-teal-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                {getDealTypeIcon(formData.type)}
              </div>
              <div>
                <h4 className="font-bold text-xl text-gray-900">{formData.title || 'Deal Title'}</h4>
                <p className="text-sm text-gray-600">{formData.description || 'Deal description'}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                {formData.type === 'BOGO' 
                  ? `Buy ${formData.buyQuantity} Get ${formData.getQuantity} Free`
                  : `${formData.discountValue}${formData.type === 'FIXED_DISCOUNT' ? '$' : '%'} OFF`
                }
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                {formData.applicableBooks.length} books
              </span>
              {formData.isActive && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">Active</span>
              )}
              {formData.showOnHomepage && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">Homepage</span>
              )}
            </div>
          </div>
        </div>
      )}
    </form>
  )
}

export default DealForm
