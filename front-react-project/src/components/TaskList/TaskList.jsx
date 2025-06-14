import { useState, useEffect } from "react";
import style from "./TaskList.module.scss";
import Task from "../Task/Task";

function TasksList() {
  const [tasks, setTasks] = useState([]);
  const [sortBy, setSortBy] = useState("name");
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [
      { 
        id: 1, 
        name: "Разработать дизайн", 
        start_date: "01 / 01 / 25",
        end_date: "01 / 02 / 25",
        description: "Создать макеты для всех страниц приложения",
        author: "Иванов Иван",
        phone: "+7(999)123-45-67",
        status: "В работе",
        files: [],
        comments: []
      },
      { 
        id: 2, 
        name: "Написать код", 
        start_date: "01 / 02 / 25",
        end_date: "01 / 03 / 25",
        description: "Реализовать функционал компонентов",
        author: "Петров Петр",
        phone: "+7(999)765-43-21",
        status: "Завершено",
        files: [],
        comments: []
      },
    ];
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else {
      return new Date(a.date) - new Date(b.date);
    }
  });

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const openTask = (task) => {
    setSelectedTask(task);
  };

  const closeTask = () => {
    setSelectedTask(null);
  };

  if (selectedTask) {
    console.log("Selected Task Status:", selectedTask.status);
    return (
      <Task 
        taskData={selectedTask} 
        onClose={closeTask}
      />
    );
  }

  return (
    <div className={style.tasksPage}>
      <div className={style.controls}>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={style.sortSelect}
        >
          <option value="name">По названию</option>
          <option value="start_date">По дате начала</option>
          <option value="end_date">По дате окончания</option>
        </select>
      </div>

      <div className={style.tasksGrid}>
        {sortedTasks.map((task) => (
          <div key={task.id} className={style.taskCard}>
            <h3>{task.name}</h3>
            <p>Дата начала: {task.start_date}</p>
            <p>Дата окончания: {task.end_date}</p>
            <div className={style.taskActions}>
              <button
                onClick={() => openTask(task)}
                className={style.openButton}
              >
                Открыть
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className={style.deleteButton}
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TasksList;