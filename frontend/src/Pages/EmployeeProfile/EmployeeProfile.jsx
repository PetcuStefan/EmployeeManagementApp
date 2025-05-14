import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {Check} from 'lucide-react';
import './EmployeeProfile.css';

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showEditOptions, setShowEditOptions] = useState(false);
  const [showGraphForm, setShowGraphForm] = useState(false);
  const [graphFilters, setGraphFilters] = useState({
    employeeId: '',
    departmentId: '',
    companyId: '',
    timeUnit: 'year',
    startDate: '', // Start date
    endDate: '',   // End date
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/employeeProfile/${id}`);
        const data = await res.json();
        setEmployee(data);

        // Set default start date (hire_date) and end date (today)
        const today = new Date().toISOString().split('T')[0];  // Get today's date in YYYY-MM-DD format
        const hireDate = data.hire_date.split('T')[0];  // Extract the hire date from employee data (assuming it's in 'YYYY-MM-DD' format)
        
        setGraphFilters((prev) => ({
          ...prev,
          startDate: hireDate || today,  // Default to hire_date or today's date if not available
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

    // If the date field is cleared, reset it to the default value
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
    setShowEditOptions((prev) => !prev);
    setShowGraphForm(false);
  };

  const toggleGraphForm = () => {
    setShowGraphForm((prev) => !prev);
    setShowEditOptions(false);
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

      {/* Control buttons OUTSIDE profile box */}
      <div className="top-controls">
        <button onClick={toggleEditOptions}>Edit Profile</button>
        <button onClick={toggleGraphForm}>Make Graph</button>
      </div>

      {/* Dropdown Options */}
      {showEditOptions && (
        <div className="edit-dropdown">
          <button onClick={() => navigate(`/changeSalary/${employee.employee_id}`)}>Change Salary</button>

          {employee.manager_id && employee.manager_name && (
            <>
              <button onClick={() => navigate(`/changeSupervisor/${employee.employee_id}`)}>Change Supervisor</button>
              <button onClick={goToSupervisorProfile}>Go to Supervisor Profile</button>
            </>
          )}
        </div>
      )}

      {/* Graph Form */}
      {showGraphForm && (
        <div className="graph-form">          
          {/* Buttons */}
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


          {/* Date Picker Filters */}
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

          {/* Time Unit Dropdown */}
          <label>
            Time Unit:
            <select name="timeUnit" value={graphFilters.timeUnit} onChange={handleGraphInputChange}>
              <option value="year">Year</option>
              <option value="month">Month</option>
              <option value="day">Day</option>
            </select>
          </label>

          {/* Show Graph Button */}
          <div className="show-graph-container">
            <button onClick={handleShowGraph}>Show Graph</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeProfile;
