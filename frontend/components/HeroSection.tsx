'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Book } from '@/types/book'
import { useCurrency } from '@/contexts/CurrencyContext'

interface HeroSectionProps {
  featuredBooks: Book[]
}

const HeroSection = ({ featuredBooks }: HeroSectionProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { formatPrice } = useCurrency()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % featuredBooks.length)
    }, 3000) // Change image every 3 seconds

    return () => clearInterval(timer)
  }, [featuredBooks.length])

  const currentBook = featuredBooks[currentImageIndex]

  if (!currentBook) return null

  return (
    <section className="px-6 py-20 md:py-32 bg-white dark:bg-gray-900 dark-transition">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-10 md:space-y-0">
        {/* Text Content */}
        <div className="md:w-1/2">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-gray-900 dark:text-gray-100 dark-transition">
            Nepal's Largest <br className="hidden md:block" />
            <span className="text-booksmandala-blue dark:text-blue-400">Online Bookstore</span>
          </h1>
          <p className="text-lg mb-8 text-gray-600 dark:text-gray-300 dark-transition">
            Over 35,000 books available with worldwide shipping. From bestselling fiction to academic texts, find the perfect book for every reader.
          </p>
          <Link 
            href="/books" 
            className="bg-booksmandala-blue hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-200 inline-block"
          >
            Shop Now
          </Link>
        </div>

        {/* Hero Image - Rotating Featured Books */}
        <div className="md:w-1/2 relative">
          <Link href={`/book/${currentBook.id}`} className="block">
            <div className="relative group cursor-pointer overflow-hidden rounded-lg h-80 md:h-96">
              {featuredBooks.map((book, index) => (
                <div
                  key={book.id}
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                    index === currentImageIndex 
                      ? 'opacity-100 scale-100' 
                      : 'opacity-0 scale-105'
                  }`}
                >
                  <Image
                    src={book.image}
                    alt={book.title}
                    fill
                    className="rounded-lg shadow-lg object-cover group-hover:scale-105 transition-transform duration-300"
                    priority={index === 0}
                  />
                  
                  {/* Book Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">{book.title}</h3>
                    <p className="text-white/80 text-xs mb-2">by {book.author}</p>
                    <p className="text-white font-bold text-sm">{formatPrice(book.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Link>

          {/* Image Indicators */}
          <div className="flex justify-center mt-4 space-x-2">
            {featuredBooks.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentImageIndex 
                    ? 'bg-booksmandala-blue dark:bg-blue-400 scale-125' 
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection