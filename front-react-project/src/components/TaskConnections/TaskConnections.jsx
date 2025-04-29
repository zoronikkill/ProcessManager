import React, { useEffect, useRef } from 'react';
import './TaskConnections.css';

const TaskConnections = ({ tasks, connections }) => {
    const svgRef = useRef(null);

    useEffect(() => {
        if (!svgRef.current || !tasks.length || !connections.length) return;

        const updateConnections = () => {
            // Очищаем существующие линии
            while (svgRef.current.firstChild) {
                svgRef.current.removeChild(svgRef.current.firstChild);
            }

            // Добавляем определение стрелки
            const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
            marker.setAttribute('id', 'arrowhead');
            marker.setAttribute('markerWidth', '10');
            marker.setAttribute('markerHeight', '7');
            marker.setAttribute('refX', '9');
            marker.setAttribute('refY', '3.5');
            marker.setAttribute('orient', 'auto');

            const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
            polygon.setAttribute('fill', '#5c2f91');

            marker.appendChild(polygon);
            defs.appendChild(marker);
            svgRef.current.appendChild(defs);

            // Создаем линии для каждого соединения
            connections.forEach(conn => {
                const fromTask = tasks.find(t => t.id === conn.from);
                const toTask = tasks.find(t => t.id === conn.to);

                if (!fromTask || !toTask) return;

                const fromElement = document.getElementById(`task-${fromTask.id}`);
                const toElement = document.getElementById(`task-${toTask.id}`);

                if (!fromElement || !toElement) return;

                const fromRect = fromElement.getBoundingClientRect();
                const toRect = toElement.getBoundingClientRect();
                const svgRect = svgRef.current.getBoundingClientRect();

                const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                
                // Вычисляем точки для кривой Безье
                const fromX = fromRect.left + fromRect.width - svgRect.left;
                const fromY = fromRect.top + fromRect.height/2 - svgRect.top;
                const toX = toRect.left - svgRect.left;
                const toY = toRect.top + toRect.height/2 - svgRect.top;
                
                // Создаем кривую Безье
                const controlPoint1X = fromX + 50;
                const controlPoint1Y = fromY;
                const controlPoint2X = toX - 50;
                const controlPoint2Y = toY;

                const d = `M ${fromX} ${fromY} 
                          C ${controlPoint1X} ${controlPoint1Y},
                            ${controlPoint2X} ${controlPoint2Y},
                            ${toX} ${toY}`;

                line.setAttribute('d', d);
                line.setAttribute('stroke', '#5c2f91');
                line.setAttribute('stroke-width', '2');
                line.setAttribute('fill', 'none');
                line.setAttribute('marker-end', 'url(#arrowhead)');

                svgRef.current.appendChild(line);
            });
        };

        updateConnections();
        window.addEventListener('resize', updateConnections);

        return () => {
            window.removeEventListener('resize', updateConnections);
        };
    }, [tasks, connections]);

    return (
        <svg 
            ref={svgRef} 
            className="connections-svg"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
            }}
        />
    );
};

export default TaskConnections;