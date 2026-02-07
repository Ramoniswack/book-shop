'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle forgot password logic here
    console.log('Password reset request for:', email)
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/">
            <Image
              src="/bookstore-logo.svg"
              alt="BookStore"
              width={120}
              height={40}
              className="mx-auto mb-8"
            />
          </Link>
          
          {!isSubmitted ? (
            <>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
              <p className="text-gray-600">
                No worries! Enter your email address and we'll send you a link to reset your password.
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Check Your Email</h2>
              <p className="text-gray-600">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
            </>
          )}
        </div>

        {!isSubmitted ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-bookStore-blue focus:border-bookStore-blue focus:z-10 sm:text-sm"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-bookStore-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bookStore-blue transition-colors"
              >
                Send Reset Link
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Didn't receive the email? Check your spam folder or
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-bookStore-blue hover:text-blue-700 font-medium"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-bookStore-blue hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}