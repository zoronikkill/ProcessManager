import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ProjectConstructor from '../components/ProjectConstructor/ProjectConstructor';
import { Link } from 'react-router-dom';
import './ProjectEditor.css';

const ProjectEditor = () => {
    return (
        <div className="container">
            <Header />
            <div className="editor-header">
                <div className="editor-title-block">
                    <h1 className="editor-title">Конструктор проекта</h1>
                </div>
                <div className="editor-actions">
                    <button 
                        className="save-project-btn"
                        onClick={() => document.dispatchEvent(new Event('saveProject'))}
                    >
                        Сохранить проект
                    </button>
                    <Link to="/" className="back-button">← На главную</Link>
                </div>
            </div>
            <ProjectConstructor />
            <Footer />
        </div>
    );
};

export default ProjectEditor;