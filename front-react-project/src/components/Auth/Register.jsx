import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      const adminExists = users.some(user => user.role === 'admin');
      if (adminExists) {
        setError('Администратор уже зарегистрирован в системе');
        return;
      }

      if (users.some(user => user.email === formData.email)) {
        setError('Пользователь с таким email уже существует');
        return;
      }

      const newAdmin = {
        id: Date.now().toString(),
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: 'admin',
        created_at: new Date().toISOString()
      };

      users.push(newAdmin);
      localStorage.setItem('users', JSON.stringify(users));
      navigate('/login');
    } catch (err) {
      setError('Ошибка при регистрации');
    }
  };

  return (
    <div className="container">
      <Header />
      <div className="auth-container">
        <div className="auth-form-container">
          <h2>Регистрация администратора</h2>
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
            <button type="submit" className="submit-btn">Зарегистрироваться</button>
          </form>
          <div className="auth-links">
            <p>
              Уже есть аккаунт?{' '}
              <Link to="/login">Войти</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register; 