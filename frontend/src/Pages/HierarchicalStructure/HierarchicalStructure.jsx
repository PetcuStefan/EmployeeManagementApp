import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Make sure this is imported
import EmployeeCard from '../../Components/EmployeeCard/EmployeeCard'; // import your EmployeeCard component

const HierarchicalStructure = () => {
  const { departmentId } = useParams(); // Use useParams to extract departmentId from the URL
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log('departmentId from URL:', departmentId); // Log the departmentId to make sure it's correct

  useEffect(() => {
    const fetchEmployees = async () => {
      console.log('Fetching employees for department:', departmentId);  // Log the departmentId
      try {
        const res = await fetch(`http://localhost:5000/api/HierarchicalStructure/${departmentId}/EmployeeList`);
        const data = await res.json();
        console.log('Fetched employees:', data); // Log the fetched employee data
        setEmployees(data);
      } catch (err) {
        console.error('Error fetching employee data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (departmentId) {
      fetchEmployees();
    } else {
      console.log("No departmentId provided");
    }
  }, [departmentId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="employee-container">
      {employees.map((employee) => (
        <EmployeeCard key={employee.employee_id} employee={employee} />
      ))}
    </div>
  );
};

export default HierarchicalStructure;
