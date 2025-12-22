import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, MessageSquare, PlayCircle, CheckCircle, Search, LogOut, LayoutDashboard, MapPin } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const admin = JSON.parse(localStorage.getItem('admin') || '{}');

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/dashboard-stats/')
            .then(res => { setData(res.data); setLoading(false); })
            .catch(err => console.error(err));
    }, []);

    const getIcon = (type) => {
        switch(type) {
            case 'students': return <Users size={20} />;
            case 'enquiry': return <MessageSquare size={20} />;
            case 'trial': return <PlayCircle size={20} />;
            case 'passout': return <CheckCircle size={20} />;
            default: return <Users size={20} />;
        }
    };

    if (loading) return <div className="loading">Initializing Dashboard...</div>;

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="brand">OPERATING<span>MEDIA</span></div>
                <div className="user-profile">
                    <div className="avatar">{admin.name?.charAt(0)}</div>
                    <div>
                        <p className="user-name">{admin.name}</p>
                        <p className="user-role">Administrator</p>
                    </div>
                </div>
                <nav className="nav-menu">
                    <a href="#" className="active"><LayoutDashboard size={18}/> Dashboard</a>
                    <a href="#"><MapPin size={18}/> Manage Branch</a>
                    <a href="#" className="logout-btn"><LogOut size={18}/> Logout</a>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="top-header">
                    <div className="search-bar">
                        <Search size={18} />
                        <input type="text" placeholder="Search here with Branch Name..." />
                    </div>
                </header>

                <div className="content-inner">
                    <div className="welcome-banner">
                        <CheckCircle size={20} />
                        <span>SUCCESS : Welcome! You are logged in as {admin.name}.</span>
                    </div>

                    {data.map((branch, idx) => (
                        <section key={idx} className="branch-section">
                            <h3 className="section-title">{branch.branch_name}</h3>
                            <div className="stats-grid">
                                {branch.stats.map((stat, sIdx) => (
                                    <div key={sIdx} className={`stat-card-modern ${stat.type}`}>
                                        <div className="card-header">
                                            <span className="icon-wrapper">{getIcon(stat.type)}</span>
                                            <span className="stat-label">{stat.label}</span>
                                        </div>
                                        <div className="card-body">
                                            <h2>{stat.value}</h2>
                                            <p>{stat.monthly} From Current Month</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;