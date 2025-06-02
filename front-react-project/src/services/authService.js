import apiService from './apiService';

/**
 * Сервис аутентификации и авторизации
 */
export const authService = {
  /**
   * Получает текущего пользователя из localStorage
   * @returns {Object|null} - Данные пользователя или null
   */
  getCurrentUser: async () => {
    try {
      const response = await apiService.get('/api/auth/me/');
      return response;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  },

  /**
   * Получает токен пользователя
   * @returns {string|null} - Токен пользователя или null
   */
  getToken: () => {
    return apiService.getToken();
  },

  /**
   * Проверяет, залогинен ли пользователь
   * @returns {boolean} - true, если пользователь залогинен
   */
  isAuthenticated: () => {
    return apiService.isAuthenticated();
  },

  /**
   * Авторизация пользователя
   * @param {Object} credentials - Учетные данные пользователя
   * @returns {Promise<Object>} - Информация о пользователе и токены
   */
  login: async (credentials) => {
    try {
      const response = await apiService.post('/api/auth/login/', credentials);
      
      // Проверяем различные форматы ответа
      if (response.access) {
        apiService.setAuthToken(response.access);
        if (response.refresh) {
          apiService.setRefreshToken(response.refresh);
        }
        return response;
      } else if (response.token) {
        apiService.setAuthToken(response.token);
        return response;
      }
      
      throw new Error('Invalid token format in response');
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  },

  /**
   * Выход из системы
   */
  logout: async () => {
    try {
      await apiService.post('/api/auth/logout/');
    } finally {
      apiService.clearToken();
    }
  },

  /**
   * Регистрация нового пользователя
   * @param {Object} userData - Данные пользователя
   * @returns {Promise<Object>} - Созданный пользователь
   */
  register: async (userData) => {
    return apiService.post('/api/auth/register/', userData);
  },

  /**
   * Запрос на восстановление пароля
   * @param {string} email - Email пользователя
   * @returns {Promise<{success: boolean}>} - Результат операции
   */
  requestPasswordReset: async (email) => {
    const requestPasswordResetEndpoint = '/auth/password-reset/';
    return apiService.post(requestPasswordResetEndpoint, { email });
  },

  /**
   * Сброс пароля
   * @param {string} token - Токен сброса пароля
   * @param {string} newPassword - Новый пароль
   * @returns {Promise<{success: boolean}>} - Результат операции
   */
  resetPassword: async (token, newPassword) => {
    const resetPasswordEndpoint = '/auth/password-reset/confirm/';
    return apiService.post(resetPasswordEndpoint, {
      token,
      new_password: newPassword
    });
  }
};