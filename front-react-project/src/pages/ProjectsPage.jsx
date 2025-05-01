import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import projectService from "../services/projectService";
import "./ProjectsPage.css";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      console.error("Ошибка при загрузке проектов:", err);
      setError("Не удалось загрузить список проектов. Пожалуйста, попробуйте позже.");
      
      // Временное решение: использовать данные из localStorage при ошибке API
      const savedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
      setProjects(savedProjects);
    } finally {
      setLoading(false);
    }
  };

  // Обработчик удаления проекта
  const handleDeleteProject = async (id) => {
    if (window.confirm("Вы уверены, что хотите удалить этот проект?")) {
      try {
        await projectService.delete(id);
        setProjects(projects.filter(project => project.id !== id));
        // Синхронизировать localStorage после успешного API-запроса
        const updatedProjects = projects.filter(project => project.id !== id);
        localStorage.setItem("projects", JSON.stringify(updatedProjects));
      } catch (err) {
        console.error("Ошибка при удалении проекта:", err);
        alert("Не удалось удалить проект. Пожалуйста, попробуйте позже.");
        
        if (err.response && err.response.status === 401) {
          // Обработка ошибки авторизации
          alert("Требуется авторизация. Пожалуйста, войдите в систему.");
          // Можно добавить редирект на страницу логина
          // window.location.href = '/login';
          return;
        }
        
        // Временное локальное удаление при ошибке API
        const updatedProjects = projects.filter(project => project.id !== id);
        setProjects(updatedProjects);
        localStorage.setItem("projects", JSON.stringify(updatedProjects));
      }
    }
  };

  // Фильтрация проектов по поисковому запросу
  const filteredProjects = projects.filter((project) =>
    project.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Функция создания нового проекта и перехода в редактор
  const createNewProject = async () => {
    const projectName = prompt("Введите название нового проекта:");
    if (projectName) {
      try {
        const newProject = await projectService.create({
          title: projectName,
          description: "",
          data: {
            tasks: [],
            connections: [],
            settings: {}
          }
        });
        
        setProjects([...projects, newProject]);
        
        // Перенаправление в редактор с ID нового проекта
        window.location.href = `/editor/${newProject.id}`;
      } catch (err) {
        console.error("Ошибка при создании проекта:", err);
        alert("Не удалось создать проект. Пожалуйста, попробуйте позже.");
        
        // Временное решение: создать проект локально при ошибке API
        const newProject = {
          id: crypto.randomUUID(),
          title: projectName,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          data: {
            tasks: [],
            connections: [],
            settings: {}
          }
        };
        
        const updatedProjects = [...projects, newProject];
        setProjects(updatedProjects);
        localStorage.setItem("projects", JSON.stringify(updatedProjects));
        
        // Перенаправление в редактор с ID нового проекта
        window.location.href = `/editor/${newProject.id}`;
      }
    }
  };

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

        {loading ? (
          <div className="loading-indicator">Загрузка проектов...</div>
        ) : (
          <div className="projects-grid">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
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
                    <Link to={`/editor/${project.id}`} className="button edit">
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
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;