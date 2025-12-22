import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Users, MessageSquare, PlayCircle, CheckCircle, Search, LogOut, LayoutDashboard, MapPin } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const admin = JSON.parse(localStorage.getItem('admin') || 'null');

    useEffect(() => {
        // Auth Check
        if (!admin) {
            navigate('/');
            return;
        }

        axios.get('http://127.0.0.1:8000/api/dashboard-stats/')
            .then(res => {
                setData(res.data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, [navigate]);

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('admin');
        navigate('/');
    };

    const getIcon = (type) => {
        switch(type) {
            case 'students': return <Users size={20} />;
            case 'enquiry': return <MessageSquare size={20} />;
            case 'trial': return <PlayCircle size={20} />;
            case 'passout': return <CheckCircle size={20} />;
            default: return <Users size={20} />;
        }
    };

    if (!admin) return null;
    if (loading) return <div className="loading-screen">Loading ERP Data...</div>;

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-logo">
                    OPERATING<span>MEDIA</span>
                </div>
                
                <div className="sidebar-user">
                    <div className="user-avatar">{admin.name?.charAt(0)}</div>
                    <div className="user-info">
                        <span className="user-name">{admin.name}</span>
                        <span className="user-role">Administrator</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <a href="#" className="nav-item active"><LayoutDashboard size={18}/> Dashboard</a>
                    <a href="#" className="nav-item"><MapPin size={18}/> Manage Branch</a>
                    <div className="nav-spacer"></div>
                    <a href="/" className="nav-item logout" onClick={handleLogout}><LogOut size={18}/> Logout</a>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                <header className="main-header">
                    <div className="header-search">
                        <Search size={18} color="#9ca3af" />
                        <input type="text" placeholder="Search branch statistics..." />
                    </div>
                </header>

                <div className="main-body">
                    <div className="alert-banner">
                        <CheckCircle size={18} />
                        Welcome back! Data is synced with Live SQL Database.
                    </div>

                    {data.map((branch, index) => (
                        <div key={index} className="branch-group">
                            <h3 className="branch-heading">{branch.branch_name}</h3>
                            <div className="stats-grid">
                                {branch.stats.map((stat, sIndex) => (
                                    <div key={sIndex} className={`stat-card ${stat.type}`}>
                                        <div className="stat-card-top">
                                            <div className="stat-icon">{getIcon(stat.type)}</div>
                                            <span className="stat-title">{stat.label}</span>
                                        </div>
                                        <div className="stat-card-bottom">
                                            <div className="stat-value">{stat.value}</div>
                                            <div className="stat-monthly">{stat.monthly} New this month</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;