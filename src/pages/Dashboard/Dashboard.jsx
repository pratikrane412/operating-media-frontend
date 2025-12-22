import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Users, MessageSquare, PlayCircle, CheckCircle, Search } from 'lucide-react';
import Sidebar from '../../components/Sidebar/Sidebar'; // Ensure this path is correct
import './Dashboard.css';

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const admin = JSON.parse(localStorage.getItem('admin') || 'null');

    useEffect(() => {
        // Security: If not logged in, go to login page
        if (!admin) {
            navigate('/');
            return;
        }

        // Fetch data from Django Backend
        axios.get('http://127.0.0.1:8000/api/dashboard-stats/')
            .then(res => {
                setData(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch Error:", err);
                setLoading(false);
            });
    }, [navigate]);

    // Helper to pick the right icon for the card
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
    if (loading) return <div className="loading-state">Synchronizing with Database...</div>;

    return (
        <div className="dashboard-wrapper">
            {/* 1. Integrated Sidebar Component */}
            <Sidebar />

            {/* 2. Main Content Area */}
            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div className="dashboard-search">
                        <Search size={18} color="#94a3b8" />
                        <input type="text" placeholder="Search branch statistics..." />
                    </div>
                </header>

                <div className="dashboard-body">
                    <div className="status-banner">
                        <CheckCircle size={18} />
                        <span>Connected to Live SQL Database. Logged in as <strong>{admin.name}</strong></span>
                    </div>

                    {/* Loop through Branches (Andheri, Borivali, etc.) */}
                    {data.map((branch, index) => (
                        <div key={index} className="branch-container">
                            <h3 className="branch-label">{branch.branch_name}</h3>
                            <div className="stats-cards-grid">
                                
                                {/* Loop through the 4 stats for this branch */}
                                {branch.stats.map((stat, sIndex) => (
                                    <div key={sIndex} className={`modern-stat-card ${stat.type}`}>
                                        <div className="card-top">
                                            <div className="icon-box">{getIcon(stat.type)}</div>
                                            <span className="label-text">{stat.label}</span>
                                        </div>
                                        <div className="card-bottom">
                                            <div className="big-number">{stat.value}</div>
                                            <div className="monthly-update">
                                                {stat.monthly} New this month
                                            </div>
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