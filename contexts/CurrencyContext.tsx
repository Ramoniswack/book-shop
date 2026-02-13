'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface CurrencyContextType {
  currency: 'NPR' | 'USD'
  setCurrency: (currency: 'NPR' | 'USD') => void
  formatPrice: (price: number) => string
  convertPrice: (price: number) => number
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

// Exchange rate: 1 USD = 133 NPR (approximate)
const USD_TO_NPR_RATE = 133

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<'NPR' | 'USD'>('NPR')

  const convertPrice = (priceInNPR: number): number => {
    // Handle null, undefined, or invalid values
    if (priceInNPR == null || isNaN(priceInNPR)) {
      return 0
    }
    
    if (currency === 'USD') {
      return Math.round((priceInNPR / USD_TO_NPR_RATE) * 100) / 100 // Round to 2 decimal places
    }
    return priceInNPR
  }

  const formatPrice = (priceInNPR: number): string => {
    // Handle null, undefined, or invalid values
    if (priceInNPR == null || isNaN(priceInNPR)) {
      return currency === 'USD' ? '$0.00' : 'Rs. 0'
    }
    
    const convertedPrice = convertPrice(priceInNPR)
    
    if (currency === 'USD') {
      return `$${convertedPrice.toFixed(2)}`
    }
    return `Rs. ${convertedPrice.toLocaleString()}`
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}
