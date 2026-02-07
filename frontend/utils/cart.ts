import apiRequest from './api';

interface CartItem {
  bookId: string
  title: string
  author: string
  price: number
  image: string
  quantity: number
}

export const addToCart = async (item: CartItem) => {
  return await apiRequest('/cart/add', {
    method: 'POST',
    body: JSON.stringify({ 
      bookId: item.bookId, 
      quantity: item.quantity 
    }),
  });
};

export const getCart = async () => {
  return await apiRequest('/cart', {
    method: 'GET',
  });
};

export const updateCartItem = async (bookId: string, quantity: number) => {
  return await apiRequest('/cart/update', {
    method: 'PUT',
    body: JSON.stringify({ bookId, quantity }),
  });
};

export const removeFromCart = async (bookId: string) => {
  return await apiRequest(`/cart/remove/${bookId}`, {
    method: 'DELETE',
  });
};
