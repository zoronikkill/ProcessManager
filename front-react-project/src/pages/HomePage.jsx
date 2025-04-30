import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
    return (
        <div className="container">
            <main className="home-main">
                <div className="welcome-section">
                    <h1>Добро пожаловать в систему управления бизнес-процессами</h1>
                    <p>Создавайте, управляйте и отслеживайте ваши бизнес-процессы</p>
                </div>
                
                <div className="quick-actions">
                    <div className="quick-actions-row">
                        <Link to="/projects" className="quick-action-card">
                            <span className="card-icon">📋</span>
                            <span className="card-title">Все проекты</span>
                            <span className="card-description">Просмотр и управление всеми проектами</span>
                        </Link>
                        <Link to="/search" className="quick-action-card">
                            <span className="card-icon">🔍</span>
                            <span className="card-title">Поиск проекта</span>
                            <span className="card-description">Быстрый поиск по проектам</span>
                        </Link>
                        <Link to="/directory" className="quick-action-card">
                            <span className="card-icon">📚</span>
                            <span className="card-title">Справочники</span>
                            <span className="card-description">Доступ к справочным материалам</span>
                        </Link>
                    </div>
                </div>

                <div className="main-actions">
                    <Link to="/editor" className="main-action-button create">
                        <span className="button-icon">➕</span>
                        <span className="button-text">Создать проект</span>
                    </Link>
                    <Link to="/active-projects" className="main-action-button active">
                        <span className="button-icon">📊</span>
                        <span className="button-text">Проекты в работе</span>
                    </Link>
                    <Link to="/archive" className="main-action-button archive">
                        <span className="button-icon">📁</span>
                        <span className="button-text">Архив проектов</span>
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default HomePage;