import { useState, useEffect } from "react";
import style from "./TaskList.module.scss"

function TasksList() {
  const [tasks, setTasks] = useState([]);
  const [sortBy, setSortBy] = useState("name"); // 'name' или 'date'

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [
      { id: 1, name: "Разработать дизайн", date: "2023-05-15" },
      { id: 2, name: "Написать код", date: "2023-05-10" },
      { id: 3, name: "Протестировать", date: "2023-05-20" },
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

  // const addTask = () => {
  //   const newTask = {
  //     id: Date.now(),
  //     name: `Новая задача ${tasks.length + 1}`,
  //     date: new Date().toISOString().split("T")[0],
  //   };
  //   setTasks([...tasks, newTask]);
  // };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className={style.tasksPage}>
      <div className={style.controls}>
        {/* <button onClick={addTask} className={style.addButton}>
          + Добавить задачу
        </button> */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={style.sortSelect}
        >
          <option value="name">По названию</option>
          <option value="date">По дате</option>
        </select>
      </div>

      <div className={style.tasksGrid}>
        {sortedTasks.map((task) => (
          <div key={task.id} className={style.taskCard}>
            <h3>{task.name}</h3>
            <p>Дата: {task.date}</p>
            <button
              onClick={() => deleteTask(task.id)}
              className={style.deleteButton}
            >
              Удалить
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TasksList;
