import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import './EmployeeCard.css';

const ItemType = 'EMPLOYEE';

const EmployeeCard = ({ employee, nodeDatum, onDropEmployee }) => {
  console.log('Employee data in EmployeeCard:', employee);
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { id: employee.id },  // Set the dragged item's ID
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Drop setup
  const [, drop] = useDrop({
    accept: ItemType,
    drop: (draggedItem) => {
      if (draggedItem.id !== employee.id) {
        onDropEmployee(draggedItem.id, employee.id);
      }
    },
  });

  return (
    <g ref={(node) => drag(drop(node))} transform="translate(-60, -30)">
      <rect
        width="120"
        height="60"
        fill="#e0f7fa"
        stroke="#26c6da"
        strokeWidth="2"
        rx="10"
        ry="10"
      />
      <text
        x="60"
        y="25"
        textAnchor="middle"
        fontSize="14"
        fill="#00796b"
        fontWeight="normal"
      >
        {employee.name}
      </text>
      <text
        x="60"
        y="45"
        textAnchor="middle"
        fontSize="10"
        fill="#00796b"
      >
        ID: {employee.id}
      </text>
    </g>
  );
};

export default EmployeeCard;
