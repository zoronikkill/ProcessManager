import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProjectConstructor from '../components/ProjectConstructor/ProjectConstructor';
import './ProjectEditor.css';

const ProjectEditor = () => {
    return (
        <div className="project-editor-container">
            <main className="project-editor-main">
                <ProjectConstructor />
            </main>
        </div>
    );
};

export default ProjectEditor;