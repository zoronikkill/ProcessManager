import apiService from './apiService';

/**
 * Сервис аутентификации и авторизации
 */
const authService = {
  /**
   * Получает данные текущего пользователя
   */
  async getCurrentUser() {
    try {
      console.log('authService: запрос данных текущего пользователя');
      const response = await apiService.get('/api/auth/user/');
      console.log('authService: получены данные пользователя:', response);
      // Если сервер вернул null, значит пользователь не аутентифицирован
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

  /**
   * Проверяет, аутентифицирован ли пользователь
   */
  async isAuthenticated() {
    try {
      const user = await this.getCurrentUser();
      return !!user;
    } catch {
      return false;
    }
  },

  /**
   * Выполняет вход пользователя
   */
  async login(username, password) {
    try {
      const response = await apiService.post('/api/auth/login/', { username, password });
      return response;
    } catch (error) {
      console.error('Ошибка при входе:', error);
      throw error;
    }
  },

  /**
   * Выполняет выход пользователя
   */
  async logout() {
    try {
      await apiService.post('/api/auth/logout/');
      return true;
    } catch (error) {
      console.error('Ошибка при выходе:', error);
      return false;
    }
  },

  /**
   * Регистрирует нового пользователя
   */
  async register(userData) {
    try {
      // Получаем CSRF-токен перед регистрацией
      await apiService.get('/api/auth/csrf/');
      
      const response = await apiService.post('/api/auth/register/', userData);
      return response;
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      console.error('Детали ошибки:', error.data);
      throw error;
    }
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
  },

  /**
   * Получает список всех пользователей
   * @returns {Promise<Array>} - Список пользователей
   */
  getUsers: async () => {
    try {
      console.log('Запрос списка пользователей...');
      const response = await apiService.get('/api/users/');
      console.log('Получен список пользователей:', response);
      
      // Проверяем, что ответ содержит поле results с массивом пользователей
      if (response && response.results && Array.isArray(response.results)) {
        return response.results;
      } else {
        console.error('Некорректный формат данных:', response);
        throw new Error('Получены некорректные данные от сервера');
      }
    } catch (error) {
      console.error('Ошибка при получении списка пользователей:', error);
      if (error.response) {
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