import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import Button from '../Button/Button';
import authService from '../../services/authService';

function Header() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  const fetchUser = async () => {
    try {
      const user = await authService.getCurrentUser();
      console.log('Данные пользователя в Header:', user);
      setCurrentUser(user);
    } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error);
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setCurrentUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
      setCurrentUser(null);
      navigate('/login');
    }
  };

  const handleAddEmployee = () => {
    navigate('/register-employee');
  };

  const isAdmin = currentUser?.is_staff && currentUser?.is_superuser;

  console.log('Текущий пользователь:', currentUser);
  console.log('Является ли админом:', isAdmin);

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
              <Link to="/users">Управление пользователями</Link>
              {isAdmin && (
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