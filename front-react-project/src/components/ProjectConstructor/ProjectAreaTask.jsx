import React from 'react';
import { useDrag } from 'react-dnd';

const ItemTypes = {
  TASK: 'task'
};

function ProjectAreaTask({ task, onSelect, onUpdate, employees = [], isSelected }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TASK,
    item: { type: 'project-task', task },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Убеждаемся, что employees является массивом
  const employeesList = Array.isArray(employees) ? employees : [];

  return (
    <div
      ref={drag}
      className={`task ${isSelected ? "selected" : ""} ${isDragging ? "dragging" : ""}`}
      style={{
        left: `${task.x}px`,
        top: `${task.y}px`,
        position: "absolute",
        cursor: "move"
      }}
      onClick={() => onSelect(task)}
    >
      <div
        className="task-header"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(task);
        }}
      >
        {task.name}
      </div>
      <div className="task-details">
        <div>
          <label>Дата начала:</label>
          <input
            type="date"
            value={task.startDate || ""}
            onChange={(e) => onUpdate(task.id, "startDate", e.target.value)}
          />
        </div>
        <div>
          <label>Дата окончания:</label>
          <input
            type="date"
            value={task.endDate || ""}
            onChange={(e) => onUpdate(task.id, "endDate", e.target.value)}
          />
        </div>
        <div>
          <label>Исполнитель:</label>
          <select
            value={task.assignee || ""}
            onChange={(e) => onUpdate(task.id, "assignee", e.target.value)}
          >
            <option value="">Не назначено</option>
            {employeesList.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name || emp.username || 'Неизвестный сотрудник'} ({emp.position || "Сотрудник"})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default ProjectAreaTask; 