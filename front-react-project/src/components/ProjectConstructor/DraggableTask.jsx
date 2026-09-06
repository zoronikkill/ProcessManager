import React from 'react';
import { useDrag } from 'react-dnd';

const ItemTypes = {
  TASK: 'task'
};

function DraggableTask({ task }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TASK,
    item: { type: 'task', task },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`task ${isDragging ? "dragging" : ""}`}
      style={{ cursor: "grab" }}
    >
      {task.name}
    </div>
  );
}

export default DraggableTask; 