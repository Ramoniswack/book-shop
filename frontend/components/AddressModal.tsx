'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Address } from '@/utils/address'
import toast from 'react-hot-toast'

interface AddressModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (address: Omit<Address, '_id'>) => Promise<void>
  editAddress?: Address | null
}

export default function AddressModal({ isOpen, onClose, onSave, editAddress }: AddressModalProps) {
  const [formData, setFormData] = useState<Omit<Address, '_id'>>({
    label: 'Home',
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Nepal',
    isDefault: false,
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (editAddress) {
      setFormData({
        label: editAddress.label,
        fullName: editAddress.fullName,
        phone: editAddress.phone,
        addressLine1: editAddress.addressLine1,
        addressLine2: editAddress.addressLine2 || '',
        city: editAddress.city,
        state: editAddress.state || '',
        postalCode: editAddress.postalCode,
        country: editAddress.country,
        isDefault: editAddress.isDefault,
      })
    } else {
      // Reset form when not editing
      setFormData({
        label: 'Home',
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Nepal',
        isDefault: false,
      })
    }
  }, [editAddress, isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.fullName || !formData.phone || !formData.addressLine1 || !formData.city || !formData.postalCode) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setIsLoading(true)
      await onSave(formData)
      onClose()
    } catch (error: any) {
      toast.error(error.message || 'Failed to save address')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {editAddress ? 'Edit Address' : 'Add New Address'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Address Label */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Address Label <span className="text-red-500">*</span>
              </label>
              <select
                name="label"
                value={formData.label}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-bookStore-blue focus:border-bookStore-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              >
                <option value="Home">Home</option>
                <option value="Office">Office</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-bookStore-blue focus:border-bookStore-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="John Doe"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-bookStore-blue focus:border-bookStore-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="+977 9800000000"
                required
              />
            </div>

            {/* Address Line 1 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Address Line 1 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-bookStore-blue focus:border-bookStore-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Street address, P.O. box"
                required
              />
            </div>

            {/* Address Line 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Address Line 2 (Optional)
              </label>
              <input
                type="text"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-bookStore-blue focus:border-bookStore-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Apartment, suite, unit, building, floor, etc."
              />
            </div>

            {/* City and State */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-bookStore-blue focus:border-bookStore-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Kathmandu"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  State/Province (Optional)
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-bookStore-blue focus:border-bookStore-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Bagmati"
                />
              </div>
            </div>

            {/* Postal Code and Country */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Postal Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-bookStore-blue focus:border-bookStore-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="44600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-bookStore-blue focus:border-bookStore-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Nepal"
                  required
                />
              </div>
            </div>

            {/* Set as Default */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
                className="h-4 w-4 text-bookStore-blue focus:ring-bookStore-blue border-gray-300 dark:border-gray-600 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Set as default address
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-bookStore-blue hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : editAddress ? 'Update Address' : 'Save Address'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
