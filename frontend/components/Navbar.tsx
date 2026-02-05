'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, ShoppingCart, User, Menu, X, ChevronDown, Sun, Moon, BookOpen } from 'lucide-react'
import { useCurrency } from '@/contexts/CurrencyContext'
import { useTheme } from '@/contexts/ThemeContext'
import SearchModal from './SearchModal'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isBooksMenuOpen, setIsBooksMenuOpen] = useState(false)
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { currency, setCurrency } = useCurrency()
  const { isDarkMode, toggleTheme } = useTheme()
  const currencyRef = useRef<HTMLDivElement>(null)

  // Handle Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Close currency dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
        setIsCurrencyOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const genres = [
    'Arts and Photography',
    'Boxed Sets', 
    'Business and Investing',
    'Fiction and Literature',
    'Foreign Languages',
    'History, Biography, and Social Science'
  ]

  const megaMenuSections = {
    'Best Sellers': [
      { id: '2', title: 'Atomic Habits', author: 'James Clear', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop&q=80' },
      { id: '7', title: 'The Alchemist', author: 'Paulo Coelho', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop&q=80' },
      { id: '4', title: 'Psychology of Money', author: 'Morgan Housel', image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=200&h=300&fit=crop&q=80' },
      { id: '18', title: 'Think and Grow Rich', author: 'Napoleon Hill', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=300&fit=crop&q=80' }
    ],
    'New Arrivals': [
      { id: '10', title: 'Fourth Wing', author: 'Rebecca Ross', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=300&fit=crop&q=80' },
      { id: '11', title: 'Tomorrow, and Tomorrow, and Tomorrow', author: 'Gabrielle Zevin', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop&q=80' }
    ],
    'Nepali Books': [
      { id: '3', title: 'Palpasa Cafe', author: 'Narayan Wagle', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop&q=80' },
      { id: '5', title: 'Shirish Ko Phool', author: 'Parijat', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=300&fit=crop&q=80' }
    ],
    'Others': [
      'Bundle Deals',
      'Used Books', 
      'Preorders',
      'Book Request'
    ]
  }

  const currencyOptions = [
    { value: 'NPR', label: 'NPR', flag: '🇳🇵', country: 'Nepal' },
    { value: 'USD', label: 'USD', flag: '🇺🇸', country: 'United States' }
  ]

  const selectedCurrency = currencyOptions.find(option => option.value === currency)

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-700 sticky top-0 z-50 dark-transition">
      {/* Main Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/bookstore-logo.svg"
              alt="BookStore - Read Discover Escape"
              width={160}
              height={64}
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Books Menu */}
            <div className="relative group">
              <button 
                className="flex items-center space-x-1 text-booksmandala-blue hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium dark-transition"
                onMouseEnter={() => setIsBooksMenuOpen(true)}
              >
                <span>Books</span>
                <ChevronDown size={16} />
              </button>
              
              {/* Mega Menu */}
              {isBooksMenuOpen && (
                <div 
                  className="absolute top-full left-0 mt-1 w-screen max-w-4xl bg-white dark:bg-gray-800 shadow-xl rounded-lg border dark:border-gray-700 z-50 dark-transition"
                  onMouseLeave={() => setIsBooksMenuOpen(false)}
                  style={{ left: '-200px' }}
                >
                  <div className="p-6">
                    <div className="grid grid-cols-12 gap-6">
                      {/* Left Sidebar - Genres */}
                      <div className="col-span-3">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Genres</h3>
                        <ul className="space-y-2">
                          {genres.map((genre) => (
                            <li key={genre}>
                              <Link
                                href={`/genre/${genre.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                className="text-gray-600 dark:text-gray-300 hover:text-booksmandala-blue dark:hover:text-blue-400 text-sm block py-1 dark-transition"
                              >
                                {genre}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Main Content */}
                      <div className="col-span-9">
                        <div className="grid grid-cols-4 gap-6">
                          {/* Best Sellers */}
                          <div>
                            <Link href="/bestsellers">
                              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 hover:text-booksmandala-blue dark:hover:text-blue-400 cursor-pointer dark-transition">Best Sellers</h4>
                            </Link>
                            <div className="space-y-3">
                              {megaMenuSections['Best Sellers'].map((book, index) => (
                                <Link
                                  key={index}
                                  href={`/book/${book.id}`}
                                  className="flex items-center space-x-2 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded transition-colors"
                                >
                                  <Image
                                    src={book.image}
                                    alt={book.title}
                                    width={30}
                                    height={40}
                                    className="rounded"
                                  />
                                  <div>
                                    <p className="text-xs font-medium text-gray-900 dark:text-gray-100 hover:text-booksmandala-blue dark:hover:text-blue-400 dark-transition">{book.title}</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">{book.author}</p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>

                          {/* New Arrivals */}
                          <div>
                            <Link href="/new-arrivals">
                              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 hover:text-booksmandala-blue dark:hover:text-blue-400 cursor-pointer dark-transition">New Arrivals</h4>
                            </Link>
                            <div className="space-y-3">
                              {megaMenuSections['New Arrivals'].map((book, index) => (
                                <Link
                                  key={index}
                                  href={`/book/${book.id}`}
                                  className="flex items-center space-x-2 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded transition-colors"
                                >
                                  <Image
                                    src={book.image}
                                    alt={book.title}
                                    width={30}
                                    height={40}
                                    className="rounded"
                                  />
                                  <div>
                                    <p className="text-xs font-medium text-gray-900 dark:text-gray-100 hover:text-booksmandala-blue dark:hover:text-blue-400 dark-transition">{book.title}</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">{book.author}</p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>

                          {/* Nepali Books */}
                          <div>
                            <Link href="/nepali-books">
                              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 hover:text-booksmandala-blue dark:hover:text-blue-400 cursor-pointer dark-transition">Nepali Books</h4>
                            </Link>
                            <div className="space-y-3">
                              {megaMenuSections['Nepali Books'].map((book, index) => (
                                <Link
                                  key={index}
                                  href={`/book/${book.id}`}
                                  className="flex items-center space-x-2 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded transition-colors"
                                >
                                  <Image
                                    src={book.image}
                                    alt={book.title}
                                    width={30}
                                    height={40}
                                    className="rounded"
                                  />
                                  <div>
                                    <p className="text-xs font-medium text-gray-900 dark:text-gray-100 hover:text-booksmandala-blue dark:hover:text-blue-400 dark-transition">{book.title}</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">{book.author}</p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>

                          {/* Others */}
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Others</h4>
                            <ul className="space-y-2">
                              <li>
                                <Link
                                  href="/bundle-deals"
                                  className="text-gray-600 dark:text-gray-300 hover:text-booksmandala-blue dark:hover:text-blue-400 text-sm dark-transition"
                                >
                                  Bundle Deals
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/used-books"
                                  className="text-gray-600 dark:text-gray-300 hover:text-booksmandala-blue dark:hover:text-blue-400 text-sm dark-transition"
                                >
                                  Used Books
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/preorders"
                                  className="text-gray-600 dark:text-gray-300 hover:text-booksmandala-blue dark:hover:text-blue-400 text-sm dark-transition"
                                >
                                  Preorders
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/book-request"
                                  className="text-gray-600 dark:text-gray-300 hover:text-booksmandala-blue dark:hover:text-blue-400 text-sm dark-transition"
                                >
                                  Book Request
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link href="/deals" className="text-booksmandala-blue hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium dark-transition">
              Deals
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-booksmandala-blue dark:hover:border-blue-400 transition-colors bg-white dark:bg-gray-800 dark-transition"
            >
              <Search size={18} className="mr-3" />
              <span className="text-sm">What do you want to read ?</span>
              <span className="ml-auto text-xs text-gray-400">Ctrl + K</span>
            </button>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-booksmandala-blue dark:hover:text-blue-400 dark-transition"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Cart */}
            <Link href="/cart" className="p-2 text-gray-600 dark:text-gray-300 hover:text-booksmandala-blue dark:hover:text-blue-400 relative dark-transition">
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>

            {/* Login */}
            <Link href="/login" className="text-gray-600 dark:text-gray-300 hover:text-booksmandala-blue dark:hover:text-blue-400 font-medium dark-transition">
              Login
            </Link>

            {/* Currency Selector - Custom Dropdown */}
            <div className="relative" ref={currencyRef}>
              <button
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:border-booksmandala-blue dark:hover:border-blue-400 rounded-lg px-3 py-2 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer group dark-transition"
              >
                <span className="text-lg mr-2">{selectedCurrency?.flag}</span>
                <span className="text-gray-700 dark:text-gray-200 font-medium text-sm group-hover:text-booksmandala-blue dark:group-hover:text-blue-400 transition-colors">
                  {selectedCurrency?.label}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-gray-500 ml-2 transition-all duration-200 group-hover:text-booksmandala-blue dark:group-hover:text-blue-400 ${isCurrencyOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Custom Dropdown */}
              {isCurrencyOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 dark-transition">
                  {currencyOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setCurrency(option.value as 'NPR' | 'USD')
                        setIsCurrencyOpen(false)
                      }}
                      className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        currency === option.value ? 'bg-blue-50 dark:bg-blue-900/20 text-booksmandala-blue dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'
                      }`}
                    >
                      <span className="text-lg mr-3">{option.flag}</span>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{option.label}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{option.country}</div>
                      </div>
                      {currency === option.value && (
                        <div className="w-2 h-2 bg-booksmandala-blue dark:bg-blue-400 rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 dark-transition"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-700 dark-transition">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 dark-transition"
            >
              <Search size={18} className="mr-3" />
              <span className="text-sm">What do you want to read ?</span>
            </button>
            
            {/* Mobile Navigation Links */}
            <div className="space-y-2">
              <Link href="/books" className="block py-2 text-gray-700 dark:text-gray-200 font-medium dark-transition">Books</Link>
              <Link href="/deals" className="block py-2 text-gray-700 dark:text-gray-200 font-medium dark-transition">Deals</Link>
              <Link href="/bestsellers" className="block py-2 text-gray-700 dark:text-gray-300 dark-transition">Best Sellers</Link>
              <Link href="/new-arrivals" className="block py-2 text-gray-700 dark:text-gray-300 dark-transition">New Arrivals</Link>
              <Link href="/nepali-books" className="block py-2 text-gray-700 dark:text-gray-300 dark-transition">Nepali Books</Link>
            </div>
          </div>
        </div>
      )}
      
      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </nav>
  )
}

export default Navbar