import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Info,
  ChevronRight,
  Circle,
  GraduationCap,
  Users,
  UserCheck,
  ClipboardList, // Ensure this is imported
} from "lucide-react";
import "./Sidebar.css";

const Sidebar = ({ isCollapsed }) => {
  // --- ALL STATES MUST BE DEFINED HERE ---
  const [leadsOpen, setLeadsOpen] = useState(false);
  const [courseBatchOpen, setCourseBatchOpen] = useState(false);
  const [staffOpen, setStaffOpen] = useState(false);
  const [studentsOpen, setStudentsOpen] = useState(false);
  const [admissionOpen, setAdmissionOpen] = useState(false); // ADDED THIS LINE

  return (
    <aside className={`sidebar-aside ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-brand">
        <div className="brand-logo-box">O</div>
        <span className="brand-name-text">Operating Media</span>
      </div>

      <div className="sidebar-menu-wrapper">
        <p className="nav-section-label">Navigation</p>

        {/* Dashboard Item */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <div className="link-content">
            <LayoutDashboard size={20} className="nav-icon" />
            <span className="link-text">Dashboards</span>
          </div>
        </NavLink>

        {/* Leads Dropdown */}
        <div className={`nav-dropdown-group ${leadsOpen ? "is-open" : ""}`}>
          <div
            className="nav-link trigger"
            onClick={() => !isCollapsed && setLeadsOpen(!leadsOpen)}
          >
            <div className="link-content">
              <Info size={20} className="nav-icon" />
              <span className="link-text">Leads</span>
            </div>
            <ChevronRight size={14} className="nav-arrow hide-on-collapse" />
          </div>

          <div className="nav-submenu">
            <NavLink to="/leads-view" className="sub-link">
              <Circle size={6} fill="currentColor" className="sub-dot" />
              <span className="link-text">Leads View</span>
            </NavLink>
          </div>
        </div>

        {/* Course & Batch Dropdown */}
        <div
          className={`nav-dropdown-group ${courseBatchOpen ? "is-open" : ""}`}
        >
          <div
            className="nav-link trigger"
            onClick={() => !isCollapsed && setCourseBatchOpen(!courseBatchOpen)}
          >
            <div className="link-content">
              <GraduationCap size={20} className="nav-icon" />
              <span className="link-text">Course & Batch</span>
            </div>
            <ChevronRight size={14} className="nav-arrow hide-on-collapse" />
          </div>

          <div className="nav-submenu">
            <NavLink to="/manage-batch" className="sub-link">
              <Circle size={6} fill="currentColor" className="sub-dot" />
              <span className="link-text">Manage Batch</span>
            </NavLink>
            <NavLink to="/manage-course" className="sub-link">
              <Circle size={6} fill="currentColor" className="sub-dot" />
              <span className="link-text">Manage Course</span>
            </NavLink>
          </div>
        </div>

        {/* Staff Dropdown */}
        <div className={`nav-dropdown-group ${staffOpen ? "is-open" : ""}`}>
          <div
            className="nav-link trigger"
            onClick={() => !isCollapsed && setStaffOpen(!staffOpen)}
          >
            <div className="link-content">
              <Users size={20} className="nav-icon" />
              <span className="link-text">Staff</span>
            </div>
            <ChevronRight size={14} className="nav-arrow hide-on-collapse" />
          </div>

          <div className="nav-submenu">
            <NavLink to="/manage-staff" className="sub-link">
              <Circle size={6} fill="currentColor" className="sub-dot" />
              <span className="link-text">Manage Staff</span>
            </NavLink>
            <NavLink to="/manage-salary" className="sub-link">
              <Circle size={6} fill="currentColor" className="sub-dot" />
              <span className="link-text">Manage Salary</span>
            </NavLink>
          </div>
        </div>


        {/* Admission Dropdown */}
        <div className={`nav-dropdown-group ${admissionOpen ? "is-open" : ""}`}>
          <div
            className="nav-link trigger"
            onClick={() => !isCollapsed && setAdmissionOpen(!admissionOpen)}
          >
            <div className="link-content">
              <ClipboardList size={20} className="nav-icon" />
              <span className="link-text">Admission</span>
            </div>
            <ChevronRight size={14} className="nav-arrow hide-on-collapse" />
          </div>

          <div className="nav-submenu">
            <NavLink to="/manage-admission" className="sub-link">
              <Circle size={6} fill="currentColor" className="sub-dot" />
              <span className="link-text">Manage Admission</span>
            </NavLink>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
