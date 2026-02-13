'use client';

import { useEffect, useState, useRef } from 'react';
import { Bell, User, ChevronDown, Menu } from 'lucide-react';
import Link from 'next/link';
import { getUser } from '@/utils/auth';
import { useCurrency } from '@/contexts/CurrencyContext';

interface SellerHeaderProps {
  onMenuClick?: () => void;
}

export default function SellerHeader({ onMenuClick }: SellerHeaderProps) {
  const [user, setUser] = useState<{ firstName: string; lastName: string; email: string } | null>(null);
  const { currency, setCurrency } = useCurrency();
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const currencyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userData = getUser();
    if (userData) {
      setUser(userData);
    }
  }, []);

  // Close currency dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
        setIsCurrencyOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currencyOptions = [
    { value: 'NPR', label: 'NPR', flag: '🇳🇵', country: 'Nepal' },
    { value: 'USD', label: 'USD', flag: '🇺🇸', country: 'United States' }
  ];

  const selectedCurrency = currencyOptions.find(option => option.value === currency);

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-4 md:px-6">
      {/* Left side - Menu button (mobile) and Title */}
      <div className="flex items-center space-x-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Page Title */}
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white">Seller Portal</h2>
      </div>

      {/* Right side - Currency, Notifications and User */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Currency Selector - Custom Dropdown - Hidden on small mobile */}
        <div className="relative hidden sm:block" ref={currencyRef}>
          <button
            onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
            className="flex items-center bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-400 rounded-lg px-2 md:px-3 py-2 md:py-2.5 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer group"
          >
            <span className="text-base md:text-lg mr-1 md:mr-2">{selectedCurrency?.flag}</span>
            <span className="text-gray-700 dark:text-gray-200 font-medium text-sm md:text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {selectedCurrency?.label}
            </span>
            <ChevronDown className={`w-3 h-3 md:w-4 md:h-4 text-gray-400 ml-1 md:ml-2 transition-all duration-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 ${isCurrencyOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Custom Dropdown */}
          {isCurrencyOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50">
              {currencyOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setCurrency(option.value as 'NPR' | 'USD');
                    setIsCurrencyOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                    currency === option.value ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'
                  }`}
                >
                  <span className="text-lg mr-3">{option.flag}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{option.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{option.country}</div>
                  </div>
                  {currency === option.value && (
                    <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications - Hidden on small mobile */}
        <button className="hidden sm:block relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          {/* Notification badge - can be dynamic */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Info */}
        <div className="flex items-center space-x-2 md:space-x-3 pl-2 md:pl-4 border-l border-gray-200 dark:border-gray-700">
          <Link href="/seller/settings" className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
            <User className="w-5 h-5 text-white" />
          </Link>
          <div className="text-sm hidden md:block">
            <p className="font-medium text-gray-900 dark:text-white">
              {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}
            </p>
            <Link href="/seller/settings" className="text-gray-500 dark:text-gray-400 text-xs hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {user?.email}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
