import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { projectService } from "../services/projectService";
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
  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Функция создания нового проекта и перехода в редактор
  const createNewProject = async () => {
    const projectName = prompt("Введите название нового проекта:");
    if (projectName) {
      try {
        const newProject = await projectService.create({
          title: projectName,
          description: "",
          status: "draft",
          data: {
            tasks: [],
            connections: [],
            settings: {}
          }
        });
        
        setProjects([...projects, newProject]);
        navigate(`/editor/${newProject.id}`);
      } catch (err) {
        console.error("Ошибка при создании проекта:", err);
        setError("Не удалось создать проект. Пожалуйста, попробуйте позже.");
      }
    }
  };

  if (loading) {
    return <div className="loading">Загрузка проектов...</div>;
  }

  return (
    <div className="container">
      <div className="projects-page">
        <div className="projects-header">
          <h1>Мои проекты</h1>
          <div className="projects-controls">
            <input
              type="text"
              placeholder="Поиск по названию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-project-input"
            />
            <button 
              onClick={createNewProject}
              className="create-project-btn"
            >
              + Создать проект
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="projects-grid">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <div key={project.id} className="project-card">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-info">
                  <span className="status">Статус: {project.status}</span>
                  <span className="deadline">Дедлайн: {new Date(project.endDate).toLocaleDateString()}</span>
                </div>
                <div className="project-actions">
                  <Link to={`/projects/${project.id}`} className="edit-button">
                    Редактировать
                  </Link>
                  <button 
                    className="delete-button"
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
                : "У вас ещё нет проектов. Нажмите «Создать проект», чтобы начать."
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;