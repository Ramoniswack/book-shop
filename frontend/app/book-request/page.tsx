import MainLayout from '@/layouts/MainLayout'
import { Search, BookOpen, MessageCircle, CheckCircle } from 'lucide-react'

export default function BookRequestPage() {
  return (
    <MainLayout>
      <div className="bg-gray-50 dark:bg-gray-800 py-8 dark-transition">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-bookStore-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-white" size={32} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 dark-transition">
              Book Request
            </h1>
            <p className="text-gray-600 dark:text-gray-300 dark-transition">
              Can't find the book you're looking for? Let us help you find it!
            </p>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <section className="py-12 bg-white dark:bg-gray-900 dark-transition">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8 dark-transition">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 dark-transition">
                <Search className="text-blue-600 dark:text-blue-400" size={32} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 dark-transition">1. Submit Request</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm dark-transition">Fill out the form with book details</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 dark-transition">
                <BookOpen className="text-blue-600 dark:text-blue-400" size={32} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 dark-transition">2. We Search</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm dark-transition">Our team searches for your book</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 dark-transition">
                <MessageCircle className="text-blue-600 dark:text-blue-400" size={32} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 dark-transition">3. We Contact You</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm dark-transition">Get notified when we find it</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 dark-transition">
                <CheckCircle className="text-blue-600 dark:text-blue-400" size={32} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 dark-transition">4. Order & Enjoy</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm dark-transition">Purchase and enjoy your book</p>
            </div>
          </div>
        </div>
      </section>

      {/* Request Form */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800 dark-transition">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 dark-transition">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center dark-transition">Request a Book</h2>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 dark-transition">
                      Book Title *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-bookStore-blue dark:focus:ring-blue-400 bg-white dark:bg-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 dark-transition"
                      placeholder="Enter book title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 dark-transition">
                      Author Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-bookStore-blue dark:focus:ring-blue-400 bg-white dark:bg-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 dark-transition"
                      placeholder="Enter author name"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 dark-transition">
                      ISBN (if known)
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-bookStore-blue dark:focus:ring-blue-400 bg-white dark:bg-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 dark-transition"
                      placeholder="Enter ISBN"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 dark-transition">
                      Publisher
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-bookStore-blue dark:focus:ring-blue-400 bg-white dark:bg-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 dark-transition"
                      placeholder="Enter publisher"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 dark-transition">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-bookStore-blue dark:focus:ring-blue-400 bg-white dark:bg-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 dark-transition"
                    placeholder="Enter your name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 dark-transition">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-bookStore-blue dark:focus:ring-blue-400 bg-white dark:bg-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 dark-transition"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 dark-transition">
                    Additional Details
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-bookStore-blue dark:focus:ring-blue-400 bg-white dark:bg-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 dark-transition"
                    placeholder="Any additional information about the book..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-bookStore-blue hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Submit Book Request
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}