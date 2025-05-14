import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import Modal from '../../Components/Modal/Modal';
import './EmployeeProfile.css';

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showEditOptions, setShowEditOptions] = useState(false);
  const [showGraphForm, setShowGraphForm] = useState(false);

  const [showChangeSupervisorModal, setShowChangeSupervisorModal] = useState(false);
  const [changeSupervisorId, setChangeSupervisorId] = useState('');

  const [showChangeSalaryModal, setShowChangeSalaryModal] = useState(false);
  const [newSalary, setNewSalary] = useState('');

  const [graphFilters, setGraphFilters] = useState({
    employeeId: '',
    departmentId: '',
    companyId: '',
    timeUnit: 'year',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/employeeProfile/${id}`);
        const data = await res.json();
        setEmployee(data);

        const today = new Date().toISOString().split('T')[0];
        const hireDate = data.hire_date?.split('T')[0] || today;

        setGraphFilters(prev => ({
          ...prev,
          startDate: hireDate,
          endDate: today,
        }));
      } catch (err) {
        console.error('Error fetching employee:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleGraphInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'startDate' && value === '') {
      setGraphFilters(prev => ({
        ...prev,
        startDate: employee?.hire_date.split('T')[0] || new Date().toISOString().split('T')[0],
      }));
    } else if (name === 'endDate' && value === '') {
      setGraphFilters(prev => ({
        ...prev,
        endDate: new Date().toISOString().split('T')[0],
      }));
    } else {
      setGraphFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleShowGraph = () => {
    console.log('📊 Show graph with filters:', graphFilters);
    // TODO: Render graph here
  };

  const goToSupervisorProfile = () => {
    if (employee?.manager_id) {
      navigate(`/employeeProfile/${employee.manager_id}`);
    }
  };

  const toggleEditOptions = () => {
    setShowEditOptions(prev => !prev);
    setShowGraphForm(false);
  };

  const toggleGraphForm = () => {
    setShowGraphForm(prev => !prev);
    setShowEditOptions(false);
  };

  const handleSupervisorChangeSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/HierarchicalStructure/changeSupervisor', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId: employee.employee_id,
          newSupervisorId: changeSupervisorId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to change supervisor');
      }

      alert('Supervisor changed successfully');
      setShowChangeSupervisorModal(false);
      setChangeSupervisorId('');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Error changing supervisor');
    }
  };

  const handleSalaryChangeSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch('http://localhost:5000/api/HierarchicalStructure/changeSalary', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        employeeId: employee.employee_id,
        newSalary: parseFloat(newSalary),
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to change salary');
    }

    alert('Salary changed successfully');
    setShowChangeSalaryModal(false);
    setNewSalary('');
    window.location.reload();
  } catch (err) {
    console.error(err);
    alert(err.message || 'Error changing salary');
  }
  };


  if (loading) return <p>Loading employee profile...</p>;
  if (!employee) return <p>Employee not found.</p>;

  return (
    <div>
      {/* Main profile box */}
      <div className="employee-profile">
        <h2>{employee.name}'s Profile</h2>
        <p><strong>ID:</strong> {employee.employee_id}</p>
        <p><strong>Salary:</strong> {employee.salary || 'N/A'}</p>
        <p><strong>Department:</strong> {employee.department_name || 'N/A'}</p>
        <p><strong>Supervisor:</strong> {employee.manager_name || 'N/A'}</p>
        <p><strong>Hire Date:</strong> {employee.hire_date || 'N/A'}</p>
      </div>

      {/* Control buttons */}
      <div className="top-controls">
        <button onClick={toggleEditOptions}>Edit Profile</button>
        <button onClick={toggleGraphForm}>Make Graph</button>
      </div>

      {/* Dropdown Options */}
      {showEditOptions && (
        <div className="edit-dropdown">
          <button onClick={() => setShowChangeSalaryModal(true)}>Change Salary</button>
          {employee.manager_id && employee.manager_name && (
            <button onClick={goToSupervisorProfile}>Go to Supervisor Profile</button>
          )}
          {employee.manager_id && (
            <button onClick={() => setShowChangeSupervisorModal(true)}>Change Supervisor</button>
          )}
        </div>
      )}

      {/* Graph Form */}
      {showGraphForm && (
        <div className="graph-form">
          <div className="button-container">
            <button
              className={`graph-toggle-button ${graphFilters.graphType === 'salary' ? 'active' : ''}`}
              onClick={() => setGraphFilters({ ...graphFilters, graphType: 'salary' })}
            >
              Salary Graph
              {graphFilters.graphType === 'salary' && (
                <Check size={16} className="graph-check-icon" />
              )}
            </button>

            <button
              className={`graph-toggle-button ${graphFilters.graphType === 'supervisor' ? 'active' : ''}`}
              onClick={() => setGraphFilters({ ...graphFilters, graphType: 'supervisor' })}
            >
              Supervisor Graph
              {graphFilters.graphType === 'supervisor' && (
                <Check size={16} className="graph-check-icon" />
              )}
            </button>
          </div>

          <label>
            Start Date:
            <input
              type="date"
              name="startDate"
              value={graphFilters.startDate}
              onChange={handleGraphInputChange}
            />
          </label>

          <label>
            End Date:
            <input
              type="date"
              name="endDate"
              value={graphFilters.endDate}
              onChange={handleGraphInputChange}
            />
          </label>

          <label>
            Time Unit:
            <select name="timeUnit" value={graphFilters.timeUnit} onChange={handleGraphInputChange}>
              <option value="year">Year</option>
              <option value="month">Month</option>
              <option value="day">Day</option>
            </select>
          </label>

          <div className="show-graph-container">
            <button onClick={handleShowGraph}>Show Graph</button>
          </div>
        </div>
      )}

      {/* Change Supervisor Modal */}
      {showChangeSupervisorModal && (
        <Modal
          title={`Change Supervisor for ${employee.name}`}
          onClose={() => setShowChangeSupervisorModal(false)}
        >
          <form onSubmit={handleSupervisorChangeSubmit}>
            <input
              type="number"
              placeholder="New Supervisor ID"
              value={changeSupervisorId}
              onChange={(e) => setChangeSupervisorId(e.target.value)}
              required
            />
            <div className="modal-buttons">
              <button type="submit">Submit</button>
              <button type="button" onClick={() => setShowChangeSupervisorModal(false)}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}
      {showChangeSalaryModal && (
        <Modal
          title={`Change Salary for ${employee.name}`}
          onClose={() => setShowChangeSalaryModal(false)}
        >
          <form onSubmit={handleSalaryChangeSubmit}>
            <input
              type="number"
              placeholder="New Salary"
              value={newSalary}
              onChange={(e) => setNewSalary(e.target.value)}
              required
              min="0"
              step="0.01"
            />
            <div className="modal-buttons">
              <button type="submit">Submit</button>
              <button type="button" onClick={() => setShowChangeSalaryModal(false)}>
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default EmployeeProfile;
