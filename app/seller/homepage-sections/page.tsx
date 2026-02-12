'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  getHomepageSections,
  createHomepageSection,
  updateHomepageSection,
  deleteHomepageSection,
  toggleHomepageSectionStatus,
} from '@/utils/seller'

interface HomepageSection {
  _id: string
  title: string
  slug: string
  isActive: boolean
  displayOrder: number
  bookCount?: number
}

export default function HomepageSectionsPage() {
  const [sections, setSections] = useState<HomepageSection[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingSection, setEditingSection] = useState<HomepageSection | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    displayOrder: 0,
    isActive: true,
  })

  useEffect(() => {
    fetchSections()
  }, [])

  const fetchSections = async () => {
    try {
      setLoading(true)
      const response = await getHomepageSections()

      if (response.success) {
        setSections(response.data || [])
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch sections')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (section?: HomepageSection) => {
    if (section) {
      setEditingSection(section)
      setFormData({
        title: section.title,
        displayOrder: section.displayOrder,
        isActive: section.isActive,
      })
    } else {
      setEditingSection(null)
      setFormData({
        title: '',
        displayOrder: sections.length,
        isActive: true,
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingSection(null)
    setFormData({
      title: '',
      displayOrder: 0,
      isActive: true,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error('Section title is required')
      return
    }

    try {
      if (editingSection) {
        const response = await updateHomepageSection(editingSection._id, formData)
        if (response.success) {
          toast.success('Section updated successfully')
          fetchSections()
          handleCloseModal()
        }
      } else {
        const response = await createHomepageSection(formData)
        if (response.success) {
          toast.success('Section created successfully! Now you can assign books to this section when adding/editing books.')
          fetchSections()
          handleCloseModal()
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to save section')
    }
  }

  const handleToggleStatus = async (sectionId: string) => {
    try {
      const response = await toggleHomepageSectionStatus(sectionId)
      if (response.success) {
        toast.success(response.message)
        fetchSections()
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to toggle status')
    }
  }

  const handleDelete = async (sectionId: string) => {
    if (!confirm('Are you sure you want to delete this section? Books assigned to this section will not be deleted.')) return

    try {
      const response = await deleteHomepageSection(sectionId)
      if (response.success) {
        toast.success('Section deleted successfully')
        fetchSections()
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete section')
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Homepage Sections</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create custom sections. Assign books to these sections when adding/editing books.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          New Section
        </button>
      </div>

      {sections.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No homepage sections yet</p>
          <button
            onClick={() => handleOpenModal()}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Create your first section
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section._id}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {section.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      section.isActive
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {section.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {section.bookCount || 0} book{section.bookCount !== 1 ? 's' : ''} assigned • Display Order: {section.displayOrder}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    Slug: {section.slug}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStatus(section._id)}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title={section.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {section.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <button
                    onClick={() => handleOpenModal(section)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(section._id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {editingSection ? 'Edit Section' : 'Create New Section'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Trending Now, Award Winners, Staff Picks"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    This will appear as a section title on your homepage
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Lower numbers appear first (0 = first, 1 = second, etc.)
                  </p>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Active (show on homepage)
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingSection ? 'Update Section' : 'Create Section'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
