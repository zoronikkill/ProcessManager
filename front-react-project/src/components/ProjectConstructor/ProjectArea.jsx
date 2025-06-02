import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import Button from "../Button/Button";
import ProjectAreaTask from "./ProjectAreaTask";
import ConnectionManager from "./ConnectionManager";

const ItemTypes = {
  TASK: "task",
};

function ProjectArea({
  projectAreaTasks,
  onSelect,
  onUpdate,
  employees,
  selectedTask,
  formData,
  handleChange,
  saveProject,
  connections,
  onConnectionClick,
  onDeleteConnection,
  selectedConnection,
}) {
  const projectAreaRef = useRef(null);
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.TASK,
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const container = projectAreaRef.current;
      if (!offset || !container) return;

      const containerRect = container.getBoundingClientRect();
      const taskWidth = 200;
      const taskHeight = 80;

      const x = offset.x - containerRect.left - taskWidth / 2;
      const y = offset.y - containerRect.top - taskHeight / 2;

      if (item.type === "task") {
        onUpdate(Date.now().toString(), "addTask", {
          ...item.task,
          x: Math.max(0, x),
          y: Math.max(0, y),
          startDate: "",
          endDate: "",
          assignee: "",
        });
      } else if (item.type === "project-task") {
        onUpdate(item.task.id, "position", {
          x: Math.max(0, x),
          y: Math.max(0, y),
        });
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      className="project-area-container"
      ref={(node) => {
        projectAreaRef.current = node;
        drop(node);
      }}
    >
      <div className="project-area-header">
        <div className="project-title-input">
          <input
            type="text"
            value={formData.title}
            onChange={handleChange}
            name="title"
            placeholder="Введите название проекта"
            className="project-title"
          />
        </div>
        <Button
          text="Сохранить проект"
          className="save-button"
          onClick={saveProject}
        />
      </div>

      <div className={`project-area ${isOver ? "active" : ""}`}>
        {projectAreaTasks.map((task) => (
          <ProjectAreaTask
            key={task.id}
            task={task}
            onSelect={onSelect}
            onUpdate={onUpdate}
            employees={employees}
            isSelected={selectedTask?.id === task.id}
          />
        ))}

        <ConnectionManager
          connections={connections}
          projectAreaTasks={projectAreaTasks}
          selectedConnection={selectedConnection}
          onConnectionClick={onConnectionClick}
          onDeleteConnection={onDeleteConnection}
        />
      </div>
    </div>
  );
}

export default ProjectArea;
