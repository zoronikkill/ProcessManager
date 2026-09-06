import apiService from './apiService';

class ProcessTemplateService {
  constructor() {
    this.endpoint = '/process-templates';
  }

  /**
   * Получает список всех шаблонов бизнес-процессов
   * @param {Object} params - Параметры запроса для фильтрации
   * @returns {Promise<Array>} - Массив шаблонов
   */
  async getAll(params = {}) {
    return apiService.get(this.endpoint, params);
  }

  /**
   * Получает данные конкретного шаблона
   * @param {string|number} id - Идентификатор шаблона
   * @returns {Promise<Object>} - Данные шаблона
   */
  async getById(id) {
    return apiService.get(`${this.endpoint}/${id}/`);
  }

  /**
   * Создает новый шаблон бизнес-процесса
   * @param {Object} templateData - Данные нового шаблона
   * @returns {Promise<Object>} - Созданный шаблон
   */
  async create(templateData) {
    return apiService.post(this.endpoint, templateData);
  }

  /**
   * Обновляет данные шаблона
   * @param {string|number} id - Идентификатор шаблона
   * @param {Object} templateData - Обновленные данные шаблона
   * @returns {Promise<Object>} - Обновленный шаблон
   */
  async update(id, templateData) {
    return apiService.put(`${this.endpoint}/${id}`, templateData);
  }

  /**
   * Частично обновляет данные шаблона
   * @param {string|number} id - Идентификатор шаблона
   * @param {Object} templateData - Частичные данные для обновления
   * @returns {Promise<Object>} - Обновленный шаблон
   */
  async partialUpdate(id, templateData) {
    return apiService.patch(`${this.endpoint}/${id}`, templateData);
  }

  /**
   * Удаляет шаблон
   * @param {string|number} id - Идентификатор шаблона
   * @returns {Promise<{success: boolean}>} - Результат операции
   */
  async delete(id) {
    return apiService.delete(`${this.endpoint}/${id}`);
  }

  /**
   * Получает этапы шаблона бизнес-процесса
   * @param {string|number} id - Идентификатор шаблона
   * @returns {Promise<Array>} - Массив этапов шаблона
   */
  async getStages(id) {
    return apiService.get(`${this.endpoint}/${id}/stages/`);
  }

  /**
   * Создает новый этап шаблона бизнес-процесса
   * @param {string|number} templateId - Идентификатор шаблона
   * @param {Object} stageData - Данные нового этапа
   * @returns {Promise<Object>} - Созданный этап
   */
  async createStage(templateId, stageData) {
    return apiService.post(`${this.endpoint}/${templateId}/stages`, stageData);
  }

  /**
   * Создает новый бизнес-процесс на основе шаблона
   * @param {string|number} templateId - Идентификатор шаблона
   * @param {Object} processData - Данные для создания процесса
   * @returns {Promise<Object>} - Созданный бизнес-процесс
   */
  async createProcess(templateId, processData) {
    return apiService.post(`${this.endpoint}/${templateId}/create-process`, processData);
  }

  /**
   * Клонирует существующий шаблон
   * @param {string|number} templateId - Идентификатор шаблона для клонирования
   * @param {string} newName - Название для нового шаблона
   * @returns {Promise<Object>} - Клонированный шаблон
   */
  async cloneTemplate(templateId, newName) {
    return apiService.post(`${this.endpoint}/${templateId}/clone`, { name: newName });
  }
}

export default new ProcessTemplateService();