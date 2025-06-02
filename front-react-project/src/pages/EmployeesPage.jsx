import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { employeeService } from '../services/employeeService';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './EmployeesPage.css';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getAll();
      setEmployees(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Не удалось загрузить список сотрудников');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этого сотрудника?')) {
      try {
        await employeeService.delete(id);
        setEmployees(employees.filter(emp => emp.id !== id));
      } catch (err) {
        console.error('Error deleting employee:', err);
        setError('Не удалось удалить сотрудника');
      }
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container">
        <Header />
        <div className="loading">Загрузка сотрудников...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="container">
      <Header />
      <div className="employees-page">
        <div className="employees-header">
          <h1>Сотрудники</h1>
          <div className="employees-controls">
            <input
              type="text"
              placeholder="Поиск по имени, email, должности или отделу..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <Link to="/register-employee" className="add-employee-btn">
              + Добавить сотрудника
            </Link>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="employees-grid">
          {filteredEmployees.map(employee => (
            <div key={employee.id} className="employee-card">
              <div className="employee-info">
                <h3>{employee.username}</h3>
                <p className="email">{employee.email}</p>
                {employee.position && (
                  <p className="position">Должность: {employee.position}</p>
                )}
                {employee.department && (
                  <p className="department">Отдел: {employee.department}</p>
                )}
                <p className="date">
                  Дата регистрации: {new Date(employee.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="employee-actions">
                <button 
                  onClick={() => handleDelete(employee.id)}
                  className="delete-btn"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EmployeesPage;