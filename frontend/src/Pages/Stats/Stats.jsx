import React, { useEffect, useState } from 'react';
import './Stats.css';

const Stats = () => {
  const [stats, setStats] = useState({ companiesCount: 0, employeesCount: 0, totalSalaries: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      console.log('[Stats] Starting fetchStats...');
      try {
        const res = await fetch('http://localhost:5000/api/statsRoutes/countCompanies', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        console.log('[Stats] Response status:', res.status);

        if (!res.ok) {
          const errorText = await res.text();
          console.error('[Stats] Response error text:', errorText);
          throw new Error('Failed to fetch user stats');
        }

        const data = await res.json();
        console.log('[Stats] Response data:', data);

        setStats({
          companiesCount: data.companiesCount ?? 0,
          employeesCount: data.employeesCount ?? 0,
          totalSalaries: data.totalSalaries ?? 0,
        });
      } catch (err) {
        console.error('[Stats] Fetch error:', err);
        setError('Error fetching user stats');
      } finally {
        setLoading(false);
        console.log('[Stats] Fetch complete, loading set to false');
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <p className="stats-container">Loading stats...</p>;
  }

  if (error) {
    return <p className="stats-container">{error}</p>;
  }

  return (
    <div className="stats-container">
      <h1>Stats File</h1>
      <p>Number of companies: {stats.companiesCount}</p>
      <p>Number of employees: {stats.employeesCount}</p>
      <p>Total salaries: {stats.totalSalaries.toLocaleString()}</p>
    </div>
  );
};

export default Stats;
