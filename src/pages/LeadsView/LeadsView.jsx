import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ChevronLeft, ChevronRight, MoreHorizontal, Eye, FileText } from 'lucide-react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import './LeadsView.css';

const LeadsView = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Pagination & Search States
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchLeads();
    }, [page, pageSize, search]);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://127.0.0.1:8000/api/leads-view/?page=${page}&size=${pageSize}&search=${search}`);
            setLeads(res.data.leads);
            setTotalPages(res.data.total_pages);
            setLoading(false);
        } catch (err) {
            console.error("API Error:", err);
            setLoading(false);
        }
    };

    return (
        <div className={`app-container ${isCollapsed ? 'is-collapsed' : ''}`}>
            <Sidebar isCollapsed={isCollapsed} />
            
            <div className="main-viewport">
                <Navbar onToggle={() => setIsCollapsed(!isCollapsed)} />
                
                <main className="content-scroll-area">
                    <div className="leads-view-card">
                        <div className="leads-header-toolbar">
                            <div className="entries-box">
                                Show 
                                <select value={pageSize} onChange={(e) => {setPageSize(e.target.value); setPage(1);}}>
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                </select>
                                entries
                            </div>

                            <div className="leads-search-box">
                                <Search size={16} />
                                <input 
                                    type="text" 
                                    placeholder="Search by name..." 
                                    value={search}
                                    onChange={(e) => {setSearch(e.target.value); setPage(1);}}
                                />
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="leads-table">
                                <thead>
                                    <tr>
                                        <th width="40"><input type="checkbox" /></th>
                                        <th>CUSTOMER</th>
                                        <th>COURSE</th>
                                        <th>MOBILE</th>
                                        <th>ENQUIRY DATE</th>
                                        <th>FOLLOWUP DATE</th>
                                        <th>NOTES (REMARKS)</th>
                                        <th className="text-center">ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="8" className="loading-msg">Synchronizing data...</td></tr>
                                    ) : (
                                        leads.map((lead) => (
                                            <tr key={lead.id}>
                                                <td><input type="checkbox" /></td>
                                                <td className="lead-user">
                                                    <div className="avatar-initials">{lead.name.charAt(0)}</div>
                                                    <div className="user-name-wrapper">
                                                        <span className="user-full-name">{lead.name}</span>
                                                    </div>
                                                </td>
                                                <td><span className="badge-course">{lead.course}</span></td>
                                                <td className="phone-text">{lead.mobile}</td>
                                                <td>
                                                    <div className="date-stack">
                                                        <span className="main-date">{lead.enquiry_date}</span>
                                                        <span className="source-tag">Ref: {lead.source}</span>
                                                    </div>
                                                </td>
                                                <td><span className="followup-badge">26-Dec-2025</span></td>
                                                <td className="remarks-cell">
                                                    <div className="remark-text">
                                                        <FileText size={12} /> {lead.notes}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="action-row">
                                                        <button className="btn-circle-action"><Eye size={14}/></button>
                                                        <button className="btn-circle-action"><MoreHorizontal size={14}/></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="leads-footer">
                            <span className="page-info">Showing page {page} of {totalPages}</span>
                            <div className="pagination-controls">
                                <button className="p-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>
                                    <ChevronLeft size={16} />
                                </button>
                                <span className="p-current">{page}</span>
                                <button className="p-btn" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default LeadsView;