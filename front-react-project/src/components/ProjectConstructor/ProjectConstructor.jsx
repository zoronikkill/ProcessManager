import React, { useState, useRef, useEffect } from "react";
import "./ProjectConstructor.css";
import Button from "../Button/Button";
import { useParams, useNavigate } from 'react-router-dom';
import projectService from "../../services/projectService";
import taskService from "../../services/taskService";
import employeeService from "../../services/employeeService";

function ProjectConstructor() {
  const [initialTasks, setInitialTasks] = useState([
    { id: 1, name: "Анализ требований" },
    { id: 2, name: "Проектирование" },
    { id: 3, name: "Разработка" },
  ]);

  const [projectAreaTasks, setProjectAreaTasks] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTaskName, setNewTaskName] = useState("");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [employees, setEmployees] = useState([]);
  
  const projectAreaRef = useRef(null);
  const taskElements = useRef({});
  const { projectId } = useParams();
  const navigate = useNavigate();

  // Добавляем обработчик для кнопки "Сохранить проект"
  useEffect(() => {
    const handleSave = () => saveProject();
    document.addEventListener('saveProject', handleSave);
    return () => document.removeEventListener('saveProject', handleSave);
  }, [projectAreaTasks, connections, projectTitle]);

  // Загрузка данных сотрудников при монтировании компонента
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Загрузка проекта при монтировании компонента, если есть projectId
  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    }
  }, [projectId]);

  // Обновление соединений между задачами при изменении позиций задач
  useEffect(() => {
    if (projectAreaTasks.length > 0 && connections.length > 0) {
      const timer = setTimeout(() => {
        setConnections([...connections]);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [projectAreaTasks]);

  // Функция загрузки данных о сотрудниках
  const fetchEmployees = async () => {
    try {
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (err) {
      console.error("Ошибка при загрузке сотрудников:", err);
      // Резервный вариант - загрузка из localStorage
      const savedEmployees = JSON.parse(localStorage.getItem('employees')) || [];
      setEmployees(savedEmployees);
    }
  };

  function handleAddNewTask() {
    if (newTaskName.trim() === "") return;

    const newTask = {
      id: Date.now(),
      name: newTaskName.trim(),
    };

    setInitialTasks([...initialTasks, newTask]);
    setNewTaskName("");
    setShowTaskForm(false);
  }

  function getNewPosition() {
    const container = projectAreaRef.current;
    if (!container) return { x: 20, y: 20 };

    const containerRect = container.getBoundingClientRect();
    const gridSize = 20;
    const tasksInRow = Math.floor((containerRect.width - 40) / 220);
    
    const row = Math.floor(projectAreaTasks.length / tasksInRow);
    const col = projectAreaTasks.length % tasksInRow;

    return {
      x: 20 + col * 220,
      y: 20 + row * 120
    };
  }

  function handleDragStart(task, e) {
    e.dataTransfer.setData("task", JSON.stringify(task));
  }

  function handleDrop(e) {
    e.preventDefault();
    const task = JSON.parse(e.dataTransfer.getData("task"));

    const rect = projectAreaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setProjectAreaTasks([
      ...projectAreaTasks,
      {
        ...task,
        id: Date.now(),
        taskType: task.id,
        x,
        y,
        deadline: "",
        assignee: "",
      },
    ]);
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  function handleTaskMouseDown(taskId, e) {
    // Проверяем, не является ли цель клика одной из кнопок действий
    if (e.target.closest('.task-action')) {
      return;
    }

    if (e.button !== 0) return;

    const startPos = { x: e.clientX, y: e.clientY };
    const taskElement = e.currentTarget;
    const containerRect = projectAreaRef.current.getBoundingClientRect();
    const taskRect = taskElement.getBoundingClientRect();
    const offset = {
      x: startPos.x - taskRect.left,
      y: startPos.y - taskRect.top,
    };

    let isDragging = false;
    let moved = false;

    function handleMouseMove(e) {
      if (e.clientX !== startPos.x || e.clientY !== startPos.y) {
        moved = true;
      }

      if (!isDragging && (Math.abs(e.clientX - startPos.x) > 3 || Math.abs(e.clientY - startPos.y) > 3)) {
        isDragging = true;
        taskElement.classList.add("dragging");
      }

      if (isDragging) {
        const newX = Math.max(0, Math.min(e.clientX - containerRect.left - offset.x, containerRect.width - taskRect.width));
        const newY = Math.max(0, Math.min(e.clientY - containerRect.top - offset.y, containerRect.height - taskRect.height));

        setProjectAreaTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, x: newX, y: newY } : t))
        );
      }
    }

    function handleMouseUp() {
      taskElement.classList.remove("dragging");
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      
      // Обрабатываем клик только если не было перемещения
      if (!moved) {
        const task = projectAreaTasks.find((t) => t.id === taskId);
        handleTaskSelect(task);
      }
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }

  function handleTaskSelect(task, e) {
    // Проверяем, не является ли цель клика одной из кнопок действий
    if (e && e.target.closest('.task-action')) {
      return;
    }

    if (!task) return;

    if (selectedTask) {
      if (selectedTask.id === task.id) {
        setSelectedTask(null);
        return;
      }
      setConnections([
        ...connections,
        {
          from: selectedTask.id,
          to: task.id,
        },
      ]);
      setSelectedTask(null);
    } else {
      setSelectedTask(task);
    }
  }

  function handleTaskUpdate(taskId, field, value) {
    setProjectAreaTasks(prev =>
      prev.map(task => task.id === taskId ? { ...task, [field]: value } : task)
    );
  }

  function removeConnection(index) {
    setConnections(prev => prev.filter((_, i) => i !== index));
  }

  function calculateConnectionPoints(fromTask, toTask) {
    const fromElement = taskElements.current[`task-${fromTask.id}`];
    const toElement = taskElements.current[`task-${toTask.id}`];

    if (!fromElement || !toElement)
      return { fromPoint: { x: 0, y: 0 }, toPoint: { x: 0, y: 0 } };

    const fromRect = fromElement.getBoundingClientRect();
    const toRect = toElement.getBoundingClientRect();

    const fromCenter = {
      x: fromRect.left + fromRect.width / 2,
      y: fromRect.top + fromRect.height / 2,
    };
    const toCenter = {
      x: toRect.left + toRect.width / 2,
      y: toRect.top + toRect.height / 2,
    };

    function getEdgePoint(rect, targetX, targetY, borderRadius = 2) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = targetX - centerX;
      const dy = targetY - centerY;
      const angle = Math.atan2(dy, dx);

      const halfWidth = rect.width / 2 - borderRadius;
      const halfHeight = rect.height / 2 - borderRadius;

      const absAngle = Math.abs(angle);
      let x, y;

      if (absAngle <= Math.PI / 4 || absAngle >= (3 * Math.PI) / 4) {
        const direction = dx > 0 ? 1 : -1;
        x = centerX + direction * (rect.width / 2);
        y = centerY + direction * (rect.width / 2) * Math.tan(angle);

        if (Math.abs(y - centerY) > halfHeight) {
          const yDirection = dy > 0 ? 1 : -1;
          y = centerY + yDirection * halfHeight;
          x = centerX + (yDirection * halfHeight) / Math.tan(angle);
        }
      } else {
        const direction = dy > 0 ? 1 : -1;
        y = centerY + direction * (rect.height / 2);
        x = centerX + (direction * (rect.height / 2)) / Math.tan(angle);

        if (Math.abs(x - centerX) > halfWidth) {
          const xDirection = dx > 0 ? 1 : -1;
          x = centerX + xDirection * halfWidth;
          y = centerY + xDirection * halfWidth * Math.tan(angle);
        }
      }

      return { x, y };
    }

    const fromPoint = getEdgePoint(fromRect, toCenter.x, toCenter.y);
    const toPoint = getEdgePoint(toRect, fromCenter.x, fromCenter.y);

    const containerRect = projectAreaRef.current.getBoundingClientRect();
    return {
      fromPoint: {
        x: fromPoint.x - containerRect.left,
        y: fromPoint.y - containerRect.top,
      },
      toPoint: {
        x: toPoint.x - containerRect.left,
        y: toPoint.y - containerRect.top,
      },
    };
  }

  // Функция загрузки проекта с сервера
  const loadProject = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const project = await projectService.getById(id);
      
      setProjectTitle(project.title || "Без названия");
      setProjectAreaTasks(project.data?.tasks || []);
      setConnections(project.data?.connections || []);
    } catch (err) {
      console.error("Ошибка при загрузке проекта:", err);
      setError("Не удалось загрузить проект. Пожалуйста, попробуйте позже.");
      
      // Резервный вариант - загрузка из localStorage
      const savedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      const project = savedProjects.find(p => p.id === id);
      
      if (project) {
        setProjectTitle(project.title || "Без названия");
        setProjectAreaTasks(project.data?.tasks || []);
        setConnections(project.data?.connections || []);
      }
    } finally {
      setLoading(false);
    }
  };

  // Функция сохранения проекта на сервер
  const saveProject = async () => {
    // Если нет названия проекта, запрашиваем его
    let title = projectTitle;
    if (!title) {
      title = prompt('Введите название проекта:');
      if (!title) return;
      setProjectTitle(title);
    }
    
    const projectData = {
      title,
      data: {
        tasks: projectAreaTasks,
        connections: connections,
        settings: {}
      }
    };
    
    try {
      setIsSaving(true);
      
      if (projectId) {
        // Обновление существующего проекта
        await projectService.update(projectId, projectData);
        alert(`Проект "${title}" успешно обновлен!`);
      } else {
        // Создание нового проекта
        const newProject = await projectService.create(projectData);
        alert(`Проект "${title}" успешно сохранен!`);
        
        // Перенаправляем на страницу с новым ID
        navigate(`/editor/${newProject.id}`);
      }
    } catch (err) {
      console.error("Ошибка при сохранении проекта:", err);
      alert("Не удалось сохранить проект. Пожалуйста, попробуйте позже.");
      
      // Резервный вариант - сохранение в localStorage
      const projectForStorage = {
        id: projectId || crypto.randomUUID(),
        title,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        data: {
          tasks: projectAreaTasks,
          connections: connections,
          settings: {}
        }
      };
      
      const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      const projectIndex = existingProjects.findIndex(p => p.id === projectId);
      
      if (projectIndex !== -1) {
        // Обновляем существующий проект
        existingProjects[projectIndex] = {
          ...projectForStorage,
          createdAt: existingProjects[projectIndex].createdAt
        };
      } else {
        // Добавляем новый проект
        existingProjects.push(projectForStorage);
      }
      
      localStorage.setItem('projects', JSON.stringify(existingProjects));
      alert(`Проект "${title}" сохранен локально!`);
      
      if (!projectId) {
        // Перенаправляем на страницу с новым ID
        navigate(`/editor/${projectForStorage.id}`);
      }
    } finally {
      setIsSaving(false);
    }
  };

  function renderConnections() {
    return connections.map((conn, index) => {
      const fromTask = projectAreaTasks.find((t) => t.id === conn.from);
      const toTask = projectAreaTasks.find((t) => t.id === conn.to);
  
      if (!fromTask || !toTask) return null;
  
      const { fromPoint, toPoint } = calculateConnectionPoints(fromTask, toTask);
  
      const path = `M ${fromPoint.x} ${fromPoint.y} L ${toPoint.x} ${toPoint.y}`;
  
      return (
        <g
          key={index}
          onClick={() => removeConnection(index)}
          style={{ pointerEvents: 'auto', cursor: 'pointer' }}
          title="Удалить связь"
        >
          <path d={path} stroke="transparent" strokeWidth="10" fill="none" />
          <path d={path} stroke="#5c2f91" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
        </g>
      );
    });
  }

  if (loading) {
    return <div className="loading-indicator">Загрузка проекта...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="project-constructor">
      <div className="project-header">
        <input
          type="text"
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
          placeholder="Название проекта"
          className="project-title-input"
        />
        <Button
          text={isSaving ? "Сохранение..." : "Сохранить проект"}
          className="save-button"
          onClick={saveProject}
          disabled={isSaving}
        />
      </div>
      
      <div className="tasks-panel">
        <div className="tasks-panel-header">
          <h3>Доступные задачи</h3>
          <Button
            text="+ Добавить задачу"
            className="small add-button"
            onClick={() => setShowTaskForm(true)}
          />
        </div>

        {showTaskForm && (
          <div className="task-form">
            <input
              type="text"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder="Введите название задачи"
              className="task-input"
              onKeyDown={(e) => e.key === "Enter" && handleAddNewTask()}
            />
            <div className="form-buttons">
              <Button
                text="Добавить"
                className="small confirm-button"
                onClick={handleAddNewTask}
              />
              <Button
                text="Отмена"
                className="small cancel-button"
                onClick={() => {
                  setNewTaskName("");
                  setShowTaskForm(false);
                }}
              />
            </div>
          </div>
        )}

        <div className="tasks-list">
          {initialTasks.map((task) => (
            <div
              key={task.id}
              className="task"
              draggable
              onDragStart={(e) => handleDragStart(task, e)}
            >
              {task.name}
            </div>
          ))}
        </div>
      </div>

      <div
        ref={projectAreaRef}
        className="project-area"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <h3 className="area-title">Рабочая область</h3>
        {projectAreaTasks.map((task) => (
          <div
            key={task.id}
            ref={(el) => (taskElements.current[`task-${task.id}`] = el)}
            className={`task ${selectedTask?.id === task.id ? "selected" : ""}`}
            style={{
              left: `${task.x}px`,
              top: `${task.y}px`,
              position: "absolute",
            }}
            onMouseDown={(e) => handleTaskMouseDown(task.id, e)}
          >
            <div className="task-header">{task.name}</div>
            <div className="task-actions">
              <div className="task-action" onClick={(e) => {
                  e.stopPropagation();
                  const priority = prompt("Укажите приоритет задачи (Высокий, Средний, Низкий):", task.priority || "Средний");
                  if (priority) {
                    handleTaskUpdate(task.id, "priority", priority);
                  }
              }}>
                <span className="action-text">Указать приоритет</span>
                <span className="info-text">{task.priority || 'Без приоритета'}</span>
                <span className="action-icon">+</span>
              </div>
              <div className="task-action" onClick={(e) => {
                  e.stopPropagation();
                  const deadline = prompt("Укажите дедлайн (формат ДД/ММ/ГГГГ):", task.deadline || "");
                  if (deadline) {
                    handleTaskUpdate(task.id, "deadline", deadline);
                  }
              }}>
                <span className="action-text">Установить дедлайн</span>
                <span className="info-text">{task.deadline || 'Не указан'}</span>
                <span className="action-icon calendar">
                  <img src="/calendar.svg" alt="calendar" />
                </span>
              </div>
              <div className="task-action" onClick={(e) => {
                  e.stopPropagation();
                  // Выбор сотрудника из списка
                  if (employees.length === 0) {
                    alert("Список сотрудников пуст. Сначала добавьте сотрудников.");
                    return;
                  }
                  
                  const employeeList = employees.map(emp => `${emp.id}: ${emp.name}`).join("\n");
                  const selectedId = prompt(`Выберите ID сотрудника из списка:\n${employeeList}`, task.assigneeId || "");
                  
                  if (selectedId) {
                    const employee = employees.find(e => e.id.toString() === selectedId.toString());
                    if (employee) {
                      handleTaskUpdate(task.id, "assigneeId", selectedId);
                      handleTaskUpdate(task.id, "assignee", employee.name);
                    } else {
                      alert("Сотрудник с указанным ID не найден.");
                    }
                  }
              }}>
                <span className="action-text">Назначить исполнителя</span>
                <span className="info-text">{task.assignee || 'Не назначен'}</span>
                <span className="action-icon">👤</span>
              </div>
            </div>
          </div>
        ))}

        <svg
          className="connections"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#5c2f91" />
            </marker>
          </defs>
          {renderConnections()}
        </svg>
      </div>
    </div>
  );
}

export default ProjectConstructor;
