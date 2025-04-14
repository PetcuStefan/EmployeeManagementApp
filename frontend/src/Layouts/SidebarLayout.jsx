import React from "react";
import Sidebar from "../Components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import "./SidebarLayout.css";

const SidebarLayout = () => {
  return (
    <div className="layout-container">
      <div className="sidebar-wrapper">
        <Sidebar />
      </div>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default SidebarLayout;

