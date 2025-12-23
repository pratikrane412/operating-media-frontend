import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Info, ChevronRight, Circle } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isCollapsed }) => {
    const [leadsOpen, setLeadsOpen] = useState(true);

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
                    {!isCollapsed && <ChevronRight size={14} className="hide-on-collapse" style={{opacity: 0}} />}
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
                        <NavLink to="/manage-branch" className="sub-link">
                            <Circle size={6} fill="currentColor" className="sub-dot" />
                            <span className="link-text">Leads View</span>
                        </NavLink>
                        <NavLink to="/leads-create" className="sub-link">
                            <Circle size={6} className="sub-dot" />
                            <span className="link-text">Leads Create</span>
                        </NavLink>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;