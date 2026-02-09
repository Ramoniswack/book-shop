'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Navigation } from 'swiper/modules'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Author } from '@/types/book'
import type { Swiper as SwiperType } from 'swiper'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'

interface BestsellingAuthorsProps {
  authors?: Author[]
  className?: string
}

const BestsellingAuthors = ({ authors, className = '' }: BestsellingAuthorsProps) => {
  const swiperRef = useRef<SwiperType | null>(null)
  const [isBeginning, setIsBeginning] = useState(true)
  const [isEnd, setIsEnd] = useState(false)
  const dragStartPosRef = useRef({ x: 0, y: 0 })
  const isDraggingRef = useRef(false)
  const dragThreshold = 5 // pixels

  // Default authors data with real images
  const defaultAuthors: Author[] = [
    {
      id: '1',
      name: 'Fyodor Dostoyevsky',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      bookCount: 45,
      description: 'Russian novelist and philosopher'
    },
    {
      id: '2', 
      name: 'Buddhisagar',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      bookCount: 23,
      description: 'Nepali author'
    },
    {
      id: '3',
      name: 'Robert Greene',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
      bookCount: 12,
      description: 'American author'
    },
    {
      id: '4',
      name: 'A.C. Bhaktivedanta',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
      bookCount: 67,
      description: 'Spiritual teacher'
    },
    {
      id: '5',
      name: 'Franz Kafka',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
      bookCount: 34,
      description: 'Czech writer'
    },
    {
      id: '6',
      name: 'Subin Bhattarai',
      image: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face',
      bookCount: 18,
      description: 'Nepali novelist'
    },
    {
      id: '7',
      name: 'Colleen Hoover',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      bookCount: 29,
      description: 'American author'
    },
    {
      id: '8',
      name: 'Haruki Murakami',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      bookCount: 41,
      description: 'Japanese writer'
    },
    {
      id: '9',
      name: 'Morgan Housel',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      bookCount: 8,
      description: 'Financial writer'
    }
  ]

  const displayAuthors = authors || defaultAuthors

  const handleSlideChange = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning)
    setIsEnd(swiper.isEnd)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    dragStartPosRef.current = { x: e.clientX, y: e.clientY }
    isDraggingRef.current = false
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const deltaX = Math.abs(e.clientX - dragStartPosRef.current.x)
    const deltaY = Math.abs(e.clientY - dragStartPosRef.current.y)
    
    if (deltaX > dragThreshold || deltaY > dragThreshold) {
      isDraggingRef.current = true
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    if (isDraggingRef.current) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  return (
    <section className={`py-8 bg-gray-50 dark:bg-gray-900 dark-transition ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 dark-transition">
            Bestselling Authors
          </h2>
          <p className="text-gray-600 dark:text-gray-300 dark-transition">
            Discover Books by Bestselling Authors in Our Collection, Ranked by Popularity.
          </p>
        </div>
        
        <div className="author-slider-wrapper relative group">
          {/* Left Arrow */}
          {!isBeginning && (
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 -ml-5"
              aria-label="Previous authors"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          )}

          {/* Right Arrow */}
          {!isEnd && (
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 -mr-5"
              aria-label="Next authors"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          )}

          <Swiper
            modules={[FreeMode, Navigation]}
            spaceBetween={20}
            slidesPerView={7}
            freeMode={true}
            grabCursor={true}
            onSwiper={(swiper) => {
              swiperRef.current = swiper
              setIsBeginning(swiper.isBeginning)
              setIsEnd(swiper.isEnd)
            }}
            onSlideChange={handleSlideChange}
            className="author-swiper"
            breakpoints={{
              320: {
                slidesPerView: 3,
                spaceBetween: 12,
              },
              640: {
                slidesPerView: 4,
                spaceBetween: 16,
              },
              768: {
                slidesPerView: 5,
                spaceBetween: 18,
              },
              1024: {
                slidesPerView: 7,
                spaceBetween: 20,
              },
            }}
          >
            {displayAuthors.map((author) => (
              <SwiperSlide key={author.id}>
                <div
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  className="text-center group/author cursor-grab active:cursor-grabbing"
                >
                  <div className="relative mb-3">
                    <Image
                      src={author.image}
                      alt={author.name}
                      width={120}
                      height={120}
                      className="rounded-full mx-auto object-cover group-hover/author:scale-105 transition-transform duration-200 shadow-md"
                    />
                  </div>
                  <Link 
                    href={`/author/${author.id}`}
                    onClick={handleClick}
                  >
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm md:text-base group-hover/author:text-bookStore-blue dark:group-hover/author:text-blue-400 transition-colors line-clamp-1 dark-transition cursor-pointer">
                      {author.name}
                    </h3>
                  </Link>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1 dark-transition">
                    {author.bookCount} books
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  )
}

export default BestsellingAuthors