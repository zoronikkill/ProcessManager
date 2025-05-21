const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Базовый класс для работы с API.
 * Содержит общие методы для выполнения HTTP-запросов.
 */
class ApiService {
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || API_BASE_URL;
    this.headers = {
      'Content-Type': 'application/json',
    };
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenKey = 'process_manager_token';
    this.refreshTokenKey = 'process_manager_refresh_token';
    this.refreshPromise = null;
  }

  /**
   * Устанавливает токены авторизации из localStorage при инициализации
   */
  initTokens() {
    const accessToken = localStorage.getItem(this.tokenKey);
    const refreshToken = localStorage.getItem(this.refreshTokenKey);

    if (accessToken) {
      this.setAuthToken(accessToken);
    }

    if (refreshToken) {
      this.refreshToken = refreshToken;
    }
  }

  /**
   * Устанавливает токен авторизации для последующих запросов
   * @param {string} token - JWT токен
   */
  setAuthToken(token) {
    if (token) {
      this.accessToken = token;
      this.headers['Authorization'] = `Bearer ${token}`;
      localStorage.setItem(this.tokenKey, token);
    } else {
      this.accessToken = null;
      delete this.headers['Authorization'];
      localStorage.removeItem(this.tokenKey);
    }
  }

  /**
   * Устанавливает токен обновления
   * @param {string} token - JWT токен для обновления
   */
  setRefreshToken(token) {
    if (token) {
      this.refreshToken = token;
      localStorage.setItem(this.refreshTokenKey, token);
    } else {
      this.refreshToken = null;
      localStorage.removeItem(this.refreshTokenKey);
    }
  }

  /**
   * Очищает все токены авторизации
   */
  clearTokens() {
    this.setAuthToken(null);
    this.setRefreshToken(null);
  }

  /**
   * Обновляет токен доступа используя refresh token
   * @returns {Promise<boolean>} - Успешность обновления токена
   */
  async refreshAccessToken() {
    try {
      // Если уже идет запрос на обновление токена, ждем его завершения
      if (this.refreshPromise) {
        return this.refreshPromise;
      }

      // Если нет refresh токена, то нельзя обновить access токен
      if (!this.refreshToken) {
        return false;
      }

      // Создаем промис для выполнения запроса на обновление токена
      this.refreshPromise = new Promise(async (resolve) => {
        try {
          const response = await fetch(`${this.baseUrl}/auth/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: this.refreshToken }),
          });

          if (!response.ok) {
            // Если не удалось обновить токен, удаляем все токены
            this.clearTokens();
            resolve(false);
            return;
          }

          const data = await response.json();
          this.setAuthToken(data.access);

          // Если в ответе есть новый refresh токен, сохраняем его
          if (data.refresh) {
            this.setRefreshToken(data.refresh);
          }

          resolve(true);
        } catch (error) {
          console.error('Error refreshing token:', error);
          this.clearTokens();
          resolve(false);
        } finally {
          this.refreshPromise = null;
        }
      });

      return this.refreshPromise;
    } catch (error) {
      console.error('Error in refreshAccessToken:', error);
      this.clearTokens();
      return false;
    }
  }

  /**
   * Выполняет запрос с возможностью автоматического обновления токена при 401 ошибке
   * @param {Function} requestFunction - Функция для выполнения запроса
   * @returns {Promise<any>} - Результат запроса
   */
  async fetchWithTokenRefresh(requestFunction) {
    try {
      return await requestFunction();
    } catch (error) {
      // Если ошибка 401 Unauthorized и есть refresh токен, пытаемся обновить токен
      if (error.status === 401 && this.refreshToken) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          // Если токен успешно обновлен, повторяем запрос
          return requestFunction();
        }
      }
      throw error;
    }
  }

  /**
   * Выполняет GET-запрос к указанному эндпоинту
   * @param {string} endpoint - Эндпоинт API
   * @param {Object} params - Параметры запроса
   * @returns {Promise<any>} - Результат запроса
   */
  async get(endpoint, params = {}) {
    return this.fetchWithTokenRefresh(async () => {
      // Убедимся, что URL заканчивается на /
      const normalizedEndpoint = endpoint.endsWith('/') ? endpoint : `${endpoint}/`;
      const url = new URL(`${this.baseUrl}${normalizedEndpoint}`);
      
      // Добавляем параметры запроса к URL
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          url.searchParams.append(key, params[key]);
        }
      });

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: this.headers,
        });

        return this.handleResponse(response);
      } catch (error) {
        return this.handleError(error);
      }
    });
  }

  /**
   * Выполняет POST-запрос к указанному эндпоинту
   * @param {string} endpoint - Эндпоинт API
   * @param {Object} data - Данные для отправки
   * @returns {Promise<any>} - Результат запроса
   */
  async post(endpoint, data) {
    return this.fetchWithTokenRefresh(async () => {
      try {
        // Убедимся, что URL заканчивается на /
        const normalizedEndpoint = endpoint.endsWith('/') ? endpoint : `${endpoint}/`;
        const response = await fetch(`${this.baseUrl}${normalizedEndpoint}`, {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify(data),
        });

        return this.handleResponse(response);
      } catch (error) {
        return this.handleError(error);
      }
    });
  }

  /**
   * Выполняет PUT-запрос к указанному эндпоинту
   * @param {string} endpoint - Эндпоинт API
   * @param {Object} data - Данные для отправки
   * @returns {Promise<any>} - Результат запроса
   */
  async put(endpoint, data) {
    return this.fetchWithTokenRefresh(async () => {
      try {
        // Убедимся, что URL заканчивается на /
        const normalizedEndpoint = endpoint.endsWith('/') ? endpoint : `${endpoint}/`;
        const response = await fetch(`${this.baseUrl}${normalizedEndpoint}`, {
          method: 'PUT',
          headers: this.headers,
          body: JSON.stringify(data),
        });

        return this.handleResponse(response);
      } catch (error) {
        return this.handleError(error);
      }
    });
  }

  /**
   * Выполняет PATCH-запрос к указанному эндпоинту
   * @param {string} endpoint - Эндпоинт API
   * @param {Object} data - Данные для отправки
   * @returns {Promise<any>} - Результат запроса
   */
  async patch(endpoint, data) {
    return this.fetchWithTokenRefresh(async () => {
      try {
        // Убедимся, что URL заканчивается на /
        const normalizedEndpoint = endpoint.endsWith('/') ? endpoint : `${endpoint}/`;
        const response = await fetch(`${this.baseUrl}${normalizedEndpoint}`, {
          method: 'PATCH',
          headers: this.headers,
          body: JSON.stringify(data),
        });

        return this.handleResponse(response);
      } catch (error) {
        return this.handleError(error);
      }
    });
  }

  /**
   * Выполняет DELETE-запрос к указанному эндпоинту
   * @param {string} endpoint - Эндпоинт API
   * @returns {Promise<any>} - Результат запроса
   */
  async delete(endpoint) {
    return this.fetchWithTokenRefresh(async () => {
      try {
        // Убедимся, что URL заканчивается на /
        const normalizedEndpoint = endpoint.endsWith('/') ? endpoint : `${endpoint}/`;
        const response = await fetch(`${this.baseUrl}${normalizedEndpoint}`, {
          method: 'DELETE',
          headers: this.headers,
        });

        return this.handleResponse(response);
      } catch (error) {
        return this.handleError(error);
      }
    });
  }

  /**
   * Обрабатывает ответ от сервера
   * @param {Response} response - Объект ответа
   * @returns {Promise<any>} - Обработанный результат
   */
  async handleResponse(response) {
    if (!response.ok) {
      const error = {
        status: response.status,
        statusText: response.statusText,
      };
      
      try {
        // Пытаемся получить подробности ошибки из JSON
        const errorData = await response.json();
        error.message = errorData.message || errorData.detail || 'Ошибка запроса';
        error.errors = errorData.errors || {};
      } catch (e) {
        error.message = 'Ошибка запроса';
      }
      
      throw error;
    }

    // Для запросов без тела ответа (например DELETE)
    if (response.status === 204) {
      return { success: true };
    }

    // Для всех остальных запросов
    return await response.json();
  }

  /**
   * Обрабатывает ошибки запросов
   * @param {Error} error - Объект ошибки
   * @returns {Promise<never>} - Отклоненный промис с сообщением об ошибке
   */
  handleError(error) {
    console.error('API Error:', error);
    throw error;
  }
}

const apiService = new ApiService();
// Инициализация токенов при загрузке модуля
apiService.initTokens();

export default apiService;