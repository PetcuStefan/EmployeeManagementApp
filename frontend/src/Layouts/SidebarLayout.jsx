import React from 'react';
import Sidebar from '../Components/Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';
import './SidebarLayout.css';

const SidebarLayout = () => {
  return (
    <div className="layout-container">
      <Sidebar />
      <main className="main-content">
        <Outlet /> {/* This is where nested route content renders */}
      </main>
    </div>
  );
};

export default SidebarLayout;
