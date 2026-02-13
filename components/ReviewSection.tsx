'use client'

import { useState, useEffect } from 'react'
import { Star, User } from 'lucide-react'
import { isAuthenticated } from '@/utils/auth'
import toast from 'react-hot-toast'

interface Review {
  _id: string
  user: {
    _id: string
    firstName?: string
    lastName?: string
    name?: string
    email: string
  }
  rating: number
  comment: string
  createdAt: string
}

interface ReviewSectionProps {
  bookId: string
  averageRating: number
  totalReviews: number
}

const ReviewSection = ({ bookId, averageRating, totalReviews }: ReviewSectionProps) => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [showAll, setShowAll] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [hasRated, setHasRated] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  
  // Review form state
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')

  useEffect(() => {
    setIsClient(true)
    const loggedIn = isAuthenticated()
    setIsLoggedIn(loggedIn)
    
    // Get current user ID from token
    if (loggedIn) {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]))
          setCurrentUserId(payload.id)
        }
      } catch (error) {
        console.error('Error parsing token:', error)
      }
    }
  }, [])

  useEffect(() => {
    fetchReviews()
    if (isLoggedIn) {
      checkUserRating()
    }
  }, [bookId, isLoggedIn])

  // Separate effect to ensure rating persists after state updates
  useEffect(() => {
    if (hasRated && userRating > 0 && rating === 0) {
      setRating(userRating)
    }
  }, [hasRated, userRating, rating])

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/book/${bookId}`)
      const data = await response.json()
      
      if (data.success) {
        setReviews(data.data.reviews)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkUserRating = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/user/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      
      if (data.success && data.data.review) {
        setHasRated(true)
        setUserRating(data.data.review.rating)
        setRating(data.data.review.rating) // Pre-fill with existing rating
      }
    } catch (error) {
      console.error('Error checking user rating:', error)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated()) {
      toast.error('Please login to submit a review')
      setTimeout(() => {
        window.location.href = '/login'
      }, 1000)
      return
    }

    // If user hasn't rated yet, rating is required
    if (!hasRated && rating === 0) {
      toast.error('Please select a rating')
      return
    }

    if (!comment.trim()) {
      toast.error('Please write a comment')
      return
    }

    try {
      setSubmitting(true)
      const token = localStorage.getItem('token')
      
      const body: any = {
        bookId,
        comment,
      }
      
      // Only send rating if user is rating for first time or updating rating
      if (rating > 0 && (!hasRated || rating !== userRating)) {
        body.rating = rating
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (data.success) {
        if (data.data.hasRated && !hasRated) {
          toast.success('Rating and comment submitted!')
          setHasRated(true)
          setUserRating(rating)
        } else if (rating > 0 && rating !== userRating) {
          toast.success('Rating updated and comment added!')
          setUserRating(rating)
          setRating(rating) // Keep the updated rating in the form
        } else {
          toast.success('Comment added!')
          // Keep the existing rating in the form
          setRating(userRating)
        }
        
        setComment('')
        
        // Fetch updated reviews
        await fetchReviews()
        
        // Fetch updated book rating if rating was changed
        if (rating > 0 && rating !== userRating) {
          // Trigger a re-fetch of book data to update average rating
          try {
            const bookResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${bookId}`)
            const bookData = await bookResponse.json()
            if (bookData.success) {
              // Update the displayed rating (you might need to pass this as a prop or use context)
              console.log('Updated book rating:', bookData.data.averageRating)
            }
          } catch (error) {
            console.error('Error fetching updated book data:', error)
          }
        }
        
        // Don't reload page - rating stays in the form for next comment
      } else {
        toast.error(data.message || 'Failed to submit review')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      toast.error('Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Comment deleted successfully')
        await fetchReviews()
        
        // Check if this was the user's last review (need to re-check rating status)
        await checkUserRating()
      } else {
        toast.error(data.message || 'Failed to delete comment')
      }
    } catch (error) {
      console.error('Error deleting review:', error)
      toast.error('Failed to delete comment')
    }
  }

  const displayedReviews = showAll ? reviews : reviews.slice(0, 2)

  // Prevent hydration mismatch by not rendering auth-dependent content on server
  if (!isClient) {
    return (
      <div className="w-full max-w-7xl mx-auto mt-8 px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 border-gray-200 dark:border-gray-700 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Customer Reviews
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={24}
                    className={`${
                      star <= Math.round(averageRating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xl font-medium text-gray-900 dark:text-white">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          </div>
          <div className="space-y-6">
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">Loading reviews...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto mt-8 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 border-gray-200 dark:border-gray-700 p-8">
        
        {/* Rating Summary */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Customer Reviews
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={24}
                  className={`${
                    star <= Math.round(averageRating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-xl font-medium text-gray-900 dark:text-white">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        </div>

        {/* Add Review Form */}
        {isLoggedIn && (
          <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {hasRated ? 'Add Another Comment' : 'Write a Review'}
            </h3>
            {hasRated && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                You've already rated this book ({userRating} stars). You can update your rating or just add a comment.
              </p>
            )}
            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Star Rating Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {hasRated ? 'Update Rating (Optional)' : 'Rating *'}
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={32}
                        className={`${
                          star <= (hoverRating || rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {hasRated && rating !== userRating && rating > 0 && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Your rating will be updated from {userRating} to {rating} stars
                  </p>
                )}
              </div>

              {/* Comment Textarea */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Comment *
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  maxLength={1000}
                  placeholder="Share your thoughts about this book..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {comment.length}/1000 characters
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || (!hasRated && rating === 0) || !comment.trim()}
                className="px-6 py-2 bg-bookStore-blue text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : hasRated ? 'Add Comment' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {loading ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No reviews yet. Be the first to review this book!
            </p>
          ) : (
            <>
              {displayedReviews.map((review) => {
                // Check if this review belongs to the current user
                const isOwnReview = currentUserId && review.user._id === currentUserId
                
                return (
                  <div
                    key={review._id}
                    className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl"
                  >
                    <div className="flex items-start gap-4">
                      {/* User Avatar */}
                      <div className="w-12 h-12 rounded-full bg-bookStore-blue flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-white" />
                      </div>

                      {/* Review Content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {review.user.name || `${review.user.firstName || ''} ${review.user.lastName || ''}`.trim() || 'Anonymous'}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(review.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                          {/* Delete Button - Only show for own reviews */}
                          {isOwnReview && (
                            <button
                              onClick={() => handleDeleteReview(review._id)}
                              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                              title="Delete comment"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* View All Button */}
              {reviews.length > 2 && !showAll && (
                <button
                  onClick={() => setShowAll(true)}
                  className="w-full py-3 border-2 border-bookStore-blue text-bookStore-blue rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  View All {reviews.length} Reviews
                </button>
              )}

              {showAll && reviews.length > 2 && (
                <button
                  onClick={() => setShowAll(false)}
                  className="w-full py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Show Less
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReviewSection
