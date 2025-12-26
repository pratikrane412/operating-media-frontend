import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreHorizontal,
  Filter,
  RotateCcw,
  Check,
  Trash2,
  Edit3,
} from "lucide-react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import LeadDrawer from "../../components/LeadDrawer/LeadDrawer";
import "./LeadsView.css";

const LeadsView = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState({ branches: [], sources: [] });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    branch: "",
    source: "",
    fromDate: "",
    toDate: "",
  });

  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/leads/create/")
      .then((res) =>
        setOptions({ branches: res.data.branches, sources: res.data.sources })
      )
      .catch((err) => console.error(err));
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/leads-view/`, {
        params: {
          page,
          size: pageSize,
          search,
          branch: filters.branch,
          source: filters.source,
          from: filters.fromDate,
          to: filters.toDate,
        },
      });
      setLeads(res.data.leads);
      setTotalPages(res.data.total_pages);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize]);

  const handleDeleteLead = async (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/leads/${id}/delete/`);
        setActiveMenuId(null);
        fetchData();
      } catch (err) {
        alert("Failed to delete lead");
      }
    }
  };

  // --- HELPER FUNCTION TO RENDER PILLS WITHOUT BRACKETS ---
  const renderPills = (dataString, type = "tag") => {
    if (!dataString || dataString === "" || dataString === "[]") return <span className="no-data-text">N/A</span>;
    
    // Remove brackets, quotes and split by comma
    const items = dataString
      .replace(/[\[\]"']/g, "") 
      .split(",")
      .map(item => item.trim())
      .filter(item => item !== "");

    return (
      <div className="pill-stack">
        {items.map((item, index) => (
          <span key={index} className={type === "source" ? "source-pill-item" : "tag-pill"}>
            {item}
          </span>
        ))}
      </div>
    );
  };

  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);
    for (let i = Math.max(1, startPage); i <= endPage; i++) pages.push(i);
    return pages;
  };

  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleOpenDrawer = (id) => {
    setSelectedLeadId(id);
    setIsDrawerOpen(true);
  };

  return (
    <div className={`app-container ${isCollapsed ? "is-collapsed" : ""}`}>
      <Sidebar isCollapsed={isCollapsed} />
      <div className="main-viewport">
        <Navbar onToggle={() => setIsCollapsed(!isCollapsed)} />
        <main className="content-area">
          <div className="filter-card">
            <div className="filter-header-row">
              <div className="filter-title"><Filter size={16} /> FILTERS</div>
            </div>
            <div className="filter-grid">
              <div className="filter-group">
                <label>Select Branch</label>
                <select value={filters.branch} onChange={(e) => setFilters({ ...filters, branch: e.target.value })}>
                  <option value="">All Branch</option>
                  {options.branches.map((b, i) => <option key={i} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="filter-group">
                <label>Student Source</label>
                <select value={filters.source} onChange={(e) => setFilters({ ...filters, source: e.target.value })}>
                  <option value="">All Sources</option>
                  {options.sources.map((s, i) => <option key={i} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="filter-group range-group">
                <label>Date Range</label>
                <div className="date-input-container">
                  <input type="date" value={filters.fromDate} onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })} />
                  <span className="date-sep">to</span>
                  <input type="date" value={filters.toDate} onChange={(e) => setFilters({ ...filters, toDate: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="filter-footer">
              <button className="btn-reset" onClick={() => { setFilters({ branch: "", source: "", fromDate: "", toDate: "" }); setSearch(""); setPage(1); fetchData(); }}>
                <RotateCcw size={14} /> RESET
              </button>
              <button className="btn-apply" onClick={() => { setPage(1); fetchData(); }}>
                <Check size={14} /> APPLY
              </button>
            </div>
          </div>

          <div className="leads-card">
            <div className="leads-toolbar">
              <div className="entries-select">
                Show <select value={pageSize} onChange={(e) => { setPageSize(e.target.value); setPage(1); }}>
                  <option value="10">10</option>
                  <option value="25">25</option>
                </select> entries
              </div>
              <div className="search-box">
                <span>Search:</span>
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search student name..." onKeyUp={(e) => e.key === "Enter" && fetchData()} />
              </div>
            </div>

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
                    <th>TAGS</th>
                    <th>NOTES</th>
                    <th className="text-center">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="9" className="table-loader">Fetching lead records...</td></tr>
                  ) : (
                    leads.map((lead) => (
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
                            <div className="source-row-stack">
                                <span className="source-label-prefix">Source:</span>
                                {renderPills(lead.source, "source")}
                            </div>
                          </div>
                        </td>
                        <td className="followup-cell">{lead.followup_date}</td>
                        <td>
                          {renderPills(lead.tags, "tag")}
                        </td>
                        <td className="notes-cell">{lead.notes || "No remarks updated"}</td>
                        <td>
                          <div className="action-btns">
                            <button className="icon-btn" onClick={() => handleOpenDrawer(lead.id)}><Eye size={16} /></button>
                            <div className="action-menu-container">
                              <button className={`icon-btn ${activeMenuId === lead.id ? "active" : ""}`} onClick={() => setActiveMenuId(activeMenuId === lead.id ? null : lead.id)}><MoreHorizontal size={16} /></button>
                              {activeMenuId === lead.id && (
                                <div className="action-dropdown" ref={menuRef}>
                                  <button className="drop-item" onClick={() => navigate(`/leads-edit/${lead.id}`)}><Edit3 size={14} /> Edit Lead</button>
                                  <button className="drop-item delete" onClick={() => handleDeleteLead(lead.id)}><Trash2 size={14} /> Delete Lead</button>
                                </div>
                              )}
                            </div>
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
                <button className="page-nav-btn" disabled={page === 1} onClick={() => setPage(page - 1)}><ChevronLeft size={16} /></button>
                {getPageNumbers().map((num) => (
                  <button key={num} className={`page-num-btn ${page === num ? "active" : ""}`} onClick={() => setPage(num)}>{num}</button>
                ))}
                <button className="page-nav-btn" disabled={page === totalPages} onClick={() => setPage(page + 1)}><ChevronRight size={16} /></button>
              </div>
            </div>
          </div>
        </main>
      </div>
      <LeadDrawer leadId={selectedLeadId} isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
};

export default LeadsView;