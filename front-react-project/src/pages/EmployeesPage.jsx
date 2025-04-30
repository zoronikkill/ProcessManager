import React, { useState, useEffect } from 'react';
import EmployeeForm from '../components/EmployeeForm/EmployeeForm';
import './EmployeesPage.css';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const savedEmployees = JSON.parse(localStorage.getItem('employees')) || [];
    setEmployees(savedEmployees);
  }, []);

  const handleSave = (employee) => {
    const updatedEmployees = [...employees, employee];
    setEmployees(updatedEmployees);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    setShowForm(false);
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchTerm.toLowerCase())
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeesPage;