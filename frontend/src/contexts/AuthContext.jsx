import { createContext, useContext } from 'react';
import { useAuthValue } from './authContextValue';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { auth, setAuth, login, logout } = useAuthValue();

  const value = {
    auth,
    setAuth,
    login,
    logout,
    userRole: auth?.role || 'guest', // Include user role for role-based rendering
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);