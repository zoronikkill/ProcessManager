import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (formData.username.length < 3) {
      setError('Имя пользователя должно содержать минимум 3 символа');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Пожалуйста, введите корректный email');
      return;
    }

    if (formData.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (!formData.position.trim()) {
      setError('Пожалуйста, укажите должность');
      return;
    }

    if (!formData.department.trim()) {
      setError('Пожалуйста, укажите отдел');
      return;
    }

    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      if (users.some(user => user.email === formData.email)) {
        setError('Пользователь с таким email уже существует');
        return;
      }

      const newEmployee = {
        id: Date.now().toString(),
        username: formData.username,
        email: formData.email,
        password: formData.password,
        position: formData.position,
        department: formData.department,
        role: 'employee',
        created_at: new Date().toISOString()
      };

      users.push(newEmployee);
      localStorage.setItem('users', JSON.stringify(users));
      navigate('/employees');
    } catch (err) {
      setError('Ошибка при регистрации сотрудника');
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
              />
            </div>
            <button type="submit" className="submit-btn">Зарегистрировать сотрудника</button>
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