'use client'

import { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/autoplay'

interface HeroSlide {
  _id: string
  image: string
  displayOrder: number
  isActive: boolean
}

// Fallback images if no slides from API
const FALLBACK_SLIDES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1920&q=80&fit=crop',
    alt: 'Bookstore collection 1'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1920&q=80&fit=crop',
    alt: 'Bookstore collection 2'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1920&q=80&fit=crop',
    alt: 'Bookstore collection 3'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920&q=80&fit=crop',
    alt: 'Bookstore collection 4'
  }
]

const HeroSlider = () => {
  const swiperRef = useRef<SwiperType | null>(null)
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSlides()
  }, [])

  const fetchSlides = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hero-slides/active`)
      const data = await response.json()
      
      console.log('Hero slides response:', data)
      
      if (data.success && data.data.length >= 2) {
        console.log('Setting slides:', data.data)
        setSlides(data.data)
      } else {
        console.log('Not enough slides or failed, using fallback')
      }
    } catch (error) {
      console.error('Error fetching hero slides:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Ensure autoplay starts on mount and after slides change
    const timer = setTimeout(() => {
      if (swiperRef.current?.autoplay) {
        swiperRef.current.autoplay.start()
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [slides])

  // Use API slides if available, otherwise use fallback
  const displaySlides = slides.length >= 2 ? slides : FALLBACK_SLIDES

  if (loading) {
    return (
      <section className="py-8 md:py-12 bg-white dark:bg-gray-900 dark-transition">
        <div className="container mx-auto px-4">
          <div className="h-[250px] md:h-[350px] bg-gray-200 dark:bg-gray-800 rounded-[20px] animate-pulse"></div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 md:py-12 bg-white dark:bg-gray-900 dark-transition">
      <div className="container mx-auto px-4">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={10}
          slidesPerView={1}
          loop={true}
          loopedSlides={displaySlides.length}
          speed={1500}
          grabCursor={true}
          centeredSlides={false}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: false
          }}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 10
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 10
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 10
            }
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper
            // Force autoplay to start
            setTimeout(() => {
              swiper.autoplay?.start()
            }, 100)
          }}
          onSlideChange={() => {
            // Ensure autoplay continues
            if (swiperRef.current?.autoplay) {
              swiperRef.current.autoplay.start()
            }
          }}
          className="hero-slider"
        >
          {displaySlides.map((slide: any, index: number) => {
            const imageUrl = slide.image.startsWith('http')
              ? slide.image
              : `http://localhost:5000/${slide.image.replace(/\\/g, '/')}`
            
            return (
              <SwiperSlide key={`hero-slide-${index}`}>
                <div className="relative overflow-hidden rounded-[20px] group">
                  <img
                    src={imageUrl}
                    alt={slide.alt || `Hero slide ${index + 1}`}
                    className="w-full h-[250px] md:h-[350px] object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      console.error('Image failed to load:', imageUrl)
                      e.currentTarget.src = FALLBACK_SLIDES[0].image
                    }}
                  />
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>

      <style jsx global>{`
        .hero-slider {
          width: 100%;
          height: auto;
        }

        .hero-slider .swiper-wrapper {
          transition-timing-function: linear;
        }

        .hero-slider .swiper-slide {
          height: auto;
        }
      `}</style>
    </section>
  )
}

export default HeroSlider
