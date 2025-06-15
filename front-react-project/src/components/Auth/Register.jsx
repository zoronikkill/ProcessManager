import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    isAdmin: false,
    firstName: '',
    lastName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.username || formData.username.length < 3) {
      setError('Имя пользователя должно быть не менее 3 символов');
      return;
    }
    
    if (!formData.email || !formData.email.includes('@')) {
      setError('Введите корректный email адрес');
      return;
    }
    
    if (!formData.password || formData.password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      setLoading(true);
      const response = await authService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName || '',
        last_name: formData.lastName || '',
        role: formData.isAdmin ? 'admin' : 'employee',
        is_staff: formData.isAdmin,
        is_superuser: formData.isAdmin
      });
      
      console.log('Регистрация успешна:', response);
      
      await authService.login({
        username: formData.username,
        password: formData.password
      });
      
      navigate('/projects');
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      if (error.response?.data) {
        const serverErrors = error.response.data;
        if (serverErrors.username) {
          setError('Это имя пользователя уже занято');
        } else {
          setError('Ошибка при регистрации: ' + JSON.stringify(serverErrors));
        }
      } else {
        setError('Произошла ошибка при регистрации. Пожалуйста, попробуйте позже.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Header />
      <div className="auth-container">
        <div className="auth-form-container">
          <h2>Регистрация</h2>
          {error && <div className="error-message" style={{ whiteSpace: 'pre-line' }}>{error}</div>}
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
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="isAdmin"
                  checked={formData.isAdmin}
                  onChange={handleChange}
                  disabled={loading}
                />
                Зарегистрировать как администратора
              </label>
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
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