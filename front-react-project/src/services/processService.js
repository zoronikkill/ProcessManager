import apiService from './apiService';

/**
 * Сервис для управления активными бизнес-процессами
 */
class ProcessService {
  /**
   * Базовый эндпоинт для API бизнес-процессов
   */
  constructor() {
    this.endpoint = '/processes';
  }

  /**
   * Получает список всех активных бизнес-процессов
   * @param {Object} params - Параметры запроса для фильтрации
   * @returns {Promise<Array>} - Массив бизнес-процессов
   */
  async getAll(params = {}) {
    return apiService.get(this.endpoint, params);
  }

  /**
   * Получает данные конкретного бизнес-процесса
   * @param {string|number} id - Идентификатор бизнес-процесса
   * @returns {Promise<Object>} - Данные бизнес-процесса
   */
  async getById(id) {
    return apiService.get(`${this.endpoint}/${id}`);
  }

  /**
   * Создает новый бизнес-процесс 
   * @param {Object} processData - Данные для создания бизнес-процесса
   * @returns {Promise<Object>} - Созданный бизнес-процесс
   */
  async create(processData) {
    return apiService.post(this.endpoint, processData);
  }

  /**
   * Обновляет данные бизнес-процесса
   * @param {string|number} id - Идентификатор бизнес-процесса
   * @param {Object} processData - Обновленные данные бизнес-процесса
   * @returns {Promise<Object>} - Обновленный бизнес-процесс
   */
  async update(id, processData) {
    return apiService.put(`${this.endpoint}/${id}`, processData);
  }

  /**
   * Частично обновляет данные бизнес-процесса
   * @param {string|number} id - Идентификатор бизнес-процесса
   * @param {Object} processData - Частичные данные для обновления
   * @returns {Promise<Object>} - Обновленный бизнес-процесс
   */
  async partialUpdate(id, processData) {
    return apiService.patch(`${this.endpoint}/${id}`, processData);
  }

  /**
   * Удаляет бизнес-процесс
   * @param {string|number} id - Идентификатор бизнес-процесса
   * @returns {Promise<{success: boolean}>} - Результат операции
   */
  async delete(id) {
    return apiService.delete(`${this.endpoint}/${id}`);
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
   * Получает задачи бизнес-процесса
   * @param {string|number} id - Идентификатор бизнес-процесса
   * @returns {Promise<Array>} - Массив задач бизнес-процесса
   */
  async getTasks(id) {
    return apiService.get(`${this.endpoint}/${id}/tasks`);
  }

  /**
   * Обновляет статус бизнес-процесса
   * @param {string|number} id - Идентификатор бизнес-процесса
   * @param {string} status - Новый статус бизнес-процесса
   * @returns {Promise<Object>} - Обновленный бизнес-процесс
   */
  async updateStatus(id, status) {
    return apiService.patch(`${this.endpoint}/${id}/status`, { status });
  }

  /**
   * Получает статистику по бизнес-процессу
   * @param {string|number} id - Идентификатор бизнес-процесса
   * @returns {Promise<Object>} - Статистика бизнес-процесса
   */
  async getStatistics(id) {
    return apiService.get(`${this.endpoint}/${id}/statistics`);
  }

  /**
   * Добавляет комментарий к бизнес-процессу
   * @param {string|number} id - Идентификатор бизнес-процесса
   * @param {string} comment - Текст комментария
   * @returns {Promise<Object>} - Созданный комментарий
   */
  async addComment(id, comment) {
    return apiService.post(`${this.endpoint}/${id}/comments`, { text: comment });
  }

  /**
   * Получает историю изменений бизнес-процесса
   * @param {string|number} id - Идентификатор бизнес-процесса
   * @returns {Promise<Array>} - История изменений
   */
  async getHistory(id) {
    return apiService.get(`${this.endpoint}/${id}/history`);
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