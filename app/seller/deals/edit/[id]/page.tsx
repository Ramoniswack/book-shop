'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import DealForm from '@/components/DealForm';
import { updateDeal } from '@/utils/seller';
import apiRequest from '@/utils/api';

interface Deal {
  _id: string;
  title: string;
  dealType: 'percentage' | 'flat' | 'bogo';
  discountValue: number;
  applicableBooks: any[];
  applicableGenres: any[];
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export default function EditDeal() {
  const router = useRouter();
  const params = useParams();
  const dealId = params.id as string;

  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    fetchDeal();
  }, [dealId]);

  const fetchDeal = async () => {
    try {
      setLoading(true);
      setFetchError(null);

      const response = await apiRequest(`/seller/deals/${dealId}`, {
        method: 'GET',
      });

      if (response.success) {
        setDeal(response.data);
      } else {
        setFetchError(response.message || 'Failed to fetch deal');
      }
    } catch (err: any) {
      setFetchError(err.message || 'Failed to fetch deal');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Convert discountValue to number
      const dealData = {
        ...formData,
        discountValue: parseFloat(formData.discountValue),
      };

      const response = await updateDeal(dealId, dealData);

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/seller/deals');
        }, 2000);
      } else {
        setError(response.message || 'Failed to update deal');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update deal');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-center gap-4 mb-6">
          <Link href="/seller/deals" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit Deal</h1>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded w-full"></div>
            <div className="h-32 bg-gray-200 rounded w-full"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div>
        <div className="flex items-center gap-4 mb-6">
          <Link href="/seller/deals" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit Deal</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-800 font-medium">Error loading deal</p>
          </div>
          <p className="text-red-600 mt-2">{fetchError}</p>
          <button
            onClick={fetchDeal}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div>
        <div className="flex items-center gap-4 mb-6">
          <Link href="/seller/deals" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit Deal</h1>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800">Deal not found</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/seller/deals" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit Deal</h1>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <p className="text-green-800 font-medium">Deal updated successfully!</p>
          </div>
          <p className="text-green-600 text-sm mt-1">Redirecting to deals list...</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-800 font-medium">Error updating deal</p>
          </div>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <DealForm
          initialData={{
            title: deal.title,
            dealType: deal.dealType,
            discountValue: deal.discountValue.toString(),
            applicableBooks: deal.applicableBooks.map((book: any) => book._id || book),
            applicableGenres: deal.applicableGenres.map((genre: any) => genre._id || genre),
            startDate: new Date(deal.startDate).toISOString().slice(0, 16),
            endDate: new Date(deal.endDate).toISOString().slice(0, 16),
            isActive: deal.isActive,
          }}
          onSubmit={handleSubmit}
          submitLabel="Update Deal"
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}
