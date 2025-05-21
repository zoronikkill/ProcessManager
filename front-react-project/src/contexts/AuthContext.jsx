import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

// Создаем контекст авторизации
const AuthContext = createContext();

// Хук для использования контекста авторизации
export const useAuth = () => {
  return useContext(AuthContext);
};

// Провайдер контекста авторизации
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUserSession = async () => {
      if (authService.isAuthenticated()) {
        try {
          const updatedUser = await authService.fetchCurrentUser();
          setCurrentUser(updatedUser);
        } catch (error) {
          console.error('Error verifying user session:', error);
        }
      }
      setLoading(false);
    };

    verifyUserSession();
  }, []);

  const login = async (username, password) => {
    const response = await authService.login(username, password);
    setCurrentUser(authService.getCurrentUser());
    return response;
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const register = async (userData) => {
    return authService.register(userData);
  };

  const isAuthenticated = () => !!currentUser;

  const value = {
    currentUser,
    loading,
    login,
    logout,
    register,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 