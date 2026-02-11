'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import DealForm from '@/components/DealForm'
import { getDealById, updateDeal } from '@/utils/seller'
import { toast } from 'react-hot-toast'
import { AlertTriangle } from 'lucide-react'

export default function EditDealPage() {
  const router = useRouter()
  const params = useParams()
  const dealId = params.id as string

  const [initialData, setInitialData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDeal()
  }, [dealId])

  const fetchDeal = async () => {
    try {
      setFetchLoading(true)
      const response = await getDealById(dealId)

      if (response.success) {
        setInitialData(response.data)
      } else {
        setError(response.message || 'Failed to fetch deal')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch deal')
    } finally {
      setFetchLoading(false)
    }
  }

  const handleSubmit = async (dealData: any) => {
    try {
      setLoading(true)
      const response = await updateDeal(dealId, dealData)

      if (response.success) {
        toast.success('Deal updated successfully!')
        router.push('/seller/deals')
      } else {
        toast.error(response.message || 'Failed to update deal')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update deal')
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Deal</h1>
        <div className="bg-white rounded-lg shadow p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Deal</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-800 font-medium">Error loading deal</p>
          </div>
          <p className="text-red-600 mt-2">{error}</p>
          <button
            onClick={fetchDeal}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Deal</h1>
        <p className="text-gray-600 mt-2">Update your promotional deal settings</p>
      </div>

      {initialData && (
        <DealForm 
          initialData={initialData} 
          onSubmit={handleSubmit} 
          loading={loading}
          isEdit={true}
        />
      )}
    </div>
  )
}
