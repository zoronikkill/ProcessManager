import React, { useState, useEffect } from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import EmployeeForm from '../components/EmployeeForm/EmployeeForm';
import api from '../api';
import './EmployeesPage.css';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const response = await api.getEmployees();
      setEmployees(response.data);
      setError(null);
    } catch (err) {
      setError("Ошибка при загрузке сотрудников");
      console.error("Ошибка загрузки сотрудников:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (employee) => {
    try {
      const response = await api.createEmployee(employee);
      setEmployees([...employees, response.data]);
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError("Ошибка при создании сотрудника");
      console.error("Ошибка создания сотрудника:", err);
    }
  };

  const handleDelete = async (employeeId) => {
    if (window.confirm("Вы уверены, что хотите удалить этого сотрудника?")) {
      try {
        await api.deleteEmployee(employeeId);
        setEmployees(employees.filter(emp => emp.id !== employeeId));
        setError(null);
      } catch (err) {
        setError("Ошибка при удалении сотрудника");
        console.error("Ошибка удаления сотрудника:", err);
      }
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Загрузка сотрудников...</div>;
  }

  return (
    <div className="container">
      <Header />
      
      <div className="employees-page">
        <h1>Управление сотрудниками</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="employees-controls">
          <input
            type="text"
            placeholder="Поиск сотрудников..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button 
            onClick={() => setShowForm(true)}
            className="add-employee-btn"
          >
            + Добавить сотрудника
          </button>
        </div>

        {showForm && (
          <div className="employee-form-modal">
            <div className="modal-content">
              <EmployeeForm onSave={handleSave} />
              <button 
                onClick={() => setShowForm(false)}
                className="close-btn"
              >
                Закрыть
              </button>
            </div>
          </div>
        )}

        <div className="employee-list">
          {filteredEmployees.map(employee => (
            <div key={employee.id} className="employee-card">
              <h3>{employee.name}</h3>
              <p><strong>Должность:</strong> {employee.position}</p>
              <p><strong>Отдел:</strong> {employee.department}</p>
              <p><strong>Email:</strong> {employee.email}</p>
              <button 
                onClick={() => handleDelete(employee.id)}
                className="delete-btn"
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EmployeesPage;