import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import './Auth.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);
    
    try {
      await login(username, password);
      // После успешного входа перенаправляем на страницу проектов
      navigate('/projects');
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Неверный логин или пароль. Пожалуйста, попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2>Вход</h2>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <input
          type="text"
          placeholder="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
          required
          name="username"
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
          name="password"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Выполняется вход...' : 'Войти'}
        </button>
        <div className="auth-links">
          <Link to="/register">Регистрация</Link>
          <Link to="/reset-password">Забыли пароль?</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;