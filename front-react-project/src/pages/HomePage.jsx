import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import './HomePage.css';

const HomePage = () => {
  const { isAuthenticated, currentUser } = useAuth();
  
  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Business Process Manager</h1>
        <p className="subtitle">Управляйте бизнес-процессами вашей компании эффективно</p>
        
        {isAuthenticated() ? (
          <div className="welcome-section">
            <h2>Добро пожаловать, {currentUser?.first_name || currentUser?.username}!</h2>
            <div className="action-buttons">
              <Link to="/projects" className="primary-button">
                Мои проекты
              </Link>
              <Link to="/employees" className="secondary-button">
                Управление сотрудниками
              </Link>
            </div>
          </div>
        ) : (
          <div className="auth-actions">
            <p>Для начала работы необходимо войти в систему или зарегистрироваться</p>
            <div className="action-buttons">
              <Link to="/login" className="primary-button">
                Вход
              </Link>
              <Link to="/register" className="secondary-button">
                Регистрация
              </Link>
            </div>
          </div>
        )}
      </div>
      
      <div className="features-section">
        <h2>Возможности системы</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Управление проектами</h3>
            <p>Создавайте и редактируйте проекты. Отслеживайте прогресс и выполнение задач.</p>
          </div>
          <div className="feature-card">
            <h3>Бизнес-процессы</h3>
            <p>Визуальное моделирование бизнес-процессов с удобным конструктором.</p>
          </div>
          <div className="feature-card">
            <h3>Управление задачами</h3>
            <p>Распределение задач между сотрудниками и контроль их выполнения.</p>
          </div>
          <div className="feature-card">
            <h3>Аналитика</h3>
            <p>Отчеты и статистика по бизнес-процессам и эффективности их выполнения.</p>
          </div>
        </div>
      </div>
      
      <div className="info-section">
        <h2>О приложении</h2>
        <p>
          Business Process Manager — это веб-приложение для моделирования, исполнения и мониторинга 
          бизнес-процессов. Система позволяет создавать визуальные схемы процессов, 
          назначать задачи сотрудникам и отслеживать их выполнение.
        </p>
      </div>
    </div>
  );
};

export default HomePage;