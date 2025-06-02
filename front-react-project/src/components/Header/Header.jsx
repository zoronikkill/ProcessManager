import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import Button from '../Button/Button';
import { authService } from '../../services/authService';

function Header() {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  const handleAddEmployee = () => {
    navigate('/register-employee');
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <Link to="/">Менеджер проектов</Link>
        </div>
        <nav className="nav-links">
          {currentUser ? (
            <>
              <Link to="/projects">Проекты</Link>
              {currentUser.role === 'admin' && (
                <>
                  <Link to="/employees">Сотрудники</Link>
                  <Button 
                    text="Добавить сотрудника" 
                    className="small secondary" 
                    onClick={handleAddEmployee}
                  />
                </>
              )}
              <div className="user-info">
                <span>{currentUser.username}</span>
                <Button text="Выйти" className="small secondary" onClick={handleLogout} />
              </div>
            </>
          ) : (
            <>
              <Link to="/login">Войти</Link>
              <Link to="/register">Регистрация</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;