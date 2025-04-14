import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const handleLogout = () => {
    window.open("http://localhost:5000/auth/logout", "_self");
  };

  return (
    <div className="sidebar slide-in">
      <h2 className="logo">MyApp</h2>
      <nav className="nav-links">
        <Link to="/homepage">Homepage</Link>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
