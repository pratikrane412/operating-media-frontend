import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import { Users, MessageSquare, PlayCircle, CheckCircle, TrendingUp } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("https://operating-media-backend.onrender.com/api/dashboard-stats/")
            .then(res => {
                setStats(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("API Error:", err);
                setLoading(false);
            });
    }, []);

    const StatCard = ({ title, value, monthly, icon: Icon, type }) => (
        <div className={`crm-stat-card ${type}`}>
            <div className="card-header">
                <div className="icon-box"><Icon size={20} /></div>
                <span className="card-label">{title}</span>
            </div>
            <div className="card-body">
                {/* The ?. and || 0 prevents the "undefined" crash */}
                <h3>{(value || 0).toLocaleString()}</h3>
                <p><TrendingUp size={14} /> {(monthly || 0)} new this month</p>
            </div>
        </div>
    );

    return (
        <div className={`app-container ${isCollapsed ? 'is-collapsed' : ''}`}>
            <Sidebar isCollapsed={isCollapsed} />
            
            <div className="main-viewport">
                <Navbar onToggle={() => setIsCollapsed(!isCollapsed)} />
                
                <main className="content-scroll-area">
                    {loading ? (
                        <div className="loader">Syncing with Database...</div>
                    ) : (
                        stats.map((branch, index) => (
                            <div key={index} className="branch-section">
                                <h4 className="branch-title">{branch.branch_name} Overview</h4>
                                <div className="dashboard-grid">
                                    <StatCard 
                                        title="Total Students" 
                                        value={branch.students?.total} 
                                        monthly={branch.students?.monthly} 
                                        icon={Users} 
                                        type="blue" 
                                    />
                                    <StatCard 
                                        title="Total Enquiries" 
                                        value={branch.enquiries?.total} 
                                        monthly={branch.enquiries?.monthly} 
                                        icon={MessageSquare} 
                                        type="orange" 
                                    />
                                    <StatCard 
                                        title="Trial Students" 
                                        value={branch.trials?.total} 
                                        monthly={branch.trials?.monthly} 
                                        icon={PlayCircle} 
                                        type="grey" 
                                    />
                                    <StatCard 
                                        title="Passout Students" 
                                        value={branch.passouts?.total} 
                                        monthly={branch.passouts?.monthly} 
                                        icon={CheckCircle} 
                                        type="green" 
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;