import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import './EmployeeCard.css';

const ItemType = 'EMPLOYEE';

const EmployeeCard = ({ employee, onDropEmployee }) => {
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
        onDropEmployee(dragged.id, employee.employee_id); // Update manager_id
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`employee-card ${isDragging ? 'dragging' : ''}`}
    >
      <p><strong>{employee.name}</strong></p>
      <p>ID: {employee.employee_id}</p>
    </div>
  );
};

export default EmployeeCard;