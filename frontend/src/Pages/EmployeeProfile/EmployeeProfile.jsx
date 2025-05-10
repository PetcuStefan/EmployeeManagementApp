import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EmployeeProfile.css';

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/employeeProfile/${id}`);
        const data = await res.json();
        setEmployee(data);
      } catch (err) {
        console.error('Error fetching employee:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  if (loading) return <p>Loading employee profile...</p>;
  if (!employee) return <p>Employee not found.</p>;

  return (
    <div className="employee-profile">
      <h2>{employee.name}'s Profile</h2>
      <p><strong>ID:</strong> {employee.employee_id}</p>
      <p><strong>Salary:</strong> {employee.salary || 'N/A'}</p>
      <p><strong>Department:</strong> {employee.department_id || 'N/A'}</p>
      <p><strong>Supervizor:</strong> {employee.manager_id || 'N/A'}</p>
      <p><strong>Hire Date:</strong> {employee.hire_date || 'N/A'}</p>
    </div>
  );
};

export default EmployeeProfile;
