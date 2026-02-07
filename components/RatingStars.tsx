import { Star } from 'lucide-react'

interface RatingStarsProps {
  rating: number
  maxRating?: number
  size?: number
  showNumber?: boolean
  reviewCount?: number
  className?: string
}

const RatingStars = ({ 
  rating, 
  maxRating = 5, 
  size = 16, 
  showNumber = false,
  reviewCount,
  className = '' 
}: RatingStarsProps) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0
  const emptyStars = maxRating - Math.ceil(rating)

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <div className="flex items-center">
        {/* Full stars */}
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            size={size}
            className="text-yellow-400 fill-current"
          />
        ))}
        
        {/* Half star */}
        {hasHalfStar && (
          <div className="relative">
            <Star size={size} className="text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star size={size} className="text-yellow-400 fill-current" />
            </div>
          </div>
        )}
        
        {/* Empty stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <Star
            key={`empty-${i}`}
            size={size}
            className="text-gray-300"
          />
        ))}
      </div>
      
      {showNumber && (
        <span className="text-sm text-gray-600 font-medium">
          {rating.toFixed(1)}
        </span>
      )}
      
      {reviewCount !== undefined && (
        <span className="text-sm text-gray-500">
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  )
}

export default RatingStars