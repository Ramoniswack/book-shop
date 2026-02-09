'use client';

import { useEffect, useState, useRef } from 'react';
import { Bell, User, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { getUser } from '@/utils/auth';
import { useCurrency } from '@/contexts/CurrencyContext';

export default function SellerHeader() {
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
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
      {/* Page Title - can be dynamic based on route */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Seller Portal</h2>
      </div>

      {/* Right side - Currency, Notifications and User */}
      <div className="flex items-center space-x-4">
        {/* Currency Selector - Custom Dropdown */}
        <div className="relative" ref={currencyRef}>
          <button
            onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
            className="flex items-center bg-white border border-gray-200 hover:border-blue-600 rounded-lg px-3 py-2.5 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer group"
          >
            <span className="text-lg mr-2">{selectedCurrency?.flag}</span>
            <span className="text-gray-700 font-medium text-base group-hover:text-blue-600 transition-colors">
              {selectedCurrency?.label}
            </span>
            <ChevronDown className={`w-4 h-4 text-gray-400 ml-2 transition-all duration-200 group-hover:text-blue-600 ${isCurrencyOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Custom Dropdown */}
          {isCurrencyOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              {currencyOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setCurrency(option.value as 'NPR' | 'USD');
                    setIsCurrencyOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                    currency === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <span className="text-lg mr-3">{option.flag}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{option.label}</div>
                    <div className="text-xs text-gray-500">{option.country}</div>
                  </div>
                  {currency === option.value && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          {/* Notification badge - can be dynamic */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Info */}
        <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
          <Link href="/seller/settings" className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
            <User className="w-5 h-5 text-white" />
          </Link>
          <div className="text-sm">
            <p className="font-medium text-gray-900">
              {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}
            </p>
            <Link href="/seller/settings" className="text-gray-500 text-xs hover:text-blue-600 transition-colors">
              {user?.email}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
