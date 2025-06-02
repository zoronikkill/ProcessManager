import apiService from './apiService';

/**
 * Сервис для управления проектами
 */
export const projectService = {
  /**
   * Получает список всех проектов
   * @param {Object} params - Параметры запроса для фильтрации
   * @returns {Promise<Array>} - Массив проектов
   */
  getAll: async (params = {}) => {
    try {
      const response = await apiService.get('/projects', params);
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  },

  /**
   * Получает данные конкретного проекта
   * @param {string|number} id - Идентификатор проекта
   * @returns {Promise<Object>} - Данные проекта
   */
  getById: async (id) => {
    try {
      const response = await apiService.get(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching project:', error);
      return null;
    }
  },

  /**
   * Создает новый проект
   * @param {Object} projectData - Данные нового проекта
   * @returns {Promise<Object>} - Созданный проект
   */
  create: async (projectData) => {
    try {
      const response = await apiService.post('/projects', projectData);
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  /**
   * Обновляет данные проекта
   * @param {string|number} id - Идентификатор проекта
   * @param {Object} projectData - Обновленные данные проекта
   * @returns {Promise<Object>} - Обновленный проект
   */
  update: async (id, projectData) => {
    try {
      const response = await apiService.put(`/projects/${id}`, projectData);
      return response.data;
    } catch (error) {
      console.error('Error updating project:', error);
      return null;
    }
  },

  /**
   * Частично обновляет данные проекта
   * @param {string|number} id - Идентификатор проекта
   * @param {Object} projectData - Частичные данные для обновления
   * @returns {Promise<Object>} - Обновленный проект
   */
  partialUpdate: async (id, projectData) => {
    return apiService.patch(`/projects/${id}`, projectData);
  },

  /**
   * Удаляет проект
   * @param {string|number} id - Идентификатор проекта
   * @returns {Promise<{success: boolean}>} - Результат операции
   */
  delete: async (id) => {
    try {
      await apiService.delete(`/projects/${id}`);
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  },

  /**
   * Получает задачи в проекте
   * @param {string|number} id - Идентификатор проекта
   * @returns {Promise<Array>} - Массив задач
   */
  getTasks: async (id) => {
    return apiService.get(`/projects/${id}/tasks`);
  },

  /**
   * Получает участников проекта
   * @param {string|number} id - Идентификатор проекта
   * @returns {Promise<Array>} - Массив участников
   */
  getParticipants: async (id) => {
    return apiService.get(`/projects/${id}/participants`);
  },

  /**
   * Добавляет участника в проект
   * @param {string|number} projectId - Идентификатор проекта
   * @param {string|number} employeeId - Идентификатор сотрудника
   * @param {Object} role - Роль сотрудника в проекте
   * @returns {Promise<Object>} - Результат операции
   */
  addParticipant: async (projectId, employeeId, role) => {
    return apiService.post(`/projects/${projectId}/participants`, { 
      employee_id: employeeId,
      role
    });
  },

  /**
   * Удаляет участника из проекта
   * @param {string|number} projectId - Идентификатор проекта
   * @param {string|number} employeeId - Идентификатор сотрудника
   * @returns {Promise<{success: boolean}>} - Результат операции
   */
  removeParticipant: async (projectId, employeeId) => {
    return apiService.delete(`/projects/${projectId}/participants/${employeeId}`);
  }
};