import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Info, 
    ChevronRight, 
    Circle, 
    GraduationCap // Added for Course & Batch
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isCollapsed }) => {
    const [leadsOpen, setLeadsOpen] = useState(false);
    const [courseBatchOpen, setCourseBatchOpen] = useState(false); // New state for Course & Batch

    return (
        <aside className={`sidebar-aside ${isCollapsed ? 'collapsed' : ''}`}>
            {/* Logo Section */}
            <div className="sidebar-brand">
                <div className="brand-logo-box">O</div>
                <span className="brand-name-text">Operating Media</span>
            </div>

            <div className="sidebar-menu-wrapper">
                <p className="nav-section-label">Navigation</p>

                {/* Dashboard Item */}
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                    <div className="link-content">
                        <LayoutDashboard size={20} className="nav-icon" />
                        <span className="link-text">Dashboards</span>
                    </div>
                </NavLink>

                {/* Leads Dropdown */}
                <div className={`nav-dropdown-group ${leadsOpen ? 'is-open' : ''}`}>
                    <div className="nav-link trigger" onClick={() => !isCollapsed && setLeadsOpen(!leadsOpen)}>
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
                        <NavLink to="/leads-create" className="sub-link">
                            <Circle size={6} fill="currentColor" className="sub-dot" />
                            <span className="link-text">Leads Create</span>
                        </NavLink>
                    </div>
                </div>

                {/* --- NEW: Course & Batch Dropdown --- */}
                <div className={`nav-dropdown-group ${courseBatchOpen ? 'is-open' : ''}`}>
                    <div className="nav-link trigger" onClick={() => !isCollapsed && setCourseBatchOpen(!courseBatchOpen)}>
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

            </div>
        </aside>
    );
};

export default Sidebar;