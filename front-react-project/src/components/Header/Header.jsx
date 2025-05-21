import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import './Header.css';

function Header() {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header>
      <div className="nav">
        <Link to="/" className="title">Конструктор проектов</Link>
        {isAuthenticated() && (
          <>
            <Link to="/projects" className="nav-link">Проекты</Link>
            <Link to="/employees" className="nav-link">Сотрудники</Link>
          </>
        )}
      </div>
      <div className="profile-area">
        {isAuthenticated() ? (
          <>
            <div className="user-info">
              <span>{currentUser?.name || currentUser?.username}</span>
            </div>
            <div className="profile-icon">
              <img src="/profile-icon.png" alt="Profile" />
              <div className="dropdown-menu">
                <button onClick={handleLogout} className="logout-btn">Выйти</button>
              </div>
            </div>
          </>
        ) : (
          <div className="auth-links">
            <Link to="/login" className="auth-link">Войти</Link>
            <Link to="/register" className="auth-link">Регистрация</Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;