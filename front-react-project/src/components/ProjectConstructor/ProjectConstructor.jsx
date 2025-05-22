import React, { useState, useRef, useEffect } from "react";
import "./ProjectConstructor.css";
import Button from "../Button/Button";
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const projectAreaRef = useRef(null);
  const taskElements = useRef({});
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [selectedConnection, setSelectedConnection] = useState(null);

  useEffect(() => {
    loadEmployees();
    if (projectId) {
      loadProject(projectId);
    } else {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    const handleSave = () => saveProject();
    document.addEventListener('saveProject', handleSave);
    return () => document.removeEventListener('saveProject', handleSave);
  }, [projectAreaTasks, connections]);

  const loadEmployees = async () => {
    try {
      const response = await api.getEmployees();
      setEmployees(response.data);
    } catch (err) {
      console.error("Ошибка загрузки сотрудников:", err);
    }
  };

  const loadProject = async (id) => {
    try {
      setLoading(true);
      const response = await api.getProject(id);
      const projectData = response.data;
      setProjectAreaTasks(projectData.tasks || []);
      setConnections(projectData.connections || []);
      setError(null);
    } catch (err) {
      setError("Ошибка при загрузке проекта");
      console.error("Ошибка загрузки проекта:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveProject = async () => {
    const projectName = prompt('Введите название проекта:');
    if (!projectName) return;
  
    try {
      const projectData = {
        title: projectName,
        tasks: projectAreaTasks,
        connections: connections
      };

      if (projectId) {
        await api.updateProject(projectId, projectData);
      } else {
        const response = await api.saveProject(projectData);
        navigate(`/editor/${response.data.id}`);
      }
      
      alert('Проект сохранен!');
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('Ошибка при сохранении проекта');
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

    return {
      x: 20 + (projectAreaTasks.length % 5) * 220,
      y: 20 + Math.floor(projectAreaTasks.length / 5) * 120,
    };
  }

  function handleDragStart(task, e) {
    e.dataTransfer.setData("task", JSON.stringify(task));
    setDragging(true);
  }

  function handleDrop(e) {
    e.preventDefault();
    const task = JSON.parse(e.dataTransfer.getData("task"));

    const newPos = getNewPosition();
    setProjectAreaTasks([
      ...projectAreaTasks,
      {
        ...task,
        id: Date.now(),
        taskType: task.id,
        ...newPos,
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

    let isDragging = false;
    let moved = false;

    function handleMouseMove(e) {
      if (e.clientX !== startPos.x || e.clientY !== startPos.y) {
        moved = true;
      }

      if (
        !isDragging &&
        (Math.abs(e.clientX - startPos.x) > 3 ||
          Math.abs(e.clientY - startPos.y) > 3)
      ) {
        isDragging = true;
        taskElement.classList.add("dragging");
      }

      if (isDragging) {
        const newX = Math.max(
          0,
          Math.min(
            e.clientX - containerRect.left - offset.x,
            containerRect.width - taskRect.width
          )
        );
        const newY = Math.max(
          0,
          Math.min(
            e.clientY - containerRect.top - offset.y,
            containerRect.height - taskRect.height
          )
        );

        setProjectAreaTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, x: newX, y: newY } : t))
        );
      }
    }

    function handleMouseUp() {
      if (moved === true) {
        const task = projectAreaTasks.find((t) => t.id === taskId);
        setSelectedTask((prev) => (prev?.id === task.id ? null : task));
        moved = false;
      }

      taskElement.classList.remove("dragging");
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }

  function handleTaskSelect(task) {
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
    setProjectAreaTasks(function (prevTasks) {
      return prevTasks.map(function (task) {
        if (task.id === taskId) {
          return { ...task, [field]: value };
        }
        return task;
      });
    });
  }

  function calculateConnectionPoints(fromTask, toTask, taskElements) {
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

  function handleConnectionClick(connection, e) {
    e.stopPropagation();
    setSelectedConnection(connection);
  }

  function handleDeleteConnection() {
    if (selectedConnection) {
      setConnections(connections.filter(conn => 
        !(conn.from === selectedConnection.from && conn.to === selectedConnection.to)
      ));
      setSelectedConnection(null);
    }
  }

  function renderConnections() {
    return connections.map((conn, index) => {
      const fromTask = projectAreaTasks.find((t) => t.id === conn.from);
      const toTask = projectAreaTasks.find((t) => t.id === conn.to);

      if (!fromTask || !toTask) return null;

      const { fromPoint, toPoint } = calculateConnectionPoints(
        fromTask,
        toTask,
        taskElements
      );

      const isSelected = selectedConnection && 
        selectedConnection.from === conn.from && 
        selectedConnection.to === conn.to;

      return (
        <g key={index} onClick={(e) => handleConnectionClick(conn, e)}>
          <line
            x1={fromPoint.x}
            y1={fromPoint.y}
            x2={toPoint.x}
            y2={toPoint.y}
            stroke={isSelected ? "#dc3545" : "#5c2f91"}
            strokeWidth={isSelected ? "3" : "2"}
            markerEnd="url(#arrowhead)"
            className="connection-line"
          />
          {isSelected && (
            <circle
              cx={(fromPoint.x + toPoint.x) / 2}
              cy={(fromPoint.y + toPoint.y) / 2}
              r="8"
              fill="#dc3545"
              className="delete-connection-btn"
              onClick={handleDeleteConnection}
            />
          )}
        </g>
      );
    });
  }

  if (loading) {
    return <div className="loading">Загрузка проекта...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

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
        <h3>Область проекта</h3>
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
            onClick={() => handleTaskSelect(task)}
          >
            <div className="task-header">{task.name}</div>
            <div className="task-details">
              <div>
                <label>Дедлайн:</label>
                <input
                  type="date"
                  value={task.deadline}
                  onChange={(e) =>
                    handleTaskUpdate(task.id, "deadline", e.target.value)
                  }
                />
              </div>
              <div>
                <label>Исполнитель:</label>
                <select
                  value={task.assignee}
                  onChange={(e) => handleTaskUpdate(task.id, 'assignee', e.target.value)}
                >
                  <option value="">Не назначено</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.position})
                    </option>
                  ))}
                </select>
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
          }}
        >
          {renderConnections()}
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
        </svg>
      </div>
    </div>
  );
}

export default ProjectConstructor;
