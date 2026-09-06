import React from 'react';
import Button from '../Button/Button';

function TaskForm({ newTaskName, setNewTaskName, handleAddNewTask, setShowTaskForm }) {
  return (
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
  );
}

export default TaskForm; 