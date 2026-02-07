import apiRequest from './api';

export interface Address {
  _id?: string;
  label: 'Home' | 'Office' | 'Other';
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export const getAddresses = async () => {
  return await apiRequest('/addresses', {
    method: 'GET',
  });
};

export const addAddress = async (address: Omit<Address, '_id'>) => {
  return await apiRequest('/addresses', {
    method: 'POST',
    body: JSON.stringify(address),
  });
};

export const updateAddress = async (addressId: string, address: Partial<Address>) => {
  return await apiRequest(`/addresses/${addressId}`, {
    method: 'PUT',
    body: JSON.stringify(address),
  });
};

export const deleteAddress = async (addressId: string) => {
  return await apiRequest(`/addresses/${addressId}`, {
    method: 'DELETE',
  });
};

export const setDefaultAddress = async (addressId: string) => {
  return await apiRequest(`/addresses/${addressId}/default`, {
    method: 'PUT',
  });
};
