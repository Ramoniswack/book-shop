'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Book } from '@/types/book'
import { ArrowRight } from 'lucide-react'

interface HeroSectionProps {
  featuredBooks: Book[]
}

// High-quality bookstore/library images from Unsplash
const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=3000&q=95&fit=crop', // Modern bookstore
  'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=3000&q=95&fit=crop', // Library interior
  'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=3000&q=95&fit=crop', // Bookstore shelves
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=3000&q=95&fit=crop', // Books aesthetic
  'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=3000&q=95&fit=crop', // Open books
]

const HeroSection = ({ featuredBooks }: HeroSectionProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length)
    }, 3000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative h-[500px] md:h-[550px] overflow-hidden bg-gray-50 dark:bg-gray-900 dark-transition">
      {/* Hero Image with Rotation */}
      <div className="absolute inset-0">
        {HERO_IMAGES.map((imageUrl, index) => (
          <div
            key={imageUrl}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={imageUrl}
              alt="Bookstore interior"
              fill
              className="object-cover"
              priority={index === 0}
              quality={95}
            />
          </div>
        ))}

        {/* Left-to-Right Gradient Overlay: Blurred left → Clear right */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/60 to-transparent dark:from-gray-900/95 dark:via-gray-900/60 dark:to-transparent backdrop-blur-[2px] md:backdrop-blur-[3px]" 
             style={{
               maskImage: 'linear-gradient(to right, black 0%, black 40%, transparent 70%)',
               WebkitMaskImage: 'linear-gradient(to right, black 0%, black 40%, transparent 70%)'
             }}
        />
        
        {/* Additional blur layer for left side */}
        <div className="absolute inset-0 backdrop-blur-xl bg-white/30 dark:bg-gray-900/30"
             style={{
               maskImage: 'linear-gradient(to right, black 0%, transparent 35%)',
               WebkitMaskImage: 'linear-gradient(to right, black 0%, transparent 35%)'
             }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center">
        <div className="grid md:grid-cols-2 gap-8 items-center w-full">
          {/* Left Content - Overlapping the blurred image */}
          <div className="space-y-5 md:space-y-6">
            {/* Stats Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-gray-200/50 dark:border-gray-700/50 dark-transition">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white dark:border-gray-800"></div>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white dark:border-gray-800"></div>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-white dark:border-gray-800"></div>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">35,000+ Happy Readers</span>
            </div>

            {/* Main Heading */}
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-900 dark:text-white dark-transition">
                Discover your next
                <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-bookStore-blue to-blue-600 dark:from-blue-400 dark:to-blue-500">
                  great read
                </span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed max-w-lg dark-transition">
              Nepal's largest online bookstore with over 35,000 books. From bestsellers to rare finds, we deliver knowledge to your doorstep.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link 
                href="/books" 
                className="group inline-flex items-center justify-center bg-bookStore-blue hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <span>Browse Books</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                href="/deals" 
                className="inline-flex items-center justify-center bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 border-2 border-gray-300 dark:border-gray-600 hover:border-bookStore-blue dark:hover:border-blue-400 dark-transition"
              >
                View Deals
              </Link>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-4 pt-1">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center dark-transition">
                  <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Free Shipping</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center dark-transition">
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Curated Selection</span>
              </div>
            </div>
          </div>

          {/* Right side - Clear image area (no content, just lets image show through) */}
          <div className="hidden md:block"></div>
        </div>
      </div>

      {/* Image Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {HERO_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentImageIndex 
                ? 'bg-bookStore-blue dark:bg-blue-400 w-8' 
                : 'bg-white/60 dark:bg-gray-600/60 w-1.5 hover:bg-white/80 dark:hover:bg-gray-500/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

export default HeroSection