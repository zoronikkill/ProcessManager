import apiService from './apiService';

/**
 * Сервис для управления данными сотрудников
 */
export const employeeService = {
  /**
   * Получает список всех сотрудников
   * @param {Object} params - Параметры запроса для фильтрации (отдел, должность и т.д.)
   * @returns {Promise<Array>} - Массив сотрудников
   */
  getAll: async (params = {}) => {
    try {
      const response = await apiService.get('/employees', params);
      return response.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      return [];
    }
  },

  /**
   * Получает данные конкретного сотрудника
   * @param {string|number} id - Идентификатор сотрудника
   * @returns {Promise<Object>} - Данные сотрудника
   */
  getById: async (id) => {
    try {
      const response = await apiService.get(`/employees/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employee:', error);
      return null;
    }
  },

  /**
   * Создает нового сотрудника
   * @param {Object} employeeData - Данные нового сотрудника
   * @returns {Promise<Object>} - Созданный сотрудник
   */
  create: async (employeeData) => {
    try {
      const response = await apiService.post('/employees', employeeData);
      return response.data;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  },

  /**
   * Обновляет данные сотрудника
   * @param {string|number} id - Идентификатор сотрудника
   * @param {Object} employeeData - Обновленные данные сотрудника
   * @returns {Promise<Object>} - Обновленный сотрудник
   */
  update: async (id, employeeData) => {
    try {
      const response = await apiService.put(`/employees/${id}`, employeeData);
      return response.data;
    } catch (error) {
      console.error('Error updating employee:', error);
      return null;
    }
  },

  /**
   * Частично обновляет данные сотрудника
   * @param {string|number} id - Идентификатор сотрудника
   * @param {Object} employeeData - Частичные данные для обновления
   * @returns {Promise<Object>} - Обновленный сотрудник
   */
  partialUpdate: async (id, employeeData) => {
    return apiService.patch(`/employees/${id}`, employeeData);
  },

  /**
   * Удаляет сотрудника
   * @param {string|number} id - Идентификатор сотрудника
   * @returns {Promise<{success: boolean}>} - Результат операции
   */
  delete: async (id) => {
    try {
      await apiService.delete(`/employees/${id}`);
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  },

  /**
   * Получает задачи, назначенные сотруднику
   * @param {string|number} id - Идентификатор сотрудника
   * @returns {Promise<Array>} - Массив задач
   */
  getTasks: async (id) => {
    return apiService.get(`/employees/${id}/tasks`);
  }
};