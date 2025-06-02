import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === formData.email);

      if (!user) {
        setError('Пользователь с таким email не найден');
        return;
      }

      if (user.password !== formData.password) {
        setError('Неверный пароль');
        return;
      }

      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('token', 'dummy-token');

      if (user.role === 'admin') {
        navigate('/projects');
      } else {
        navigate('/projects');
      }
    } catch (err) {
      setError('Ошибка при входе в систему');
    }
  };

  return (
    <div className="container">
      <Header />
      <div className="auth-container">
        <div className="auth-form-container">
          <h2>Вход в систему</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit} className="auth-form">
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
                placeholder="Введите ваш пароль"
              />
            </div>
            <button type="submit" className="submit-btn">Войти</button>
          </form>
          <div className="auth-links">
            <p>
              Нет аккаунта?{' '}
              <Link to="/register">Зарегистрироваться</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login; 