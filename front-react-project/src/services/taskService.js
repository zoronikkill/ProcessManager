import apiService from './apiService';

/**
 * Сервис для управления задачами
 */
export const taskService = {
  /**
   * Получает список всех задач
   * @param {Object} params - Параметры запроса для фильтрации
   * @returns {Promise<Array>} - Массив задач
   */
  getAll: async (params = {}) => {
    try {
      const response = await apiService.get('/tasks', params);
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  },

  /**
   * Получает данные конкретной задачи
   * @param {string|number} id - Идентификатор задачи
   * @returns {Promise<Object>} - Данные задачи
   */
  getById: async (id) => {
    try {
      const response = await apiService.get(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching task:', error);
      return null;
    }
  },

  /**
   * Создает новую задачу
   * @param {Object} taskData - Данные новой задачи
   * @returns {Promise<Object>} - Созданная задача
   */
  create: async (taskData) => {
    try {
      const response = await apiService.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  /**
   * Обновляет данные задачи
   * @param {string|number} id - Идентификатор задачи
   * @param {Object} taskData - Обновленные данные задачи
   * @returns {Promise<Object>} - Обновленная задача
   */
  update: async (id, taskData) => {
    try {
      const response = await apiService.put(`/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      return null;
    }
  },

  /**
   * Частично обновляет данные задачи
   * @param {string|number} id - Идентификатор задачи
   * @param {Object} taskData - Частичные данные для обновления
   * @returns {Promise<Object>} - Обновленная задача
   */
  partialUpdate: async (id, taskData) => {
    try {
      const response = await apiService.patch(`/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      console.error('Error partially updating task:', error);
      return null;
    }
  },

  /**
   * Удаляет задачу
   * @param {string|number} id - Идентификатор задачи
   * @returns {Promise<{success: boolean}>} - Результат операции
   */
  delete: async (id) => {
    try {
      await apiService.delete(`/tasks/${id}`);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  /**
   * Получает подзадачи для задачи
   * @param {string|number} id - Идентификатор родительской задачи
   * @returns {Promise<Array>} - Массив подзадач
   */
  getSubtasks: async (id) => {
    try {
      const response = await apiService.get(`/tasks/${id}/subtasks`);
      return response.data;
    } catch (error) {
      console.error('Error fetching subtasks:', error);
      return [];
    }
  },

  /**
   * Обновляет статус задачи
   * @param {string|number} id - Идентификатор задачи
   * @param {string} status - Новый статус задачи
   * @returns {Promise<Object>} - Обновленная задача
   */
  updateStatus: async (id, status) => {
    try {
      const response = await apiService.patch(`/tasks/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating task status:', error);
      return null;
    }
  },

  /**
   * Назначает сотрудника на задачу
   * @param {string|number} taskId - Идентификатор задачи
   * @param {string|number} employeeId - Идентификатор сотрудника
   * @returns {Promise<Object>} - Обновленная задача
   */
  assignEmployee: async (taskId, employeeId) => {
    try {
      const response = await apiService.post(`/tasks/${taskId}/assign`, { employee_id: employeeId });
      return response.data;
    } catch (error) {
      console.error('Error assigning employee to task:', error);
      return null;
    }
  },

  /**
   * Создает связь между задачами (предшественник/последователь)
   * @param {string|number} sourceTaskId - Идентификатор задачи-предшественника
   * @param {string|number} targetTaskId - Идентификатор задачи-последователя
   * @param {string} relationType - Тип связи (например, "finishToStart", "startToStart" и т.д.)
   * @returns {Promise<Object>} - Созданная связь
   */
  createTaskRelation: async (sourceTaskId, targetTaskId, relationType = 'finishToStart') => {
    try {
      const response = await apiService.post('/tasks/relations', {
        source_task_id: sourceTaskId,
        target_task_id: targetTaskId,
        relation_type: relationType
      });
      return response.data;
    } catch (error) {
      console.error('Error creating task relation:', error);
      return null;
    }
  },

  /**
   * Удаляет связь между задачами
   * @param {string|number} relationId - Идентификатор связи
   * @returns {Promise<{success: boolean}>} - Результат операции
   */
  removeTaskRelation: async (relationId) => {
    try {
      await apiService.delete(`/tasks/relations/${relationId}`);
    } catch (error) {
      console.error('Error removing task relation:', error);
      return false;
    }
  }
};