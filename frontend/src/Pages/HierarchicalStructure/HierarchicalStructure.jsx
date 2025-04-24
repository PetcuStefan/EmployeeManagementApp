import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Tree from 'react-d3-tree'; // Import react-d3-tree
import './HierarchicalStructure.css';

// Function to build a tree structure from flat employee data
const buildHierarchy = (employees) => {
  const employeeMap = {};
  const root = [];

  // Create a map of employee_id to employee
  employees.forEach((emp) => {
    employeeMap[emp.employee_id] = { ...emp, children: [] };
  });

  // Build the hierarchy
  employees.forEach((emp) => {
    if (emp.manager_id) {
      employeeMap[emp.manager_id].children.push(employeeMap[emp.employee_id]);
    } else {
      root.push(employeeMap[emp.employee_id]);
    }
  });

  return root;
};

const HierarchicalStructure = () => {
  const { departmentId } = useParams();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/HierarchicalStructure/${departmentId}/EmployeeList`);
        const data = await res.json();
        const hierarchy = buildHierarchy(data); // Convert flat data to hierarchical structure
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

  // Handle drop event and update the manager relationship
  const onDropEmployee = async (draggedId, droppedId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/HierarchicalStructure/updateManager`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          draggedId,
          droppedId,
        }),
      });

      if (response.ok) {
        // After the drop, update the employee state and hierarchy
        const updatedEmployees = employees.map((emp) =>
          emp.employee_id === droppedId ? { ...emp, manager_id: draggedId } : emp
        );

        const updatedHierarchy = buildHierarchy(updatedEmployees); // Rebuild the hierarchy with updated data
        setEmployees(updatedHierarchy); // Update state with new hierarchy
      } else {
        console.error('Failed to update manager_id');
      }
    } catch (err) {
      console.error('Error updating manager_id:', err);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  // Convert the employee data into a format that react-d3-tree can render
  const renderHierarchyForTree = (employee) => {
    return {
      name: employee.name,
      id: employee.employee_id,
      children: employee.children ? employee.children.map(renderHierarchyForTree) : [],
    };
  };

  const treeData = employees.map(renderHierarchyForTree);
  console.log('Tree Data:', treeData);

  // Style for the tree container
  const treeStyle = {
    width: '100%',
    height: '100vh', // Set a fixed height or make it fill the screen
    overflow: 'hidden', // Prevent overflow
  };

  return (
    <div className="employee-container">
      {/* Render the tree with react-d3-tree using the default node rendering */}
      <Tree
        data={treeData}
        orientation="vertical"
        pathFunc="step"
        zoom={0.8} // Adjust zoom level
        styles={{
          links: {
            stroke: '#000',
            strokeWidth: '2px',
          },
          nodes: {
            node: {
              circle: {
                fill: '#fff',
                stroke: '#000',
                strokeWidth: '2px',
              },
            },
          },
        }}
        nodeSize={{ x: 150, y: 100 }} // Define the size of each node
        scaleExtent={{ min: 0.5, max: 2 }} // Set the zoom scale
        style={treeStyle}
      />
    </div>
  );
};

export default HierarchicalStructure;
