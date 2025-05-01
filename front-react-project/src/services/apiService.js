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
  }

  /**
   * Устанавливает токен авторизации для последующих запросов
   * @param {string} token - JWT токен
   */
  setAuthToken(token) {
    if (token) {
      this.headers['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.headers['Authorization'];
    }
  }

  /**
   * Выполняет GET-запрос к указанному эндпоинту
   * @param {string} endpoint - Эндпоинт API
   * @param {Object} params - Параметры запроса
   * @returns {Promise<any>} - Результат запроса
   */
  async get(endpoint, params = {}) {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
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
  }

  /**
   * Выполняет POST-запрос к указанному эндпоинту
   * @param {string} endpoint - Эндпоинт API
   * @param {Object} data - Данные для отправки
   * @returns {Promise<any>} - Результат запроса
   */
  async post(endpoint, data) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(data),
      });

      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Выполняет PUT-запрос к указанному эндпоинту
   * @param {string} endpoint - Эндпоинт API
   * @param {Object} data - Данные для отправки
   * @returns {Promise<any>} - Результат запроса
   */
  async put(endpoint, data) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify(data),
      });

      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Выполняет PATCH-запрос к указанному эндпоинту
   * @param {string} endpoint - Эндпоинт API
   * @param {Object} data - Данные для отправки
   * @returns {Promise<any>} - Результат запроса
   */
  async patch(endpoint, data) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PATCH',
        headers: this.headers,
        body: JSON.stringify(data),
      });

      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Выполняет DELETE-запрос к указанному эндпоинту
   * @param {string} endpoint - Эндпоинт API
   * @returns {Promise<any>} - Результат запроса
   */
  async delete(endpoint) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: this.headers,
      });

      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Обрабатывает ответ от сервера
   * @param {Response} response - Объект ответа
   * @returns {Promise<any>} - Обработанный результат
   */
  async handleResponse(response) {
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Ошибка запроса');
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

export default new ApiService();