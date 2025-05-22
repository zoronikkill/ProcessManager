import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import "./ProjectsPage.css";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await api.getProjects();
      setProjects(response.data);
      setError(null);
    } catch (err) {
      setError("Ошибка при загрузке проектов");
      console.error("Ошибка загрузки проектов:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm("Вы уверены, что хотите удалить этот проект?")) {
      try {
        await api.deleteProject(projectId);
        setProjects(projects.filter(p => p.id !== projectId));
      } catch (err) {
        setError("Ошибка при удалении проекта");
        console.error("Ошибка удаления проекта:", err);
      }
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Загрузка проектов...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
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
                Создан: {new Date(project.created_at).toLocaleDateString()}
              </span>
              <span>
                Изменен: {new Date(project.updated_at).toLocaleDateString()}
              </span>
            </div>
            <div className="project-actions">
              <Link to={`/editor/${project.id}`} className="button">
                Открыть
              </Link>
              <button 
                className="button danger"
                onClick={() => handleDeleteProject(project.id)}
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;