import apiService from './apiService';

const projectService = {
  /**
   * Получает список всех проектов
   * @param {Object} params - Параметры запроса для фильтрации
   * @returns {Promise<Array>} - Массив проектов
   */
  async getAll(params = {}) {
    try {
      const response = await apiService.get('/api/projects/', params);
      return Array.isArray(response) ? response : response.results || [];
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
  async getById(id) {
    try {
      const response = await apiService.get(`/api/projects/${id}/`);
      return response;
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  },

  /**
   * Создает новый проект
   * @param {Object} projectData - Данные нового проекта
   * @returns {Promise<Object>} - Созданный проект
   */
  async create(projectData) {
    try {
      const response = await apiService.post('/api/projects/', projectData);
      return response;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  createProject: function(projectData) {
    return this.create(projectData);
  },

  /**
   * Обновляет данные проекта
   * @param {string|number} id - Идентификатор проекта
   * @param {Object} projectData - Обновленные данные проекта
   * @returns {Promise<Object>} - Обновленный проект
   */
  async update(id, projectData) {
    try {
      const response = await apiService.put(`/api/projects/${id}/`, projectData);
      return response;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  updateProject: function(id, projectData) {
    return this.update(id, projectData);
  },

  /**
   * Удаляет проект
   * @param {string|number} id - Идентификатор проекта
   * @returns {Promise<{success: boolean}>} - Результат операции
   */
  async delete(id) {
    try {
      const response = await apiService.delete(`/api/projects/${id}/`);
      return response;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  },

  deleteProject: function(id) {
    return this.delete(id);
  },

  /**
   * Получает задачи проекта
   * @param {string|number} projectId - Идентификатор проекта
   * @returns {Promise<Array>} - Массив задач
   */
  async getProjectTasks(projectId) {
    try {
      const response = await apiService.get(`/api/projects/${projectId}/tasks/`);
      return Array.isArray(response) ? response : response.results || [];
    } catch (error) {
      console.error('Error fetching project tasks:', error);
      return [];
    }
  },

  /**
   * Получает участников проекта
   * @param {string|number} id - Идентификатор проекта
   * @returns {Promise<Array>} - Массив участников
   */
  async getParticipants(id) {
    try {
      const response = await apiService.get(`/api/projects/${id}/participants/`);
      return Array.isArray(response) ? response : response.results || [];
    } catch (error) {
      console.error('Error fetching project participants:', error);
      return [];
    }
  },

  /**
   * Добавляет участника в проект
   * @param {string|number} projectId - Идентификатор проекта
   * @param {string|number} employeeId - Идентификатор сотрудника
   * @param {Object} role - Роль сотрудника в проекте
   * @returns {Promise<Object>} - Результат операции
   */
  async addParticipant(projectId, employeeId, role) {
    try {
      const response = await apiService.post(`/api/projects/${projectId}/participants/`, { 
        employee_id: employeeId,
        role
      });
      return response;
    } catch (error) {
      console.error('Error adding project participant:', error);
      if (error.response?.data) {
        throw new Error(JSON.stringify(error.response.data));
      }
      throw error;
    }
  },

  /**
   * Удаляет участника из проекта
   * @param {string|number} projectId - Идентификатор проекта
   * @param {string|number} employeeId - Идентификатор сотрудника
   * @returns {Promise<{success: boolean}>} - Результат операции
   */
  async removeParticipant(projectId, employeeId) {
    try {
      await apiService.delete(`/api/projects/${projectId}/participants/${employeeId}/`);
      return { success: true };
    } catch (error) {
      console.error('Error removing project participant:', error);
      if (error.response?.data) {
        throw new Error(JSON.stringify(error.response.data));
      }
      throw error;
    }
  },

  async createProcess(processData) {
    try {
      const response = await apiService.post('/api/processes/', processData);
      return response;
    } catch (error) {
      console.error('Error creating process:', error);
      throw error;
    }
  },

  async createProjectTask(projectId, taskData) {
    try {
      const response = await apiService.post(`/api/projects/${projectId}/tasks/`, taskData);
      return response;
    } catch (error) {
      console.error('Error creating project task:', error);
      throw error;
    }
  },

  /**
   * Получает связи между задачами проекта
   * @param {string|number} projectId - Идентификатор проекта
   * @returns {Promise<Array>} - Массив связей между задачами
   */
  async getProjectConnections(projectId) {
    try {
      const response = await apiService.get(`/api/projects/${projectId}/connections/`);
      return Array.isArray(response) ? response : response.results || [];
    } catch (error) {
      console.error('Error fetching project connections:', error);
      return [];
    }
  }
};

export default projectService;