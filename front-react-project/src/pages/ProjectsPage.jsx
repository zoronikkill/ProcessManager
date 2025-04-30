import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ProjectsPage.css";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const savedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
    setProjects(savedProjects);
  }, []);

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      <div className="projects-page">
        <div className="projects-header">
          <h1>Мои проекты</h1>
          <input
            type="text"
            placeholder="Поиск по названию..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <div key={project.id} className="project-card">
              <h3>{project.title}</h3>
              <div className="project-meta">
                <span>
                  Создан: {new Date(project.createdAt).toLocaleDateString()}
                </span>
                <span>
                  Изменен: {new Date(project.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="project-actions">
                <Link to={`/editor/${project.id}`} className="button">
                  Открыть
                </Link>
                <button className="button danger">Удалить</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;