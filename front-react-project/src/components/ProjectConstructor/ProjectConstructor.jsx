import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./ProjectConstructor.css";
import Button from "../Button/Button";
import { useParams, useNavigate } from "react-router-dom";
import projectService from "../../services/projectService";
import taskService from "../../services/taskService";
import employeeService from "../../services/employeeService";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import DraggableTask from "./DraggableTask";
import ProjectArea from "./ProjectArea";
import TaskForm from "./TaskForm";
import apiService from '../../services/apiService';

function ProjectConstructor() {
  const [initialTasks, setInitialTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTaskName, setNewTaskName] = useState("");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "active",
    priority: "medium",
    budget: "",
    manager: "",
    team: [],
    process: null
  });

  useEffect(() => {
    const handleSave = () => saveProject();
    document.addEventListener("saveProject", handleSave);
    return () => {
      document.removeEventListener("saveProject", handleSave);
    };
  }, [tasks, connections, formData]);

  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    } else {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const employeesList = await employeeService.getAll();
        setEmployees(Array.isArray(employeesList) ? employeesList : []);
      } catch (error) {
        console.error('Error loading employees:', error);
        setEmployees([]);
      }
    };

    loadEmployees();
  }, []);

  useEffect(() => {
    const loadTaskTypes = async () => {
      try {
        const taskTypes = await taskService.getTaskTypes();
        const typesArray = Array.isArray(taskTypes) ? taskTypes : [];
        
        if (!projectId) {
          const defaultTasks = [
            { 
              name: "Анализ требований",
              status: 'not_started',
              priority: 'medium',
              description: 'Анализ требований проекта'
            },
            { 
              name: "Проектирование",
              status: 'not_started',
              priority: 'medium',
              description: 'Проектирование системы'
            },
            { 
              name: "Разработка",
              status: 'not_started',
              priority: 'medium',
              description: 'Разработка системы'
            },
          ];

          if (typesArray.length === 0) {
            await taskService.createDefaultTaskTypes();
            const updatedTypes = await taskService.getTaskTypes();
            setInitialTasks(defaultTasks.map((t, index) => ({
              ...t,
              id: index + 1,
              taskType: (Array.isArray(updatedTypes) ? updatedTypes : [])
                         .find(tt => tt.name === t.name)?.id || null
            })));
          } else {
            setInitialTasks(defaultTasks.map((t, index) => ({
              ...t,
              id: index + 1,
              taskType: typesArray.find(tt => tt.name === t.name)?.id || typesArray[0]?.id || null
            })));
          }
        }
      } catch (error) {
        console.error('Error loading task types:', error);
        setInitialTasks([]);
      }
    };

    loadTaskTypes();
  }, [projectId]);

  const initializeProcess = async () => {
    try {
      console.log('Creating new process...');
      const process = await projectService.createProcess({ 
        title: 'Новый процесс',
        status: 'active'
      });
      console.log('Process creation response:', process);
      if (!process || !process.id) {
        console.error('Process response is invalid:', process);
        throw new Error('Не удалось создать процесс: отсутствует ID');
      }
      console.log('Setting process ID:', process.id);
      setFormData(prev => ({ ...prev, process: process.id }));
      console.log('Process ID set successfully');
    } catch (error) {
      console.error('Ошибка создания процесса:', error);
      setError('Ошибка при создании процесса. Пожалуйста, попробуйте еще раз.');
    }
  };

  useEffect(() => {
    if (!projectId) {
      initializeProcess();
    }
  }, []);

  const loadProject = async (id) => {
    try {
      setLoading(true);
      console.log('Загрузка проекта с ID:', id);
      
      const project = await projectService.getById(id);
      console.log('Загруженные данные проекта:', project);
      
      if (!project) {
        throw new Error("Проект не найден");
      }

      setFormData({
        title: project.title || "",
        description: project.description || "",
        startDate: project.start_date || "",
        endDate: project.end_date || "",
        status: project.status || "active",
        priority: project.priority || "medium",
        budget: project.budget || "",
        manager: project.manager || "",
        team: project.team || [],
        process: project.process || null
      });

      const projectTasks = await projectService.getProjectTasks(id);
      console.log('Загруженные задачи проекта:', projectTasks);
      
      if (Array.isArray(projectTasks) && projectTasks.length > 0) {
        const formattedTasks = projectTasks.map(task => ({
          id: task.id,
          name: task.name,
          description: task.description,
          x: task.position_x || 0,
          y: task.position_y || 0,
          startDate: task.start_date,
          endDate: task.end_date,
          status: task.status || 'not_started',
          priority: task.priority || 'medium',
          assignee: task.assignee_id,
          taskType: task.task_type
        }));

        setTasks(formattedTasks);
        console.log('Задачи установлены:', formattedTasks);
      } else {
        console.log('Задачи не найдены, устанавливаем пустой массив');
        setTasks([]);
      }
      
      try {
        const taskConnections = await projectService.getProjectConnections(id);
        console.log('Загруженные связи:', taskConnections);
        
        if (Array.isArray(taskConnections) && taskConnections.length > 0) {
          const formattedConnections = taskConnections.map(conn => ({
            id: conn.id,
            sourceId: conn.source_task,
            targetId: conn.target_task,
            type: conn.connection_type || 'default'
          }));
          
          setConnections(formattedConnections);
          console.log('Связи установлены:', formattedConnections);
        } else {
          console.log('Связи не найдены, устанавливаем пустой массив');
          setConnections([]);
        }
      } catch (connError) {
        console.error('Ошибка при загрузке связей:', connError);
        setConnections([]);
      }

      setError(null);
    } catch (error) {
      console.error('Ошибка при загрузке проекта:', error);
      setError("Не удалось загрузить проект. Пожалуйста, попробуйте позже.");
      setTasks([]);
      setConnections([]);
    } finally {
      setLoading(false);
    }
  };

  const saveProject = async () => {
    try {
      if (!formData.title) {
        throw new Error("Название проекта обязательно для заполнения");
      }

      if (!formData.process) {
        throw new Error("Не создан процесс для проекта");
      }

      try {
        const processResponse = await apiService.get(`/api/processes/${formData.process}/`);
        if (!processResponse) {
          throw new Error("Процесс не найден");
        }
      } catch (processError) {
        console.error("Ошибка проверки процесса:", processError);
        const newProcess = await projectService.createProcess({ 
          title: 'Новый процесс',
          status: 'active'
        });
        if (!newProcess || !newProcess.id) {
          throw new Error("Не удалось создать новый процесс");
        }
        formData.process = newProcess.id;
      }

      const startDate = formData.startDate ? new Date(formData.startDate).toISOString() : null;
      const endDate = formData.endDate ? new Date(formData.endDate).toISOString() : null;

      const projectData = {
        title: formData.title,
        description: formData.description || '',
        start_date: startDate,
        end_date: endDate,
        status: formData.status || 'active',
        priority: formData.priority || 'medium',
        budget: formData.budget || 0,
        manager_id: formData.manager || null,
        team: formData.team || [],
        process: formData.process
      };

      let savedProject;
      if (projectId) {
        savedProject = await projectService.update(projectId, projectData);
      } else {
        savedProject = await projectService.create(projectData);
      }

      if (!savedProject) {
        throw new Error("Не удалось сохранить проект");
      }

      const taskIdMap = new Map();

      for (const task of tasks) {
        const taskData = {
          name: task.name,
          start_date: task.startDate ? new Date(task.startDate).toISOString() : null,
          end_date: task.endDate ? new Date(task.endDate).toISOString() : null,
          assignee_id: task.assignee || null,
          position_x: task.x,
          position_y: task.y,
          status: task.status || 'not_started',
          priority: task.priority || 'medium',
          process: formData.process,
          description: task.description || '',
          task_type: task.taskType,
          project: savedProject.id
        };

        try {
          console.log('Сохранение задачи:', { taskId: task.id, taskData });
          let savedTask;
          if (task.id && typeof task.id === 'string' && task.id.length > 30) {
            console.log('Обновление существующей задачи:', task.id);
            savedTask = await taskService.update(task.id, taskData);

            await taskService.deleteTaskConnections(task.id);
          } else {
            console.log('Создание новой задачи');
            savedTask = await taskService.create(savedProject.id, taskData);
          }
          console.log('Задача сохранена:', savedTask);
          taskIdMap.set(task.id, savedTask.id);
        } catch (taskError) {
          console.error("Ошибка при сохранении задачи:", {
            taskData,
            error: taskError.response?.data || taskError.message
          });
          throw new Error(`Ошибка при сохранении задачи "${task.name}": ${JSON.stringify(taskError.response?.data || taskError.message)}`);
        }
      }

      for (const conn of connections) {
        const sourceTaskId = taskIdMap.get(conn.sourceId);
        const targetTaskId = taskIdMap.get(conn.targetId);

        if (!sourceTaskId || !targetTaskId) {
          console.error('Не удалось найти соответствие ID для связи:', conn);
          continue;
        }

        try {
          console.log('Создание связи между задачами:', { sourceTaskId, targetTaskId });
          await taskService.createTaskRelation(sourceTaskId, targetTaskId);
        } catch (connError) {
          console.error('Ошибка при создании связи:', {
            connection: { from: sourceTaskId, to: targetTaskId },
            error: connError
          });
          console.warn('Пропускаем создание связи из-за ошибки');
        }
      }

      setError(null);
      navigate("/projects");
    } catch (error) {
      setError(error.message || "Ошибка при сохранении проекта");
      console.error("Ошибка сохранения:", error);
    }
  };

  const handleAddNewTask = () => {
    if (newTaskName.trim() === "") return;

    const newTask = {
      id: Math.floor(Math.random() * 1000) + 1,
      name: newTaskName.trim(),
    };

    setInitialTasks([...initialTasks, newTask]);
    setNewTaskName("");
    setShowTaskForm(false);
  };

  const handleTaskSelect = (task) => {
    if (selectedTask) {
      if (selectedTask.id === task.id) {
        setSelectedTask(null);
        return;
      }
      
      const connectionExists = connections.some(
        conn => (conn.sourceId === selectedTask.id && conn.targetId === task.id) || 
                (conn.sourceId === task.id && conn.targetId === selectedTask.id)
      );
      
      if (!connectionExists) {
        setConnections([
          ...connections,
          {
            sourceId: selectedTask.id,
            targetId: task.id,
          },
        ]);
      }
      
      setSelectedTask(null);
    } else {
      setSelectedTask(task);
    }
  };

  const handleTaskUpdate = (taskId, field, value) => {
    if (field === 'addTask') {
      if (!value || !value.id) {
        console.error('Invalid task data:', value);
        return;
      }
      
      setTasks(prev => [...prev, { 
        ...value, 
        id: Math.floor(Math.random() * 1000) + 1,
        taskType: value.taskType || null,
        x: value.x || 0,
        y: value.y || 0
      }]);
      return;
    }
    
    setTasks(prevTasks => {
      const taskIndex = prevTasks.findIndex(task => task.id === taskId);
      if (taskIndex === -1) {
        console.error('Task not found:', taskId);
        return prevTasks;
      }

      if (field === 'position') {
        if (!value || typeof value.x !== 'number' || typeof value.y !== 'number') {
          console.error('Invalid position data:', value);
          return prevTasks;
        }
        return prevTasks.map(task => {
          if (task.id !== taskId) return task;
          return {
            ...task,
            x: Math.max(0, value.x),
            y: Math.max(0, value.y)
          };
        });
      }

      return prevTasks.map(task => {
        if (task.id !== taskId) return task;
        return {
          ...task,
          [field]: value || ""
        };
      });
    });
  };

  const handleConnectionClick = (connection, e) => {
    e.stopPropagation();
    setSelectedConnection((prev) =>
      prev?.sourceId === connection.sourceId && prev?.targetId === connection.targetId
        ? null
        : connection
    );
  };

  const handleDeleteConnection = (e) => {
    e.stopPropagation();
    if (!selectedConnection) {
      console.log('No connection selected');
      return;
    }

    const updatedConnections = connections.filter(
      (conn) =>
        !(
          conn.sourceId === selectedConnection.sourceId &&
          conn.targetId === selectedConnection.targetId
        )
    );

    setConnections(updatedConnections);
    setSelectedConnection(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  if (loading) {
    return (
      <div className="container">
        <Header />
        <div className="loading">Загрузка проекта...</div>
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
    <DndProvider backend={HTML5Backend}>
      <div className="container">
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
              <TaskForm
                newTaskName={newTaskName}
                setNewTaskName={setNewTaskName}
                handleAddNewTask={handleAddNewTask}
                setShowTaskForm={setShowTaskForm}
              />
            )}

            <div className="tasks-list">
              {initialTasks.map((task) => (
                <DraggableTask key={task.id} task={task} />
              ))}
            </div>
          </div>

          <ProjectArea
            projectAreaTasks={tasks}
            onSelect={handleTaskSelect}
            onUpdate={handleTaskUpdate}
            employees={employees}
            selectedTask={selectedTask}
            formData={formData}
            handleChange={handleChange}
            saveProject={saveProject}
            connections={connections}
            onConnectionClick={handleConnectionClick}
            onDeleteConnection={handleDeleteConnection}
            selectedConnection={selectedConnection}
          />
        </div>
      </div>
    </DndProvider>
  );
}

export default ProjectConstructor;
