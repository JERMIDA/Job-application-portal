import api from './api';
import { toast } from 'react-toastify';

const getAuthToken = () => localStorage.getItem('token');

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    toast.success('Registration successful');
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to register');
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    toast.success('Login successful');
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to login');
    throw new Error(`Failed to login: ${error.response?.data?.message || error.message}`);
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  toast.info('Logged out successfully');
};

export const getProfile = async () => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error('No token found');
    const response = await api.get('/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to fetch profile');
    throw error;
  }
};

export const updateProfile = async (userData) => {
  try {
    const token = getAuthToken();
    let headers = { Authorization: `Bearer ${token}` };
    let data = userData;
    if (userData instanceof FormData) {
      headers['Content-Type'] = 'multipart/form-data';
    }
    const response = await api.put('/auth/profile', data, { headers });
    toast.success('Profile updated successfully');
    return response.data;
  } catch (error) {
    toast.error('Failed to update profile');
    throw error;
  }
};