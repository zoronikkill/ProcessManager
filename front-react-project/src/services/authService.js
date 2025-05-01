import apiService from './apiService';

/**
 * Сервис аутентификации и авторизации
 */
class AuthService {
  /**
   * Базовый эндпоинт для API аутентификации
   */
  constructor() {
    this.endpoint = '/auth';
    this.tokenKey = 'process_manager_token';
    this.userKey = 'process_manager_user';
  }

  /**
   * Авторизация пользователя
   * @param {string} username - Имя пользователя
   * @param {string} password - Пароль
   * @returns {Promise<{token: string, user: Object}>} - Информация о пользователе и токен
   */
  async login(username, password) {
    const response = await apiService.post(`${this.endpoint}/login`, { username, password });
    
    if (response.token) {
      localStorage.setItem(this.tokenKey, response.token);
      localStorage.setItem(this.userKey, JSON.stringify(response.user));
      apiService.setAuthToken(response.token);
    }
    
    return response;
  }

  /**
   * Выход из системы
   */
  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    apiService.setAuthToken(null);
  }

  /**
   * Регистрация нового пользователя
   * @param {Object} userData - Данные пользователя
   * @returns {Promise<Object>} - Созданный пользователь
   */
  async register(userData) {
    return apiService.post(`${this.endpoint}/register`, userData);
  }

  /**
   * Запрос на восстановление пароля
   * @param {string} email - Email пользователя
   * @returns {Promise<{success: boolean}>} - Результат операции
   */
  async requestPasswordReset(email) {
    return apiService.post(`${this.endpoint}/password-reset`, { email });
  }

  /**
   * Сброс пароля
   * @param {string} token - Токен сброса пароля
   * @param {string} newPassword - Новый пароль
   * @returns {Promise<{success: boolean}>} - Результат операции
   */
  async resetPassword(token, newPassword) {
    return apiService.post(`${this.endpoint}/password-reset/confirm`, {
      token,
      new_password: newPassword
    });
  }

  /**
   * Получает текущего пользователя из localStorage
   * @returns {Object|null} - Данные пользователя или null
   */
  getCurrentUser() {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Получает информацию о текущем пользователе с сервера
   * @returns {Promise<Object>} - Данные пользователя
   */
  async fetchCurrentUser() {
    const response = await apiService.get(`${this.endpoint}/me`);
    localStorage.setItem(this.userKey, JSON.stringify(response));
    return response;
  }

  /**
   * Проверяет, залогинен ли пользователь
   * @returns {boolean} - true, если пользователь залогинен
   */
  isAuthenticated() {
    return !!localStorage.getItem(this.tokenKey);
  }

  /**
   * Инициализирует сервис аутентификации
   * Восстанавливает токен из localStorage, если он там есть
   */
  initAuth() {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      apiService.setAuthToken(token);
    }
  }
}

export default new AuthService();