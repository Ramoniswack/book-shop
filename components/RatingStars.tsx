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
  const partialStar = rating % 1
  const emptyStars = maxRating - Math.ceil(rating)

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center">
        {/* Full stars */}
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            size={size}
            className="text-yellow-400 fill-yellow-400"
          />
        ))}
        
        {/* Partial star */}
        {partialStar > 0 && (
          <div className="relative inline-block" style={{ width: size, height: size }}>
            {/* Background empty star */}
            <Star size={size} className="text-gray-300 dark:text-gray-600 absolute top-0 left-0" />
            {/* Foreground filled portion */}
            <div 
              className="absolute top-0 left-0 overflow-hidden" 
              style={{ width: `${partialStar * 100}%` }}
            >
              <Star size={size} className="text-yellow-400 fill-yellow-400" />
            </div>
          </div>
        )}
        
        {/* Empty stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <Star
            key={`empty-${i}`}
            size={size}
            className="text-gray-300 dark:text-gray-600"
          />
        ))}
      </div>
      
      {showNumber && (
        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          {rating.toFixed(1)}
        </span>
      )}
      
      {reviewCount !== undefined && (
        <span className="text-[10px] text-gray-500 dark:text-gray-400">
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  )
}

export default RatingStars