import React, { useState } from "react";
import style from "./TaskStatus.module.scss";

const TaskStatus = () => {
  const [status, setStatus] = useState("в работе");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const statusOptions = ["В работе", "Завершено", "Получено", "Заморожено"];

  const getStatusColor = () => {
    switch (status) {
      case "В работе":
        return style.inProgress;
      case "Завершено":
        return style.completed;
      case "Получено":
        return style.received;
      case "Заморожено":
        return style.frozen;
      default:
        return style.default;
    }
  };

  return (
    <div className={style.statusContainer}>
      <button
        className={`${style.statusButton} ${getStatusColor(status)}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <span className={style.statusText}>{status}</span>
        <span className={style.arrow}>{isMenuOpen ? "▲" : "▼"}</span>
      </button>

      <div className={`${style.menu} ${isMenuOpen ? style.menuOpen : ''}`}>
        {statusOptions.map((option) => (
          <div
            key={option}
            className={`${style.menuItem} ${getStatusColor(option)}`}
            onClick={() => {
              setStatus(option);
              setIsMenuOpen(false);
            }}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskStatus;