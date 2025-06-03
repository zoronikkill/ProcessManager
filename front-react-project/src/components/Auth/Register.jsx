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
    isAdmin: false
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

    try {
      const registrationData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.isAdmin ? 'admin' : 'employee',
        is_staff: formData.isAdmin,
        is_superuser: formData.isAdmin
      };

      console.log('Отправка данных для регистрации:', registrationData);
      
      const response = await authService.register(registrationData);
      
      // После успешной регистрации автоматически входим в систему
      if (response && response.id) {
        // Обновляем контекст аутентификации с данными пользователя
        await login({ user: response });
        navigate('/projects');
      } else {
        // Если автоматический вход не удался, перенаправляем на страницу входа
        navigate('/login');
      }
    } catch (err) {
      console.error('Ошибка при регистрации:', err);
      
      // Улучшенная обработка ошибок
      if (err.response?.data) {
        const errorData = err.response.data;
        
        // Если есть сообщение об ошибке
        if (errorData.message || errorData.detail) {
          setError(errorData.message || errorData.detail);
        }
        // Если есть объект с ошибками валидации
        else if (typeof errorData === 'object') {
          const errorMessages = Object.entries(errorData)
            .map(([field, errors]) => {
              // Проверяем, является ли errors массивом
              if (Array.isArray(errors)) {
                return `${field}: ${errors.join(', ')}`;
              }
              // Если это строка или другой тип данных
              return `${field}: ${errors}`;
            })
            .filter(message => message) // Убираем пустые сообщения
            .join('\n');
          
          setError(errorMessages || 'Произошла ошибка при регистрации');
        } else {
          setError('Произошла ошибка при регистрации');
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