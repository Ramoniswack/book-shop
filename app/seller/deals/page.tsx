'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, AlertTriangle, Tag, Calendar, TrendingUp, Clock, Flame, Gift, Percent } from 'lucide-react';
import Link from 'next/link';
import { getSellerDeals, deleteDeal } from '@/utils/seller';

interface Deal {
  _id: string;
  title: string;
  description?: string;
  type: 'FLASH_SALE' | 'BOGO' | 'PERCENTAGE' | 'FIXED_DISCOUNT' | 'LIMITED_TIME' | 'SEASONAL';
  discountValue: number;
  buyQuantity?: number;
  getQuantity?: number;
  applicableBooks: any[];
  bannerImage?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  showOnHomepage: boolean;
  showOnDealsPage: boolean;
  createdAt: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalDeals: number;
  dealsPerPage: number;
}

export default function SellerDeals() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchDeals();
  }, [currentPage, statusFilter, typeFilter]);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        page: currentPage,
        limit: 12,
      };

      if (statusFilter === 'active') {
        params.isActive = true;
      } else if (statusFilter === 'inactive') {
        params.isActive = false;
      }

      if (typeFilter) {
        params.type = typeFilter;
      }

      const response = await getSellerDeals(params);

      if (response.success) {
        setDeals(response.data);
        setPagination(response.pagination);
      } else {
        setError(response.message || 'Failed to fetch deals');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch deals');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDeal = async (dealId: string) => {
    try {
      setDeleting(true);
      const response = await deleteDeal(dealId);

      if (response.success) {
        setDeals(deals.filter(deal => deal._id !== dealId));
        setDeleteConfirm(null);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete deal');
    } finally {
      setDeleting(false);
    }
  };

  const getDealStatus = (deal: Deal) => {
    const now = new Date();
    const start = new Date(deal.startDate);
    const end = new Date(deal.endDate);

    if (!deal.isActive) return 'inactive';
    if (now < start) return 'upcoming';
    if (now > end) return 'expired';
    return 'active';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDealTypeIcon = (type: string) => {
    switch (type) {
      case 'FLASH_SALE':
        return <Flame className="w-4 h-4" />;
      case 'BOGO':
        return <Gift className="w-4 h-4" />;
      case 'LIMITED_TIME':
        return <Clock className="w-4 h-4" />;
      case 'PERCENTAGE':
      case 'FIXED_DISCOUNT':
        return <Percent className="w-4 h-4" />;
      default:
        return <Tag className="w-4 h-4" />;
    }
  };

  const getDealTypeLabel = (type: string) => {
    switch (type) {
      case 'FLASH_SALE':
        return 'Flash Sale';
      case 'BOGO':
        return 'Buy One Get One';
      case 'PERCENTAGE':
        return 'Percentage Off';
      case 'FIXED_DISCOUNT':
        return 'Fixed Discount';
      case 'LIMITED_TIME':
        return 'Limited Time';
      case 'SEASONAL':
        return 'Seasonal';
      default:
        return type;
    }
  };

  const getDealValueDisplay = (deal: Deal) => {
    switch (deal.type) {
      case 'FLASH_SALE':
      case 'PERCENTAGE':
      case 'LIMITED_TIME':
      case 'SEASONAL':
        return `${deal.discountValue}% OFF`;
      case 'FIXED_DISCOUNT':
        return `$${deal.discountValue} OFF`;
      case 'BOGO':
        return `Buy ${deal.buyQuantity} Get ${deal.getQuantity} Free`;
      default:
        return deal.discountValue;
    }
  };

  const getDealTypeColor = (type: string) => {
    switch (type) {
      case 'FLASH_SALE':
        return 'from-red-500 to-orange-600';
      case 'BOGO':
        return 'from-green-500 to-emerald-600';
      case 'LIMITED_TIME':
        return 'from-orange-500 to-yellow-600';
      case 'SEASONAL':
        return 'from-teal-500 to-cyan-600';
      case 'PERCENTAGE':
        return 'from-blue-500 to-indigo-600';
      case 'FIXED_DISCOUNT':
        return 'from-purple-500 to-pink-600';
      default:
        return 'from-blue-500 to-purple-600';
    }
  };

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Deals & Promotions</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-800 font-medium">Error loading deals</p>
          </div>
          <p className="text-red-600 mt-2">{error}</p>
          <button
            onClick={fetchDeals}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Deals & Promotions</h1>
        <Link
          href="/seller/deals/add"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Deal
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Deal Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Deal Types</option>
            <option value="FLASH_SALE">Flash Sale</option>
            <option value="BOGO">Buy One Get One</option>
            <option value="PERCENTAGE">Percentage Off</option>
            <option value="FIXED_DISCOUNT">Fixed Discount</option>
            <option value="LIMITED_TIME">Limited Time</option>
            <option value="SEASONAL">Seasonal</option>
          </select>
        </div>
      </div>

      {/* Deals Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : deals.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal) => {
              const status = getDealStatus(deal);
              return (
                <div key={deal._id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Deal Header */}
                  <div className={`bg-gradient-to-r ${getDealTypeColor(deal.type)} p-6 text-white`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{deal.title}</h3>
                        <div className="text-3xl font-bold">
                          {getDealValueDisplay(deal)}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(status)} bg-white`}>
                        {status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm opacity-90">
                      {getDealTypeIcon(deal.type)}
                      <span>{getDealTypeLabel(deal.type)}</span>
                    </div>
                  </div>

                  {/* Deal Body */}
                  <div className="p-6">
                    <div className="space-y-3 text-sm">
                      {/* Date Range */}
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(deal.startDate).toLocaleDateString()} - {new Date(deal.endDate).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Applicable Books */}
                      {deal.applicableBooks && deal.applicableBooks.length > 0 && (
                        <div className="flex items-start gap-2 text-gray-600">
                          <TrendingUp className="w-4 h-4 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-900">Books ({deal.applicableBooks.length})</p>
                            <p className="text-xs text-gray-500">
                              {deal.applicableBooks.slice(0, 2).map((book: any) => book.title).join(', ')}
                              {deal.applicableBooks.length > 2 && ` +${deal.applicableBooks.length - 2} more`}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Visibility Flags */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {deal.showOnHomepage && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                            Homepage
                          </span>
                        )}
                        {deal.showOnDealsPage && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            Deals Page
                          </span>
                        )}
                      </div>

                      {/* Created Date */}
                      <div className="flex items-center gap-2 text-gray-500 text-xs pt-2 border-t border-gray-100">
                        <Clock className="w-3 h-3" />
                        <span>Created {new Date(deal.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                      <Link
                        href={`/seller/deals/edit/${deal._id}`}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteConfirm(deal._id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-red-300 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-6 bg-white rounded-lg shadow px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalDeals} total deals)
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === pagination.totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">No deals found</p>
          <p className="text-gray-400 text-sm mb-4">
            {statusFilter || typeFilter
              ? 'Try adjusting your filters'
              : 'Create your first deal to start promoting your books'}
          </p>
          <Link
            href="/seller/deals/add"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Deal
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this deal? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteDeal(deleteConfirm)}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
