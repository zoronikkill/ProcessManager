import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import projectService from "../services/projectService";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import "./ProjectsPage.css";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Загрузка проектов при монтировании компонента
  useEffect(() => {
    fetchProjects();
  }, []);

  // Функция загрузки проектов из API
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getAll();
      setProjects(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Не удалось загрузить проекты. Пожалуйста, попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  // Обработчик удаления проекта
  const handleDelete = async (id) => {
    if (window.confirm("Вы уверены, что хотите удалить этот проект?")) {
      try {
        await projectService.delete(id);
        setProjects(projects.filter(project => project.id !== id));
      } catch (err) {
        console.error("Error deleting project:", err);
        setError("Не удалось удалить проект. Пожалуйста, попробуйте позже.");
      }
    }
  };

  // Фильтрация проектов по поисковому запросу
  const filteredProjects = Array.isArray(projects) 
    ? projects.filter(project => 
        project?.title?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Функция создания нового проекта и перехода в редактор
  const createNewProject = () => {
    navigate('/editor');
  };

  if (loading) {
    return <div className="loading">Загрузка проектов...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
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
            <button 
              onClick={createNewProject}
              className="button"
            >
              + Новый проект
            </button>
          </div>
        </div>

        <div className="projects-grid">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
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
                  <Link to={`/projects/${project.id}`} className="button">
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
            ))
          ) : (
            <div className="no-projects">
              {searchQuery 
                ? "Нет проектов, соответствующих поисковому запросу" 
                : "У вас ещё нет проектов. Нажмите «Новый проект», чтобы начать."
              }
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProjectsPage;