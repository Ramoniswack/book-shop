/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#1a6489',
          600: '#0284c7',
          700: '#0369a1',
        },
        booksmandala: {
          blue: '#1a6489',
          'blue-rgb': 'rgba(26, 100, 137, 1)',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#1a1a1a',
          800: '#121212',
          900: '#0a0a0a',
        },
        sage: {
          50: '#f6f7f6',
          100: '#e3e8e3',
          600: '#6b8e6b',
          700: '#4a6b4a',
          900: '#2d4a2d',
        },
        sand: {
          50: '#faf9f7',
          100: '#f5f1eb',
        },
        coral: {
          500: '#ff6b6b',
          600: '#ee5a52',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}