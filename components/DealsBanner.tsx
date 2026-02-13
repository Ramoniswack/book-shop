'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Tag, Zap, Gift } from 'lucide-react'

// High-quality deals/sale images from Unsplash
const DEALS_IMAGES = [
  'https://images.unsplash.com/photo-1607827448387-a67db1383b59?w=3000&q=95&fit=crop', // Sale tags
  'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=3000&q=95&fit=crop', // Shopping bags
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=3000&q=95&fit=crop', // Gift boxes
  'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=3000&q=95&fit=crop', // Books with coffee
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=3000&q=95&fit=crop', // Books stack
]

const DealsBanner = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % DEALS_IMAGES.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative h-[400px] md:h-[450px] overflow-hidden bg-gradient-to-r from-orange-600 to-red-600">
      {/* Background Images with Rotation */}
      <div className="absolute inset-0">
        {DEALS_IMAGES.map((imageUrl, index) => (
          <div
            key={imageUrl}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={imageUrl}
              alt="Deals banner"
              fill
              className="object-cover"
              priority={index === 0}
              quality={95}
            />
          </div>
        ))}

        {/* Gradient Overlay - Removed, only images now */}
        {/* Semi-transparent overlay for text readability */}
        <div className="absolute inset-0 bg-black/30 dark:bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="text-center w-full">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Tag size={40} className="text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Amazing Deals & Offers
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Discover incredible discounts on your favorite books. Limited time offers you don't want to miss!
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
              <Zap className="text-yellow-300" size={24} />
              <span className="text-white font-semibold">Flash Sales</span>
            </div>
            
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
              <Gift className="text-green-300" size={24} />
              <span className="text-white font-semibold">BOGO Offers</span>
            </div>
            
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
              <Tag className="text-blue-300" size={24} />
              <span className="text-white font-semibold">Up to 50% Off</span>
            </div>
          </div>
        </div>
      </div>

      {/* Image Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {DEALS_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentImageIndex 
                ? 'bg-white w-8' 
                : 'bg-white/40 w-1.5 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

export default DealsBanner
