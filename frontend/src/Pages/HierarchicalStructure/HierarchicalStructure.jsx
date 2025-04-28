import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Tree from 'react-d3-tree';
import EmployeeCard from '../../Components/EmployeeCard/EmployeeCard';
import { buildHierarchy } from '../../Utility/buildTree';
import './HierarchicalStructure.css';

const HierarchicalStructure = () => {
  const { departmentId } = useParams();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const treeContainerDimensions = { width: window.innerWidth, height: window.innerHeight };

  const [translate, setTranslate] = useState({
    x: treeContainerDimensions.width / 2,
    y: 100, // Start tree not too high up
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/HierarchicalStructure/${departmentId}/EmployeeList`);
        const data = await res.json();
        const hierarchy = buildHierarchy(data);
        setEmployees(hierarchy);
      } catch (err) {
        console.error('Error fetching employee data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (departmentId) {
      fetchEmployees();
    }
  }, [departmentId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  const renderHierarchyForTree = (employee) => {
    const employeeData = {
      name: employee.name,
      id: employee.employee_id,
      children: employee.children ? employee.children.map(renderHierarchyForTree) : [],
    };
    console.log('Rendering employee data for tree:', employeeData); // Log the data being rendered for each employee
    return employeeData;
  };

  const handleDropEmployee = (draggedId, targetId) => {
    const updatedEmployees = [...employees];
    
    // Find the dragged and target employee
    const draggedEmployee = findEmployeeById(updatedEmployees, draggedId);
    const targetEmployee = findEmployeeById(updatedEmployees, targetId);

    if (draggedEmployee && targetEmployee) {
      // Update the dragged employee's manager to the target employee's ID
      draggedEmployee.manager_id = targetId;

      setEmployees(updatedEmployees);
    }
  };

  const findEmployeeById = (employees, id) => {
    for (let employee of employees) {
      if (employee.employee_id === id) {
        return employee;
      }
      if (employee.children) {
        const child = findEmployeeById(employee.children, id);
        if (child) return child;
      }
    }
    return null;
  };

  const treeData = employees.map(renderHierarchyForTree);
  console.log('Tree Data:', treeData);

  return (
    <div className="employee-container">
      <Tree
        data={treeData}
        renderCustomNodeElement={(rd3tProps) => {
            console.log('Sending node data to EmployeeCard:', rd3tProps.nodeDatum); // Log node data before passing to EmployeeCard
            return (
              <EmployeeCard
                employee={rd3tProps.nodeDatum}
                nodeDatum={rd3tProps.nodeDatum}
                onDropEmployee={handleDropEmployee}
              />
            );
          }}
        orientation="vertical"
        pathFunc="step"
        zoom={0.8}
        translate={translate}
        nodeSize={{ x: 150, y: 100 }}
        scaleExtent={{ min: 0.5, max: 2 }}
      />
    </div>
  );
};

export default HierarchicalStructure;
