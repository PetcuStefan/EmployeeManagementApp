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
    return employeeData;
  };

  const treeData = employees.map(renderHierarchyForTree);

  return (
    <div className="employee-container">
      <Tree
        data={treeData}
        renderCustomNodeElement={(rd3tProps) => {
            return (
              <EmployeeCard
                employee={rd3tProps.nodeDatum}
                nodeDatum={rd3tProps.nodeDatum}
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
