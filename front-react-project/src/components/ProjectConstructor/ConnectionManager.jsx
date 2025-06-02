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
      const fromTask = projectAreaTasks.find(t => t.id === conn.from);
      const toTask = projectAreaTasks.find(t => t.id === conn.to);
      
      if (!fromTask || !toTask) return null;
      
      const fromPoint = { x: fromTask.x + 100, y: fromTask.y + 40 };
      const toPoint = { x: toTask.x + 100, y: toTask.y + 40 };
      
      const dateDiff = calculateDateDifference(fromTask, toTask);
      const midX = (fromPoint.x + toPoint.x) / 2;
      const midY = (fromPoint.y + toPoint.y) / 2;
      
      const isSelected = selectedConnection?.from === conn.from && selectedConnection?.to === conn.to;
      
      return (
        <g key={`connection-${index}`}>
          <line
            x1={fromPoint.x}
            y1={fromPoint.y}
            x2={toPoint.x}
            y2={toPoint.y}
            className={`connection-line ${isSelected ? 'selected' : ''}`}
            onClick={(e) => onConnectionClick(conn, e)}
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
        {renderConnections()}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#5c2f91" />
          </marker>
        </defs>
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