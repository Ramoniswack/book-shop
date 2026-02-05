'use client'

import Link from 'next/link'
import { Tag, Percent, BookOpen, Recycle, Sparkles, TrendingUp, Gift } from 'lucide-react'

export const DealsPromoBanner = () => (
  <section className="py-16 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 dark:from-gray-800 dark:via-gray-900 dark:to-black relative overflow-hidden dark-transition">
    {/* Animated background elements */}
    <div className="absolute inset-0">
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 dark:bg-white/5 rounded-full animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 dark:bg-white/3 rounded-full animate-bounce"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 dark:bg-white/5 rounded-full animate-ping"></div>
    </div>
    
    <div className="container mx-auto px-4 relative z-10">
      <div className="flex flex-col lg:flex-row items-center justify-between text-white">
        <div className="text-center lg:text-left mb-8 lg:mb-0 lg:w-2/3">
          <div className="flex items-center justify-center lg:justify-start mb-4">
            <div className="w-16 h-16 bg-white/20 dark:bg-white/10 rounded-full flex items-center justify-center mr-4 animate-spin-slow">
              <Tag size={32} />
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-2">Limited Time Deals</h3>
              <p className="text-xl opacity-90">Flash sales ending soon!</p>
            </div>
          </div>
          <p className="text-2xl font-semibold mb-4">Up to 50% OFF on bestselling books</p>
          <p className="text-lg opacity-80">Don't miss out on these incredible savings. Offer valid while stocks last.</p>
        </div>
        <div className="lg:w-1/3 text-center">
          <Link 
            href="/deals" 
            className="inline-block bg-white dark:bg-gray-100 text-gray-800 dark:text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 dark:hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            Shop Deals Now
            <Sparkles className="inline ml-2" size={20} />
          </Link>
        </div>
      </div>
    </div>
  </section>
)

export const UsedBooksPromoBanner = () => (
  <section className="py-16 bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 dark:from-slate-700 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden dark-transition">
    {/* Animated background elements */}
    <div className="absolute inset-0">
      <div className="absolute top-20 right-20 w-24 h-24 bg-white/10 dark:bg-white/5 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 bg-white/5 dark:bg-white/3 rounded-full animate-bounce"></div>
      <div className="absolute top-1/3 right-1/3 w-12 h-12 bg-white/10 dark:bg-white/5 rounded-full animate-ping"></div>
    </div>
    
    <div className="container mx-auto px-4 relative z-10">
      <div className="flex flex-col lg:flex-row items-center justify-between text-white">
        <div className="flex items-center space-x-6 mb-8 lg:mb-0 lg:w-2/3">
          <div className="w-20 h-20 bg-white/20 dark:bg-white/10 rounded-full flex items-center justify-center animate-bounce">
            <Recycle size={40} />
          </div>
          <div className="text-center lg:text-left">
            <h3 className="text-4xl font-bold mb-2">Used Books Collection</h3>
            <p className="text-xl opacity-90 mb-2">Quality pre-owned books at amazing prices</p>
            <p className="text-lg opacity-80">Eco-friendly reading with up to 60% savings</p>
          </div>
        </div>
        <div className="lg:w-1/3 text-center">
          <Link 
            href="/used-books" 
            className="inline-block bg-white dark:bg-gray-100 text-slate-700 dark:text-slate-800 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 dark:hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            Browse Used Books
            <BookOpen className="inline ml-2" size={20} />
          </Link>
        </div>
      </div>
    </div>
  </section>
)

export const RecommendationBanner = () => (
  <section className="py-16 bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden dark-transition">
    {/* Animated background elements */}
    <div className="absolute inset-0">
      <div className="absolute top-16 left-16 w-28 h-28 bg-white/10 dark:bg-white/5 rounded-full animate-pulse"></div>
      <div className="absolute bottom-16 right-16 w-36 h-36 bg-white/5 dark:bg-white/3 rounded-full animate-bounce"></div>
      <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-white/10 dark:bg-white/5 rounded-full animate-ping"></div>
    </div>
    
    <div className="container mx-auto px-4 text-center text-white relative z-10">
      <div className="max-w-4xl mx-auto">
        <div className="w-24 h-24 bg-white/20 dark:bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <TrendingUp size={48} />
        </div>
        <h3 className="text-4xl font-bold mb-4">Discover Your Next Favorite Book</h3>
        <p className="text-xl opacity-90 mb-6">
          Get personalized book recommendations based on trending titles and reader preferences
        </p>
        <p className="text-lg opacity-80 mb-8">
          Join thousands of readers who've found their perfect match through our recommendation system
        </p>
        <Link
          href="/recommendations"
          className="inline-block bg-white dark:bg-gray-100 text-gray-700 dark:text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 dark:hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-2xl"
        >
          Get Recommendations
          <Sparkles className="inline ml-2" size={20} />
        </Link>
      </div>
    </div>
  </section>
)

export const SpecialOffersBanner = () => (
  <section className="py-12 bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 dark:from-gray-600 dark:via-gray-700 dark:to-gray-800 relative overflow-hidden dark-transition">
    {/* Animated background elements */}
    <div className="absolute inset-0">
      <div className="absolute top-4 left-10 w-16 h-16 bg-white/10 dark:bg-white/5 rounded-full animate-bounce"></div>
      <div className="absolute bottom-4 right-10 w-20 h-20 bg-white/5 dark:bg-white/3 rounded-full animate-pulse"></div>
    </div>
    
    <div className="container mx-auto px-4 relative z-10">
      <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 text-center md:text-left">
          <div className="flex items-center space-x-3 bg-white/20 dark:bg-white/10 px-6 py-3 rounded-full">
            <Gift className="text-white" size={24} />
            <span className="font-bold text-white text-lg">Buy 2 Get 1 Free on Selected Books</span>
          </div>
          <div className="flex items-center space-x-3 bg-white/20 dark:bg-white/10 px-6 py-3 rounded-full">
            <Percent className="text-white" size={24} />
            <span className="font-bold text-white text-lg">Free Shipping on Orders Over Rs. 2000</span>
          </div>
        </div>
        
        <div className="text-center">
          <Link 
            href="/deals#bogo-deals" 
            className="inline-block bg-white dark:bg-gray-100 text-gray-700 dark:text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 dark:hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            Shop BOGO Deals
            <Gift className="inline ml-2" size={20} />
          </Link>
        </div>
      </div>
    </div>
  </section>
)