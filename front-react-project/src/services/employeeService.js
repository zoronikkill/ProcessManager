import apiService from './apiService';

/**
 * Сервис для управления данными сотрудников
 */
const employeeService = {
  /**
   * Получает список всех сотрудников
   * @param {Object} params - Параметры запроса для фильтрации (отдел, должность и т.д.)
   * @returns {Promise<Array>} - Массив сотрудников
   */
  async getAll(params = {}) {
    try {
      const response = await apiService.get('/api/employees/', params);
      return Array.isArray(response) ? response : response.results || [];
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
  async getById(id) {
    try {
      const response = await apiService.get(`/api/employees/${id}/`);
      return response;
    } catch (error) {
      console.error('Error fetching employee:', error);
      throw error;
    }
  },

  /**
   * Создает нового сотрудника
   * @param {Object} employeeData - Данные нового сотрудника
   * @returns {Promise<Object>} - Созданный сотрудник
   */
  async create(employeeData) {
    try {
      const response = await apiService.post('/api/employees/', employeeData);
      return response;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  },

  // Алиас для обратной совместимости
  createEmployee: function(employeeData) {
    return this.create(employeeData);
  },

  /**
   * Обновляет данные сотрудника
   * @param {string|number} id - Идентификатор сотрудника
   * @param {Object} employeeData - Обновленные данные сотрудника
   * @returns {Promise<Object>} - Обновленный сотрудник
   */
  async update(id, employeeData) {
    try {
      const response = await apiService.put(`/api/employees/${id}/`, employeeData);
      return response;
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  },

  // Алиас для обратной совместимости
  updateEmployee: function(id, employeeData) {
    return this.update(id, employeeData);
  },

  /**
   * Частично обновляет данные сотрудника
   * @param {string|number} id - Идентификатор сотрудника
   * @param {Object} employeeData - Частичные данные для обновления
   * @returns {Promise<Object>} - Обновленный сотрудник
   */
  partialUpdate: async (id, employeeData) => {
    return apiService.patch(`/api/employees/${id}/`, employeeData);
  },

  /**
   * Удаляет сотрудника
   * @param {string|number} id - Идентификатор сотрудника
   * @returns {Promise<{success: boolean}>} - Результат операции
   */
  async delete(id) {
    try {
      await apiService.delete(`/api/employees/${id}/`);
      return true;
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  },

  // Алиас для обратной совместимости
  deleteEmployee: function(id) {
    return this.delete(id);
  },

  /**
   * Получает задачи, назначенные сотруднику
   * @param {string|number} employeeId - Идентификатор сотрудника
   * @returns {Promise<Array>} - Массив задач
   */
  async getTasks(employeeId) {
    try {
      const response = await apiService.get(`/api/employees/${employeeId}/tasks/`);
      return Array.isArray(response) ? response : response.results || [];
    } catch (error) {
      console.error('Error fetching employee tasks:', error);
      return [];
    }
  },

  // Алиас для обратной совместимости
  getEmployeeTasks: function(employeeId) {
    return this.getTasks(employeeId);
  },

  /**
   * Получает список всех отделов
   * @returns {Promise<Array>} - Массив отделов
   */
  async getDepartments() {
    try {
      const response = await apiService.get('/api/departments/');
      return response;
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
  },

  /**
   * Создает новый отдел
   * @param {Object} departmentData - Данные нового отдела
   * @returns {Promise<Object>} - Созданный отдел
   */
  async createDepartment(departmentData) {
    try {
      const response = await apiService.post('/api/departments/', departmentData);
      return response;
    } catch (error) {
      console.error('Error creating department:', error);
      throw error;
    }
  }
};

export default employeeService;