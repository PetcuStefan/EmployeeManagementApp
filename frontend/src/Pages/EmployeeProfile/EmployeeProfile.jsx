import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import Modal from '../../Components/Modal/Modal';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import './EmployeeProfile.css';

import SupervisorTimeline from "../../Components/Timeline/Timeline";

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [salaryHistory, setSalaryHistory] = useState([]);
  const [supervisorHistory, setSupervisorHistory] = useState([]);
  const [showChartModal, setShowChartModal] = useState(false);
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
    startDate: '',
    endDate: '',
    graphType: '',
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

  useEffect(() => {
    if (showChartModal && graphFilters.graphType === 'salary') {
      const fetchSalaryHistory = async () => {
        try {
          const { startDate, endDate } = graphFilters;
          const query = `?startDate=${startDate}&endDate=${endDate}`;
          const res = await fetch(`http://localhost:5000/api/employeeProfile/salaryHistory/${employee.employee_id}${query}`);
          const data = await res.json();
          setSalaryHistory(data);
        } catch (err) {
          console.error('Failed to load salary history:', err);
        }
      };
      fetchSalaryHistory();
    }
  }, [showChartModal, graphFilters.graphType, graphFilters.startDate, graphFilters.endDate, employee?.employee_id]);

  useEffect(() => {
    if (showChartModal && graphFilters.graphType === 'supervisor') {
      // Hardcoded supervisor history data for testing
      const hardcodedSupervisorHistory = [
        {
          manager_history_id: 1,
          manager_date: "2022-01-15T00:00:00.000Z",
          manager_id: 101,
          manager: {
            id: 101,
            name: "Sarah Johnson"
          }
        },
        {
          manager_history_id: 2,
          manager_date: "2022-08-01T00:00:00.000Z",
          manager_id: 102,
          manager: {
            id: 102,
            name: "Michael Chen"
          }
        },
        {
          manager_history_id: 3,
          manager_date: "2023-03-15T00:00:00.000Z",
          manager_id: 103,
          manager: {
            id: 103,
            name: "Emily Rodriguez"
          }
        },
        {
          manager_history_id: 4,
          manager_date: "2023-11-01T00:00:00.000Z",
          manager_id: 104,
          manager: {
            id: 104,
            name: "David Kim"
          }
        },
        {
          manager_history_id: 5,
          manager_date: "2024-06-15T00:00:00.000Z",
          manager_id: 105,
          manager: {
            id: 105,
            name: "Lisa Thompson"
          }
        }
      ];
      
      setSupervisorHistory(hardcodedSupervisorHistory);
      
      // Uncomment below to use real API call instead of hardcoded data
      /*
      const fetchSupervisorHistory = async () => {
        try {
          const { startDate, endDate } = graphFilters;
          const query = `?startDate=${startDate}&endDate=${endDate}`;
          const res = await fetch(`Consumer://localhost:5000/api/employeeProfile/supervisorHistory/${employee.employee_id}${query}`);
          const data = await res.json();
          setSupervisorHistory(data);
        } catch (err) {
          console.error('Failed to load supervisor history:', err);
        }
      };
      fetchSupervisorHistory();
      */
    }
  }, [showChartModal, graphFilters.graphType, graphFilters.startDate, graphFilters.endDate, employee?.employee_id]);

  const processedData = salaryHistory.map((entry) => ({
    salary: entry.salary,
    date: entry.salary_date.split('T')[0],
  }));

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
    setShowChartModal(true);
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
      <div className="employee-profile">
        <h2>{employee.name}'s Profile</h2>
        <p><strong>ID:</strong> {employee.employee_id}</p>
        <p><strong>Salary:</strong> {employee.salary || 'N/A'}</p>
        <p><strong>Department:</strong> {employee.department_name || 'N/A'}</p>
        <p><strong>Supervisor:</strong> {employee.manager_name || 'N/A'}</p>
        <p><strong>Hire Date:</strong> {employee.hire_date || 'N/A'}</p>
      </div>

      <div className="top-controls">
        <button onClick={toggleEditOptions}>Edit Profile</button>
        <button onClick={toggleGraphForm}>Make Graph</button>
      </div>

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

      {showGraphForm && (
        <div className="graph-form">
          <div className="button-container">
            <button
              className={`graph-toggle-button ${graphFilters.graphType === 'salary' ? 'active' : ''}`}
              onClick={() => setGraphFilters({ ...graphFilters, graphType: 'salary' })}
            >
              Salary Graph
              {graphFilters.graphType === 'salary' && <Check size={16} className="graph-check-icon" />}
            </button>

            <button
              className={`graph-toggle-button ${graphFilters.graphType === 'supervisor' ? 'active' : ''}`}
              onClick={() => setGraphFilters({ ...graphFilters, graphType: 'supervisor' })}
            >
              Supervisor Timeline
              {graphFilters.graphType === 'supervisor' && <Check size={16} className="graph-check-icon" />}
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

          <div className="show-graph-container">
            <button onClick={handleShowGraph}>Show Graph</button>
          </div>
        </div>
      )}

      {showChangeSupervisorModal && (
        <Modal title={`Change Supervisor for ${employee.name}`} onClose={() => setShowChangeSupervisorModal(false)}>
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
        <Modal title={`Change Salary for ${employee.name}`} onClose={() => setShowChangeSalaryModal(false)}>
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
              <button type="button" onClick={() => setShowChangeSalaryModal(false)}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}

      {showChartModal && (
        <Modal title={`Graph for ${employee.name}`} onClose={() => setShowChartModal(false)}>
          {graphFilters.graphType === 'salary' ? (
            salaryHistory.length > 0 ? (
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={processedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="salary" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p>No salary history data available.</p>
            )
          ) : graphFilters.graphType === 'supervisor' ? (
            <div style={{ width: '100%', minHeight: '800px', padding: '20px' }}>
              <SupervisorTimeline history={supervisorHistory} />
            </div>
          ) : (
            <p>Please select a chart type.</p>
          )}
        </Modal>
      )}
    </div>
  );
};

export default EmployeeProfile;