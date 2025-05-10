import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from "../../Components/Modal/Modal";
import './CompanyDetails.css';

const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [departmentName, setDepartmentName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [expandedDepartments, setExpandedDepartments] = useState({});
  const [employeeName, setEmployeeName] = useState('');
  const [salary, setSalary] = useState('');
  const [hireDate, setHireDate] = useState('');
  const [supervisorId, setSupervisorId] = useState('');
  const [submittingEmployee, setSubmittingEmployee] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState(null);

  const fetchCompanyDetails = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/CompanyDetails/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch company details');
      const data = await res.json();
      setCompany(data);
    } catch (err) {
      console.error(err);
      setError('Error fetching company details');
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentClick = (departmentId) => {
    setExpandedDepartments((prev) => {
      const isExpanded = prev[departmentId]?.expanded;

      return {
        ...prev,
        [departmentId]: {
          ...prev[departmentId],
          expanded: !isExpanded,
        },
      };
    });
  };

  useEffect(() => {
    fetchCompanyDetails();
  }, [id]);

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (!departmentName.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/CompanyDetails/${id}/addDepartment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: departmentName }),
      });

      if (!res.ok) throw new Error('Failed to add department');

      setDepartmentName('');
      setShowForm(false);
      fetchCompanyDetails();
    } catch (err) {
      console.error(err);
      alert('Failed to add department');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCompany = async () => {
    if (window.confirm('Are you sure you want to delete this company? This action is permanent.')) {
      try {
        const res = await fetch(`http://localhost:5000/api/CompanyDetails/DeleteCompany/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (!res.ok) throw new Error('Failed to delete company');

        alert('Company deleted successfully');
        navigate('/companies');
      } catch (err) {
        console.error(err);
        alert('Failed to delete company');
      }
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!employeeName.trim() || !hireDate) {
      return alert("Please provide both name and hire date.");
    }
  
    if (currentDepartment.Employees?.length > 0) {
      if (!supervisorId.trim()) {
        return alert("Supervisor ID is required for departments that already have employees.");
      }
      const supervisorExists = currentDepartment.Employees.some(
        (emp) => emp.employee_id === Number(supervisorId)
      );
      if (!supervisorExists) {
        return alert("Supervisor ID must belong to an existing employee in this department.");
      }
    }
  
    setSubmittingEmployee(true);
  
    try {
      const payload = {
        departmentId: currentDepartment.department_id,
        name: employeeName,
        salary: salary,
        hire_date: hireDate,
        supervisor_id: currentDepartment.Employees?.length > 0 ? supervisorId : null,
      };
  
      const res = await fetch(`http://localhost:5000/api/CompanyDetails/${id}/addEmployee`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to add employee');
      }
  
      setEmployeeName('');
      setSalary('');
      setHireDate('');
      setSupervisorId('');
      setCurrentDepartment(null);
      fetchCompanyDetails(); // Refresh list
    } catch (err) {
      console.error(err);
      alert(err.message || 'Error adding employee');
    } finally {
      setSubmittingEmployee(false);
    }
  };
  

  const handleDeleteDepartment = async (departmentId) => {
    if (window.confirm('Are you sure you want to delete this department? This action is permanent.')) {
      try {
        const res = await fetch(`http://localhost:5000/api/CompanyDetails/${id}/deleteDepartment`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ departmentId }), // ✅ Send departmentId in body
        });
  
        if (!res.ok) {
          throw new Error('Failed to delete department');
        }

        alert('Department deleted successfully');
        fetchCompanyDetails();
      } catch (err) {
        console.error(err);
        alert('Error deleting department');
      }
    }
  };
  

  if (loading) return <p>Loading company details...</p>;
  if (error) return <p>{error}</p>;
  if (!company) return <p>Company not found</p>;

  return (
    <div className="company-details-container">
      <h1>{company.name}</h1>
      <p><strong>Start Date:</strong> {new Date(company.start_date).toLocaleDateString()}</p>
      <p><strong>Created At:</strong> {new Date(company.createdAt).toLocaleString()}</p>
      <p><strong>Google ID:</strong> {company.googleId}</p>

      <h2>Departments</h2>
      {company.Departments && company.Departments.length > 0 ? (
        <ul className="departments-list">
          {company.Departments.map((dept) => (
            <li key={dept.department_id}>
              <div
                className="department-name"
                onClick={() => handleDepartmentClick(dept.department_id)}
                style={{ cursor: 'pointer', fontWeight: 'bold' }}
              >
                {dept.name}
              </div>
              {expandedDepartments[dept.department_id]?.expanded && (
                <div className="expanded-department">
                  {/* Buttons for Add Employee and Delete Department */}
                  <div className="department-actions">
                    <button onClick={() => setCurrentDepartment(dept)}>
                      Add Employee
                    </button>
                    <button onClick={() => navigate(`/HierarchicalStructure/${dept.department_id}`)}>
                      Manage Employees
                    </button>
                    <button onClick={() => handleDeleteDepartment(dept.department_id)} style={{ backgroundColor: 'red' }}>
                      Delete Department
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No departments found for this company.</p>
      )}

      {/* Modal for adding employee */}
      {currentDepartment && (
  <Modal title="Add Employee" onClose={() => setCurrentDepartment(null)}>
    <form onSubmit={handleAddEmployee}>
      <input
        type="text"
        value={employeeName}
        onChange={(e) => setEmployeeName(e.target.value)}
        placeholder="Employee Name"
        required
      />

      {/* Conditionally show Supervisor ID only if employees exist in department */}
      {currentDepartment.Employees?.length > 0 && (
        <input
          type="number"
          value={supervisorId}
          onChange={(e) => setSupervisorId(e.target.value)}
          placeholder="Supervisor ID (required)"
          required
        />
      )}

      <input
        type="number"
        value={salary}
        onChange={(e) => setSalary(e.target.value)}
        placeholder="Salary"
        required
      />
      <input
        type="date"
        value={hireDate}
        onChange={(e) => setHireDate(e.target.value)}
        required
      />
      <div className="modal-buttons">
        <button type="submit" disabled={submittingEmployee}>
          {submittingEmployee ? 'Adding...' : 'Add Employee'}
        </button>
        <button type="button" onClick={() => setCurrentDepartment(null)}>
          Cancel
        </button>
      </div>
    </form>
  </Modal>
)}


{showForm && (
  <Modal title="Add Department" onClose={() => setShowForm(false)}>
    <form onSubmit={handleAddDepartment}>
      <input
        type="text"
        value={departmentName}
        onChange={(e) => setDepartmentName(e.target.value)}
        placeholder="Department Name"
        required
      />
      <div className="modal-buttons">
        <button type="submit" disabled={submitting}>
          {submitting ? 'Adding...' : 'Add'}
        </button>
        <button type="button" onClick={() => setShowForm(false)}>
          Cancel
        </button>
      </div>
    </form>
  </Modal>
)}

      <div className="buttons-container">
        <button onClick={() => setShowForm(true)}>Add Department</button>
        <button onClick={handleDeleteCompany} style={{ backgroundColor: 'red' }}>
          Delete Company
        </button>
      </div>
    </div>
  );
};

export default CompanyDetails;
