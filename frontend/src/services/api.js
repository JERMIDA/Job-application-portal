import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Ensure this matches the backend port
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Add the Authorization header
  }
  // Check for undefined parameters in the URL
  if (config.url.includes('undefined')) {
    console.error('API request contains undefined parameter:', config.url);
    throw new Error('Invalid API request: undefined parameter in URL');
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast.error('Session expired. Please login again.');
      // Optionally, redirect to the login page
    }
    return Promise.reject(error);
  }
);

export default api;