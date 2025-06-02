import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./ProjectConstructor.css";
import Button from "../Button/Button";
import { useParams, useNavigate } from "react-router-dom";
import { projectService } from "../../services/projectService";
import { taskService } from "../../services/taskService";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import DraggableTask from "./DraggableTask";
import ProjectArea from "./ProjectArea";
import TaskForm from "./TaskForm";

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
  });

  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    } else {
      setLoading(false);
    }
  }, [projectId]);

  const loadProject = async (id) => {
    try {
      setLoading(true);
      const project = await projectService.getById(id);
      if (project) {
        setFormData({
          title: project.title || "",
          description: project.description || "",
          startDate: project.startDate || "",
          endDate: project.endDate || "",
          status: project.status || "active",
          priority: project.priority || "medium",
          budget: project.budget || "",
          manager: project.manager || "",
          team: project.team || [],
        });

        const projectTasks = await taskService.getTasks(id);
        setProjectAreaTasks(projectTasks);
        setConnections(project.connections || []);
      }
      setError(null);
    } catch (err) {
      setError("Ошибка при загрузке проекта");
      console.error("Ошибка загрузки проекта:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveProject = async () => {
    try {
      const projectData = {
        ...formData,
        tasks: projectAreaTasks,
        connections: connections,
      };

      if (projectId) {
        await projectService.update(projectId, projectData);
      } else {
        const newProject = await projectService.create(projectData);
        navigate(`/projects/${newProject.id}`);
      }
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      setError("Ошибка при сохранении проекта");
    }
  };

  const handleAddNewTask = () => {
    if (newTaskName.trim() === "") return;

    const newTask = {
      id: Date.now(),
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
        conn => (conn.from === selectedTask.id && conn.to === task.id) || 
                (conn.from === task.id && conn.to === selectedTask.id)
      );
      
      if (!connectionExists) {
        setConnections([
          ...connections,
          {
            from: selectedTask.id,
            to: task.id,
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
      
      setProjectAreaTasks(prev => [...prev, { 
        ...value, 
        id: taskId,
        taskType: value.id,
        x: value.x || 0,
        y: value.y || 0
      }]);
      return;
    }
    
    setProjectAreaTasks(prevTasks => {
      const taskIndex = prevTasks.findIndex(task => task.id === taskId);
      if (taskIndex === -1) {
        console.error('Task not found:', taskId);
        return prevTasks;
      }

      return prevTasks.map(task => {
        if (task.id !== taskId) return task;

        if (field === 'position') {
          if (!value || typeof value.x !== 'number' || typeof value.y !== 'number') {
            console.error('Invalid position data:', value);
            return task;
          }
          return {
            ...task,
            x: Math.max(0, value.x),
            y: Math.max(0, value.y)
          };
        }

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
      prev?.from === connection.from && prev?.to === connection.to
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

    console.log('Deleting connection:', selectedConnection);
    console.log('Current connections:', connections);

    const updatedConnections = connections.filter(
      (conn) =>
        !(
          conn.from === selectedConnection.from &&
          conn.to === selectedConnection.to
        )
    );

    console.log('Updated connections:', updatedConnections);
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
            projectAreaTasks={projectAreaTasks}
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
