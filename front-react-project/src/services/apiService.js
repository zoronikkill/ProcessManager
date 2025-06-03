const API_BASE_URL = 'http://localhost:8000';

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
   * Получает CSRF токен из куки
   */
  getCsrfToken() {
    const name = 'csrftoken';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  /**
   * Обновляет заголовки запроса
   */
  updateHeaders() {
    const csrfToken = this.getCsrfToken();
    if (csrfToken) {
      this.headers['X-CSRFToken'] = csrfToken;
    }
  }

  /**
   * Проверяет статус аутентификации пользователя
   */
  async isAuthenticated() {
    try {
      const response = await this.get('/api/auth/user/');
      return response && response.id;
    } catch (error) {
      return false;
    }
  }

  /**
   * Выполняет вход пользователя
   */
  async login(username, password) {
    try {
      // Сначала получаем CSRF токен
      await this.get('/api/auth/csrf/');
      
      const response = await this.post('/api/auth/login/', { username, password });
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  /**
   * Выполняет выход пользователя
   */
  async logout() {
    try {
      await this.post('/api/auth/logout/');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  /**
   * Обрабатывает ответ от сервера
   */
  async handleResponse(response) {
    const contentType = response.headers.get('content-type');
    
    if (!response.ok) {
      const error = new Error('HTTP error');
      error.status = response.status;
      
      try {
        if (contentType && contentType.includes('application/json')) {
          error.data = await response.json();
        } else {
          error.data = await response.text();
        }
      } catch {
        error.data = 'Failed to parse error response';
      }
      
      throw error;
    }

    // Обработка успешного ответа
    if (!contentType) {
      return null;
    }
    
    if (contentType.includes('application/json')) {
      return response.json();
    }
    
    return response.text();
  }

  /**
   * Выполняет GET-запрос к указанному эндпоинту
   */
  async get(endpoint, params = {}) {
    try {
      this.updateHeaders();
      const queryString = new URLSearchParams(params).toString();
      const url = `${this.baseUrl}${endpoint}${queryString ? '?' + queryString : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.headers,
        credentials: 'include',
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('GET request failed:', error);
      throw error;
    }
  }

  /**
   * Выполняет POST-запрос к указанному эндпоинту
   */
  async post(endpoint, data) {
    try {
      this.updateHeaders();
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.headers,
        credentials: 'include',
        body: JSON.stringify(data),
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('POST request failed:', error);
      throw error;
    }
  }

  /**
   * Выполняет PUT-запрос к указанному эндпоинту
   */
  async put(endpoint, data) {
    try {
      this.updateHeaders();
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: this.headers,
        credentials: 'include',
        body: JSON.stringify(data),
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('PUT request failed:', error);
      throw error;
    }
  }

  /**
   * Выполняет PATCH-запрос к указанному эндпоинту
   */
  async patch(endpoint, data) {
    try {
      this.updateHeaders();
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PATCH',
        headers: this.headers,
        credentials: 'include',
        body: JSON.stringify(data),
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('PATCH request failed:', error);
      throw error;
    }
  }

  /**
   * Выполняет DELETE-запрос к указанному эндпоинту
   */
  async delete(endpoint) {
    try {
      this.updateHeaders();
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: this.headers,
        credentials: 'include',
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('DELETE request failed:', error);
      throw error;
    }
  }
}

export default new ApiService();