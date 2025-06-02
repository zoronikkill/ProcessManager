import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    try {
      await login(formData);
      navigate('/projects');
    } catch (err) {
      setError(err.message || 'Ошибка при входе в систему');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Header />
      <div className="auth-form-container">
        <h2>Вход в систему</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Пароль:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
        <div className="auth-links">
          <Link to="/register">Регистрация</Link>
          <Link to="/forgot-password">Забыли пароль?</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;