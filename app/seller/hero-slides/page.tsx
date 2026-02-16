'use client'

import { useState, useEffect } from 'react'
import { Upload, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react'
import toast from 'react-hot-toast'

interface HeroSlide {
  _id: string
  image: string
  displayOrder: number
  isActive: boolean
  createdAt: string
}

export default function HeroSlidesPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchSlides()
  }, [])

  const fetchSlides = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seller/hero-slides`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setSlides(data.data)
      }
    } catch (error) {
      console.error('Error fetching slides:', error)
      toast.error('Failed to fetch hero slides')
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (slides.length >= 4) {
      toast.error('Maximum 4 hero slides allowed')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('image', file)
    formData.append('displayOrder', slides.length.toString())

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seller/hero-slides`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await response.json()
      if (data.success) {
        toast.success('Hero slide uploaded successfully')
        fetchSlides()
      } else {
        toast.error(data.message || 'Failed to upload hero slide')
      }
    } catch (error) {
      console.error('Error uploading slide:', error)
      toast.error('Failed to upload hero slide')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const activeCount = slides.filter(s => s.isActive).length
    if (activeCount <= 2 && currentStatus) {
      toast.error('Minimum 2 active slides required')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seller/hero-slides/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      const data = await response.json()
      if (data.success) {
        toast.success(`Slide ${!currentStatus ? 'activated' : 'deactivated'}`)
        fetchSlides()
      } else {
        toast.error(data.message || 'Failed to update slide')
      }
    } catch (error) {
      console.error('Error updating slide:', error)
      toast.error('Failed to update slide')
    }
  }

  const deleteSlide = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slide?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seller/hero-slides/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()
      if (data.success) {
        toast.success('Slide deleted successfully')
        fetchSlides()
      } else {
        toast.error(data.message || 'Failed to delete slide')
      }
    } catch (error) {
      console.error('Error deleting slide:', error)
      toast.error('Failed to delete slide')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Hero Slides</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage homepage hero slider images (Min: 2, Max: 4)
        </p>
      </div>

      {/* Upload Section */}
      <div className="mb-8">
        <label
          htmlFor="hero-upload"
          className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            uploading || slides.length >= 4
              ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
              : 'border-blue-300 bg-blue-50 hover:bg-blue-100 dark:border-blue-600 dark:bg-blue-900/20 dark:hover:bg-blue-900/30'
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className={`w-12 h-12 mb-3 ${uploading ? 'text-gray-400' : 'text-blue-500'}`} />
            <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold">
                {uploading ? 'Uploading...' : slides.length >= 4 ? 'Maximum slides reached' : 'Click to upload'}
              </span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PNG, JPG, WEBP or GIF (MAX. 5MB)
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Current: {slides.length}/4 slides
            </p>
          </div>
          <input
            id="hero-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading || slides.length >= 4}
          />
        </label>
      </div>

      {/* Slides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slides.map((slide, index) => {
          // Construct proper image URL
          const imageUrl = slide.image.startsWith('http') 
            ? slide.image 
            : `http://localhost:5000/${slide.image.replace(/\\/g, '/')}`
          
          return (
            <div
              key={slide._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              <div className="relative h-64">
                <img
                  src={imageUrl}
                  alt={`Hero slide ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Failed to load image:', imageUrl)
                    e.currentTarget.style.display = 'none'
                    const parent = e.currentTarget.parentElement
                    if (parent) {
                      parent.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                        <div class="text-center">
                          <p class="text-gray-500 dark:text-gray-400">Image not found</p>
                          <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">${slide.image}</p>
                        </div>
                      </div>`
                    }
                  }}
                />
                {!slide.isActive && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">Inactive</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <GripVertical className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Order: {index + 1}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleActive(slide._id, slide.isActive)}
                      className={`p-2 rounded-lg transition-colors ${
                        slide.isActive
                          ? 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400'
                      }`}
                      title={slide.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {slide.isActive ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => deleteSlide(slide._id)}
                      className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {slides.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No hero slides yet. Upload your first slide!</p>
        </div>
      )}
    </div>
  )
}
