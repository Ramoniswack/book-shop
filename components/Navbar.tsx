'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, ShoppingCart, User, Menu, X, ChevronDown, Sun, Moon, BookOpen, LogOut, LayoutDashboard, Settings } from 'lucide-react'
import { useCurrency } from '@/contexts/CurrencyContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useCart } from '@/contexts/CartContext'
import SearchModal from './SearchModal'
import ProfileModal from './ProfileModal'
import { isAuthenticated, getUser, logout } from '@/utils/auth'
import { getGenres } from '@/utils/seller'
import apiRequest from '@/utils/api'

interface Genre {
  _id: string
  name: string
  subGenres: string[]
}

interface Book {
  _id: string
  title: string
  author: string
  images: string[]
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isBooksMenuOpen, setIsBooksMenuOpen] = useState(false)
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)
  const { currency, setCurrency } = useCurrency()
  const { isDarkMode, toggleTheme } = useTheme()
  const { cartCount } = useCart()
  const currencyRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Dynamic data
  const [genres, setGenres] = useState<Genre[]>([])
  const [bestsellers, setBestsellers] = useState<Book[]>([])
  const [newArrivals, setNewArrivals] = useState<Book[]>([])
  const [nepaliBooks, setNepaliBooks] = useState<Book[]>([])
  const [loadingData, setLoadingData] = useState(true)

  // Check authentication status
  useEffect(() => {
    setIsLoggedIn(isAuthenticated())
    setUser(getUser())
  }, [])

  // Fetch dynamic data for mega menu
  useEffect(() => {
    const fetchMegaMenuData = async () => {
      try {
        setLoadingData(true)
        
        // Fetch all books first to calculate genre book counts
        const booksResponse = await apiRequest('/books', { method: 'GET' })
        const allBooks = booksResponse.success ? (booksResponse.data.books || []) : []
        
        // Fetch genres
        const genresResponse = await getGenres({ limit: 100 })
        if (genresResponse.success) {
          // Filter out genres with no books
          const genresWithBooks = genresResponse.data.filter((genre: Genre) => {
            const bookCount = allBooks.filter((book: any) => 
              book.genres && book.genres.some((g: string) => 
                g.toLowerCase() === genre.name.toLowerCase()
              )
            ).length
            return bookCount > 0
          })
          setGenres(genresWithBooks)
        }

        // Fetch bestsellers for mega menu (showInMegaMenuBestseller=true, limit 3)
        const bestsellersResponse = await apiRequest('/books?showInMegaMenuBestseller=true&limit=3', { method: 'GET' })
        if (bestsellersResponse.success) {
          setBestsellers(bestsellersResponse.data.books || [])
        }

        // Fetch new arrivals for mega menu (showInMegaMenuNewArrival=true, limit 3)
        const newArrivalsResponse = await apiRequest('/books?showInMegaMenuNewArrival=true&limit=3', { method: 'GET' })
        if (newArrivalsResponse.success) {
          setNewArrivals(newArrivalsResponse.data.books || [])
        }

        // Fetch Nepali books for mega menu (showInMegaMenuNepali=true, limit 3)
        const nepaliBooksResponse = await apiRequest('/books?showInMegaMenuNepali=true&limit=3', { method: 'GET' })
        if (nepaliBooksResponse.success) {
          setNepaliBooks(nepaliBooksResponse.data.books || [])
        }
      } catch (error) {
        console.error('Error fetching mega menu data:', error)
      } finally {
        setLoadingData(false)
      }
    }

    fetchMegaMenuData()
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
                          {loadingData ? (
                            <div className="space-y-2">
                              {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                              ))}
                            </div>
                          ) : (
                            <ul className="space-y-1">
                              {genres.map((genre) => (
                                <li key={genre._id}>
                                  <div className="flex items-stretch gap-1">
                                    <Link
                                      href={`/genre/${genre.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                      className={`flex-1 flex items-center text-left text-gray-900 dark:text-gray-100 hover:text-bookStore-blue dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 py-2.5 px-3 rounded-md transition-all dark-transition font-semibold text-[15px] ${
                                        expandedGenre === genre.name ? 'bg-gray-50 dark:bg-gray-700 text-bookStore-blue dark:text-blue-400' : ''
                                      }`}
                                    >
                                      <span>{genre.name}</span>
                                    </Link>
                                    {genre.subGenres && genre.subGenres.length > 0 && (
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
                                    )}
                                  </div>
                                  
                                  {/* Sub-genres - Expand Below */}
                                  {expandedGenre === genre.name && genre.subGenres && genre.subGenres.length > 0 && (
                                    <ul className="mt-1 mb-2 ml-3 space-y-1 border-l-2 border-gray-200 dark:border-gray-600 pl-3">
                                      <li>
                                        <Link
                                          href={`/genre/${genre.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                          className="text-gray-600 dark:text-gray-400 hover:text-bookStore-blue dark:hover:text-blue-400 text-sm block py-1.5 px-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        >
                                          All
                                        </Link>
                                      </li>
                                      {genre.subGenres.map((subGenre) => (
                                        <li key={subGenre}>
                                          <Link
                                            href={`/genre/${genre.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/${subGenre.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
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
                          )}
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
                              {loadingData ? (
                                [...Array(3)].map((_, i) => (
                                  <div key={i} className="flex items-start space-x-3 p-2">
                                    <div className="w-[50px] h-[70px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                    <div className="flex-1 space-y-2">
                                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse"></div>
                                    </div>
                                  </div>
                                ))
                              ) : bestsellers.length > 0 ? (
                                bestsellers.map((book) => (
                                  <Link
                                    key={book._id}
                                    href={`/book/${book._id}`}
                                    className="flex items-start space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-md transition-colors group"
                                  >
                                    <Image
                                      src={book.images?.[0] || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&h=300&fit=crop'}
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
                                ))
                              ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400">No bestsellers available</p>
                              )}
                            </div>
                          </div>

                          {/* New Arrivals */}
                          <div>
                            <Link href="/new-arrivals">
                              <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-4 hover:text-bookStore-blue dark:hover:text-blue-400 cursor-pointer dark-transition text-base">New Arrivals</h4>
                            </Link>
                            <div className="space-y-3">
                              {loadingData ? (
                                [...Array(3)].map((_, i) => (
                                  <div key={i} className="flex items-start space-x-3 p-2">
                                    <div className="w-[50px] h-[70px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                    <div className="flex-1 space-y-2">
                                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse"></div>
                                    </div>
                                  </div>
                                ))
                              ) : newArrivals.length > 0 ? (
                                newArrivals.map((book) => (
                                  <Link
                                    key={book._id}
                                    href={`/book/${book._id}`}
                                    className="flex items-start space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-md transition-colors group"
                                  >
                                    <Image
                                      src={book.images?.[0] || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&h=300&fit=crop'}
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
                                ))
                              ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400">No new arrivals available</p>
                              )}
                            </div>
                          </div>

                          {/* Nepali Books */}
                          <div>
                            <Link href="/nepali-books">
                              <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-4 hover:text-bookStore-blue dark:hover:text-blue-400 cursor-pointer dark-transition text-base">Nepali Books</h4>
                            </Link>
                            <div className="space-y-3">
                              {loadingData ? (
                                [...Array(3)].map((_, i) => (
                                  <div key={i} className="flex items-start space-x-3 p-2">
                                    <div className="w-[50px] h-[70px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                    <div className="flex-1 space-y-2">
                                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse"></div>
                                    </div>
                                  </div>
                                ))
                              ) : nepaliBooks.length > 0 ? (
                                nepaliBooks.map((book) => (
                                  <Link
                                    key={book._id}
                                    href={`/book/${book._id}`}
                                    className="flex items-start space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-md transition-colors group"
                                  >
                                    <Image
                                      src={book.images?.[0] || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&h=300&fit=crop'}
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
                                ))
                              ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400">No Nepali books available</p>
                              )}
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
                      {(user.role === 'seller' || user.role === 'admin') && (
                        <p className="text-xs text-orange-500 dark:text-orange-400 font-medium mt-1">
                          {user.role === 'admin' ? 'Admin' : 'Seller'}
                        </p>
                      )}
                    </div>
                    {(user.role === 'seller' || user.role === 'admin') && (
                      <>
                        <Link
                          href="/seller"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <LayoutDashboard size={16} />
                          Seller Dashboard
                        </Link>
                        {user.role === 'admin' && (
                          <Link
                            href="/seo"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Settings size={16} />
                            SEO Settings
                          </Link>
                        )}
                        <div className="border-t border-gray-200 dark:border-gray-600"></div>
                      </>
                    )}
                    <Link
                      href="/profile"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsProfileOpen(true);
                        setIsUserMenuOpen(false);
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      Profile Settings
                    </Link>
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
      
      {/* Profile Modal */}
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </nav>
  )
}

export default Navbar