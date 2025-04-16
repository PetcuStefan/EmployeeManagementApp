import React, { useState, useEffect } from 'react';

const Companies = ({ userId }) => {
  const [showModal, setShowModal] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch companies when the component mounts
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/companies/myCompanies', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Make sure the session info is included
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
        credentials: 'include', // 👈 this line is crucial!
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Something went wrong');

      alert('Company added!');
      setCompanyName('');
      setShowModal(false);
      // Re-fetch the companies after adding a new one
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

  return (
    <div>
      <h1>Your Companies</h1>

      {loading ? (
        <p>Loading your companies...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div style={companiesStyles.container}>
          {companies.length === 0 ? (
            <p>No companies found. Please add one!</p>
          ) : (
            companies.map((company) => (
              <div key={company.company_id} style={cardStyles.card}>
                <h3>{company.name}</h3>
                <p>Created on: {new Date(company.createdAt).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>
      )}

      <button onClick={() => setShowModal(true)}>Add Company</button>

      {showModal && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modal}>
            <h2>Add Company</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
              <br />
              <button type="submit">Submit</button>
              <button type="button" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Styling for the cards and the layout
const companiesStyles = {
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
    padding: '20px',
  },
};

const cardStyles = {
  card: {
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
};

// Modal styles for adding a company
const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    minWidth: '300px',
  },
};

export default Companies;
