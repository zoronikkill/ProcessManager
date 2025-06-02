import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { projectStorage } from "../storage";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import "./ProjectsPage.css";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = () => {
      try {
        const data = projectStorage.getProjects();
        setProjects(data);
        setLoading(false);
      } catch (err) {
        setError('Ошибка при загрузке проектов');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот проект?')) {
      try {
        projectStorage.deleteProject(id);
        setProjects(projects.filter(project => project.id !== id));
      } catch (err) {
        setError('Ошибка при удалении проекта');
      }
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container">
        <Header />
        <div className="loading">Загрузка проектов...</div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <Header />
        <div className="error">{error}</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="container">
      <Header />
      <div className="projects-page">
        <div className="projects-header">
          <h1>Мои проекты</h1>
          <div className="projects-controls">
            <input
              type="text"
              placeholder="Поиск по названию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <Link to="/employees" className="employees-btn">
              Сотрудники
            </Link>
            <Link to="/editor" className="button">
              + Новый проект
            </Link>
          </div>
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
                  onClick={() => handleDelete(project.id)}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProjectsPage;