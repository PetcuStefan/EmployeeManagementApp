import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './CompanyDetails.css';

const CompanyDetails = () => {
  const { id } = useParams(); // Company ID from URL
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [departmentName, setDepartmentName] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
      fetchCompanyDetails(); // Refresh departments list
    } catch (err) {
      console.error(err);
      alert('Failed to add department');
    } finally {
      setSubmitting(false);
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
            <li key={dept.department_id}>{dept.name}</li>
          ))}
        </ul>
      ) : (
        <p>No departments found for this company.</p>
      )}
  
      <button onClick={() => setShowForm(true)}>Add Department</button>
  
      {/* Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Department</h3>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDetails;
