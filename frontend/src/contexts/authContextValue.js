import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

export const useAuthValue = () => {
  const [auth, setAuth] = useState(() => {
    const storedAuth = JSON.parse(localStorage.getItem('auth'));
    return storedAuth || { user: null, token: null };
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && typeof token === 'string' && token !== 'undefined' && token.split('.').length === 3) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          logout();
        } else {
          setAuth({
            user: decodedToken,
            token,
          });
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Invalid token:', error.message);
        localStorage.removeItem('token');
        setAuth({ user: null, token: null });
      }
    } else {
      // Remove invalid or undefined token
      localStorage.removeItem('token');
      setAuth({ user: null, token: null });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify(auth));
  }, [auth]);

  const login = (userData) => {
    localStorage.setItem('token', userData.token);
    setAuth({
      user: userData.user,
      token: userData.token,
    });
    api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuth({
      user: null,
      token: null,
    });
    delete api.defaults.headers.common['Authorization'];
  };

  return { auth, setAuth, login, logout };
};