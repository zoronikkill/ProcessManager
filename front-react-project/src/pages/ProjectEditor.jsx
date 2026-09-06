import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ProjectConstructor from '../components/ProjectConstructor/ProjectConstructor';
import { Link, useParams } from 'react-router-dom';
import './ProjectEditor.css';

const ProjectEditor = () => {
    const { id } = useParams();

    return (
        <div className="container">
            <Header />
            <div className="editor-header">
                <h2>Конструктор проекта</h2>
                <div className="editor-actions">
                    <button 
                        className="save-project-btn"
                        onClick={() => document.dispatchEvent(new Event('saveProject'))}
                    >
                        Сохранить проект
                    </button>
                    <Link to="/projects" className="back-button">← К проектам</Link>
                </div>
            </div>
            <ProjectConstructor projectId={id} />
            <Footer />
        </div>
    );
};

export default ProjectEditor;