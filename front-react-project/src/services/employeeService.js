import apiService from './apiService';

/**
 * Сервис для управления данными сотрудников
 */
class EmployeeService {
  /**
   * Базовый эндпоинт для API сотрудников
   */
  constructor() {
    this.endpoint = '/employees';
  }

  /**
   * Получает список всех сотрудников
   * @param {Object} params - Параметры запроса для фильтрации (отдел, должность и т.д.)
   * @returns {Promise<Array>} - Массив сотрудников
   */
  async getAll(params = {}) {
    return apiService.get(this.endpoint, params);
  }

  /**
   * Получает данные конкретного сотрудника
   * @param {string|number} id - Идентификатор сотрудника
   * @returns {Promise<Object>} - Данные сотрудника
   */
  async getById(id) {
    return apiService.get(`${this.endpoint}/${id}`);
  }

  /**
   * Создает нового сотрудника
   * @param {Object} employeeData - Данные нового сотрудника
   * @returns {Promise<Object>} - Созданный сотрудник
   */
  async create(employeeData) {
    return apiService.post(this.endpoint, employeeData);
  }

  /**
   * Обновляет данные сотрудника
   * @param {string|number} id - Идентификатор сотрудника
   * @param {Object} employeeData - Обновленные данные сотрудника
   * @returns {Promise<Object>} - Обновленный сотрудник
   */
  async update(id, employeeData) {
    return apiService.put(`${this.endpoint}/${id}`, employeeData);
  }

  /**
   * Частично обновляет данные сотрудника
   * @param {string|number} id - Идентификатор сотрудника
   * @param {Object} employeeData - Частичные данные для обновления
   * @returns {Promise<Object>} - Обновленный сотрудник
   */
  async partialUpdate(id, employeeData) {
    return apiService.patch(`${this.endpoint}/${id}`, employeeData);
  }

  /**
   * Удаляет сотрудника
   * @param {string|number} id - Идентификатор сотрудника
   * @returns {Promise<{success: boolean}>} - Результат операции
   */
  async delete(id) {
    return apiService.delete(`${this.endpoint}/${id}`);
  }

  /**
   * Получает задачи, назначенные сотруднику
   * @param {string|number} id - Идентификатор сотрудника
   * @returns {Promise<Array>} - Массив задач
   */
  async getTasks(id) {
    return apiService.get(`${this.endpoint}/${id}/tasks`);
  }
}

export default new EmployeeService();