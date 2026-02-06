'use client'

import Link from 'next/link'
import { Tag, Percent, BookOpen, Recycle, Sparkles, TrendingUp, Gift, Leaf, Search, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'

// 1. The Reader's Rewards - Refined 3D Break-out
export const SpecialOffersBanner = () => (
  <section className="relative overflow-visible py-12 md:py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center max-w-7xl mx-auto">
        {/* Left: 60% Text Content */}
        <div className="lg:col-span-3 space-y-6 z-20">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-booksmandala-blue dark:text-blue-400 font-bold mb-3">
              Limited Offer
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight leading-[1.1]">
              Buy 2, Get 1 on<br />Modern Classics
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-base max-w-xl leading-relaxed">
              Discover timeless stories and build your collection with our exclusive offer on carefully curated classics.
            </p>
          </div>

          {/* Elegant Icon Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <Gift className="text-booksmandala-blue dark:text-blue-400" size={20} strokeWidth={1.5} />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">Buy 2 Get 1</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Selected Titles</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <Percent className="text-booksmandala-blue dark:text-blue-400" size={20} strokeWidth={1.5} />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">Free Shipping</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Over Rs. 2000</p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Link 
              href="/deals#bogo-deals" 
              className="inline-flex items-center px-8 py-3 bg-booksmandala-blue hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group"
            >
              Shop BOGO Deals
              <Sparkles className="ml-2 group-hover:rotate-12 transition-transform" size={18} />
            </Link>
          </div>
        </div>

        {/* Right: 40% Visual Column with "Extra" 3D Logic */}
        <div className="lg:col-span-2 relative flex justify-center items-center h-[350px] md:h-[400px]">
          {/* Layer 1: The Decorative Circle (Behind) */}
          <div className="absolute w-[250px] h-[250px] md:w-[320px] md:h-[320px] rounded-full bg-gradient-to-tr from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10 z-0 shadow-inner" />
          
          {/* Layer 2: The Floating Image (Breaking out) */}
          <div className="relative z-10 animate-float">
            <img
              src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&h=700&fit=crop&q=80"
              alt="Book stack"
              className="w-[280px] md:w-[350px] max-w-none drop-shadow-[0_25px_40px_rgba(0,0,0,0.25)] transform -rotate-3 hover:rotate-0 transition-all duration-700 ease-out"
            />
            
            {/* Layer 3: Accent Element - Positioned relative to image */}
            <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6 w-14 h-14 md:w-16 md:h-16 bg-booksmandala-blue dark:bg-blue-600 rounded-full flex items-center justify-center shadow-xl z-20 animate-bounce-slow">
              <span className="font-serif italic font-bold text-white text-sm md:text-base">Free</span>
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
