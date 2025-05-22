import React, { useState, useRef, useEffect } from "react";
import "./ProjectConstructor.css";
import Button from "../Button/Button";
import { useParams, useNavigate } from 'react-router-dom';
import processService from "../../services/processService";
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
  const projectAreaRef = useRef(null);
  const taskElements = useRef({});
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState(
    JSON.parse(localStorage.getItem('employees')) || []
  );

  const [editingTask, setEditingTask] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");

  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState(null);

  // Загружаем проект, если есть projectId
  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    }
  }, [projectId]);

  // Обновляем соединения при изменении задач
  useEffect(() => {
    if (projectAreaTasks.length > 0 && connections.length > 0) {
      const timer = setTimeout(() => {
        setConnections([...connections]);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [projectAreaTasks]);

  // Добавляем обработчик события сохранения проекта
  useEffect(() => {
    const handleSave = () => saveProject();
    document.addEventListener('saveProject', handleSave);
    return () => document.removeEventListener('saveProject', handleSave);
  }, [projectAreaTasks, connections, projectTitle]);

  // Add a click outside handler to cancel editing
  useEffect(() => {
    if (editingTask && editingField) {
      const handleClickOutside = (e) => {
        // Only process click outside if it's not on an input or select element
        if (!e.target.closest('.inline-edit-input') && !e.target.closest('.inline-edit-select')) {
          const isTaskAction = e.target.closest('.task-action');
          
          // If clicking on a different task action or outside task actions entirely
          if (!isTaskAction || (isTaskAction && !isTaskAction.contains(e.target.closest('.task-action')))) {
            setEditingTask(null);
            setEditingField(null);
          }
        }
      };
      
      // Add the event listener to the document
      document.addEventListener('mousedown', handleClickOutside);
      
      // Clean up the event listener
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [editingTask, editingField]);

  // Load project data from backend or fallback to localStorage
  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    }
  }, [projectId]);

  // Load employees from backend API
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Fetch employees from API
  const fetchEmployees = async () => {
    try {
      const response = await employeeService.getAll();
      // Handle API response format
      const data = Array.isArray(response.results) ? response.results : (response || []);
      setEmployees(data);
    } catch (err) {
      console.error("Error loading employees:", err);
      // Fallback to localStorage
      const localEmployees = JSON.parse(localStorage.getItem('employees') || '[]');
      setEmployees(localEmployees);
    }
  };

  // Function to load project from backend API
  const loadProject = async (id) => {
    setLoadingData(true);
    setError(null);
    
    try {
      const project = await processService.getById(id);
      
      // Set project title and data
      setProjectTitle(project.title || "");
      
      // Handle tasks - either load from project.data.tasks or fetch with getTasks API
      let projectTasks = [];
      let projectConnections = [];
      
      if (project.data && project.data.tasks && project.data.connections) {
        // Data is stored in process.data object
        projectTasks = project.data.tasks || [];
        projectConnections = project.data.connections || [];
      } else {
        // Try to fetch tasks from separate API endpoint
        try {
          const tasksResponse = await processService.getTasks(id);
          projectTasks = tasksResponse.map(task => ({
            id: task.id,
            name: task.name,
            x: task.position_x || 0,
            y: task.position_y || 0,
            priority: task.priority || "",
            deadline: task.deadline || "",
            assignee: task.assignee_name || "",
            assigneeId: task.assignee || ""
          }));
          
          // We'd also need to fetch connections between tasks
          // This would depend on your API structure
        } catch (err) {
          console.error("Error fetching tasks:", err);
        }
      }
      
      setProjectAreaTasks(projectTasks);
      setConnections(projectConnections);
      
    } catch (err) {
      console.error("Error loading project:", err);
      setError("Failed to load project. Please try again later.");
      
      // Fallback to localStorage
      const savedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      const localProject = savedProjects.find(p => p.id === id);
      
      if (localProject) {
        setProjectTitle(localProject.title || "");
        setProjectAreaTasks(localProject.data?.tasks || []);
        setConnections(localProject.data?.connections || []);
      }
    } finally {
      setLoadingData(false);
    }
  };

  // Function to save project to backend
  const saveProject = async () => {
    let title = projectTitle;
    if (!title) {
      title = prompt('Введите название проекта:');
      if (!title) return;
      setProjectTitle(title);
    }
    
    setSaving(true);
    setError(null);
    
    const projectData = {
      title: title,
      data: {
        tasks: projectAreaTasks,
        connections: connections,
        settings: {}
      }
    };
    
    try {
      let savedProject;
      
      if (projectId) {
        // Update existing project
        savedProject = await processService.update(projectId, projectData);
        alert(`Проект "${title}" успешно обновлен!`);
      } else {
        // Create new project
        savedProject = await processService.create(projectData);
        alert(`Проект "${title}" успешно сохранен!`);
        
        // Redirect to edit page with new ID
        navigate(`/editor/${savedProject.id}`);
      }
      
      // Save individual tasks to backend if your API requires it
      for (const task of projectAreaTasks) {
        try {
          const taskData = {
            name: task.name,
            process: savedProject.id,
            position_x: task.x,
            position_y: task.y,
            priority: task.priority || null,
            deadline: task.deadline || null,
            assignee: task.assigneeId || null
          };
          
          if (task.id && task.id.toString().length > 10) {
            // Existing task, update it
            await taskService.update(task.id, taskData);
          } else {
            // New task, create it
            await taskService.create(taskData);
          }
        } catch (err) {
          console.error(`Error saving task ${task.name}:`, err);
          // Continue with next task even if this one fails
        }
      }
      
    } catch (err) {
      console.error("Error saving project:", err);
      setError("Failed to save project. Please try again later.");
      
      // Fallback to localStorage
      const localProject = {
        id: projectId || crypto.randomUUID(),
        title: title,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        data: {
          tasks: projectAreaTasks,
          connections: connections,
          settings: {}
        }
      };
      
      const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      const projectIndex = existingProjects.findIndex(p => p.id === localProject.id);
      
      if (projectIndex !== -1) {
        // Update existing project
        existingProjects[projectIndex] = {
          ...localProject,
          createdAt: existingProjects[projectIndex].createdAt
        };
      } else {
        // Add new project
        existingProjects.push(localProject);
      }
      
      localStorage.setItem('projects', JSON.stringify(existingProjects));
      alert(`Проект "${title}" сохранен локально.`);
      
      if (!projectId) {
        navigate(`/editor/${localProject.id}`);
      }
    } finally {
      setSaving(false);
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

  function handleDragStart(task, e) {
    e.dataTransfer.setData("task", JSON.stringify(task));
  }

  function handleDrop(e) {
    e.preventDefault();
    const task = JSON.parse(e.dataTransfer.getData("task"));

    const rect = projectAreaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Generate a unique ID for the new task
    const newTaskId = Date.now();
    
    const newTask = {
      ...task,
      id: newTaskId,
      taskType: task.id,
      x,
      y,
      priority: "",
      deadline: "",
      assignee: "",
      assigneeId: ""
    };

    setProjectAreaTasks([...projectAreaTasks, newTask]);
    
    // If a project is already saved (we have projectId), create the task in backend
    if (projectId) {
      try {
        const taskData = {
          name: task.name,
          process: projectId,
          position_x: x,
          position_y: y
        };
        
        // Create task in backend - this is async but we don't need to await
        taskService.create(taskData)
          .then(savedTask => {
            // Update the task ID with the backend ID
            setProjectAreaTasks(prev => 
              prev.map(t => t.id === newTaskId ? { ...t, id: savedTask.id } : t)
            );
          })
          .catch(err => console.error('Error creating task in backend:', err));
      } catch (err) {
        console.error('Error preparing task for backend:', err);
      }
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  function handleTaskMouseDown(taskId, e) {
    // If we're currently editing and clicked on another task, save the edit
    if (editingTask && editingTask !== taskId) {
      saveEdit();
    }

    // Don't start drag if we're clicking on an input or select
    if (e.target.closest('.inline-edit-input') || e.target.closest('.inline-edit-select')) {
      return;
    }

    // Проверяем, не является ли цель клика одной из кнопок действий
    if (e.target.closest('.task-action')) {
      return;
    }

    if (e.button !== 0) return;

    // Остановить редактирование при начале перетаскивания
    if (editingTask === taskId) {
      saveEdit();
    }

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
      } else {
        // If the task was moved and has a backend ID, update position in backend
        if (projectId && taskId.toString().length > 10) {
          const task = projectAreaTasks.find((t) => t.id === taskId);
          if (task) {
            try {
              // Update the task position in backend
              taskService.partialUpdate(taskId, {
                position_x: task.x,
                position_y: task.y
              }).catch(err => console.error('Error updating task position:', err));
            } catch (err) {
              console.error('Error preparing task position update:', err);
            }
          }
        }
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
      
      // Create a new connection
      const newConnection = {
        from: selectedTask.id,
        to: task.id,
      };
      
      setConnections([...connections, newConnection]);
      setSelectedTask(null);
      
      // If this is an existing project, save the connection to backend
      if (projectId && selectedTask.id.toString().length > 10 && task.id.toString().length > 10) {
        try {
          // Create the task connection in the backend
          taskService.createTaskRelation(selectedTask.id, task.id)
            .catch(err => console.error('Error creating task connection:', err));
        } catch (err) {
          console.error('Error preparing task connection:', err);
        }
      }
    } else {
      setSelectedTask(task);
    }
  }

  // Handle updating task properties
  function handleTaskUpdate(taskId, field, value) {
    setProjectAreaTasks(prev =>
      prev.map(task => {
        if (task.id === taskId) {
          const updatedTask = { ...task, [field]: value };
          
          // Optionally, update task on backend when a property changes
          if (task.id && task.id.toString().length > 10) {
            try {
              const apiFieldMap = {
                'priority': 'priority',
                'deadline': 'deadline',
                'assignee': 'assignee_name',
                'assigneeId': 'assignee',
                'name': 'name'
              };
              
              if (field in apiFieldMap) {
                const updateData = { [apiFieldMap[field]]: value };
                taskService.partialUpdate(task.id, updateData)
                  .catch(err => console.error(`Error updating task ${field}:`, err));
              }
            } catch (err) {
              console.error(`Error updating task ${field}:`, err);
            }
          }
          
          return updatedTask;
        }
        return task;
      })
    );
  }

  // Function to remove a connection
  function removeConnection(index) {
    const connection = connections[index];
    setConnections(prev => prev.filter((_, i) => i !== index));
    
    // If this is an existing project with backend task IDs, delete the connection
    if (projectId && 
        connection && 
        connection.id && 
        connection.from.toString().length > 10 && 
        connection.to.toString().length > 10) {
      try {
        // Delete the task connection in the backend
        taskService.removeTaskRelation(connection.id)
          .catch(err => console.error('Error removing task connection:', err));
      } catch (err) {
        console.error('Error preparing task connection removal:', err);
      }
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

  // Функция для начала редактирования поля задачи
  function startEditing(task, field) {
    setEditingTask(task.id);
    setEditingField(field);
    setEditValue(task[field] || "");
  }

  // Функция для сохранения отредактированного значения
  function saveEdit() {
    if (editingTask && editingField) {
      handleTaskUpdate(editingTask, editingField, editValue);
      setEditingTask(null);
      setEditingField(null);
    }
  }

  // Обработчик нажатия клавиш при редактировании
  function handleEditKeyDown(e) {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      setEditingTask(null);
      setEditingField(null);
    }
  }

  // Функция для выбора сотрудника из списка
  function handleAssigneeSelect(taskId, employeeId) {
    const employee = employees.find(e => e.id === employeeId);
    if (employee) {
      handleTaskUpdate(taskId, "assignee", employee.name);
      handleTaskUpdate(taskId, "assigneeId", employee.id);
    } else {
      handleTaskUpdate(taskId, "assignee", "");
      handleTaskUpdate(taskId, "assigneeId", "");
    }
    setEditingTask(null);
    setEditingField(null);
  }

  // Show loading indicator while fetching data
  if (loadingData) {
    return <div className="loading-message">Loading project data...</div>;
  }

  // Show error message if there was an error
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
          text={saving ? "Сохранение..." : "Сохранить проект"}
          className={`save-button ${saving ? 'saving' : ''}`}
          onClick={saveProject}
          disabled={saving}
        />
      </div>
      
      <div className="project-content">
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
              <div 
                className="task-header" 
                onClick={(e) => {
                  e.stopPropagation();
                  if (editingTask !== task.id || editingField !== "name") {
                    startEditing(task, "name");
                  }
                }}
              >
                {editingTask === task.id && editingField === "name" ? (
                  <input
                    type="text"
                    className="task-name-input"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={saveEdit}
                    onKeyDown={handleEditKeyDown}
                    autoFocus
                  />
                ) : task.name}
              </div>
              <div className="task-actions">
                <div className="task-action" onClick={(e) => {
                    e.stopPropagation();
                    if (editingTask !== task.id || editingField !== "priority") {
                      startEditing(task, "priority");
                    }
                }}>
                  <span className="action-text">Указать приоритет</span>
                  {editingTask === task.id && editingField === "priority" ? (
                    <input
                      type="text"
                      className="inline-edit-input"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={saveEdit}
                      onKeyDown={handleEditKeyDown}
                      placeholder="Приоритет"
                      autoFocus
                    />
                  ) : (
                    <span className="info-text">{task.priority || '—'}</span>
                  )}
                  <span className="action-icon">+</span>
                </div>
                <div className="task-action" onClick={(e) => {
                    e.stopPropagation();
                    if (editingTask !== task.id || editingField !== "deadline") {
                      startEditing(task, "deadline");
                    }
                }}>
                  <span className="action-text">Установить дедлайн</span>
                  {editingTask === task.id && editingField === "deadline" ? (
                    <input
                      type="text"
                      className="inline-edit-input"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={saveEdit}
                      onKeyDown={handleEditKeyDown}
                      placeholder="ДД/ММ/ГГГГ"
                      autoFocus
                    />
                  ) : (
                    <span className="info-text">{task.deadline || '—'}</span>
                  )}
                  <span className="action-icon calendar">
                    <img src="/calendar.svg" alt="calendar" />
                  </span>
                </div>
                <div className="task-action" onClick={(e) => {
                    e.stopPropagation();
                    if (editingTask !== task.id || editingField !== "assignee") {
                      startEditing(task, "assignee");
                    }
                }}>
                  <span className="action-text">Назначить исполнителя</span>
                  {editingTask === task.id && editingField === "assignee" ? (
                    employees.length > 0 ? (
                      <select
                        className="inline-edit-select"
                        value={task.assigneeId || ""}
                        onChange={(e) => handleAssigneeSelect(task.id, e.target.value)}
                        onBlur={() => {
                          setEditingTask(null);
                          setEditingField(null);
                        }}
                        autoFocus
                      >
                        <option value="">Не выбрано</option>
                        {employees.map(emp => (
                          <option key={emp.id} value={emp.id}>
                            {emp.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        className="inline-edit-input"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={saveEdit}
                        onKeyDown={handleEditKeyDown}
                        placeholder="Исполнитель"
                        autoFocus
                      />
                    )
                  ) : (
                    <span className="info-text">{task.assignee || '—'}</span>
                  )}
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
    </div>
  );
}

export default ProjectConstructor;
