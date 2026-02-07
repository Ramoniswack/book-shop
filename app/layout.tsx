import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { CurrencyProvider } from '@/contexts/CurrencyContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { CartProvider } from '@/contexts/CartContext'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Books Mandala - Buy Books Online in Nepal | Worldwide Shipping',
  description: 'Nepal\'s largest online bookstore with over 35,000 books. Buy books online with worldwide shipping. Fiction, non-fiction, academic books and more.',
  keywords: 'books, Nepal, online bookstore, buy books, fiction, non-fiction, academic books',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <CurrencyProvider>
            <CartProvider>
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#10b981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 4000,
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
              {children}
            </CartProvider>
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}