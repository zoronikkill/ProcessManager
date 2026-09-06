const API_BASE_URL = 'http://localhost:8000';

class ApiService {
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || API_BASE_URL;
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

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


  updateHeaders() {
    const csrfToken = this.getCsrfToken();
    if (csrfToken) {
      this.headers['X-CSRFToken'] = csrfToken;
    }
  }


  async isAuthenticated() {
    try {
      const response = await this.get('/api/auth/user/');
      return response && response.id;
    } catch (error) {
      return false;
    }
  }


  async login(username, password) {
    try {
      await this.get('/api/auth/csrf/');
      
      const response = await this.post('/api/auth/login/', { username, password });
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }


  async logout() {
    try {
      await this.post('/api/auth/logout/');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error('HTTP error');
      error.status = response.status;
      error.response = {
        status: response.status,
        data: errorData,
        headers: response.headers
      };
      throw error;
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    return { success: true };
  }

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

  async post(endpoint, data) {
    try {
      this.updateHeaders();
      const response = await fetch(this.baseUrl + endpoint, {
        method: 'POST',
        headers: this.headers,
        credentials: 'include',
        body: JSON.stringify(data)
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`Ошибка POST запроса к ${endpoint}:`, error);
      throw error;
    }
  }

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