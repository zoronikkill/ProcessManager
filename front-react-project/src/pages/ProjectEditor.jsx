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
                <h2>Конструктор проекта</h2>
                <Link to="/" className="back-button">← На главную</Link>
            </div>
            <ProjectConstructor />
            <Footer />
        </div>
    );
};

export default ProjectEditor;