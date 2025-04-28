import React from 'react';
import './EmployeeCard.css';

const EmployeeCard = ({ employee }) => {
  return (
    <g transform="translate(-60, -30)">
      <rect
        width="120"
        height="60"
        rx="10"
        ry="10"
      />
      <text
        x="60"
        y="25"
        textAnchor="middle"
        fontSize="14"
        fontWeight="normal"
      >
        {employee.name}
      </text>
      <text
        x="60"
        y="45"
        textAnchor="middle"
        fontSize="10"
      >
        ID: {employee.id}
      </text>
    </g>
  );
};

export default EmployeeCard;
