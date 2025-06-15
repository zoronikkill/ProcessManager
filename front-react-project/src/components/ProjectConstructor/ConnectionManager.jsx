import React from 'react';

function ConnectionManager({ connections, projectAreaTasks, selectedConnection, onConnectionClick, onDeleteConnection }) {
  const calculateDateDifference = (fromTask, toTask) => {
    if (!fromTask.endDate || !toTask.startDate) return null;

    const fromDate = new Date(fromTask.endDate);
    const toDate = new Date(toTask.startDate);

    const diffTime = toDate.getTime() - fromDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  const renderConnections = () => {
    return connections.map((conn, index) => {
      const fromTask = projectAreaTasks.find(t => t.id === conn.sourceId);
      const toTask = projectAreaTasks.find(t => t.id === conn.targetId);
      
      if (!fromTask || !toTask) {
        console.log('Не найдена задача для связи:', { conn, fromTask, toTask });
        return null;
      }
      
      const fromPoint = { x: fromTask.x + 100, y: fromTask.y + 40 };
      const toPoint = { x: toTask.x + 100, y: toTask.y + 40 };
      
      const dateDiff = calculateDateDifference(fromTask, toTask);
      const midX = (fromPoint.x + toPoint.x) / 2;
      const midY = (fromPoint.y + toPoint.y) / 2;
      
      const isSelected = selectedConnection?.sourceId === conn.sourceId && selectedConnection?.targetId === conn.targetId;
      
      // Вычисляем угол для стрелки
      const angle = Math.atan2(toPoint.y - fromPoint.y, toPoint.x - fromPoint.x);
      const length = Math.sqrt(Math.pow(toPoint.x - fromPoint.x, 2) + Math.pow(toPoint.y - fromPoint.y, 2));
      
      // Корректируем конечную точку, чтобы стрелка не заходила на задачу
      const arrowPadding = 10;
      const adjustedToX = fromPoint.x + (length - arrowPadding) * Math.cos(angle);
      const adjustedToY = fromPoint.y + (length - arrowPadding) * Math.sin(angle);
      
      return (
        <g key={`connection-${index}`}>
          <line
            x1={fromPoint.x}
            y1={fromPoint.y}
            x2={adjustedToX}
            y2={adjustedToY}
            className={`connection-line ${isSelected ? 'selected' : ''}`}
            onClick={(e) => onConnectionClick(conn, e)}
            markerEnd="url(#arrowhead)"
          />
          {dateDiff !== null && (
            <text
              x={midX}
              y={midY}
              textAnchor="middle"
              dominantBaseline="middle"
              className={`connection-label ${dateDiff > 0 ? 'positive-diff' : dateDiff < 0 ? 'negative-diff' : 'zero-diff'}`}
            >
              {dateDiff > 0 ? `+${dateDiff}д` : `${dateDiff}д`}
            </text>
          )}
        </g>
      );
    });
  };

  return (
    <>
      <svg className="connections">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="0"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#5c2f91" />
          </marker>
        </defs>
        {renderConnections()}
      </svg>

      {selectedConnection && (
        <div className="delete-connection-panel">
          <button
            className="delete-connection-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteConnection(e);
            }}
          >
            Удалить связь
          </button>
        </div>
      )}
    </>
  );
}

export default ConnectionManager; 