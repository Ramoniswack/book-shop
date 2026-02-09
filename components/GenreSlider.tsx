'use client'

import { useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Navigation } from 'swiper/modules'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import type { Swiper as SwiperType } from 'swiper'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'

type Genre = {
  id: string
  name: string
  slug: string
  image?: string
  bookCount?: number
  description?: string
}

interface GenreSliderProps {
  genres: Genre[]
}

const GenreSlider = ({ genres }: GenreSliderProps) => {
  const swiperRef = useRef<SwiperType | null>(null)
  const [isBeginning, setIsBeginning] = useState(true)
  const [isEnd, setIsEnd] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 })
  const dragThreshold = 5 // pixels

  const handleSlideChange = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning)
    setIsEnd(swiper.isEnd)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStartPos({ x: e.clientX, y: e.clientY })
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const deltaX = Math.abs(e.clientX - dragStartPos.x)
    const deltaY = Math.abs(e.clientY - dragStartPos.y)
    
    if (deltaX > dragThreshold || deltaY > dragThreshold) {
      setIsDragging(true)
    }
  }

  const handleClick = (e: React.MouseEvent, slug: string) => {
    if (isDragging) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  return (
    <div className="genre-slider-wrapper relative group">
      {/* Left Arrow */}
      {!isBeginning && (
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 -ml-5"
          aria-label="Previous genres"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      )}

      {/* Right Arrow */}
      {!isEnd && (
        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 -mr-5"
          aria-label="Next genres"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      )}

      <Swiper
        modules={[FreeMode, Navigation]}
        spaceBetween={8}
        slidesPerView="auto"
        freeMode={true}
        grabCursor={true}
        onSwiper={(swiper) => {
          swiperRef.current = swiper
          setIsBeginning(swiper.isBeginning)
          setIsEnd(swiper.isEnd)
        }}
        onSlideChange={handleSlideChange}
        className="genre-swiper-refined"
        breakpoints={{
          320: {
            spaceBetween: 6,
          },
          640: {
            spaceBetween: 8,
          },
          1024: {
            spaceBetween: 8,
          },
        }}
      >
        {genres.map((genre) => (
          <SwiperSlide key={genre.id} className="!w-auto">
            <Link
              href={`/genre/${genre.slug}`}
              onClick={(e) => handleClick(e, genre.slug)}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              className="block genre-card-link"
            >
              <div className="relative w-[240px] sm:w-[260px] md:w-[280px] lg:w-[300px] h-[280px] sm:h-[300px] md:h-[320px] lg:h-[340px] overflow-hidden group/card cursor-grab active:cursor-grabbing shadow-md hover:shadow-xl transition-all duration-300">
                {/* Genre Image */}
                {genre.image ? (
                  <Image
                    src={genre.image}
                    alt={genre.name}
                    fill
                    className="object-cover group-hover/card:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 240px, (max-width: 768px) 260px, (max-width: 1024px) 280px, 300px"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 dark:from-blue-600 dark:via-blue-700 dark:to-blue-800" />
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Genre Name Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                  <h3 className="text-white font-bold text-lg md:text-xl mb-1 drop-shadow-lg cursor-pointer hover:text-blue-200 transition-colors">
                    {genre.name}
                  </h3>
                  {genre.bookCount !== undefined && (
                    <p className="text-white/90 text-sm drop-shadow-md">
                      {genre.bookCount.toLocaleString()} books
                    </p>
                  )}
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 border-2 border-transparent group-hover/card:border-blue-400 dark:group-hover/card:border-blue-500 transition-colors duration-300 pointer-events-none" />
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default GenreSlider
