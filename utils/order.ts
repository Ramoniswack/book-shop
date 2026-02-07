import apiRequest from './api';

interface OrderData {
  items: Array<{
    bookId: string
    title: string
    author: string
    price: number
    quantity: number
    image: string
  }>
  totalAmount: number
  shippingAddress: string
  deliveryMethod: string
  orderNote?: string
  paymentStatus: string
}

export const createOrder = async (orderData: OrderData) => {
  return await apiRequest('/orders/create', {
    method: 'POST',
    body: JSON.stringify({
      shippingAddress: orderData.shippingAddress,
      deliveryMethod: orderData.deliveryMethod,
      orderNote: orderData.orderNote
    }),
  });
};

export const getOrders = async () => {
  return await apiRequest('/orders', {
    method: 'GET',
  });
};

export const getOrderById = async (orderId: string) => {
  return await apiRequest(`/orders/${orderId}`, {
    method: 'GET',
  });
};

export const cancelOrder = async (orderId: string) => {
  return await apiRequest(`/orders/${orderId}/cancel`, {
    method: 'PUT',
  });
};
