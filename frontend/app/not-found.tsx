import Link from 'next/link'
import MainLayout from '@/layouts/MainLayout'
import { BookOpen, Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-8">
            <BookOpen size={80} className="text-booksmandala-blue mx-auto mb-4" />
            <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
            <p className="text-gray-600 mb-8">
              Sorry, we couldn't find the page you're looking for. 
              The book you're searching for might have been moved or doesn't exist.
            </p>
          </div>
          
          <div className="space-y-4">
            <Link href="/" className="bg-booksmandala-blue hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 inline-flex items-center space-x-2">
              <Home size={16} />
              <span>Go Home</span>
            </Link>
            <div className="text-center">
              <span className="text-gray-500">or</span>
            </div>
            <Link href="/search" className="btn-secondary inline-flex items-center space-x-2">
              <Search size={16} />
              <span>Search Books</span>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}