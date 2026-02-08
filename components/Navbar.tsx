'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, ShoppingCart, User, Menu, X, ChevronDown, Sun, Moon, BookOpen, LogOut } from 'lucide-react'
import { useCurrency } from '@/contexts/CurrencyContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useCart } from '@/contexts/CartContext'
import SearchModal from './SearchModal'
import { isAuthenticated, getUser, logout } from '@/utils/auth'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isBooksMenuOpen, setIsBooksMenuOpen] = useState(false)
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)
  const { currency, setCurrency } = useCurrency()
  const { isDarkMode, toggleTheme } = useTheme()
  const { cartCount } = useCart()
  const currencyRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Check authentication status
  useEffect(() => {
    setIsLoggedIn(isAuthenticated())
    setUser(getUser())
  }, [])

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
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const [expandedGenre, setExpandedGenre] = useState<string | null>(null)

  const genresWithSubGenres = [
    {
      name: 'Arts and Photography',
      subGenres: ['All', 'Architecture', 'Design & Decorative Arts', 'Drawing', 'Fashion', 'Graphic Design', 'History & Criticism', 'Music', 'Painting', 'Photography & Video']
    },
    {
      name: 'Boxed Sets',
      subGenres: ['All', 'Fiction Box Sets', 'Non-Fiction Box Sets', 'Children\'s Box Sets', 'Young Adult Box Sets', 'Classic Literature Sets']
    },
    {
      name: 'Business and Investing',
      subGenres: ['All', 'Accounting', 'Economics', 'Entrepreneurship', 'Finance', 'Management', 'Marketing & Sales', 'Personal Finance', 'Real Estate']
    },
    {
      name: 'Fiction and Literature',
      subGenres: ['All', 'Action & Adventure', 'Classics', 'Contemporary Fiction', 'Fantasy', 'Historical Fiction', 'Horror', 'Literary Fiction', 'Mystery & Thriller', 'Romance', 'Science Fiction']
    },
    {
      name: 'Foreign Languages',
      subGenres: ['All', 'Chinese', 'French', 'German', 'Hindi', 'Italian', 'Japanese', 'Korean', 'Nepali', 'Spanish', 'Urdu']
    },
    {
      name: 'History, Biography, and Social Science',
      subGenres: ['All', 'Ancient History', 'Anthropology', 'Archaeology', 'Biography & Memoir', 'Military History', 'Philosophy', 'Political Science', 'Psychology', 'Sociology', 'World History']
    },
    {
      name: 'Children and Young Adult',
      subGenres: ['All', 'Action & Adventure', 'Animals', 'Comics & Graphic Novels', 'Early Learning', 'Fantasy & Magic', 'Growing Up', 'Mysteries', 'Science Fiction']
    },
    {
      name: 'Science and Technology',
      subGenres: ['All', 'Astronomy', 'Biology', 'Chemistry', 'Computer Science', 'Engineering', 'Mathematics', 'Physics', 'Programming', 'Technology']
    },
    {
      name: 'Self-Help and Personal Development',
      subGenres: ['All', 'Creativity', 'Happiness', 'Memory Improvement', 'Motivational', 'Personal Transformation', 'Relationships', 'Self-Esteem', 'Stress Management', 'Success', 'Time Management']
    },
    {
      name: 'Health and Wellness',
      subGenres: ['All', 'Alternative Medicine', 'Diet & Nutrition', 'Exercise & Fitness', 'Mental Health', 'Mindfulness', 'Yoga', 'Weight Loss']
    }
  ]

  const megaMenuSections = {
    'Best Sellers': [
      { id: '2', title: 'Atomic Habits', author: 'James Clear', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop&q=80' },
      { id: '7', title: 'The Alchemist', author: 'Paulo Coelho', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop&q=80' },
      { id: '4', title: 'Psychology of Money', author: 'Morgan Housel', image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=200&h=300&fit=crop&q=80' }
    ],
    'New Arrivals': [
      { id: '10', title: 'Fourth Wing', author: 'Rebecca Ross', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=300&fit=crop&q=80' },
      { id: '11', title: 'Tomorrow, and Tomorrow', author: 'Gabrielle Zevin', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop&q=80' },
      { id: '12', title: 'The Midnight Library', author: 'Matt Haig', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop&q=80' }
    ],
    'Nepali Books': [
      { id: '3', title: 'Palpasa Cafe', author: 'Narayan Wagle', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop&q=80' },
      { id: '5', title: 'Shirish Ko Phool', author: 'Parijat', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=300&fit=crop&q=80' },
      { id: '15', title: 'Seto Dharti', author: 'Amar Neupane', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop&q=80' }
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
        <div className="flex items-center justify-between h-20">
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
            <div className="relative">
              <Link
                href="/books"
                className="flex items-center space-x-1 text-gray-700 dark:text-gray-200 hover:text-bookStore-blue dark:hover:text-blue-400 font-medium dark-transition text-base"
                onMouseEnter={() => setIsBooksMenuOpen(true)}
                onClick={(e) => {
                  // Allow navigation to /books
                  setIsBooksMenuOpen(false)
                }}
              >
                <span>Books</span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-200 ${isBooksMenuOpen ? 'rotate-180' : ''}`}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setIsBooksMenuOpen(!isBooksMenuOpen)
                  }}
                />
              </Link>
              
              {/* Mega Menu */}
              {isBooksMenuOpen && (
                <div 
                  className="fixed left-0 right-0 bg-white dark:bg-gray-800 shadow-2xl border-t dark:border-gray-700 z-40 dark-transition"
                  onMouseLeave={() => {
                    setIsBooksMenuOpen(false)
                    setExpandedGenre(null)
                  }}
                  style={{ top: '80px' }}
                >
                  <div className="container mx-auto px-4 py-6">
                    <div className="grid grid-cols-12 gap-6">
                      {/* Left Sidebar - Genres with Scrollbar */}
                      <div className="col-span-3 border-r dark:border-gray-700 pr-6">
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 text-base">Browse by Genre</h3>
                        <div className="genre-scroll pr-2" style={{ maxHeight: '360px' }}>
                          <ul className="space-y-1">
                            {genresWithSubGenres.map((genre) => (
                              <li key={genre.name}>
                                <div className="flex items-stretch gap-1">
                                  <Link
                                    href={`/genre/${genre.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                    className={`flex-1 flex items-center text-left text-gray-900 dark:text-gray-100 hover:text-bookStore-blue dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 py-2.5 px-3 rounded-md transition-all dark-transition font-semibold text-[15px] ${
                                      expandedGenre === genre.name ? 'bg-gray-50 dark:bg-gray-700 text-bookStore-blue dark:text-blue-400' : ''
                                    }`}
                                  >
                                    <span>{genre.name}</span>
                                  </Link>
                                  <button
                                    onClick={() => setExpandedGenre(expandedGenre === genre.name ? null : genre.name)}
                                    className={`flex items-center justify-center px-2 text-gray-900 dark:text-gray-100 hover:text-bookStore-blue dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-all dark-transition ${
                                      expandedGenre === genre.name ? 'bg-gray-50 dark:bg-gray-700 text-bookStore-blue dark:text-blue-400' : ''
                                    }`}
                                  >
                                    <ChevronDown 
                                      size={16} 
                                      className={`flex-shrink-0 transition-transform duration-200 ${
                                        expandedGenre === genre.name ? 'rotate-180' : ''
                                      }`}
                                    />
                                  </button>
                                </div>
                                
                                {/* Sub-genres - Expand Below */}
                                {expandedGenre === genre.name && (
                                  <ul className="mt-1 mb-2 ml-3 space-y-1 border-l-2 border-gray-200 dark:border-gray-600 pl-3">
                                    {genre.subGenres.map((subGenre) => (
                                      <li key={subGenre}>
                                        <Link
                                          href={
                                            subGenre === 'All' 
                                              ? `/genre/${genre.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
                                              : `/genre/${genre.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/${subGenre.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
                                          }
                                          className="text-gray-600 dark:text-gray-400 hover:text-bookStore-blue dark:hover:text-blue-400 text-sm block py-1.5 px-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        >
                                          {subGenre}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Main Content - Fixed Height */}
                      <div className="col-span-9">
                        <div className="grid grid-cols-4 gap-6">
                          {/* Best Sellers */}
                          <div>
                            <Link href="/bestsellers">
                              <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-4 hover:text-bookStore-blue dark:hover:text-blue-400 cursor-pointer dark-transition text-base">Best Sellers</h4>
                            </Link>
                            <div className="space-y-3">
                              {megaMenuSections['Best Sellers'].map((book, index) => (
                                <Link
                                  key={index}
                                  href={`/book/${book.id}`}
                                  className="flex items-start space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-md transition-colors group"
                                >
                                  <Image
                                    src={book.image}
                                    alt={book.title}
                                    width={50}
                                    height={70}
                                    className="rounded shadow-sm flex-shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-bookStore-blue dark:group-hover:text-blue-400 dark-transition line-clamp-2">{book.title}</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{book.author}</p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>

                          {/* New Arrivals */}
                          <div>
                            <Link href="/new-arrivals">
                              <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-4 hover:text-bookStore-blue dark:hover:text-blue-400 cursor-pointer dark-transition text-base">New Arrivals</h4>
                            </Link>
                            <div className="space-y-3">
                              {megaMenuSections['New Arrivals'].map((book, index) => (
                                <Link
                                  key={index}
                                  href={`/book/${book.id}`}
                                  className="flex items-start space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-md transition-colors group"
                                >
                                  <Image
                                    src={book.image}
                                    alt={book.title}
                                    width={50}
                                    height={70}
                                    className="rounded shadow-sm flex-shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-bookStore-blue dark:group-hover:text-blue-400 dark-transition line-clamp-2">{book.title}</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{book.author}</p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>

                          {/* Nepali Books */}
                          <div>
                            <Link href="/nepali-books">
                              <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-4 hover:text-bookStore-blue dark:hover:text-blue-400 cursor-pointer dark-transition text-base">Nepali Books</h4>
                            </Link>
                            <div className="space-y-3">
                              {megaMenuSections['Nepali Books'].map((book, index) => (
                                <Link
                                  key={index}
                                  href={`/book/${book.id}`}
                                  className="flex items-start space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-md transition-colors group"
                                >
                                  <Image
                                    src={book.image}
                                    alt={book.title}
                                    width={50}
                                    height={70}
                                    className="rounded shadow-sm flex-shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-bookStore-blue dark:group-hover:text-blue-400 dark-transition line-clamp-2">{book.title}</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{book.author}</p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>

                          {/* Quick Links */}
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-4 text-base">Quick Links</h4>
                            <ul className="space-y-2.5">
                              <li>
                                <Link
                                  href="/bundle-deals"
                                  className="block text-gray-700 dark:text-gray-300 hover:text-bookStore-blue dark:hover:text-blue-400 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 py-2 px-3 rounded-md transition-all dark-transition"
                                >
                                  Bundle Deals
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/used-books"
                                  className="block text-gray-700 dark:text-gray-300 hover:text-bookStore-blue dark:hover:text-blue-400 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 py-2 px-3 rounded-md transition-all dark-transition"
                                >
                                  Used Books
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/preorders"
                                  className="block text-gray-700 dark:text-gray-300 hover:text-bookStore-blue dark:hover:text-blue-400 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 py-2 px-3 rounded-md transition-all dark-transition"
                                >
                                  Preorders
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/book-request"
                                  className="block text-gray-700 dark:text-gray-300 hover:text-bookStore-blue dark:hover:text-blue-400 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 py-2 px-3 rounded-md transition-all dark-transition"
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

            <Link href="/deals" className="text-gray-700 dark:text-gray-200 hover:text-bookStore-blue dark:hover:text-blue-400 font-medium dark-transition text-base">
              Deals
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-bookStore-blue dark:hover:border-blue-400 transition-colors bg-white dark:bg-gray-800 dark-transition"
            >
              <Search size={19} className="mr-3" />
              <span className="text-base">What do you want to read ?</span>
              <span className="ml-auto text-sm text-gray-400">Ctrl + K</span>
            </button>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-bookStore-blue dark:hover:text-blue-400 dark-transition"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Cart */}
            <Link href="/cart" className="p-2 text-gray-600 dark:text-gray-300 hover:text-bookStore-blue dark:hover:text-blue-400 relative dark-transition">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu / Login */}
            {isLoggedIn && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-bookStore-blue dark:hover:text-blue-400 font-medium dark-transition"
                >
                  <User size={20} />
                  <span className="hidden md:inline">{user.firstName}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 dark-transition">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <Link
                      href="/wishlist"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Wishlist
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 rounded-b-lg"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="text-gray-600 dark:text-gray-300 hover:text-bookStore-blue dark:hover:text-blue-400 font-medium dark-transition">
                Login
              </Link>
            )}

            {/* Currency Selector - Custom Dropdown */}
            <div className="relative" ref={currencyRef}>
              <button
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:border-bookStore-blue dark:hover:border-blue-400 rounded-lg px-3 py-2.5 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer group dark-transition"
              >
                <span className="text-lg mr-2">{selectedCurrency?.flag}</span>
                <span className="text-gray-700 dark:text-gray-200 font-medium text-base group-hover:text-bookStore-blue dark:group-hover:text-blue-400 transition-colors">
                  {selectedCurrency?.label}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-gray-500 ml-2 transition-all duration-200 group-hover:text-bookStore-blue dark:group-hover:text-blue-400 ${isCurrencyOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Custom Dropdown */}
              {isCurrencyOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 dark-transition">
                  {currencyOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setCurrency(option.value as 'NPR' | 'USD')
                        setIsCurrencyOpen(false)
                      }}
                      className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        currency === option.value ? 'bg-blue-50 dark:bg-blue-900/20 text-bookStore-blue dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'
                      }`}
                    >
                      <span className="text-lg mr-3">{option.flag}</span>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{option.label}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{option.country}</div>
                      </div>
                      {currency === option.value && (
                        <div className="w-2 h-2 bg-bookStore-blue dark:bg-blue-400 rounded-full"></div>
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