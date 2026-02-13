'use client'

import { useState } from 'react'
import { Tag, Clock, Gift, Flame, Calendar, ShoppingBag, Filter } from 'lucide-react'
import BookCard from './BookCard'
import { getDealBadgeInfo } from '@/utils/bookMapper'

interface Deal {
  _id: string
  title: string
  description: string
  type: string
  customTypeName?: string
  isCustomType?: boolean
  discountPercentage: number
  buyQuantity?: number
  getQuantity?: number
  applicableBooks: any[]
  bannerImage?: string
  startDate: string
  endDate: string
}

interface DealsPageClientProps {
  deals: Deal[]
}

const DealsPageClient = ({ deals }: DealsPageClientProps) => {
  const [selectedType, setSelectedType] = useState<string>('ALL')
  const [showFilters, setShowFilters] = useState(false)

  // Get unique deal types (including custom ones)
  const uniqueTypes = Array.from(new Set(deals.map(d => {
    if (d.isCustomType && d.customTypeName) {
      return d.customTypeName;
    }
    return d.type;
  })));

  // Filter deals by type
  const filteredDeals = selectedType === 'ALL' 
    ? deals 
    : deals.filter(deal => {
        const dealType = deal.isCustomType && deal.customTypeName ? deal.customTypeName : deal.type;
        return dealType === selectedType;
      });

  // Count deals by type
  const dealCounts: Record<string, number> = {
    ALL: deals.length,
  };
  
  uniqueTypes.forEach(type => {
    dealCounts[type] = deals.filter(d => {
      const dealType = d.isCustomType && d.customTypeName ? d.customTypeName : d.type;
      return dealType === type;
    }).length;
  });

  const getDealIcon = (deal: Deal) => {
    const type = deal.isCustomType ? 'CUSTOM' : deal.type;
    
    switch (type) {
      case 'FLASH_SALE':
        return <Flame className="w-5 h-5" />
      case 'BOGO':
        return <Gift className="w-5 h-5" />
      case 'LIMITED_TIME':
        return <Clock className="w-5 h-5" />
      case 'SEASONAL':
        return <Calendar className="w-5 h-5" />
      case 'CUSTOM':
        return <Tag className="w-5 h-5" />
      default:
        return <Tag className="w-5 h-5" />
    }
  }

  const getDealBadgeColor = (deal: Deal) => {
    const type = deal.isCustomType ? 'CUSTOM' : deal.type;
    
    switch (type) {
      case 'FLASH_SALE':
        return 'bg-red-500 text-white'
      case 'BOGO':
        return 'bg-green-500 text-white'
      case 'LIMITED_TIME':
        return 'bg-orange-500 text-white'
      case 'SEASONAL':
        return 'bg-teal-500 text-white'
      case 'CUSTOM':
        return 'bg-purple-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const getDealText = (deal: Deal) => {
    if (deal.type === 'BOGO') {
      return `Buy ${deal.buyQuantity} Get ${deal.getQuantity} Free`;
    }
    return `${deal.discountPercentage}% OFF`;
  };

  const formatDealType = (deal: Deal) => {
    if (deal.isCustomType && deal.customTypeName) {
      return deal.customTypeName;
    }
    
    return deal.type.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  };

  return (
    <>
      {/* Filter Section */}
      <section className="py-6 bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-700 dark-transition sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4 md:mb-0">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Filter by Deal Type
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <Filter size={18} />
              <span className="text-sm">Filters</span>
            </button>
          </div>

          {/* Desktop Filters */}
          <div className="hidden md:flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedType('ALL')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedType === 'ALL'
                  ? 'bg-bookStore-blue text-white shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-bookStore-blue'
              }`}
            >
              All Deals ({dealCounts.ALL})
            </button>
            {uniqueTypes.map(type => {
              const count = dealCounts[type] || 0;
              if (count === 0) return null;
              
              const deal = deals.find(d => {
                const dealType = d.isCustomType && d.customTypeName ? d.customTypeName : d.type;
                return dealType === type;
              });
              
              if (!deal) return null;
              
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedType === type
                      ? `${getDealBadgeColor(deal)} shadow-md`
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-gray-400'
                  }`}
                >
                  {getDealIcon(deal)}
                  <span>{formatDealType(deal)} ({count})</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="md:hidden mt-4 space-y-2">
              <button
                onClick={() => { setSelectedType('ALL'); setShowFilters(false) }}
                className={`w-full px-4 py-3 rounded-lg font-medium transition-all ${
                  selectedType === 'ALL'
                    ? 'bg-bookStore-blue text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                }`}
              >
                All Deals ({dealCounts.ALL})
              </button>
              {uniqueTypes.map(type => {
                const count = dealCounts[type] || 0;
                if (count === 0) return null;
                
                const deal = deals.find(d => {
                  const dealType = d.isCustomType && d.customTypeName ? d.customTypeName : d.type;
                  return dealType === type;
                });
                
                if (!deal) return null;
                
                return (
                  <button
                    key={type}
                    onClick={() => { setSelectedType(type); setShowFilters(false) }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all ${
                      selectedType === type
                        ? getDealBadgeColor(deal)
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      {getDealIcon(deal)}
                      <span>{formatDealType(deal)}</span>
                    </span>
                    <span>({count})</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Deals Content */}
      <section className="py-12 bg-white dark:bg-gray-900 dark-transition">
        <div className="container mx-auto px-4">
          {filteredDeals.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Tag className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                No Active Deals
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Check back soon for exciting offers and discounts!
              </p>
            </div>
          ) : (
            <div className="space-y-16">
              {filteredDeals.map((deal) => (
                <div key={deal._id} className="space-y-6">
                  {/* Deal Header Card */}
                  <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${getDealBadgeColor(deal)}`}>
                            {getDealIcon(deal)}
                            <span className="font-semibold text-sm">{getDealText(deal)}</span>
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {deal.applicableBooks.length} books
                          </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                          {deal.title}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                          {deal.description}
                        </p>
                        {deal.type === 'BOGO' && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-2 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Add {deal.buyQuantity! + deal.getQuantity!} items to cart to avail this offer
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Books Grid */}
                  {deal.applicableBooks && deal.applicableBooks.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                      {deal.applicableBooks.map((book: any) => (
                        <BookCard 
                          key={book._id || book.id} 
                          book={book}
                          dealInfo={getDealBadgeInfo(book) || undefined}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 bg-gradient-to-r from-bookStore-blue to-blue-700 dark:from-gray-900 dark:to-black dark-transition">
        <div className="container mx-auto px-4 text-center text-white">
          <ShoppingBag size={48} className="mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">
            Never Miss a Deal
          </h2>
          <p className="text-xl mb-6 opacity-90 max-w-2xl mx-auto">
            Subscribe to get notified about exclusive deals, flash sales, and special offers
          </p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-white dark-transition"
            />
            <button className="px-6 py-3 bg-white dark:bg-blue-600 text-bookStore-blue dark:text-white font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-blue-700 transition-colors shadow-lg">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

export default DealsPageClient
