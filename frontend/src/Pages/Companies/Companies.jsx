import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Companies.css';

const Companies = ({ userId }) => {
  const [showModal, setShowModal] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Fetch companies when the component mounts
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/companies/myCompanies', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // include session
        });

        if (!res.ok) throw new Error('Failed to fetch companies');

        const data = await res.json();
        setCompanies(data);
      } catch (err) {
        console.error(err);
        setError('Error fetching companies');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: companyName,
      user_id: userId,
      created_at: new Date().toISOString(),
    };

    try {
      const res = await fetch('http://localhost:5000/api/companies/addCompany', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Something went wrong');

      alert('Company added!');
      setCompanyName('');
      setShowModal(false);

      const newRes = await fetch('http://localhost:5000/api/companies/myCompanies', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const newData = await newRes.json();
      setCompanies(newData);
    } catch (err) {
      console.error(err);
      alert('Error adding company');
    }
  };

  const handleCardClick = (companyId) => {
    navigate(`/company/${companyId}`);
  };

  return (
    <div className={isSidebarOpen ? 'content' : 'sidebar-closed content'}>
      <h1>Your Companies</h1>

      {loading ? (
        <p>Loading your companies...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="companies-container">
          {companies.length === 0 ? (
            <p>No companies found. Please add one!</p>
          ) : (
            companies.map((company) => (
              <div
                key={company.company_id}
                className="company-card"
                onClick={() => handleCardClick(company.company_id)}
                style={{ cursor: 'pointer' }}
              >
                <h3>{company.name}</h3>
                <p>Created on: {new Date(company.createdAt).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>
      )}

      <button onClick={() => setShowModal(true)}>Add Company</button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add Company</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
              <div className="modal-buttons">
                <button type="submit" className="modal-button">
                  Submit
                </button>
                <button
                  type="button"
                  className="modal-button"
                  onClick={() => setShowModal(false)}
                >
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

export default Companies;
