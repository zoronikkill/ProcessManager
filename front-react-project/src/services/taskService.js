import apiService from './apiService';

/**
 * Сервис для управления задачами
 */
const taskService = {
  /**
   * Получает список всех задач
   * @param {Object} params - Параметры запроса для фильтрации
   * @returns {Promise<Array>} - Массив задач
   */
  getAll: async (params = {}) => {
    try {
      const response = await apiService.get('/api/tasks/', params);
      return Array.isArray(response) ? response : response.results || [];
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
      const response = await apiService.get(`/api/tasks/${id}/`);
      return response;
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  },

  /**
   * Создает новую задачу
   * @param {string|number} projectId - Идентификатор проекта
   * @param {Object} taskData - Данные новой задачи
   * @returns {Promise<Object>} - Созданная задача
   */
  create: async (projectId, taskData) => {
    try {
      const response = await apiService.post('/api/tasks/', {
        ...taskData,
        project_id: projectId
      });
      return response;
    } catch (error) {
      console.error('Error creating task:', error);
      if (error.response?.data) {
        throw new Error(JSON.stringify(error.response.data));
      }
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
      const response = await apiService.put(`/api/tasks/${id}/`, taskData);
      return response;
    } catch (error) {
      console.error('Error updating task:', error);
      if (error.response?.data) {
        throw new Error(JSON.stringify(error.response.data));
      }
      throw error;
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
      const response = await apiService.patch(`/api/tasks/${id}/`, taskData);
      return response;
    } catch (error) {
      console.error('Error partially updating task:', error);
      if (error.response?.data) {
        throw new Error(JSON.stringify(error.response.data));
      }
      throw error;
    }
  },

  /**
   * Удаляет задачу
   * @param {string|number} id - Идентификатор задачи
   * @returns {Promise<{success: boolean}>} - Результат операции
   */
  delete: async (id) => {
    try {
      await apiService.delete(`/api/tasks/${id}/`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  /**
   * Получает задачи проекта
   * @param {string|number} projectId - Идентификатор проекта
   * @returns {Promise<Array>} - Массив задач
   */
  getTasks: async (projectId) => {
    try {
      const response = await apiService.get(`/api/projects/${projectId}/tasks/`);
      return Array.isArray(response) ? response : response.results || [];
    } catch (error) {
      console.error('Error fetching project tasks:', error);
      return [];
    }
  },

  /**
   * Получает подзадачи для задачи
   * @param {string|number} id - Идентификатор родительской задачи
   * @returns {Promise<Array>} - Массив подзадач
   */
  getSubtasks: async (id) => {
    try {
      const response = await apiService.get(`/api/tasks/${id}/subtasks/`);
      return response;
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
      const response = await apiService.patch(`/api/tasks/${id}/status/`, { status });
      return response;
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
      const response = await apiService.post(`/api/tasks/${taskId}/assign/`, { employee_id: employeeId });
      return response;
    } catch (error) {
      console.error('Error assigning employee to task:', error);
      return null;
    }
  },

  /**
   * Создает связь между задачами
   * @param {string|number} sourceTaskId - Идентификатор задачи-предшественника
   * @param {string|number} targetTaskId - Идентификатор задачи-последователя
   * @returns {Promise<Object>} - Созданная связь
   */
  createTaskRelation: async (sourceTaskId, targetTaskId) => {
    try {
      const response = await apiService.post('/api/task-connections/', {
        source_task: sourceTaskId,
        target_task: targetTaskId,
        connection_type: 'finish_to_start'
      });
      return response;
    } catch (error) {
      console.error('Error creating task relation:', error);
      if (error.response?.data) {
        throw new Error(JSON.stringify(error.response.data));
      }
      throw error;
    }
  },

  /**
   * Удаляет связь между задачами
   * @param {string|number} sourceTaskId - Идентификатор задачи-предшественника
   * @param {string|number} targetTaskId - Идентификатор задачи-последователя
   * @returns {Promise<{success: boolean}>} - Результат операции
   */
  removeTaskRelation: async (sourceTaskId, targetTaskId) => {
    try {
      // Сначала найдем ID связи
      const connections = await apiService.get('/api/task-connections/', {
        params: {
          source_task: sourceTaskId,
          target_task: targetTaskId
        }
      });
      
      if (Array.isArray(connections) && connections.length > 0) {
        const connectionId = connections[0].id;
        await apiService.delete(`/api/task-connections/${connectionId}/`);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error removing task relation:', error);
      if (error.response?.data) {
        throw new Error(JSON.stringify(error.response.data));
      }
      throw error;
    }
  },

  getTaskTypes: async () => {
    try {
      const response = await apiService.get('/api/task-types/');
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Error fetching task types:', error);
      return [];
    }
  },

  createDefaultTaskTypes: async () => {
    const defaultTypes = [
      {name: 'Анализ требований'}, 
      {name: 'Проектирование'}, 
      {name: 'Разработка'}
    ];
    
    const results = [];
    for (const type of defaultTypes) {
      try {
        const response = await apiService.post('/api/task-types/', type);
        results.push(response);
      } catch (error) {
        console.error('Error creating task type:', error);
      }
    }
    return results;
  }
};

export default taskService;