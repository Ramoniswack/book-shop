'use client'

import { useState } from 'react'
import { Tag, Clock, Percent, Gift, Flame, Calendar, ShoppingBag, Filter, X } from 'lucide-react'
import BookCard from './BookCard'
import Image from 'next/image'

interface Deal {
  _id: string
  title: string
  description: string
  type: 'FLASH_SALE' | 'BOGO' | 'PERCENTAGE' | 'FIXED_DISCOUNT' | 'LIMITED_TIME' | 'SEASONAL'
  discountValue: number
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

  console.log('DealsPageClient received', deals.length, 'deals:', deals.map(d => d.title))

  // Filter deals by type
  const filteredDeals = selectedType === 'ALL' 
    ? deals 
    : deals.filter(deal => deal.type === selectedType)

  // Count deals by type
  const dealCounts = {
    ALL: deals.length,
    FLASH_SALE: deals.filter(d => d.type === 'FLASH_SALE').length,
    BOGO: deals.filter(d => d.type === 'BOGO').length,
    PERCENTAGE: deals.filter(d => d.type === 'PERCENTAGE').length,
    LIMITED_TIME: deals.filter(d => d.type === 'LIMITED_TIME').length,
    SEASONAL: deals.filter(d => d.type === 'SEASONAL').length,
    FIXED_DISCOUNT: deals.filter(d => d.type === 'FIXED_DISCOUNT').length,
  }

  const getDealBadgeInfo = (deal: Deal) => {
    const color = getDealBadgeColor(deal.type)
    let badge = ''
    
    switch (deal.type) {
      case 'FLASH_SALE':
        badge = '🔥 FLASH'
        break
      case 'BOGO':
        badge = '🎁 BOGO'
        break
      case 'PERCENTAGE':
        badge = `${deal.discountValue}% OFF`
        break
      case 'FIXED_DISCOUNT':
        badge = `${deal.discountValue} OFF`
        break
      case 'LIMITED_TIME':
        badge = `⏰ ${deal.discountValue}%`
        break
      case 'SEASONAL':
        badge = `🎉 ${deal.discountValue}%`
        break
      default:
        badge = 'DEAL'
    }
    
    return { type: deal.type, badge, color }
  }

  const getDealIcon = (type: string) => {
    switch (type) {
      case 'FLASH_SALE':
        return <Flame className="w-5 h-5" />
      case 'BOGO':
        return <Gift className="w-5 h-5" />
      case 'LIMITED_TIME':
        return <Clock className="w-5 h-5" />
      case 'SEASONAL':
        return <Calendar className="w-5 h-5" />
      case 'PERCENTAGE':
      case 'FIXED_DISCOUNT':
        return <Percent className="w-5 h-5" />
      default:
        return <Tag className="w-5 h-5" />
    }
  }

  const getDealBadgeColor = (type: string) => {
    switch (type) {
      case 'FLASH_SALE':
        return 'bg-red-500 text-white'
      case 'BOGO':
        return 'bg-green-500 text-white'
      case 'LIMITED_TIME':
        return 'bg-orange-500 text-white'
      case 'SEASONAL':
        return 'bg-teal-500 text-white'
      case 'PERCENTAGE':
        return 'bg-blue-500 text-white'
      case 'FIXED_DISCOUNT':
        return 'bg-purple-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const getDealText = (deal: Deal) => {
    switch (deal.type) {
      case 'FLASH_SALE':
        return `${deal.discountValue}% OFF`
      case 'BOGO':
        return `Buy ${deal.buyQuantity} Get ${deal.getQuantity} Free`
      case 'PERCENTAGE':
        return `${deal.discountValue}% OFF`
      case 'FIXED_DISCOUNT':
        return `$${deal.discountValue} OFF`
      case 'LIMITED_TIME':
        return `${deal.discountValue}% OFF`
      case 'SEASONAL':
        return `${deal.discountValue}% OFF`
      default:
        return 'Special Offer'
    }
  }

  const formatDealType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ')
  }

  return (
    <>
      {/* Deals Header */}
      <div className="bg-gradient-to-r from-bookStore-blue to-blue-700 dark:from-gray-900 dark:to-black text-white py-12 md:py-16 dark-transition">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Special Deals & Offers
          </h1>
          <p className="text-xl mb-6 opacity-90">
            Save big on your favorite books with our exclusive deals
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 text-sm">
            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full">
              <Percent size={20} />
              <span>Up to 50% OFF</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full">
              <Gift size={20} />
              <span>BOGO Deals</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full">
              <Tag size={20} />
              <span>{deals.length} Active Deals</span>
            </div>
          </div>
        </div>
      </div>

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
            {dealCounts.FLASH_SALE > 0 && (
              <button
                onClick={() => setSelectedType('FLASH_SALE')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedType === 'FLASH_SALE'
                    ? 'bg-red-500 text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-red-500'
                }`}
              >
                <Flame size={18} />
                <span>Flash Sale ({dealCounts.FLASH_SALE})</span>
              </button>
            )}
            {dealCounts.BOGO > 0 && (
              <button
                onClick={() => setSelectedType('BOGO')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedType === 'BOGO'
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-green-500'
                }`}
              >
                <Gift size={18} />
                <span>BOGO ({dealCounts.BOGO})</span>
              </button>
            )}
            {dealCounts.LIMITED_TIME > 0 && (
              <button
                onClick={() => setSelectedType('LIMITED_TIME')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedType === 'LIMITED_TIME'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-orange-500'
                }`}
              >
                <Clock size={18} />
                <span>Limited Time ({dealCounts.LIMITED_TIME})</span>
              </button>
            )}
            {dealCounts.SEASONAL > 0 && (
              <button
                onClick={() => setSelectedType('SEASONAL')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedType === 'SEASONAL'
                    ? 'bg-teal-500 text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-teal-500'
                }`}
              >
                <Calendar size={18} />
                <span>Seasonal ({dealCounts.SEASONAL})</span>
              </button>
            )}
            {(dealCounts.PERCENTAGE > 0 || dealCounts.FIXED_DISCOUNT > 0) && (
              <button
                onClick={() => setSelectedType('PERCENTAGE')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedType === 'PERCENTAGE'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-500'
                }`}
              >
                <Percent size={18} />
                <span>Discounts ({dealCounts.PERCENTAGE + dealCounts.FIXED_DISCOUNT})</span>
              </button>
            )}
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
              {Object.entries(dealCounts).map(([type, count]) => {
                if (type === 'ALL' || count === 0) return null
                return (
                  <button
                    key={type}
                    onClick={() => { setSelectedType(type); setShowFilters(false) }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all ${
                      selectedType === type
                        ? getDealBadgeColor(type)
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      {getDealIcon(type)}
                      <span>{formatDealType(type)}</span>
                    </span>
                    <span>({count})</span>
                  </button>
                )
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
                          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${getDealBadgeColor(deal.type)}`}>
                            {getDealIcon(deal.type)}
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
                          <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-2">
                            💡 Add {deal.buyQuantity! + deal.getQuantity!} items to cart to avail this offer
                          </p>
                        )}
                      </div>
                      {deal.bannerImage && (
                        <div className="flex-shrink-0">
                          <div className="relative w-full md:w-32 h-32 rounded-xl overflow-hidden">
                            <Image
                              src={deal.bannerImage}
                              alt={deal.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Books Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {deal.applicableBooks.map((book: any) => (
                      <BookCard 
                        key={book._id || book.id} 
                        book={book}
                        dealInfo={getDealBadgeInfo(deal)}
                      />
                    ))}
                  </div>
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
