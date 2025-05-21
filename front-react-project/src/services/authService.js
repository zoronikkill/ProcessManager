import apiService from './apiService';

/**
 * Сервис аутентификации и авторизации
 */
class AuthService {
  /**
   * Базовый эндпоинт для API аутентификации
   */
  constructor() {
    this.endpoint = '/auth/';
    this.tokenKey = 'process_manager_token';
    this.userKey = 'process_manager_user';
    this.initAuth();
  }

  /**
   * Авторизация пользователя
   * @param {string} username - Имя пользователя
   * @param {string} password - Пароль
   * @returns {Promise<{token: string, user: Object}>} - Информация о пользователе и токен
   */
  login = async (username, password) => {
    const loginEndpoint = `${this.endpoint}login/`;
    const tokenResponse = await apiService.post(loginEndpoint, { username, password });

    if (tokenResponse && tokenResponse.access) {
      apiService.setAuthToken(tokenResponse.access);
      if (tokenResponse.refresh) {
        apiService.setRefreshToken(tokenResponse.refresh);
      }

      try {
        const user = await this.fetchCurrentUser();
        return { token: tokenResponse.access, user };
      } catch (fetchError) {
        console.error('Error fetching user details after login:', fetchError);
        this.logout();
        throw new Error('Login successful, but failed to retrieve user details.');
      }
    } else {
      console.error('Login failed: No access token in response.', tokenResponse);
      throw new Error('Неверный логин или пароль.');
    }
  }

  /**
   * Выход из системы
   */
  logout = () => {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    apiService.setAuthToken(null);
  }

  /**
   * Регистрация нового пользователя
   * @param {Object} userData - Данные пользователя
   * @returns {Promise<Object>} - Созданный пользователь
   */
  register = async (userData) => {
    const registerEndpoint = `${this.endpoint}register/`;
    return apiService.post(registerEndpoint, userData);
  }

  /**
   * Запрос на восстановление пароля
   * @param {string} email - Email пользователя
   * @returns {Promise<{success: boolean}>} - Результат операции
   */
  requestPasswordReset = async (email) => {
    const requestPasswordResetEndpoint = `${this.endpoint}password-reset/`;
    return apiService.post(requestPasswordResetEndpoint, { email });
  }

  /**
   * Сброс пароля
   * @param {string} token - Токен сброса пароля
   * @param {string} newPassword - Новый пароль
   * @returns {Promise<{success: boolean}>} - Результат операции
   */
  resetPassword = async (token, newPassword) => {
    const resetPasswordEndpoint = `${this.endpoint}password-reset/confirm/`;
    return apiService.post(resetPasswordEndpoint, {
      token,
      new_password: newPassword
    });
  }

  /**
   * Получает текущего пользователя из localStorage
   * @returns {Object|null} - Данные пользователя или null
   */
  getCurrentUser = () => {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Получает информацию о текущем пользователе с сервера
   * @returns {Promise<Object>} - Данные пользователя
   */
  fetchCurrentUser = async () => {
    const meEndpoint = `${this.endpoint}me/`;
    const user = await apiService.get(meEndpoint);
    if (user) {
      localStorage.setItem(this.userKey, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.userKey);
      console.warn('fetchCurrentUser: No user data received from /me endpoint.');
    }
    return user;
  }

  /**
   * Проверяет, залогинен ли пользователь
   * @returns {boolean} - true, если пользователь залогинен
   */
  isAuthenticated = () => {
    if (typeof localStorage === 'undefined') {
      return false;
    }
    return !!localStorage.getItem(this.tokenKey);
  }

  /**
   * Инициализирует сервис аутентификации
   * Восстанавливает токен из localStorage, если он там есть
   */
  initAuth = () => {
    if (typeof localStorage === 'undefined') {
      return;
    }
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      apiService.setAuthToken(token);
    }
  }
}

const authServiceInstance = new AuthService();

export default authServiceInstance;