import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import './EmployeeCard.css';

const ItemType = 'EMPLOYEE';

const EmployeeCard = ({ employee, onDropEmployee, nodeDatum }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { id: employee.employee_id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    drop: (dragged) => {
      if (dragged.id !== employee.employee_id) {
        onDropEmployee(dragged.id, employee.employee_id); // Handle drop
      }
    },
  });

  return (
    <g ref={(node) => drag(drop(node))} transform="translate(-60, -30)">
  <rect
    className="employee-rect"
    width="120"
    height="60"
    rx="10"
    ry="10"
  />
  <text
    className="employee-name"
    x="60"
    y="25"
    textAnchor="middle"
  >
    {employee.name}
  </text>
  <text
    className="employee-id"
    x="60"
    y="45"
    textAnchor="middle"
  >
    ID: {employee.employee_id}
  </text>
</g>
  );
  
};

export default EmployeeCard;
