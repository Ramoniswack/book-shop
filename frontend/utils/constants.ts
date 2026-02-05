export const SITE_CONFIG = {
  name: 'Books Mandala',
  description: 'Nepal\'s largest online bookstore with over 35,000 books',
  url: 'https://booksmandala.com',
  email: 'info@booksmandala.com',
  phone: '+977-1-4123456',
  address: 'Baluwatar, Kathmandu, Nepal'
}

export const GENRES = [
  { 
    id: '1', 
    name: 'Fiction and Literature', 
    slug: 'fiction-and-literature', 
    bookCount: 5420,
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop&q=80',
    description: 'Novels, short stories, and literary fiction'
  },
  { 
    id: '2', 
    name: 'Business and Investing', 
    slug: 'business-and-investing', 
    bookCount: 3210,
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=300&fit=crop&q=80',
    description: 'Business strategy, finance, and investment guides'
  },
  { 
    id: '3', 
    name: 'Arts and Photography', 
    slug: 'arts-and-photography', 
    bookCount: 8750,
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop&q=80',
    description: 'Art history, photography techniques, and visual arts'
  },
  { 
    id: '4', 
    name: 'Children', 
    slug: 'children', 
    bookCount: 2340,
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop&q=80',
    description: 'Picture books, early readers, and children\'s stories'
  },
  { 
    id: '5', 
    name: 'Foreign Languages', 
    slug: 'foreign-languages', 
    bookCount: 1890,
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop&q=80',
    description: 'Language learning and books in various languages'
  },
  { 
    id: '6', 
    name: 'Nepali Books', 
    slug: 'nepali-books', 
    bookCount: 4560,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop&q=80',
    description: 'Literature and books in Nepali language'
  },
  { 
    id: '7', 
    name: 'History, Biography, and Social Science', 
    slug: 'history-biography-social-science', 
    bookCount: 1230,
    image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=300&fit=crop&q=80',
    description: 'Historical accounts, biographies, and social studies'
  },
  { 
    id: '8', 
    name: 'Boxed Sets', 
    slug: 'boxed-sets', 
    bookCount: 980,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop&q=80',
    description: 'Complete series and multi-volume collections'
  },
  { 
    id: '9', 
    name: 'Self Help', 
    slug: 'self-help', 
    bookCount: 1450,
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=300&fit=crop&q=80',
    description: 'Personal development and self-improvement'
  },
  { 
    id: '10', 
    name: 'Science', 
    slug: 'science', 
    bookCount: 2100,
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop&q=80',
    description: 'Scientific research, discoveries, and theories'
  }
]

export const FEATURED_BOOKS = [
  {
    id: '1',
    title: 'The Seven Husbands of Evelyn Hugo',
    author: 'Taylor Jenkins Reid',
    price: 1250,
    originalPrice: 1500,
    rating: 4.8,
    reviewCount: 234,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop&q=80',
    genre: 'Fiction and Literature',
    language: 'English',
    inStock: true,
    isFeatured: true,
    isBestseller: true
  },
  {
    id: '2',
    title: 'Atomic Habits',
    author: 'James Clear',
    price: 1800,
    rating: 4.9,
    reviewCount: 456,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop&q=80',
    genre: 'Self Help',
    language: 'English',
    inStock: true,
    isFeatured: true,
    isBestseller: true
  },
  {
    id: '3',
    title: 'Palpasa Cafe',
    author: 'Narayan Wagle',
    price: 450,
    rating: 4.6,
    reviewCount: 189,
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop&q=80',
    genre: 'Nepali Books',
    language: 'Nepali',
    inStock: true,
    isFeatured: true
  },
  {
    id: '4',
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    price: 1650,
    originalPrice: 1900,
    rating: 4.7,
    reviewCount: 312,
    image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop&q=80',
    genre: 'Business and Investing',
    language: 'English',
    inStock: true,
    isFeatured: true
  },
  {
    id: '5',
    title: 'Shirish Ko Phool',
    author: 'Parijat',
    price: 380,
    rating: 4.5,
    reviewCount: 156,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop&q=80',
    genre: 'Nepali Books',
    language: 'Nepali',
    inStock: true,
    isFeatured: true
  }
]

export const BESTSELLERS = [
  {
    id: '6',
    title: 'It Ends with Us',
    author: 'Colleen Hoover',
    price: 1350,
    rating: 4.6,
    reviewCount: 567,
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop&q=80',
    genre: 'Fiction and Literature',
    language: 'English',
    inStock: true,
    isBestseller: true
  },
  {
    id: '7',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    price: 950,
    rating: 4.8,
    reviewCount: 789,
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop&q=80',
    genre: 'Fiction and Literature',
    language: 'English',
    inStock: true,
    isBestseller: true
  },
  {
    id: '8',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    price: 2100,
    originalPrice: 2400,
    rating: 4.7,
    reviewCount: 445,
    image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop&q=80',
    genre: 'History, Biography, and Social Science',
    language: 'English',
    inStock: true,
    isBestseller: true
  },
  {
    id: '9',
    title: 'Rich Dad Poor Dad',
    author: 'Robert Kiyosaki',
    price: 1200,
    rating: 4.5,
    reviewCount: 324,
    image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop&q=80',
    genre: 'Business and Investing',
    language: 'English',
    inStock: true,
    isBestseller: true
  },
  {
    id: '18',
    title: 'Think and Grow Rich',
    author: 'Napoleon Hill',
    price: 890,
    rating: 4.6,
    reviewCount: 456,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop&q=80',
    genre: 'Self Help',
    language: 'English',
    inStock: true,
    isBestseller: true
  },
  {
    id: '19',
    title: 'The 7 Habits of Highly Effective People',
    author: 'Stephen Covey',
    price: 1450,
    rating: 4.7,
    reviewCount: 678,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop&q=80',
    genre: 'Self Help',
    language: 'English',
    inStock: true,
    isBestseller: true
  },
  {
    id: '20',
    title: 'How to Win Friends and Influence People',
    author: 'Dale Carnegie',
    price: 1100,
    rating: 4.5,
    reviewCount: 543,
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop&q=80',
    genre: 'Self Help',
    language: 'English',
    inStock: true,
    isBestseller: true
  }
]

export const NEW_ARRIVALS = [
  {
    id: '10',
    title: 'Fourth Wing',
    author: 'Rebecca Ross',
    price: 1450,
    rating: 4.5,
    reviewCount: 123,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop',
    genre: 'Fiction and Literature',
    language: 'English',
    inStock: true,
    isNew: true
  },
  {
    id: '11',
    title: 'Tomorrow, and Tomorrow, and Tomorrow',
    author: 'Gabrielle Zevin',
    price: 1680,
    rating: 4.4,
    reviewCount: 89,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop&q=80',
    genre: 'Fiction and Literature',
    language: 'English',
    inStock: true,
    isNew: true
  },
  {
    id: '12',
    title: 'The Thursday Murder Club',
    author: 'Richard Osman',
    price: 1320,
    rating: 4.3,
    reviewCount: 67,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop&q=80',
    genre: 'Fiction and Literature',
    language: 'English',
    inStock: true,
    isNew: true
  },
  {
    id: '13',
    title: 'Digital Photography Complete Course',
    author: 'David Taylor',
    price: 2200,
    rating: 4.6,
    reviewCount: 156,
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop&q=80',
    genre: 'Arts and Photography',
    language: 'English',
    inStock: true,
    isNew: true
  }
]

// Additional books for different genres
export const ALL_BOOKS = [
  ...FEATURED_BOOKS,
  ...BESTSELLERS,
  ...NEW_ARRIVALS,
  {
    id: '14',
    title: 'The Complete Works of Shakespeare',
    author: 'William Shakespeare',
    price: 2500,
    rating: 4.8,
    reviewCount: 445,
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop',
    genre: 'Boxed Sets',
    language: 'English',
    inStock: true
  },
  {
    id: '15',
    title: 'Learn Spanish in 30 Days',
    author: 'Maria Rodriguez',
    price: 890,
    rating: 4.2,
    reviewCount: 234,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop',
    genre: 'Foreign Languages',
    language: 'English',
    inStock: true
  },
  {
    id: '16',
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    price: 1450,
    rating: 4.7,
    reviewCount: 567,
    image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop',
    genre: 'Science',
    language: 'English',
    inStock: true
  },
  {
    id: '17',
    title: 'Where the Crawdads Sing',
    author: 'Delia Owens',
    price: 1250,
    originalPrice: 1400,
    rating: 4.6,
    reviewCount: 789,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop',
    genre: 'Fiction and Literature',
    language: 'English',
    inStock: true
  }
]

export const PAGINATION_LIMIT = 20