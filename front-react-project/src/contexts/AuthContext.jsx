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
      try {
        const userData = await authService.getCurrentUser();
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      console.log('AuthContext: попытка входа');
      
      // Если переданы готовые данные пользователя (после регистрации)
      if (credentials.user && credentials.user.id) {
        console.log('AuthContext: установка данных пользователя после регистрации');
        setUser(credentials.user);
        return credentials.user;
      }
      
      // Обычный вход с логином и паролем
      const response = await authService.login(credentials);
      console.log('AuthContext: успешный вход, ответ:', response);
      
      // Проверяем права администратора
      if (response.is_staff && response.is_superuser) {
        console.log('AuthContext: пользователь является администратором');
      }
      
      // Устанавливаем данные пользователя
      setUser(response);
      
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

  const isAdmin = () => user && user.is_staff && user.is_superuser;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 