import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import employeeService from '../../services/employeeService';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './Auth.css';

const EmployeeRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    position: '',
    department: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.username.length < 3) {
      setError('Имя пользователя должно содержать минимум 3 символа');
      setLoading(false);
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Пожалуйста, введите корректный email');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }

    if (!formData.position.trim()) {
      setError('Пожалуйста, укажите должность');
      setLoading(false);
      return;
    }

    if (!formData.department.trim()) {
      setError('Пожалуйста, укажите отдел');
      setLoading(false);
      return;
    }

    try {
      const userData = await authService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: 'employee'
      });

      let departmentData;
      try {
        departmentData = await employeeService.createDepartment({
          name: formData.department,
          description: `Отдел ${formData.department}`
        });
      } catch (err) {
        if (err.response?.status === 400) {
          const departments = await employeeService.getDepartments();
          departmentData = departments.find(d => d.name === formData.department);
          if (!departmentData) {
            throw new Error('Не удалось найти или создать отдел');
          }
        } else {
          throw err;
        }
      }

      await employeeService.create({
        user: userData.id,
        name: formData.username,
        email: formData.email,
        position: formData.position,
        department: departmentData.id
      });

      navigate('/employees');
    } catch (err) {
      console.error('Ошибка при регистрации:', err);
      let errorMessage = 'Ошибка при регистрации сотрудника';
      
      if (err.response?.data) {
        const errors = err.response.data;
        if (errors.email) {
          errorMessage = Array.isArray(errors.email) ? errors.email[0] : errors.email;
        } else if (errors.username) {
          errorMessage = Array.isArray(errors.username) ? errors.username[0] : errors.username;
        } else if (errors.password) {
          errorMessage = Array.isArray(errors.password) ? errors.password[0] : errors.password;
        } else if (typeof errors === 'string') {
          errorMessage = errors;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Header />
      <div className="auth-container">
        <div className="auth-form-container">
          <h2>Регистрация сотрудника</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username">Имя пользователя</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Введите имя пользователя (минимум 3 символа)"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Введите ваш email"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Введите пароль (минимум 6 символов)"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Подтверждение пароля</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Подтвердите пароль"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="position">Должность</label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                placeholder="Введите должность"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="department">Отдел</label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                placeholder="Введите отдел"
                disabled={loading}
              />
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Регистрация...' : 'Зарегистрировать сотрудника'}
            </button>
          </form>
          <div className="auth-links">
            <p>
              <Link to="/employees">Вернуться к списку сотрудников</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EmployeeRegister; 