import React, { useEffect, useState } from 'react';
import { ChevronDown, ChartPie, FileUp} from 'lucide-react';
import Modal from '../../Components/Modal/Modal';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#aa00ff', '#ff4081'];
import './Stats.css';

const Stats = () => {
  const [stats, setStats] = useState({
    companiesCount: 0,
    employeesCount: 0,
    totalSalaries: 0,
    companies: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [modalSource, setModalSource] = useState(null); // 'employees' or 'salaries'
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportCompanyId, setExportCompanyId] = useState(null);


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
          companies: data.companyBreakdown ?? [],
        });
      } catch (err) {
        setError('Error fetching user stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const toggleSection = (section) => {
    setExpandedSection(prev => (prev === section ? null : section));
  };

  const handleCompanyClick = (company, source) => {
    setSelectedCompany(company);
    setModalSource(source); // Track which section triggered the modal
  };

  const closeModal = () => {
    setSelectedCompany(null);
    setModalSource(null);
  };

  const [departmentData, setDepartmentData] = useState([]);
useEffect(() => {
  const fetchDepartmentData = async () => {
    if (!selectedCompany || !modalSource) return;
    const endpoint = modalSource === 'employees'
      ? `http://localhost:5000/api/statsRoutes/employeesPerDepartment/${selectedCompany.company_id}`
      : `http://localhost:5000/api/statsRoutes/salariesPerDepartment/${selectedCompany.company_id}`;

    try {
      const res = await fetch(endpoint, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const data = await res.json();
      setDepartmentData(data);
    } catch (error) {
      console.error("Error fetching chart data:", error);
      setDepartmentData([]);
    }
  };

  fetchDepartmentData();
}, [selectedCompany, modalSource]);

  if (loading) return <p className="stats-container">Loading stats...</p>;
  if (error) return <p className="stats-container">{error}</p>;

  const handleExport = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/statsRoutes/export', {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ companyId: exportCompanyId }),
});

    if (!response.ok) {
      throw new Error('Failed to export Excel');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'employees.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('❌ Error exporting Excel:', error);
    alert('Failed to export employees data.');
  }
};

  return (
    <div className="stats-container">
      <h1>Stats Dashboard</h1>

      <div className="stat-block">
        <div className="stat-title hoverable">
          <div className="label-value">
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
              <div
                key={i}
                className="company-item"
                onClick={() => handleCompanyClick(c, 'employees')}
              >
                <span><strong>{c.name}</strong>: {c.employeesCount} employee(s)</span>
                <ChartPie className="hover-icon" size={18} />
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
              <div
                key={i}
                className="company-item"
                onClick={() => handleCompanyClick(c, 'salaries')}
              >
                <span><strong>{c.name}</strong>: {c.totalSalaries.toLocaleString()}</span>
                <ChartPie className="hover-icon" size={18} />
              </div>
            ))}
          </div>
        )}
      </div>

{/* Conditional Modal */}
{selectedCompany && modalSource && (
  <Modal
    isOpen={true}
    onClose={closeModal}
    title={selectedCompany.name}
  >
    <p><strong>{modalSource === 'employees' ? 'Employees' : 'Total Salaries'} by Department:</strong></p>
    {departmentData.length > 0 ? (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={departmentData}
            dataKey="value"
            nameKey="department"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {departmentData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    ) : (
      <p>No data available for this company.</p>
    )}
  </Modal>
)}

<div className="export-button-wrapper">
  <button className="export-button" onClick={() => setExportModalOpen(true)}>
    <span className="export-button-content">
      <FileUp className="export-icon" />
      Export as Excel
    </span>
  </button>
</div>

{exportModalOpen && (
  <Modal
    isOpen={true}
    onClose={() => {
      setExportModalOpen(false);
      setExportCompanyId(null);
    }}
    title="Select a Company to Export"
  >
    <div>
      <label htmlFor="company-select"><strong>Choose a company:</strong></label>
      <select
        id="company-select"
        value={exportCompanyId ?? ''}
        onChange={(e) => setExportCompanyId(e.target.value)}
        className="company-dropdown"
      >
        <option value="" disabled>Select a company</option>
        {stats.companies.map((c) => (
          <option key={c.company_id} value={c.company_id}>
            {c.name}
          </option>
        ))}
      </select>

      <button
        className="confirm-export-btn"
        onClick={async () => {
          if (!exportCompanyId) {
            alert('Please select a company first.');
            return;
          }

            console.log("📦 Attempting to export company ID:", exportCompanyId);
          try {
            const response = await fetch('http://localhost:5000/api/statsRoutes/export', {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ companyId: exportCompanyId }),
});

    console.log("🟢 Export response status:", response.status);

            if (!response.ok) throw new Error('Failed to export company data.');

            const blob = await response.blob();
                console.log("📄 Received Excel blob:", blob);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'employees_by_company.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            setExportModalOpen(false);
            setExportCompanyId(null);
          } catch (err) {
            console.error('Export failed:', err);
            alert('Export failed. Try again.');
          }
        }}
      >
        Export
      </button>
    </div>
  </Modal>
)}

    </div>
  );
};

export default Stats;
