interface LoadingSkeletonProps {
  className?: string
  variant?: 'card' | 'text' | 'avatar' | 'button' | 'hero' | 'navbar'
  width?: string
  height?: string
  count?: number
}

const LoadingSkeleton = ({ 
  className = '', 
  variant = 'card',
  width,
  height,
  count = 1
}: LoadingSkeletonProps) => {
  const getSkeletonClasses = () => {
    const baseClasses = 'animate-pulse bg-gray-200 rounded'
    
    switch (variant) {
      case 'card':
        return `${baseClasses} w-full h-64`
      case 'text':
        return `${baseClasses} h-4 w-3/4`
      case 'avatar':
        return `${baseClasses} w-10 h-10 rounded-full`
      case 'button':
        return `${baseClasses} h-10 w-24`
      case 'hero':
        return `${baseClasses} w-full h-96 md:h-[500px]`
      case 'navbar':
        return `${baseClasses} w-full h-16`
      default:
        return baseClasses
    }
  }

  const skeletonStyle = {
    width: width || undefined,
    height: height || undefined,
  }

  if (count === 1) {
    return (
      <div 
        className={`${getSkeletonClasses()} ${className}`}
        style={skeletonStyle}
      />
    )
  }

  return (
    <div className={className}>
      {[...Array(count)].map((_, i) => (
        <div 
          key={i}
          className={`${getSkeletonClasses()} ${i > 0 ? 'mt-2' : ''}`}
          style={skeletonStyle}
        />
      ))}
    </div>
  )
}

// Page-specific skeleton components
export const HomePageSkeleton = () => (
  <div className="min-h-screen">
    {/* Navbar Skeleton */}
    <LoadingSkeleton variant="navbar" />
    
    {/* Hero Skeleton */}
    <LoadingSkeleton variant="hero" />
    
    {/* Search Section Skeleton */}
    <div className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <LoadingSkeleton height="32px" width="300px" className="mx-auto" />
          <LoadingSkeleton height="20px" width="400px" className="mx-auto" />
          <LoadingSkeleton height="48px" width="100%" />
        </div>
      </div>
    </div>
    
    {/* Categories Skeleton */}
    <div className="py-12">
      <div className="container mx-auto px-4">
        <LoadingSkeleton height="32px" width="200px" className="mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {[...Array(10)].map((_, i) => (
            <CategoryCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
    
    {/* Books Grid Skeleton */}
    <div className="py-8">
      <div className="container mx-auto px-4">
        <LoadingSkeleton height="32px" width="200px" className="mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(10)].map((_, i) => (
            <BookCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  </div>
)

export const BookCardSkeleton = () => (
  <div className="card animate-pulse">
    <div className="aspect-[2/3] bg-gray-200 rounded-t-lg"></div>
    <div className="p-3 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      <div className="flex items-center space-x-1">
        <div className="h-3 bg-gray-200 rounded w-16"></div>
        <div className="h-3 bg-gray-200 rounded w-8"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      <div className="h-8 bg-gray-200 rounded w-full"></div>
    </div>
  </div>
)

export const CategoryCardSkeleton = () => (
  <div className="card animate-pulse">
    <div className="h-32 md:h-40 bg-gray-200 rounded-t-lg"></div>
    <div className="p-4 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
)

export const BookDetailSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Image Skeleton */}
      <div className="aspect-[3/4] bg-gray-200 animate-pulse rounded-lg max-w-md mx-auto"></div>
      
      {/* Details Skeleton */}
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 animate-pulse rounded w-1/2"></div>
        </div>
        
        <div className="h-6 bg-gray-200 animate-pulse rounded w-1/3"></div>
        <div className="h-8 bg-gray-200 animate-pulse rounded w-1/4"></div>
        
        <div className="space-y-4">
          <div className="h-12 bg-gray-200 animate-pulse rounded w-full"></div>
          <div className="flex space-x-4">
            <div className="h-10 bg-gray-200 animate-pulse rounded flex-1"></div>
            <div className="h-10 bg-gray-200 animate-pulse rounded flex-1"></div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 animate-pulse rounded w-1/3"></div>
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 bg-gray-200 animate-pulse rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
)

export const AuthorsSkeleton = () => (
  <div className="py-8">
    <div className="container mx-auto px-4">
      <div className="text-center mb-8">
        <div className="h-8 bg-gray-200 animate-pulse rounded w-64 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-200 animate-pulse rounded w-96 mx-auto"></div>
      </div>
      
      <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-4">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="text-center">
            <div className="w-20 h-20 bg-gray-200 animate-pulse rounded-full mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-16 mx-auto mb-1"></div>
            <div className="h-3 bg-gray-200 animate-pulse rounded w-12 mx-auto"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default LoadingSkeleton