import React,{useState} from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    window.open("http://localhost:5000/auth/logout", "_self");
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle the sidebar state
  };

  return (
    <div className={`sidebar-wrapper ${isSidebarOpen ? 'expanded' : ''}`}>
      {/* Hamburger Icon (for collapsed state) */}
      <div className="hamburger" onClick={handleSidebarToggle}>
        <div></div>
        <div></div>
        <div></div>
      </div>

      {/* Sidebar content */}
      <div className={`sidebar ${isSidebarOpen ? 'show' : ''}`}>
        <h2 className="logo">MyApp</h2>
        <nav className="nav-links">
          <Link to="/homepage">Homepage</Link>
          <Link to="/companies">My Organizations</Link>
          <Link to="/stats">Stats</Link>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
