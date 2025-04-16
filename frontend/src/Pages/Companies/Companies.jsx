import React, { useState } from 'react';

const Companies = ({ userId }) => {
  const [showModal, setShowModal] = useState(false);
  const [companyName, setCompanyName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: companyName,
      user_id: userId,
      created_at: new Date().toISOString()
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
    } catch (err) {
      console.error(err);
      alert('Error adding company');
    }
  };

  return (
    <div>
      <h1>Companies File</h1>
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

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modal: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    minWidth: '300px'
  }
};

export default Companies;
