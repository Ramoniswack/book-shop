import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Youtube, Twitter } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t dark:border-gray-700 dark-transition">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">QUICK LINKS</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/book-request" className="text-gray-600 dark:text-gray-300 hover:text-bookStore-blue dark:hover:text-blue-400 transition-colors">Book Request</Link></li>
              <li><Link href="/bestsellers" className="text-gray-600 dark:text-gray-300 hover:text-bookStore-blue dark:hover:text-blue-400 transition-colors">Best Sellers</Link></li>
              <li><Link href="/new-arrivals" className="text-gray-600 dark:text-gray-300 hover:text-bookStore-blue dark:hover:text-blue-400 transition-colors">New Arrivals</Link></li>
              <li><Link href="/blogs" className="text-gray-600 dark:text-gray-300 hover:text-bookStore-blue dark:hover:text-blue-400 transition-colors">Blogs</Link></li>
              <li><Link href="/used-books" className="text-gray-600 dark:text-gray-300 hover:text-bookStore-blue dark:hover:text-blue-400 transition-colors">Used Books</Link></li>
            </ul>
          </div>

          {/* About */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">ABOUT</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about-us" className="text-gray-600 dark:text-gray-300 hover:text-bookStore-blue dark:hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="text-gray-600 dark:text-gray-300 hover:text-bookStore-blue dark:hover:text-blue-400 transition-colors">Careers</Link></li>
              <li><Link href="/contact-us" className="text-gray-600 dark:text-gray-300 hover:text-bookStore-blue dark:hover:text-blue-400 transition-colors">Contact Us</Link></li>
              <li><Link href="/wholesale" className="text-gray-600 dark:text-gray-300 hover:text-bookStore-blue dark:hover:text-blue-400 transition-colors">Wholesale</Link></li>
            </ul>
          </div>

          {/* Genres */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">GENRES</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/genre/fiction" className="text-gray-600 dark:text-gray-300 hover:text-bookStore-blue dark:hover:text-blue-400 transition-colors">Fiction</Link></li>
              <li><Link href="/genre/self-help" className="text-gray-600 dark:text-gray-300 hover:text-bookStore-blue dark:hover:text-blue-400 transition-colors">Self Help</Link></li>
              <li><Link href="/genre/business" className="text-gray-600 dark:text-gray-300 hover:text-bookStore-blue dark:hover:text-blue-400 transition-colors">Business</Link></li>
              <li><Link href="/genre/children" className="text-gray-600 dark:text-gray-300 hover:text-bookStore-blue dark:hover:text-blue-400 transition-colors">Children</Link></li>
              <li><Link href="/genre/nepali" className="text-gray-600 dark:text-gray-300 hover:text-bookStore-blue dark:hover:text-blue-400 transition-colors">Nepali</Link></li>
            </ul>
          </div>

          {/* Others */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">OTHERS</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/cafe" className="text-gray-600 dark:text-gray-300 hover:text-bookStore-blue dark:hover:text-blue-400 transition-colors">Cafe</Link></li>
              <li><Link href="/faq" className="text-gray-600 dark:text-gray-300 hover:text-bookStore-blue dark:hover:text-blue-400 transition-colors">FAQ's</Link></li>
              <li><Link href="/shipping-rates" className="text-gray-600 dark:text-gray-300 hover:text-bookStore-blue dark:hover:text-blue-400 transition-colors">Shipping Rates</Link></li>
            </ul>
          </div>

          {/* Newsletter Signup - Spans 2 columns on large screens */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Signup and <span className="text-red-500">Unlock 10% OFF</span>
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                On your first purchase!
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Opt in to our newsletter on bookStore for exclusive deals, updates, and more!
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:border-bookStore-blue dark:focus:border-blue-400 min-w-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 dark-transition"
              />
              <button className="px-6 py-2 bg-bookStore-blue hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
                GET 10% OFF
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6 dark-transition">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-600 dark:text-gray-300">
              <span>© 2026 bookStore</span>
              <div className="flex space-x-4">
                <Link href="/terms-of-use" className="hover:text-bookStore-blue dark:hover:text-blue-400 transition-colors">
                  Terms Of Use
                </Link>
                <Link href="/privacy-policy" className="hover:text-bookStore-blue dark:hover:text-blue-400 transition-colors">
                  Privacy Policy
                </Link>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">Connect With Us:</span>
              <div className="flex space-x-3">
                <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-bookStore-blue dark:hover:text-blue-400 transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-bookStore-blue dark:hover:text-blue-400 transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-bookStore-blue dark:hover:text-blue-400 transition-colors">
                  <Youtube size={20} />
                </a>
                <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-bookStore-blue dark:hover:text-blue-400 transition-colors">
                  <Twitter size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer