import apiService from './apiService';

/**
 * Сервис для управления задачами
 */
class TaskService {
  /**
   * Базовый эндпоинт для API задач
   */
  constructor() {
    this.endpoint = '/tasks';
  }

  /**
   * Получает список всех задач
   * @param {Object} params - Параметры запроса для фильтрации
   * @returns {Promise<Array>} - Массив задач
   */
  async getAll(params = {}) {
    return apiService.get(this.endpoint, params);
  }

  /**
   * Получает данные конкретной задачи
   * @param {string|number} id - Идентификатор задачи
   * @returns {Promise<Object>} - Данные задачи
   */
  async getById(id) {
    return apiService.get(`${this.endpoint}/${id}`);
  }

  /**
   * Создает новую задачу
   * @param {Object} taskData - Данные новой задачи
   * @returns {Promise<Object>} - Созданная задача
   */
  async create(taskData) {
    return apiService.post(this.endpoint, taskData);
  }

  /**
   * Обновляет данные задачи
   * @param {string|number} id - Идентификатор задачи
   * @param {Object} taskData - Обновленные данные задачи
   * @returns {Promise<Object>} - Обновленная задача
   */
  async update(id, taskData) {
    return apiService.put(`${this.endpoint}/${id}`, taskData);
  }

  /**
   * Частично обновляет данные задачи
   * @param {string|number} id - Идентификатор задачи
   * @param {Object} taskData - Частичные данные для обновления
   * @returns {Promise<Object>} - Обновленная задача
   */
  async partialUpdate(id, taskData) {
    return apiService.patch(`${this.endpoint}/${id}`, taskData);
  }

  /**
   * Удаляет задачу
   * @param {string|number} id - Идентификатор задачи
   * @returns {Promise<{success: boolean}>} - Результат операции
   */
  async delete(id) {
    return apiService.delete(`${this.endpoint}/${id}`);
  }

  /**
   * Получает подзадачи для задачи
   * @param {string|number} id - Идентификатор родительской задачи
   * @returns {Promise<Array>} - Массив подзадач
   */
  async getSubtasks(id) {
    return apiService.get(`${this.endpoint}/${id}/subtasks`);
  }

  /**
   * Обновляет статус задачи
   * @param {string|number} id - Идентификатор задачи
   * @param {string} status - Новый статус задачи
   * @returns {Promise<Object>} - Обновленная задача
   */
  async updateStatus(id, status) {
    return apiService.patch(`${this.endpoint}/${id}/status`, { status });
  }

  /**
   * Назначает сотрудника на задачу
   * @param {string|number} taskId - Идентификатор задачи
   * @param {string|number} employeeId - Идентификатор сотрудника
   * @returns {Promise<Object>} - Обновленная задача
   */
  async assignEmployee(taskId, employeeId) {
    return apiService.post(`${this.endpoint}/${taskId}/assign`, { employee_id: employeeId });
  }

  /**
   * Создает связь между задачами (предшественник/последователь)
   * @param {string|number} sourceTaskId - Идентификатор задачи-предшественника
   * @param {string|number} targetTaskId - Идентификатор задачи-последователя
   * @param {string} relationType - Тип связи (например, "finishToStart", "startToStart" и т.д.)
   * @returns {Promise<Object>} - Созданная связь
   */
  async createTaskRelation(sourceTaskId, targetTaskId, relationType = 'finishToStart') {
    return apiService.post(`${this.endpoint}/relations`, {
      source_task_id: sourceTaskId,
      target_task_id: targetTaskId,
      relation_type: relationType
    });
  }

  /**
   * Удаляет связь между задачами
   * @param {string|number} relationId - Идентификатор связи
   * @returns {Promise<{success: boolean}>} - Результат операции
   */
  async removeTaskRelation(relationId) {
    return apiService.delete(`${this.endpoint}/relations/${relationId}`);
  }
}

export default new TaskService();