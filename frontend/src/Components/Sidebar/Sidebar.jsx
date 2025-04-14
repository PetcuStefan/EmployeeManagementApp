import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    return (
      <div className="sidebar slide-in">
        <h2 className="logo">MyApp</h2>
        <nav className="nav-links">
          <Link to="/homepage">Homepage</Link>
        </nav>
      </div>
    );
  };
  
  export default Sidebar;