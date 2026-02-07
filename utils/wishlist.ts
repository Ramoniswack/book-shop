import apiRequest from './api';

interface WishlistItem {
  bookId: string
  title: string
  author: string
  price: number
  image: string
}

export const addToWishlist = async (item: WishlistItem) => {
  return await apiRequest('/wishlist/add', {
    method: 'POST',
    body: JSON.stringify({ bookId: item.bookId }),
  });
};

export const getWishlist = async () => {
  return await apiRequest('/wishlist', {
    method: 'GET',
  });
};

export const removeFromWishlist = async (bookId: string) => {
  return await apiRequest(`/wishlist/remove/${bookId}`, {
    method: 'DELETE',
  });
};
