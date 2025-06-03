import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

// Создаем контекст авторизации
const AuthContext = createContext(null);

// Хук для использования контекста авторизации
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Провайдер контекста авторизации
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
          await authService.logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      console.log('AuthContext: попытка входа');
      const response = await authService.login(credentials);
      console.log('AuthContext: успешный вход, ответ:', response);
      
      // Проверяем, есть ли данные пользователя в ответе
      if (response.user) {
        setUser(response.user);
      } else {
        // Если данных пользователя нет в ответе, запрашиваем их отдельно
        console.log('AuthContext: запрос данных пользователя');
        const userData = await authService.getCurrentUser();
        console.log('AuthContext: получены данные пользователя:', userData);
        setUser(userData);
      }
      
      return response;
    } catch (error) {
      console.error('AuthContext: ошибка при входе:', error);
      throw error;
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const register = async (userData) => {
    return authService.register(userData);
  };

  const isAuthenticated = () => !!user;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 