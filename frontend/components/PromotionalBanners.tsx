'use client'

import Link from 'next/link'
import { Tag, Percent, BookOpen, Recycle, Sparkles, TrendingUp, Gift, Leaf, Search, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'

// 1. The Reader's Rewards - Minimalist Split Banner
export const SpecialOffersBanner = () => (
  <section className="py-20 bg-stone-50 dark:bg-gray-900 relative overflow-hidden dark-transition">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center max-w-7xl mx-auto">
        {/* Left: 60% Text Content */}
        <div className="lg:col-span-3 space-y-8">
          <div>
            <h2 className="font-serif text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              The Reader's Rewards
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-xl">
              Exclusive benefits designed for book lovers who can't get enough
            </p>
          </div>

          {/* Elegant Icons */}
          <div className="flex flex-col sm:flex-row gap-8">
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 rounded-full bg-sage-100 dark:bg-sage-900/20 flex items-center justify-center flex-shrink-0">
                <Gift className="text-sage-600 dark:text-sage-400" size={20} strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Buy 2 Get 1 Free</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">On selected titles</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 rounded-full bg-sage-100 dark:bg-sage-900/20 flex items-center justify-center flex-shrink-0">
                <Percent className="text-sage-600 dark:text-sage-400" size={20} strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Free Shipping</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Orders over Rs. 2000</p>
              </div>
            </div>
          </div>

          {/* Ghost Button */}
          <div>
            <Link 
              href="/deals#bogo-deals" 
              className="inline-flex items-center px-8 py-3 border-2 border-booksmandala-blue dark:border-blue-400 text-booksmandala-blue dark:text-blue-400 font-medium rounded-lg hover:bg-booksmandala-blue hover:text-white dark:hover:bg-blue-400 dark:hover:text-white transition-all duration-300 group"
            >
              Shop BOGO Deals
              <Gift className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
            </Link>
          </div>
        </div>

        {/* Right: 40% Visual */}
        <div className="lg:col-span-2 relative">
          <div className="relative w-full h-80 flex items-center justify-center">
            {/* Aesthetic Book Stack Illustration */}
            <div className="absolute inset-0 bg-gradient-to-br from-sage-100 to-sand-100 dark:from-sage-900/20 dark:to-sand-900/20 rounded-2xl transform rotate-3"></div>
            <div className="relative z-10 text-center">
              <div className="w-48 h-48 mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex items-center justify-center transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                <BookOpen className="text-sage-600 dark:text-sage-400" size={80} strokeWidth={1} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
)

// 2. Used Books Collection - Organic/Eco-Minimal
export const UsedBooksPromoBanner = () => (
  <section className="py-24 bg-gradient-to-br from-sage-50 via-white to-sage-50 dark:from-gray-900 dark:via-black dark:to-gray-900 relative overflow-hidden dark-transition">
    {/* Subtle Paper Grain Texture */}
    <div className="absolute inset-0 opacity-5 dark:opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.4\'/%3E%3C/svg%3E")' }}></div>
    
    {/* Leaf Watermark */}
    <div className="absolute top-10 right-10 opacity-5 dark:opacity-10">
      <Leaf size={200} className="text-sage-600" strokeWidth={0.5} />
    </div>

    <div className="container mx-auto px-4 relative z-10">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Eco Tag */}
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-sage-100 dark:bg-sage-900/30 rounded-full">
          <Leaf className="text-sage-600 dark:text-sage-400" size={16} />
          <span className="text-sm font-medium text-sage-700 dark:text-sage-300">Eco-Friendly Reading</span>
        </div>

        {/* Serif Headline */}
        <h2 className="font-serif text-5xl md:text-7xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
          Give Stories a<br />Second Home
        </h2>

        {/* Short Subtext */}
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Quality pre-owned books at up to 60% off, giving literature a new life
        </p>

        {/* Deep Forest Green Button */}
        <div className="pt-4">
          <Link 
            href="/used-books" 
            className="inline-flex items-center px-10 py-4 bg-booksmandala-blue dark:bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 dark:hover:bg-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Browse Used Books
            <Recycle className="ml-2" size={20} />
          </Link>
        </div>
      </div>
    </div>
  </section>
)

// 3. Limited Time Deals - Elegant Urgency
export const DealsPromoBanner = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 14, seconds: 55 })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-16 bg-white dark:bg-gray-900 dark-transition">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Card Style with Thin Border */}
          <div className="relative border border-gray-200 dark:border-gray-700 rounded-2xl p-12 overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
            {/* Flash Sale Badge */}
            <div className="absolute top-6 right-6">
              <div className="px-4 py-2 bg-coral-500 dark:bg-coral-600 text-white text-sm font-semibold rounded-full shadow-lg">
                Flash Sale
              </div>
            </div>

            {/* Large Background Discount */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-[200px] font-bold text-gray-900 dark:text-white opacity-5 select-none">
                40%
              </span>
            </div>

            <div className="relative z-10 text-center space-y-8">
              <div>
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                  Limited Time Deals
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Flash sales ending soon – don't miss out
                </p>
              </div>

              {/* Minimalist Countdown Timer */}
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

              {/* Solid Dark Button */}
              <div>
                <Link 
                  href="/deals" 
                  className="inline-flex items-center px-10 py-4 bg-booksmandala-blue dark:bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 dark:hover:bg-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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

// 4. Get Recommendations - Personalized Utility
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
                className="inline-flex items-center px-8 py-3 bg-booksmandala-blue dark:bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 dark:hover:bg-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
