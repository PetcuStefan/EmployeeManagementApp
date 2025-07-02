import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './Stats.css';

const Stats = () => {
  const [stats, setStats] = useState({
    companiesCount: 0,
    employeesCount: 0,
    totalSalaries: 0,
    companies: [], // For expandable info
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null); // 'employees' | 'salaries' | null

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/statsRoutes/countCompanies', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error('Failed to fetch user stats');
        }

        const data = await res.json();

        setStats({
          companiesCount: data.companiesCount ?? 0,
          employeesCount: data.employeesCount ?? 0,
          totalSalaries: data.totalSalaries ?? 0,
          companies: data.companyBreakdown ?? [], // backend should return this
        });
      } catch (err) {
        setError('Error fetching user stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p className="stats-container">Loading stats...</p>;
  if (error) return <p className="stats-container">{error}</p>;

  // Helper to toggle expanded section
  const toggleSection = (section) => {
    setExpandedSection(prev => (prev === section ? null : section));
  };

  return (
    <div className="stats-container">
      <h1>Stats Dashboard</h1>

      <div className="stat-block">
        <div className="stat-title hoverable">
          <div className='label-value'>
            <span className="label">Total Companies: </span>
            <span className="value">{stats.companiesCount}</span>
          </div>
        </div>
      </div>

      <div className="stat-block" onClick={() => toggleSection('employees')}>
        <div className="stat-title hoverable">
          <div className="label-value">
            <span className="label">Total Employees: </span>
            <span className="value">{stats.employeesCount}</span>
          </div>
          <span className={`arrow-icon ${expandedSection === 'employees' ? 'open' : ''}`}>
            <ChevronDown />
          </span>
        </div>
        {expandedSection === 'employees' && (
          <div className="stat-details">
            {stats.companies.map((c, i) => (
              <div key={i} className="company-item">
                <strong>{c.name}</strong>: {c.employeesCount} employee(s)
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="stat-block" onClick={() => toggleSection('salaries')}>
        <div className="stat-title hoverable">
          <div className="label-value">
            <span className="label">Total Salaries: </span>
            <span className="value">{stats.totalSalaries.toLocaleString()}</span>
          </div>
          <span className={`arrow-icon ${expandedSection === 'salaries' ? 'open' : ''}`}>
            <ChevronDown />
          </span>
        </div>
        {expandedSection === 'salaries' && (
          <div className="stat-details">
            {stats.companies.map((c, i) => (
              <div key={i} className="company-item">
                <strong>{c.name}</strong>: {c.totalSalaries.toLocaleString()}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Stats;
