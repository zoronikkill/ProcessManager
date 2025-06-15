import apiService from './apiService';

const authService = {

  async getCurrentUser() {
    try {
      console.log('authService: запрос данных текущего пользователя');
      const response = await apiService.get('/api/auth/user/');
      console.log('authService: получены данные пользователя:', response);
      if (response === null) {
        return null;
      }
      return response;
    } catch (error) {
      console.error('Error fetching current user:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        data: error.data
      });
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

  async isAuthenticated() {
    try {
      const user = await this.getCurrentUser();
      return !!user;
    } catch {
      return false;
    }
  },


  async login(credentials) {
    try {
      const response = await apiService.post('/api/auth/login/', {
        username: credentials.username,
        password: credentials.password
      });

      if (response.is_staff && response.is_superuser) {
        console.log('Пользователь является администратором');
      }
      
      return response;
    } catch (error) {
      console.error('Ошибка при входе:', error);
      throw error;
    }
  },

  async logout() {
    try {
      await apiService.post('/api/auth/logout/');
      return true;
    } catch (error) {
      console.error('Ошибка при выходе:', error);
      return false;
    }
  },

  async register(userData) {
    try {
      await apiService.get('/api/auth/csrf/');

      if (!userData.username || !userData.email || !userData.password) {
        throw new Error('Не все обязательные поля заполнены');
      }

      const logData = { ...userData };
      delete logData.password;
      console.log('Подготовленные данные для регистрации:', logData);
      
      const response = await apiService.post('/api/auth/register/', userData);
      console.log('Успешный ответ от сервера:', response);
      return response;
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      if (error.response) {
        console.error('Статус ошибки:', error.response.status);
        console.error('Данные ошибки:', error.response.data);
      }
      throw error;
    }
  },

  /**
   * Запрос на восстановление пароля
   * @param {string} email - Email пользователя
   * @returns {Promise<{success: boolean}>} - Результат операции
   */
  async requestPasswordReset(email) {
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
  },

  /**
   * Получает список всех пользователей
   * @returns {Promise<Array>} - Список пользователей
   */
  async getUsers() {
    try {
      console.log('Запрос списка пользователей...');
      const response = await apiService.get('/api/users/');
      console.log('Получен список пользователей:', response);
      
      if (response && response.results && Array.isArray(response.results)) {
        return response.results;
      } else if (response && Array.isArray(response)) {
        return response;
      } else {
        console.error('Некорректный формат данных:', response);
        throw new Error('Получены некорректные данные от сервера');
      }
    } catch (error) {
      console.error('Ошибка при получении списка пользователей:', error);
      if (error.response?.data) {
        console.error('Детали ошибки:', error.response.data);
        throw new Error(error.response.data.detail || 'Ошибка при получении списка пользователей');
      }
      throw error;
    }
  },

  /**
   * Удаляет пользователя
   * @param {string|number} userId - Идентификатор пользователя
   * @returns {Promise<{success: boolean}>} - Результат операции
   */
  deleteUser: async (userId) => {
    try {
      console.log('Попытка удаления пользователя:', userId);
      const response = await apiService.delete(`/api/users/${userId}/`);
      console.log('Пользователь успешно удален');
      return response;
    } catch (error) {
      console.error('Ошибка при удалении пользователя:', error);
      throw error;
    }
  }
};

export default authService;