import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, MapPin, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    const navigate = useNavigate();
    const admin = JSON.parse(localStorage.getItem('admin') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('admin');
        navigate('/');
    };

    return (
        <aside className="sidebar-container">
            <div className="sidebar-logo">
                OPERATING<span>MEDIA</span>
            </div>

            <div className="sidebar-user-box">
                <div className="user-initial">{admin.name?.charAt(0) || 'A'}</div>
                <div className="user-details">
                    <p>{admin.name || 'Admin'}</p>
                    <span>Administrator</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                    <LayoutDashboard size={18} />
                    Dashboard
                </NavLink>
                
                <NavLink to="/manage-branch" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                    <MapPin size={18} />
                    Manage Branch
                </NavLink>
            </nav>

            <div className="logout-btn-container">
                <button onClick={handleLogout} className="sidebar-logout">
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;