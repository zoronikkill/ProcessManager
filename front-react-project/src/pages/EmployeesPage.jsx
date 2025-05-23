import React, { useState, useEffect } from 'react';
import employeeService from '../services/employeeService';
import EmployeeForm from '../components/EmployeeForm/EmployeeForm';
import './EmployeesPage.css';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка сотрудников при монтировании компонента
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Функция загрузки сотрудников из API
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getAll();
      // Проверяем, что data является массивом, если нет - преобразуем в массив
      const employeesArray = Array.isArray(data) ? data : data?.results || [];
      setEmployees(employeesArray);
      setError(null);
    } catch (err) {
      console.error("Ошибка при загрузке сотрудников:", err);
      setError("Не удалось загрузить список сотрудников. Пожалуйста, попробуйте позже.");
      
      // Временное решение: использовать данные из localStorage при ошибке API
      const savedEmployees = JSON.parse(localStorage.getItem('employees')) || [];
      setEmployees(savedEmployees);
    } finally {
      setLoading(false);
    }
  };

  // Обработчик сохранения сотрудника (создание или обновление)
  const handleSave = async (employeeData) => {
    try {
      if (selectedEmployee) {
        // Обновление существующего сотрудника
        const updatedEmployee = await employeeService.update(selectedEmployee.id, employeeData);
        setEmployees(employees.map(emp => 
          emp.id === selectedEmployee.id ? updatedEmployee : emp
        ));
      } else {
        // Создание нового сотрудника
        const newEmployee = await employeeService.create(employeeData);
        setEmployees([...employees, newEmployee]);
      }
      
      // Закрываем форму и сбрасываем выбранного сотрудника
      setShowForm(false);
      setSelectedEmployee(null);
    } catch (err) {
      console.error("Ошибка при сохранении сотрудника:", err);
      alert("Не удалось сохранить сотрудника. Пожалуйста, попробуйте позже.");
      
      // Временное решение: обновить локальное хранилище при ошибке API
      if (selectedEmployee) {
        const updatedEmployees = employees.map(emp => 
          emp.id === selectedEmployee.id ? {...emp, ...employeeData} : emp
        );
        setEmployees(updatedEmployees);
        localStorage.setItem('employees', JSON.stringify(updatedEmployees));
      } else {
        const newEmployee = {
          id: Date.now().toString(),
          ...employeeData
        };
        const updatedEmployees = [...employees, newEmployee];
        setEmployees(updatedEmployees);
        localStorage.setItem('employees', JSON.stringify(updatedEmployees));
      }
      
      setShowForm(false);
      setSelectedEmployee(null);
    }
  };

  // Обработчик удаления сотрудника
  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этого сотрудника?')) {
      try {
        await employeeService.delete(id);
        setEmployees(employees.filter(emp => emp.id !== id));
      } catch (err) {
        console.error("Ошибка при удалении сотрудника:", err);
        alert("Не удалось удалить сотрудника. Пожалуйста, попробуйте позже.");
        
        // Временное решение: обновить локальное хранилище при ошибке API
        const updatedEmployees = employees.filter(emp => emp.id !== id);
        setEmployees(updatedEmployees);
        localStorage.setItem('employees', JSON.stringify(updatedEmployees));
      }
    }
  };

  // Обработчик редактирования сотрудника
  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setShowForm(true);
  };

  // Фильтрация сотрудников по поисковому запросу
  const filteredEmployees = employees.filter(emp =>
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <div className="employees-page">
        <h1>Управление сотрудниками</h1>
        
        <div className="employees-controls">
          <input
            type="text"
            placeholder="Поиск сотрудников..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button 
            onClick={() => {
              setSelectedEmployee(null); // Сбрасываем выбранного сотрудника при создании нового
              setShowForm(true);
            }}
            className="add-employee-btn"
          >
            + Добавить сотрудника
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {showForm && (
          <div className="employee-form-modal">
            <div className="modal-content">
              <h2>{selectedEmployee ? 'Редактировать сотрудника' : 'Добавить сотрудника'}</h2>
              <EmployeeForm 
                onSave={handleSave} 
                initialData={selectedEmployee || {}} 
              />
              <button 
                onClick={() => {
                  setShowForm(false);
                  setSelectedEmployee(null);
                }}
                className="close-btn"
              >
                Закрыть
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading-indicator">Загрузка данных...</div>
        ) : (
          <div className="employee-list">
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map(employee => (
                <div key={employee.id} className="employee-card">
                  <h3>{employee.name}</h3>
                  <p><strong>Должность:</strong> {employee.position}</p>
                  <p><strong>Отдел:</strong> {employee.department}</p>
                  <p><strong>Email:</strong> {employee.email}</p>
                  <div className="employee-actions">
                    <button 
                      onClick={() => handleEdit(employee)} 
                      className="edit-btn"
                    >
                      Редактировать
                    </button>
                    <button 
                      onClick={() => handleDelete(employee.id)} 
                      className="delete-btn"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                {searchTerm ? 'Нет сотрудников, соответствующих поисковому запросу' : 'Нет добавленных сотрудников'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeesPage;