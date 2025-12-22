import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, ExternalLink, MapPin } from 'lucide-react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './ManageBranch.css';

const ManageBranch = () => {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const admin = JSON.parse(localStorage.getItem('admin') || 'null');

    useEffect(() => {
        // Auth Guard
        if (!admin) {
            navigate('/');
            return;
        }

        // Fetch all branches from Django API
        axios.get('http://127.0.0.1:8000/api/branches/')
            .then(res => {
                setBranches(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching branches:", err);
                setLoading(false);
            });
    }, [navigate]);

    if (!admin) return null;

    return (
        <div className="dashboard-wrapper">
            {/* 1. Global Sidebar Component */}
            <Sidebar />

            {/* 2. Main Content */}
            <main className="dashboard-main">
                <header className="page-header">
                    <div className="header-left">
                        <div className="breadcrumb">
                            <span onClick={() => navigate('/dashboard')}>Dashboard</span>
                            <span className="separator">/</span>
                            <span className="current">Manage Branch</span>
                        </div>
                        <h2 className="page-title">Branch Management</h2>
                    </div>

                    <button className="add-new-btn">
                        <Plus size={18} />
                        <span>Add New Branch</span>
                    </button>
                </header>

                <div className="table-card">
                    <div className="table-header">
                        <div className="table-search">
                            <Search size={16} />
                            <input type="text" placeholder="Filter branches..." />
                        </div>
                    </div>

                    {loading ? (
                        <div className="table-loader">Loading branch list...</div>
                    ) : (
                        <table className="modern-data-table">
                            <thead>
                                <tr>
                                    <th>Branch Details</th>
                                    <th>Login Username</th>
                                    <th>Status</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {branches.map((branch) => (
                                    <tr key={branch.id}>
                                        <td>
                                            <div className="branch-info">
                                                <div className="branch-icon"><MapPin size={16}/></div>
                                                <span className="branch-name">{branch.branch_name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <code className="username-tag">{branch.branch_name || 'not_set'}</code>
                                        </td>
                                        <td>
                                            <span className={`status-pill ${branch.status === 0 || branch.status === 'Active' ? 'active' : 'inactive'}`}>
                                                {branch.status === 0 || branch.status === 'Active' ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-group">
                                                <button className="btn-icon login" title="Login to Branch">
                                                    <ExternalLink size={16} />
                                                </button>
                                                <button className="btn-icon edit" title="Edit Settings">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button className="btn-icon delete" title="Delete Branch">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ManageBranch;