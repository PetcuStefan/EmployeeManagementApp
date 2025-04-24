import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

const ItemType = 'EMPLOYEE';

const EmployeeCard = ({ employee, onDropEmployee }) => {
  // Dragging state
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { id: employee.employee_id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Drop target state
  const [, drop] = useDrop({
    accept: ItemType,
    drop: (dragged) => {
      // Log the dragged item and dropped item for debugging
      console.log('Dragged item:', dragged);
      console.log('Dropped item:', employee);

      // Only allow dropping if the dragged item is different from the current item
      if (dragged.id !== employee.employee_id) {
        console.log(`Updating manager_id for employee ${dragged.id} to ${employee.employee_id}`);
        onDropEmployee(dragged.id, employee.employee_id); // Update manager_id
      }
    },
  });

  // Log to see if the drag state is being updated
  console.log('isDragging:', isDragging);
  console.log("Employee data received:", employee);
  
  return (
    <div
      ref={(node) => drag(drop(node))}
      className="employee-card"
      style={{
        opacity: isDragging ? 0.5 : 1,
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '10px',
        margin: '10px',
        backgroundColor: 'white',
      }}
    >
      <p><strong>{employee.name}</strong></p>
      <p>ID: {employee.employee_id}</p>
    </div>
  );
};

export default EmployeeCard;
