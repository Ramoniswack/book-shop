'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Tag, Clock, Gift, Sparkles, ArrowRight, Flame, Calendar, Percent } from 'lucide-react'
import BookCard from './BookCard'

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

interface DealSectionProps {
  deal: Deal
  className?: string
}

const DealSection = ({ deal, className = '' }: DealSectionProps) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [showCountdown, setShowCountdown] = useState(false)

  useEffect(() => {
    // Calculate time left for flash sales and limited time deals
    if (deal.type === 'FLASH_SALE' || deal.type === 'LIMITED_TIME') {
      const calculateTimeLeft = () => {
        const now = new Date().getTime()
        const end = new Date(deal.endDate).getTime()
        const difference = end - now

        if (difference > 0) {
          setTimeLeft({
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
          })
          setShowCountdown(true)
        } else {
          setShowCountdown(false)
        }
      }

      calculateTimeLeft()
      const timer = setInterval(calculateTimeLeft, 1000)

      return () => clearInterval(timer)
    }
  }, [deal.endDate, deal.type])

  const getDealIcon = () => {
    switch (deal.type) {
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

  const getDealBadgeColor = () => {
    switch (deal.type) {
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

  const getDealText = () => {
    switch (deal.type) {
      case 'FLASH_SALE':
        return `${deal.discountValue}% OFF`
      case 'BOGO':
        return `Buy ${deal.buyQuantity} Get ${deal.getQuantity} Free`
      case 'PERCENTAGE':
        return `${deal.discountValue}% OFF`
      case 'FIXED_DISCOUNT':
        return `Save $${deal.discountValue}`
      case 'LIMITED_TIME':
        return `${deal.discountValue}% OFF`
      case 'SEASONAL':
        return `${deal.discountValue}% OFF`
      default:
        return 'Special Offer'
    }
  }

  const getBackgroundGradient = () => {
    switch (deal.type) {
      case 'FLASH_SALE':
        return 'from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/10'
      case 'BOGO':
        return 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10'
      case 'LIMITED_TIME':
        return 'from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/10'
      case 'SEASONAL':
        return 'from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/10'
      default:
        return 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/10'
    }
  }

  return (
    <section className={`py-12 md:py-16 bg-gradient-to-br ${getBackgroundGradient()} dark-transition ${className}`}>
      <div className="container mx-auto px-4">
        {/* Deal Header */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* Left: Deal Info */}
              <div className="flex-1 text-center lg:text-left space-y-4">
                {/* Badge */}
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full shadow-md">
                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${getDealBadgeColor()}`}>
                    {getDealIcon()}
                    <span className="font-semibold text-sm">{getDealText()}</span>
                  </div>
                </div>

                {/* Title */}
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  {deal.title}
                </h2>

                {/* Description */}
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                  {deal.description}
                </p>

                {/* BOGO Helper Text */}
                {deal.type === 'BOGO' && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    Add {deal.buyQuantity! + deal.getQuantity!} items to cart to avail offer
                  </p>
                )}
              </div>

              {/* Right: Countdown or CTA */}
              <div className="flex-shrink-0 flex flex-col items-center space-y-4">
                {/* Countdown Timer */}
                {showCountdown && (
                  <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                    <Clock className="text-orange-500" size={24} />
                    <div className="flex space-x-2">
                      <div className="text-center">
                        <div className="text-2xl font-mono font-bold text-gray-900 dark:text-white">
                          {String(timeLeft.hours).padStart(2, '0')}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Hours</div>
                      </div>
                      <div className="text-2xl text-gray-400">:</div>
                      <div className="text-center">
                        <div className="text-2xl font-mono font-bold text-gray-900 dark:text-white">
                          {String(timeLeft.minutes).padStart(2, '0')}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Mins</div>
                      </div>
                      <div className="text-2xl text-gray-400">:</div>
                      <div className="text-center">
                        <div className="text-2xl font-mono font-bold text-gray-900 dark:text-white">
                          {String(timeLeft.seconds).padStart(2, '0')}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Secs</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* View All Button */}
                <Link
                  href="/deals"
                  className="inline-flex items-center px-8 py-3 bg-bookStore-blue hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group"
                >
                  View All Deals
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Deal Books Grid */}
        {/* Books are only shown on the deals page, not on homepage */}
      </div>
    </section>
  )
}

export default DealSection
