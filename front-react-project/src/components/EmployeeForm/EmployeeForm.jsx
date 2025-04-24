import React, { useState } from 'react';
import './EmployeeForm.css';

const EmployeeForm = ({ onSave }) => {
  const [employee, setEmployee] = useState({
    id: '',
    name: '',
    email: '',
    position: '',
    department: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEmployee = { ...employee, id: crypto.randomUUID() };
    onSave(newEmployee);
    setEmployee({ id: '', name: '', email: '', position: '', department: '' });
  };

  return (
    <div className="employee-form-container">
      <h2>Регистрация нового сотрудника</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>ФИО:</label>
          <input
            type="text"
            name="name"
            value={employee.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={employee.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Должность:</label>
          <input
            type="text"
            name="position"
            value={employee.position}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Отдел:</label>
          <input
            type="text"
            name="department"
            value={employee.department}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-btn">Сохранить</button>
      </form>
    </div>
  );
};

export default EmployeeForm;