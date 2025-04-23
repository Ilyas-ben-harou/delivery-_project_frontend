// src/services/orderService.js
import {clientAxios} from '../api/axios';

export const createOrder = async (orderData) => {
  try {
    const response = await clientAxios.post('/orders', orderData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred while creating the order' };
  }
};

export const getZoneGeographics = async () => {
  try {
    const response = await clientAxios.get('/zone-geographics');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred while fetching zones' };
  }
};