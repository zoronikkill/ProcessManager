import React, { useState, useRef, useEffect } from "react";
import "./ProjectConstructor.css";
import Button from "../Button/Button";
import { useParams } from 'react-router-dom';

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
  const projectAreaRef = useRef(null);
  const taskElements = useRef({});
  const { projectId } = useParams();
  const [employees, setEmployees] = useState(
    JSON.parse(localStorage.getItem('employees')) || []
  );
  const [dragTimeout, setDragTimeout] = useState(null);

  useEffect(() => {
    const handleSave = () => saveProject();
    document.addEventListener('saveProject', handleSave);
    return () => document.removeEventListener('saveProject', handleSave);
  }, [projectAreaTasks, connections]);

  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    }
  }, [projectId]);

  useEffect(() => {
    if (projectAreaTasks.length > 0 && connections.length > 0) {
      const timer = setTimeout(() => {
        setConnections([...connections]);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [projectAreaTasks]);

  function handleSaveEmployee (employee){
    const updatedEmployees = [...employees, employee];
    setEmployees(updatedEmployees);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
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
    if (e.button !== 0) return;

    const startPos = { x: e.clientX, y: e.clientY };
    const taskElement = e.currentTarget;
    const containerRect = projectAreaRef.current.getBoundingClientRect();
    const taskRect = taskElement.getBoundingClientRect();
    const offset = {
      x: startPos.x - taskRect.left,
      y: startPos.y - taskRect.top,
    };

    taskElement.classList.add("dragging");

    function handleMouseMove(e) {
      const newX = Math.max(0, Math.min(e.clientX - containerRect.left - offset.x, containerRect.width - taskRect.width));
      const newY = Math.max(0, Math.min(e.clientY - containerRect.top - offset.y, containerRect.height - taskRect.height));

      setProjectAreaTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, x: newX, y: newY } : t))
      );
    }

    function handleMouseUp() {
      taskElement.classList.remove("dragging");
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }

  function handleTaskClick(taskId, connectionType) {
    const task = projectAreaTasks.find(t => t.id === taskId);
    if (!task) return;

    if (selectedTask) {
      if (selectedTask.id === task.id) {
        setSelectedTask(null);
        return;
      }

      // Определяем from и to в зависимости от типа связи
      const from = connectionType === 'previous' ? task.id : selectedTask.id;
      const to = connectionType === 'previous' ? selectedTask.id : task.id;

      setConnections([
        ...connections,
        { from, to }
      ]);
      setSelectedTask(null);
    } else {
      setSelectedTask({...task, connectionType});
    }
  }

  function handleTaskUpdate(taskId, field, value) {
    setProjectAreaTasks(prev =>
      prev.map(task => task.id === taskId ? { ...task, [field]: value } : task)
    );
  }

  function handleConnectionClick(taskId, connectionType) {
    const task = projectAreaTasks.find(t => t.id === taskId);
    if (!task) return;

    if (selectedTask) {
      if (selectedTask.id === taskId) {
        setSelectedTask(null);
        return;
      }

      // Определяем направление связи на основе типа кнопки
      const newConnection = connectionType === 'next' 
        ? { from: selectedTask.id, to: taskId }
        : { from: taskId, to: selectedTask.id };

      setConnections([...connections, newConnection]);
      setSelectedTask(null);
    } else {
      setSelectedTask({ ...task, connectionType });
    }
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

  function renderConnections() {
    return connections.map((conn, index) => {
      const fromTask = projectAreaTasks.find((t) => t.id === conn.from);
      const toTask = projectAreaTasks.find((t) => t.id === conn.to);

      if (!fromTask || !toTask) return null;

      const { fromPoint, toPoint } = calculateConnectionPoints(fromTask, toTask);

      // Используем прямую линию вместо кривой Безье
      const path = `M ${fromPoint.x} ${fromPoint.y} L ${toPoint.x} ${toPoint.y}`;

      return (
        <path
          key={index}
          d={path}
          stroke="#5c2f91"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrowhead)"
        />
      );
    });
  }

  function saveProject() {
    const projectName = prompt('Введите название проекта:');
    if (!projectName) return;
  
    const newProject = {
      id: crypto.randomUUID(),
      title: projectName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      data: {
        tasks: projectAreaTasks,
        connections: connections,
        settings: {}
      }
    };
  
    const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    localStorage.setItem('projects', JSON.stringify([...existingProjects, newProject]));
    alert(`Проект "${projectName}" сохранен!`);
  }

  const loadProject = (projectId) => {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const project = projects.find(p => p.id === projectId);
    
    if (project) {
      setProjectAreaTasks(project.data.tasks || []);
      setConnections(project.data.connections || []);
    }
  };

  return (
    <div className="project-constructor">
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
            className={`task ${selectedTask ? 'connection-mode' : ''}`}
            style={{
              left: `${task.x}px`,
              top: `${task.y}px`,
              position: "absolute",
            }}
            onMouseDown={(e) => {
              // Если есть выбранная задача для связи, обрабатываем клик для создания связи
              if (selectedTask && selectedTask.id !== task.id) {
                e.stopPropagation();
                // Определяем направление связи на основе типа выбранной кнопки
                const newConnection = selectedTask.connectionType === 'next' 
                  ? { from: selectedTask.id, to: task.id }
                  : { from: task.id, to: selectedTask.id };

                setConnections([...connections, newConnection]);
                setSelectedTask(null);
                return;
              }
              // Иначе обрабатываем перетаскивание
              handleTaskMouseDown(task.id, e);
            }}
          >
            <div className="task-header">{task.name}</div>
            <div className="task-actions">
                <div className="task-action">
                    <span className="action-text">Указать приоритет</span>
                    <span className="action-icon">+</span>
                </div>
                <div className="task-action">
                    <span className="action-text">Установить сроки</span>
                    <span className="action-icon calendar">
                        <img src="/calendar.svg" alt="calendar" />
                    </span>
                </div>
                <div className="task-action">
                    <span className="action-text">Выбрать исполнителя</span>
                    <span className="action-icon">+</span>
                </div>
                <div 
                    className="task-action"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleConnectionClick(task.id, 'previous');
                    }}
                >
                    <span className="action-text">Предшествующая задача</span>
                    <span className={`action-icon ${selectedTask?.id === task.id && selectedTask?.connectionType === 'previous' ? 'active' : ''}`}>+</span>
                </div>
                <div 
                    className="task-action"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleConnectionClick(task.id, 'next');
                    }}
                >
                    <span className="action-text">Следующая задача</span>
                    <span className={`action-icon ${selectedTask?.id === task.id && selectedTask?.connectionType === 'next' ? 'active' : ''}`}>+</span>
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
