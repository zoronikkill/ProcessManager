import apiService from './apiService';

class ProcessService {
  /**
   * Базовый эндпоинт для API бизнес-процессов
   */
  constructor() {
    this.endpoint = '/api/processes';
  }

  /**
   * Получает список всех процессов
   * @param {Object} params - Параметры запроса для фильтрации
   * @returns {Promise<Array>} - Массив бизнес-процессов
   */
  async getAll(params = {}) {
    try {
      const response = await apiService.get(this.endpoint, params);
      return Array.isArray(response) ? response : response.results || [];
    } catch (error) {
      console.error('Error fetching processes:', error);
      return [];
    }
  }

  /**
   * Получает данные конкретного процесса
   * @param {string|number} id - Идентификатор бизнес-процесса
   * @returns {Promise<Object>} - Данные бизнес-процесса
   */
  async getById(id) {
    try {
      const response = await apiService.get(`${this.endpoint}/${id}/`);
      return response;
    } catch (error) {
      console.error('Error fetching process:', error);
      throw error;
    }
  }

  /**
   * Создает новый процесс
   * @param {Object} processData - Данные для создания бизнес-процесса
   * @returns {Promise<Object>} - Созданный бизнес-процесс
   */
  async createProcess(processData) {
    try {
      const response = await apiService.post(this.endpoint, processData);
      return response;
    } catch (error) {
      console.error('Error creating process:', error);
      throw error;
    }
  }

  /**
   * Обновляет данные процесса
   * @param {string|number} id - Идентификатор бизнес-процесса
   * @param {Object} processData - Обновленные данные бизнес-процесса
   * @returns {Promise<Object>} - Обновленный бизнес-процесс
   */
  async updateProcess(id, processData) {
    try {
      const response = await apiService.put(`${this.endpoint}/${id}/`, processData);
      return response;
    } catch (error) {
      console.error('Error updating process:', error);
      throw error;
    }
  }

  /**
   * Удаляет процесс
   * @param {string|number} id - Идентификатор бизнес-процесса
   * @returns {Promise<{success: boolean}>} - Результат операции
   */
  async deleteProcess(id) {
    try {
      await apiService.delete(`${this.endpoint}/${id}/`);
      return true;
    } catch (error) {
      console.error('Error deleting process:', error);
      throw error;
    }
  }

  /**
   * Получает этапы бизнес-процесса
   * @param {string|number} id - Идентификатор бизнес-процесса
   * @returns {Promise<Array>} - Массив этапов бизнес-процесса
   */
  async getStages(id) {
    return apiService.get(`${this.endpoint}/${id}/stages`);
  }

  /**
   * Получает задачи процесса
   * @param {string|number} processId - Идентификатор бизнес-процесса
   * @returns {Promise<Array>} - Массив задач бизнес-процесса
   */
  async getProcessTasks(processId) {
    try {
      const response = await apiService.get(`${this.endpoint}/${processId}/tasks/`);
      return Array.isArray(response) ? response : response.results || [];
    } catch (error) {
      console.error('Error fetching process tasks:', error);
      return [];
    }
  }

  /**
   * Создает новую задачу в процессе
   * @param {string|number} processId - Идентификатор бизнес-процесса
   * @param {Object} taskData - Данные для создания задачи
   * @returns {Promise<Object>} - Созданная задача
   */
  async createProcessTask(processId, taskData) {
    try {
      const response = await apiService.post(`${this.endpoint}/${processId}/tasks/`, taskData);
      return response;
    } catch (error) {
      console.error('Error creating process task:', error);
      throw error;
    }
  }

  /**
   * Обновляет статус процесса
   * @param {string|number} processId - Идентификатор бизнес-процесса
   * @param {string} status - Новый статус бизнес-процесса
   * @returns {Promise<Object>} - Обновленный бизнес-процесс
   */
  async updateStatus(processId, status) {
    try {
      const response = await apiService.patch(`${this.endpoint}/${processId}/status/`, { status });
      return response;
    } catch (error) {
      console.error('Error updating process status:', error);
      throw error;
    }
  }

  /**
   * Получает статистику по бизнес-процессу
   * @param {string|number} id - Идентификатор бизнес-процесса
   * @returns {Promise<Object>} - Статистика бизнес-процесса
   */
  async getStatistics(id) {
    return apiService.get(`${this.endpoint}/${id}/statistics/`);
  }

  /**
   * Добавляет комментарий к бизнес-процессу
   * @param {string|number} id - Идентификатор бизнес-процесса
   * @param {string} comment - Текст комментария
   * @returns {Promise<Object>} - Созданный комментарий
   */
  async addComment(id, comment) {
    return apiService.post(`${this.endpoint}/${id}/comments/`, { text: comment });
  }

  /**
   * Получает историю изменений бизнес-процесса
   * @param {string|number} id - Идентификатор бизнес-процесса
   * @returns {Promise<Array>} - История изменений
   */
  async getHistory(id) {
    return apiService.get(`${this.endpoint}/${id}/history/`);
  }

  /**
   * Добавляет участника в бизнес-процесс
   * @param {string|number} processId - Идентификатор бизнес-процесса
   * @param {string|number} employeeId - Идентификатор сотрудника
   * @param {Object} role - Роль сотрудника в бизнес-процессе
   * @returns {Promise<Object>} - Результат операции
   */
  async addParticipant(processId, employeeId, role) {
    return apiService.post(`${this.endpoint}/${processId}/participants`, { 
      employee_id: employeeId,
      role
    });
  }
}

export default new ProcessService();