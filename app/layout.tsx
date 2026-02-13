import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { CurrencyProvider } from '@/contexts/CurrencyContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { CartProvider } from '@/contexts/CartContext'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://bookstore.com'),
  title: {
    default: 'BookStore Nepal - Buy Books Online | Worldwide Shipping',
    template: '%s | BookStore Nepal',
  },
  description: 'Nepal\'s largest online bookstore with over 35,000 books. Buy books online with worldwide shipping. Fiction, non-fiction, academic books and more.',
  keywords: 'books Nepal, online bookstore, buy books online, fiction, non-fiction, academic books, bestsellers, new arrivals',
  authors: [{ name: 'BookStore Nepal' }],
  creator: 'BookStore Nepal',
  publisher: 'BookStore Nepal',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bookstore.com',
    siteName: 'BookStore Nepal',
    title: 'BookStore Nepal - Buy Books Online',
    description: 'Nepal\'s largest online bookstore with over 35,000 books.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BookStore Nepal - Buy Books Online',
    description: 'Nepal\'s largest online bookstore with over 35,000 books.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
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