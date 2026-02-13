import { Suspense } from 'react'
import { Metadata } from 'next'
import MainLayout from '@/layouts/MainLayout'
import DealsPageClient from '@/components/DealsPageClient'
import DealsBanner from '@/components/DealsBanner'
import { BookCardSkeleton } from '@/components/LoadingSkeleton'
import { normalizeBooks } from '@/utils/bookMapper'

export const metadata: Metadata = {
  title: 'Book Deals & Offers - BookStore Nepal',
  description: 'Discover amazing deals on books! Flash sales, BOGO offers, seasonal discounts, and limited-time offers on bestsellers and popular titles.',
  keywords: 'book deals, book offers, flash sale, BOGO books, discount books Nepal, cheap books',
  openGraph: {
    title: 'Book Deals & Offers - BookStore Nepal',
    description: 'Discover amazing deals on books! Flash sales, BOGO offers, and more.',
    type: 'website',
    url: 'https://bookstore.com/deals',
    siteName: 'BookStore Nepal',
  },
  robots: {
    index: true,
    follow: true,
  },
}

// Fetch all active deals for deals page
const fetchDealsPageDeals = async () => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/deals/active?showOnDealsPage=true`
    console.log('Fetching deals from:', url)
    
    const response = await fetch(url, { cache: 'no-store' })
    const data = await response.json()
    
    console.log('Deals API response:', {
      success: data.success,
      count: data.data?.length || 0,
      deals: data.data?.map((d: any) => ({ title: d.title, type: d.type }))
    })
    
    // Normalize books in each deal
    const deals = data.success ? data.data : []
    const normalizedDeals = deals.map((deal: any) => ({
      ...deal,
      applicableBooks: normalizeBooks(deal.applicableBooks || [])
    }))
    
    return normalizedDeals
  } catch (error) {
    console.error('Error fetching deals:', error)
    return []
  }
}

export default async function DealsPage() {
  const deals = await fetchDealsPageDeals()
  
  console.log('DealsPage rendering with', deals.length, 'deals')

  return (
    <MainLayout>
      {/* Deals Banner */}
      <DealsBanner />
      
      <Suspense fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }>
        <DealsPageClient deals={deals} />
      </Suspense>
    </MainLayout>
  )
}
