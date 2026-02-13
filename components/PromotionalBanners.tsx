'use client'

import Link from 'next/link'
import { Tag, Percent, BookOpen, Recycle, Sparkles, TrendingUp, Gift, Leaf, Search, Clock, Flame, Calendar } from 'lucide-react'
import { useState, useEffect } from 'react'

// Dynamic BOGO Banner - Uses actual deal data
interface BOGOBannerProps {
  deal?: {
    _id: string
    title: string
    description: string
    type: string
    discountPercentage: number
    buyQuantity?: number
    getQuantity?: number
    applicableBooks: any[]
  }
}

export const DynamicBOGOBanner = ({ deal }: BOGOBannerProps) => {
  if (!deal) return null

  return (
    <section className="relative overflow-visible py-12 md:py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center max-w-7xl mx-auto">
          {/* Left: 60% Text Content */}
          <div className="lg:col-span-3 space-y-6 z-20">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-bookStore-blue dark:text-blue-400 font-bold mb-3">
                Limited Offer
              </p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight leading-[1.1]">
                {deal.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-base max-w-xl leading-relaxed">
                {deal.description}
              </p>
            </div>

            {/* Elegant Icon Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <Gift className="text-bookStore-blue dark:text-blue-400" size={20} strokeWidth={1.5} />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    Buy {deal.buyQuantity} Get {deal.getQuantity}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Selected Titles</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <Percent className="text-bookStore-blue dark:text-blue-400" size={20} strokeWidth={1.5} />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {deal.applicableBooks?.length || 0} Books
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">In This Deal</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link 
                href="/deals#bogo-deals" 
                className="inline-flex items-center px-8 py-3 bg-bookStore-blue hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group"
              >
                Shop BOGO Deals
                <Sparkles className="ml-2 group-hover:rotate-12 transition-transform" size={18} />
              </Link>
            </div>
          </div>

          {/* Right: 40% Visual Column with "Extra" 3D Logic */}
          <div className="lg:col-span-2 relative flex justify-center items-center h-[280px] md:h-[320px]">
            {/* Layer 1: The Decorative Circle (Behind) */}
            <div className="absolute w-[200px] h-[200px] md:w-[240px] md:h-[240px] rounded-full bg-gradient-to-tr from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10 z-0 shadow-inner" />
            
            {/* Layer 2: The Floating Image (Breaking out) */}
            <div className="relative z-10 animate-float">
              <div className="w-[200px] md:w-[240px] h-[250px] md:h-[300px] relative">
                <img
                  src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=500&fit=crop&q=90"
                  alt="Book stack"
                  className="w-full h-full object-cover drop-shadow-[0_25px_40px_rgba(0,0,0,0.25)] transform -rotate-3 hover:rotate-0 transition-all duration-700 ease-out rounded-lg"
                />
              </div>
              
              {/* Layer 3: Accent Element - Positioned relative to image */}
              <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 w-12 h-12 md:w-14 md:h-14 bg-bookStore-blue dark:bg-blue-600 rounded-full flex items-center justify-center shadow-xl z-20 animate-bounce-slow">
                <span className="font-serif italic font-bold text-white text-xs md:text-sm">Free</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Dynamic Flash Sale Banner - Uses actual deal data
interface FlashSaleBannerProps {
  deal?: {
    _id: string
    title: string
    description: string
    type: string
    discountPercentage: number
    endDate: string
    applicableBooks: any[]
  }
}

export const DynamicFlashSaleBanner = ({ deal }: FlashSaleBannerProps) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [showCountdown, setShowCountdown] = useState(false)

  useEffect(() => {
    if (!deal) return

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
  }, [deal])

  if (!deal) return null

  const getDealIcon = () => {
    switch (deal.type) {
      case 'FLASH_SALE':
        return <Flame className="w-5 h-5" />
      case 'LIMITED_TIME':
        return <Clock className="w-5 h-5" />
      case 'SEASONAL':
        return <Calendar className="w-5 h-5" />
      default:
        return <Tag className="w-5 h-5" />
    }
  }

  return (
    <section className="py-16 bg-white dark:bg-gray-900 dark-transition">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Card Style with Thin Border */}
          <div className="relative border border-gray-200 dark:border-gray-700 rounded-2xl p-12 overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
            {/* Flash Sale Badge */}
            <div className="absolute top-6 right-6">
              <div className="flex items-center space-x-2 px-4 py-2 bg-coral-500 dark:bg-coral-600 text-white text-sm font-semibold rounded-full shadow-lg">
                {getDealIcon()}
                <span>{deal.type.replace('_', ' ')}</span>
              </div>
            </div>

            {/* Large Background Discount */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-[200px] font-bold text-gray-900 dark:text-white opacity-5 select-none">
                {deal.discountPercentage}%
              </span>
            </div>

            <div className="relative z-10 text-center space-y-8">
              <div>
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                  {deal.title}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {deal.description}
                </p>
              </div>

              {/* Minimalist Countdown Timer */}
              {showCountdown && (
                <div className="flex justify-center items-center space-x-4">
                  <div className="text-center">
                    <div className="text-4xl font-mono font-bold text-gray-900 dark:text-white">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Hours</div>
                  </div>
                  <div className="text-3xl text-gray-400">:</div>
                  <div className="text-center">
                    <div className="text-4xl font-mono font-bold text-gray-900 dark:text-white">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Minutes</div>
                  </div>
                  <div className="text-3xl text-gray-400">:</div>
                  <div className="text-center">
                    <div className="text-4xl font-mono font-bold text-gray-900 dark:text-white">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Seconds</div>
                  </div>
                </div>
              )}

              {/* Book Count */}
              <div className="text-gray-600 dark:text-gray-400">
                <span className="font-semibold">{deal.applicableBooks?.length || 0} books</span> in this deal
              </div>

              {/* Solid Dark Button */}
              <div>
                <Link 
                  href="/deals" 
                  className="inline-flex items-center px-10 py-4 bg-bookStore-blue dark:bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 dark:hover:bg-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Shop Deals Now
                  <Tag className="ml-2" size={20} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Keep the recommendation banner for deals page
export const RecommendationBanner = () => (
  <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black dark-transition">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        {/* Horizontal CTA Strip */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left: Text Content */}
            <div className="flex-1 text-center lg:text-left space-y-4">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Not sure what to read next?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Get personalized book recommendations based on your taste
              </p>
            </div>

            {/* Right: Action */}
            <div className="flex-shrink-0 flex flex-col items-center space-y-6">
              {/* 3D Illustration */}
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center shadow-lg">
                  <Search className="text-purple-600 dark:text-purple-400" size={40} strokeWidth={1.5} />
                  <Sparkles className="absolute -top-2 -right-2 text-yellow-400" size={20} />
                </div>
              </div>

              {/* Start Quiz Button */}
              <Link 
                href="/recommendations" 
                className="inline-flex items-center px-8 py-3 bg-bookStore-blue dark:bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 dark:hover:bg-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Start the Quiz
                <TrendingUp className="ml-2" size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
)
