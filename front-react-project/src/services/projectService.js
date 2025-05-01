import apiService from './apiService';

/**
 * Сервис для управления проектами
 */
class ProjectService {
  /**
   * Базовый эндпоинт для API проектов
   */
  constructor() {
    this.endpoint = '/projects';
  }

  /**
   * Получает список всех проектов
   * @param {Object} params - Параметры запроса для фильтрации
   * @returns {Promise<Array>} - Массив проектов
   */
  async getAll(params = {}) {
    return apiService.get(this.endpoint, params);
  }

  /**
   * Получает данные конкретного проекта
   * @param {string|number} id - Идентификатор проекта
   * @returns {Promise<Object>} - Данные проекта
   */
  async getById(id) {
    return apiService.get(`${this.endpoint}/${id}`);
  }

  /**
   * Создает новый проект
   * @param {Object} projectData - Данные нового проекта
   * @returns {Promise<Object>} - Созданный проект
   */
  async create(projectData) {
    return apiService.post(this.endpoint, projectData);
  }

  /**
   * Обновляет данные проекта
   * @param {string|number} id - Идентификатор проекта
   * @param {Object} projectData - Обновленные данные проекта
   * @returns {Promise<Object>} - Обновленный проект
   */
  async update(id, projectData) {
    return apiService.put(`${this.endpoint}/${id}`, projectData);
  }

  /**
   * Частично обновляет данные проекта
   * @param {string|number} id - Идентификатор проекта
   * @param {Object} projectData - Частичные данные для обновления
   * @returns {Promise<Object>} - Обновленный проект
   */
  async partialUpdate(id, projectData) {
    return apiService.patch(`${this.endpoint}/${id}`, projectData);
  }

  /**
   * Удаляет проект
   * @param {string|number} id - Идентификатор проекта
   * @returns {Promise<{success: boolean}>} - Результат операции
   */
  async delete(id) {
    return apiService.delete(`${this.endpoint}/${id}`);
  }

  /**
   * Получает задачи в проекте
   * @param {string|number} id - Идентификатор проекта
   * @returns {Promise<Array>} - Массив задач
   */
  async getTasks(id) {
    return apiService.get(`${this.endpoint}/${id}/tasks`);
  }

  /**
   * Получает участников проекта
   * @param {string|number} id - Идентификатор проекта
   * @returns {Promise<Array>} - Массив участников
   */
  async getParticipants(id) {
    return apiService.get(`${this.endpoint}/${id}/participants`);
  }

  /**
   * Добавляет участника в проект
   * @param {string|number} projectId - Идентификатор проекта
   * @param {string|number} employeeId - Идентификатор сотрудника
   * @param {Object} role - Роль сотрудника в проекте
   * @returns {Promise<Object>} - Результат операции
   */
  async addParticipant(projectId, employeeId, role) {
    return apiService.post(`${this.endpoint}/${projectId}/participants`, { 
      employee_id: employeeId,
      role
    });
  }

  /**
   * Удаляет участника из проекта
   * @param {string|number} projectId - Идентификатор проекта
   * @param {string|number} employeeId - Идентификатор сотрудника
   * @returns {Promise<{success: boolean}>} - Результат операции
   */
  async removeParticipant(projectId, employeeId) {
    return apiService.delete(`${this.endpoint}/${projectId}/participants/${employeeId}`);
  }
}

export default new ProjectService();