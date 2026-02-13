import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Image from 'next/image'
import MainLayout from '@/layouts/MainLayout'
import BookDetailClient from '@/components/BookDetailClient'
import { fetchBookById } from '@/utils/fetcher'

interface BookPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const book = await fetchBookById(params.id)
  
  if (!book) {
    return {
      title: 'Book Not Found',
    }
  }

  // Calculate price safely
  const discountPercentage = (book as any).discountPercentage || 0
  const price = discountPercentage > 0
    ? `Rs. ${(book.price * (1 - discountPercentage / 100)).toFixed(2)}`
    : `Rs. ${book.price}`

  // Get author name safely
  const authorName = typeof book.author === 'string' 
    ? book.author 
    : (book.author as any)?.name || 'Unknown'

  // Get genre name safely
  const genreName = Array.isArray(book.genres) && book.genres.length > 0
    ? book.genres[0]
    : (book as any).genre?.name || ''

  return {
    title: `${book.title} by ${authorName} - BookStore Nepal`,
    description: book.description?.substring(0, 160) || `Buy ${book.title} by ${authorName} online at BookStore Nepal. ${price}`,
    keywords: `${book.title}, ${authorName}, ${genreName}, buy books online Nepal`,
    openGraph: {
      title: book.title,
      description: book.description?.substring(0, 160) || `Buy ${book.title} online`,
      type: 'book',
      url: `https://bookstore.com/book/${book._id || (book as any).id}`,
      images: book.images && book.images.length > 0 ? [
        {
          url: `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'}/${book.images[0]}`,
          width: 800,
          height: 1200,
          alt: book.title,
        }
      ] : [],
      siteName: 'BookStore Nepal',
    },
    twitter: {
      card: 'summary_large_image',
      title: book.title,
      description: book.description?.substring(0, 160) || `Buy ${book.title} online`,
      images: book.images && book.images.length > 0 ? [
        `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'}/${book.images[0]}`
      ] : [],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function BookPage({ params }: BookPageProps) {
  const book = await fetchBookById(params.id)
  
  if (!book) {
    notFound()
  }

  // Get author name safely
  const authorName = typeof book.author === 'string' 
    ? book.author 
    : (book.author as any)?.name || 'Unknown'

  // Calculate price safely
  const discountPercentage = (book as any).discountPercentage || 0
  const finalPrice = discountPercentage > 0
    ? (book.price * (1 - discountPercentage / 100)).toFixed(2)
    : book.price.toFixed(2)

  // Generate JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    isbn: (book as any).isbn || undefined,
    description: book.description || undefined,
    image: book.images && book.images.length > 0 
      ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'}/${book.images[0]}`
      : undefined,
    offers: {
      '@type': 'Offer',
      price: finalPrice,
      priceCurrency: 'NPR',
      availability: book.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `https://bookstore.com/book/${book._id || (book as any).id}`,
    },
    aggregateRating: (book as any).averageRating && (book as any).totalReviews ? {
      '@type': 'AggregateRating',
      ratingValue: (book as any).averageRating,
      reviewCount: (book as any).totalReviews,
    } : undefined,
  }

  return (
    <MainLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BookDetailClient book={book} />
    </MainLayout>
  )
}