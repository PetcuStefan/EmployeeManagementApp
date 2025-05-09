import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Tree from 'react-d3-tree';
import EmployeeCard from '../../Components/EmployeeCard/EmployeeCard';
import Modal from '../../Components/Modal/Modal';
import { buildHierarchy } from '../../Utility/buildTree';
import './HierarchicalStructure.css';

const HierarchicalStructure = () => {
  const { departmentId } = useParams();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const treeContainerDimensions = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const [translate, setTranslate] = useState({
    x: treeContainerDimensions.width / 2,
    y: 100,
  });

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

  useEffect(() => {
    if (departmentId) {
      fetchEmployees();
    }
  }, [departmentId]);

  const renderHierarchyForTree = (employee) => {
    return {
      name: employee.name,
      id: employee.employee_id,
      title: employee.title,
      children: employee.children ? employee.children.map(renderHierarchyForTree) : [],
    };
  };

  const treeData = employees.map(renderHierarchyForTree);

  const handleNodeClick = (nodeDatum) => {
    setSelectedEmployee(nodeDatum);
    setIsModalOpen(true);
  };

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee?.id) return;

    try {
      const res = await fetch(`http://localhost:5000/api/HierarchicalStructure/${selectedEmployee.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Employee deleted successfully');
        setIsModalOpen(false);
        
        // Debounce and refresh the data
        setTimeout(async () => {
          await fetchEmployees();
        }, 300);  // Delay after deletion
      } else {
        const error = await res.text();
        alert(`Failed to delete employee: ${error}`);
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('An error occurred while deleting the employee.');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="employee-container">
      <Tree
        key={JSON.stringify(employees)}  // Force re-render on data change
        data={treeData}
        renderCustomNodeElement={(rd3tProps) => (
          <g onClick={() => handleNodeClick(rd3tProps.nodeDatum)} style={{ cursor: 'pointer' }}>
            <EmployeeCard
              employee={rd3tProps.nodeDatum}
              nodeDatum={rd3tProps.nodeDatum}
            />
          </g>
        )}
        orientation="vertical"
        pathFunc="step"
        zoom={0.8}
        translate={translate}
        nodeSize={{ x: 150, y: 100 }}
        scaleExtent={{ min: 0.5, max: 2 }}
        // Disable dragging by removing or not using any drag functionality
        collapsible={false}  // This also helps keep it static
        draggable={false}  // Disable the drag functionality
      />

{isModalOpen && selectedEmployee && (
  <Modal
    title={`Employee: ${selectedEmployee.name}`}
    onClose={() => setIsModalOpen(false)}
  >
    <p><strong>ID:</strong> {selectedEmployee.id}</p>
    {selectedEmployee.title && <p><strong>Title:</strong> {selectedEmployee.title}</p>}

    <div className="modal-buttons">
      <button className="modal-back-button" onClick={() => setIsModalOpen(false)}>
        ← Back
      </button>
      {(!selectedEmployee.children || selectedEmployee.children.length === 0) && (
        <button className="modal-delete-button" onClick={handleDeleteEmployee}>
          🗑 Delete Employee
        </button>
      )}
    </div>
  </Modal>
)}

    </div>
  );
};

export default HierarchicalStructure;
