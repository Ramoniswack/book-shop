'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Recycle, DollarSign, Leaf, CheckCircle } from 'lucide-react'

// High-quality vintage/used books images from Unsplash
const USED_BOOKS_IMAGES = [
  'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=3000&q=95&fit=crop', // Vintage bookstore
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=3000&q=95&fit=crop', // Stack of books
  'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=3000&q=95&fit=crop', // Old books
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=3000&q=95&fit=crop', // Books collection
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=3000&q=95&fit=crop', // Vintage books aesthetic
]

const UsedBooksBanner = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % USED_BOOKS_IMAGES.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative h-[400px] md:h-[450px] overflow-hidden bg-gradient-to-r from-green-600 to-teal-600">
      {/* Background Images with Rotation */}
      <div className="absolute inset-0">
        {USED_BOOKS_IMAGES.map((imageUrl, index) => (
          <div
            key={imageUrl}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={imageUrl}
              alt="Used books banner"
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
              <Recycle size={40} className="text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Quality Used Books
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Discover amazing books at unbeatable prices. All our used books are carefully inspected for quality and condition.
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
              <DollarSign className="text-yellow-300" size={24} />
              <span className="text-white font-semibold">Save Money</span>
            </div>
            
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
              <Leaf className="text-green-300" size={24} />
              <span className="text-white font-semibold">Eco-Friendly</span>
            </div>
            
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
              <CheckCircle className="text-blue-300" size={24} />
              <span className="text-white font-semibold">Quality Assured</span>
            </div>
          </div>
        </div>
      </div>

      {/* Image Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {USED_BOOKS_IMAGES.map((_, index) => (
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

export default UsedBooksBanner
