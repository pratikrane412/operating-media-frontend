import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ChevronLeft, ChevronRight, Eye, MoreHorizontal } from 'lucide-react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import './LeadsView.css';

const LeadsView = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`http://127.0.0.1:8000/api/leads-view/?page=${page}&size=${pageSize}&search=${search}`);
                setLeads(res.data.leads);
                setTotalPages(res.data.total_pages);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchData();
    }, [page, pageSize, search]);

    const getPageNumbers = () => {
        const pages = [];
        let startPage = Math.max(1, page - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);
        for (let i = startPage; i <= endPage; i++) pages.push(i);
        return pages;
    };

    return (
        <div className={`app-container ${isCollapsed ? 'is-collapsed' : ''}`}>
            <Sidebar isCollapsed={isCollapsed} />
            <div className="main-viewport">
                <Navbar onToggle={() => setIsCollapsed(!isCollapsed)} />
                <main className="content-area">
                    
                    <div className="leads-card">
                        <div className="leads-toolbar">
                            <div className="entries-select">
                                Show <select value={pageSize} onChange={(e) => { setPageSize(e.target.value); setPage(1); }}>
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                </select> entries
                            </div>
                            <div className="search-box">
                                <span>Search:</span>
                                <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search name..." />
                            </div>
                        </div>

                        {/* This wrapper is now scrollable */}
                        <div className="table-wrapper">
                            <table className="leads-table">
                                <thead>
                                    <tr>
                                        <th width="40"><input type="checkbox" /></th>
                                        <th>CUSTOMER</th>
                                        <th>COURSE</th>
                                        <th>PHONE</th>
                                        <th>DATE</th>
                                        <th>FOLLOWUP</th>
                                        <th>NOTES</th>
                                        <th className="text-center">ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="8" className="table-loader">Loading leads...</td></tr>
                                    ) : (
                                        leads.map(lead => (
                                            <tr key={lead.id}>
                                                <td><input type="checkbox" /></td>
                                                <td className="user-cell">
                                                    <div className="user-avatar">{lead.name.charAt(0)}</div>
                                                    <span className="user-name">{lead.name}</span>
                                                </td>
                                                <td><span className="course-pill">{lead.course}</span></td>
                                                <td>{lead.mobile}</td>
                                                <td>
                                                    <div className="date-cell">
                                                        <span className="date-text">{lead.enquiry_date}</span>
                                                        <span className="source-text">Source: {lead.source}</span>
                                                    </div>
                                                </td>
                                                <td className="followup-cell">{lead.followup_date}</td>
                                                <td className="notes-cell">{lead.notes}</td>
                                                <td>
                                                    <div className="action-btns">
                                                        <button className="icon-btn"><Eye size={16}/></button>
                                                        <button className="icon-btn"><MoreHorizontal size={16}/></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="table-footer">
                            <span className="showing-text">Showing page {page} of {totalPages}</span>
                            <div className="pagination">
                                <button className="page-nav-btn" disabled={page === 1} onClick={() => setPage(page - 1)}><ChevronLeft size={16}/></button>
                                {getPageNumbers().map(num => (
                                    <button key={num} className={`page-num-btn ${page === num ? 'active' : ''}`} onClick={() => setPage(num)}>{num}</button>
                                ))}
                                <button className="page-nav-btn" disabled={page === totalPages} onClick={() => setPage(page + 1)}><ChevronRight size={16}/></button>
                            </div>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default LeadsView;