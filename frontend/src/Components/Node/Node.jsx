import React, { useState } from 'react';

const EmployeeNode = ({ employee, level = 0 }) => {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = employee.children && employee.children.length > 0;

  return (
    <div style={{ marginLeft: level * 20 }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          cursor: hasChildren ? 'pointer' : 'default',
          fontWeight: hasChildren ? 'bold' : 'normal',
        }}
      >
        {hasChildren ? (expanded ? '▼ ' : '▶ ') : '• '}
        {employee.name}
      </div>
      {expanded && hasChildren && employee.children.map((child) => (
        <EmployeeNode key={child.employee_id} employee={child} level={level + 1} />
      ))}
    </div>
  );
};

export default EmployeeNode;
  