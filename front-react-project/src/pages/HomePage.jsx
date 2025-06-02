import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './HomePage.css';

const HomePage = () => {
    return (
        <div className="container">
            <Header />
            <main>
                <div className="div-button">
                    <Link to="/projects" className="button">Все проекты</Link>
                    <Link to="/projects" className="button">Поиск проекта</Link>
                    <Link to="/projects" className="button">Справочники</Link>
                </div>
                <div className="button-container">
                    <Link to="/editor" className="main-button">Создать проект</Link>
                    <Link to="/projects" className="main-button">Проекты в работе</Link>
                    <Link to="/projects" className="main-button">Архив проектов</Link>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default HomePage;