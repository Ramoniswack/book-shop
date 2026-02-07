// Helper to ensure book exists in backend before adding to cart/wishlist
// This creates a temporary book if it doesn't exist

interface BookData {
  id: string
  title: string
  author: string
  price: number
  image: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Cache to store dummy ID to MongoDB ID mappings
const bookIdCache = new Map<string, string>();

export const ensureBookExists = async (book: BookData): Promise<string> => {
  // Check cache first
  if (bookIdCache.has(book.id)) {
    return bookIdCache.get(book.id)!;
  }

  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    // Try to create/get the book in backend
    const response = await fetch(`${API_URL}/books/ensure`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify({
        dummyId: book.id,
        title: book.title,
        author: book.author,
        price: book.price,
        imageUrl: book.image,
        stock: 100, // Default stock
        category: 'General',
        format: 'paperback'
      })
    });

    const data = await response.json();
    
    if (data.success && data.data.book) {
      const mongoId = data.data.book._id;
      // Cache the mapping
      bookIdCache.set(book.id, mongoId);
      return mongoId;
    }
    
    // If failed, return the dummy ID (will fail at backend but better than nothing)
    return book.id;
  } catch (error) {
    console.error('Error ensuring book exists:', error);
    return book.id;
  }
};

// Clear cache (useful for testing)
export const clearBookCache = () => {
  bookIdCache.clear();
};
