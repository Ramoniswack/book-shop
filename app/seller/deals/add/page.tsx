'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DealForm from '@/components/DealForm'
import { createDeal } from '@/utils/seller'
import { toast } from 'react-hot-toast'

export default function AddDealPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (dealData: any) => {
    try {
      setLoading(true)
      const response = await createDeal(dealData)

      if (response.success) {
        toast.success('Deal created successfully!')
        router.push('/seller/deals')
      } else {
        toast.error(response.message || 'Failed to create deal')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create deal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Deal</h1>
        <p className="text-gray-600 mt-2">Set up a new promotional deal for your books</p>
      </div>

      <DealForm onSubmit={handleSubmit} loading={loading} />
    </div>
  )
}
