import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Search,
  Plus,
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
import Navbar from "../../components/Navbar/Navbar";
import LeadCreateDrawer from "../../components/LeadDrawer/LeadCreateDrawer";
import LeadDrawer from "../../components/LeadDrawer/LeadDrawer";
import "./LeadsView.css";

const LeadsView = () => {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // --- ALL STATES DEFINED AT THE TOP ---
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState({ branches: [], sources: [] });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [filters, setFilters] = useState({
    branch: "",
    source: "",
    fromDate: "",
    toDate: "",
  });

  const user = JSON.parse(localStorage.getItem("admin") || "{}");
  const isBranchUser = !!user.branch_id;

  // --- HELPERS ---
  const getCourseShortName = (name) => {
    if (!name || name === "NA") return "NA";
    const n = name.toLowerCase();
    if (n.includes("wordpress")) return "WP";
    if (n.includes("social media")) return "SMM";
    if (n.includes("digital marketing")) return "DM";
    if (n.includes("search engine optimization")) return "SEO";
    if (n.includes("graphic")) return "GD";
    return name
      .split(" ")
      .map((word) => word[0].toUpperCase())
      .join("");
  };

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === "No Date" || dateStr === "N/A") return dateStr;
    const parts = dateStr.split("-");
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return dateStr;
  };

  const renderPills = (dataString, type = "tag") => {
    if (
      !dataString ||
      dataString === "" ||
      dataString === "[]" ||
      dataString === "No Tag"
    )
      return <span className="no-tag-pill">No Tag</span>;

    const items = dataString
      .replace(/[\[\]"']/g, "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    return (
      <div className="pill-stack">
        {items.map((item, index) => (
          <span
            key={index}
            className={type === "source" ? "source-pill-item" : "tag-pill"}
          >
            {item}
          </span>
        ))}
      </div>
    );
  };

  // --- LOGIC ---
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
      .get("https://operating-media-backend.onrender.com/api/leads/create/")
      .then((res) =>
        setOptions({ branches: res.data.branches, sources: res.data.sources })
      )
      .catch((err) => console.error(err));
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://operating-media-backend.onrender.com/api/leads-view/`,
        {
          params: {
            page,
            size: pageSize,
            search,
            branch_id: isBranchUser ? user.branch_id : undefined,
            branch: isBranchUser ? "" : filters.branch,
            source: filters.source,
            from: filters.fromDate,
            to: filters.toDate,
          },
        }
      );
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

  // Dynamic search with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setPage(1);
      fetchData();
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [search]);

  const handleDeleteLead = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(
          `https://operating-media-backend.onrender.com/api/leads/${id}/delete/`
        );
        fetchData();
      } catch (err) {
        alert("Failed to delete lead");
      }
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);
    for (let i = Math.max(1, startPage); i <= endPage; i++) pages.push(i);
    return pages;
  };

  const handleOpenDrawer = (id) => {
    setSelectedLeadId(id);
    setIsDrawerOpen(true);
  };

  return (
    <div className="app-container">
      <div className="main-viewport">
        <Navbar onToggle={() => setIsCollapsed(!isCollapsed)} />
        <main className="content-area">
          <div className="filter-card">
            <div className="filter-header-row">
              <div className="filter-title">
                <Filter size={16} /> LEAD DIRECTORY
              </div>
              <button
                className="btn-add-primary"
                onClick={() => setIsCreateOpen(true)}
              >
                <Plus size={18} /> ADD NEW LEAD
              </button>
            </div>
            <div className="filter-grid">
              {!isBranchUser && (
                <div className="filter-group">
                  <label>Select Branch</label>
                  <select
                    value={filters.branch}
                    onChange={(e) =>
                      setFilters({ ...filters, branch: e.target.value })
                    }
                  >
                    <option value="">All Branch</option>
                    {options.branches.map((b, i) => (
                      <option key={i} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="filter-group">
                <label>Student Source</label>
                <select
                  value={filters.source}
                  onChange={(e) =>
                    setFilters({ ...filters, source: e.target.value })
                  }
                >
                  <option value="">All Sources</option>
                  {options.sources.map((s, i) => (
                    <option key={i} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="filter-group range-group">
                <label>Date Range</label>
                <div className="date-input-container">
                  <input
                    type="date"
                    value={filters.fromDate}
                    onChange={(e) =>
                      setFilters({ ...filters, fromDate: e.target.value })
                    }
                  />
                  <span className="date-sep">to</span>
                  <input
                    type="date"
                    value={filters.toDate}
                    onChange={(e) =>
                      setFilters({ ...filters, toDate: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* BUTTONS MOVED INTO GRID FOR PERFECT BOX ALIGNMENT */}
              <div className="filter-actions-inline">
                <button
                  className="btn-reset"
                  onClick={() => {
                    setFilters({
                      branch: "",
                      source: "",
                      fromDate: "",
                      toDate: "",
                    });
                    setSearch("");
                    setPage(1);
                    fetchData();
                  }}
                >
                  <RotateCcw size={14} /> RESET
                </button>
                <button
                  className="btn-apply"
                  onClick={() => {
                    setPage(1);
                    fetchData();
                  }}
                >
                  <Check size={14} /> APPLY
                </button>
              </div>
            </div>
          </div>

          <div className="leads-card">
            <div className="leads-toolbar">
              <div className="entries-select">
                Show{" "}
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>{" "}
                entries
              </div>
              <div className="search-box">
                <span>Search:</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search student name..."
                />
              </div>
            </div>

            <div className="table-wrapper">
              <table className="leads-table">
                <thead>
                  <tr>
                    <th width="160">CUSTOMER</th>
                    <th width="80">COURSE</th>
                    <th width="130">PHONE</th>
                    <th width="140">DATE</th>
                    <th width="120">FOLLOWUP</th>
                    <th width="120">TAGS</th>
                    <th width="400">NOTES</th>
                    <th width="100">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="table-loader">
                        Syncing data...
                      </td>
                    </tr>
                  ) : (
                    leads.map((lead) => (
                      <tr key={lead.id}>
                        <td className="customer-name-cell">
                          <span>{lead.name}</span>
                        </td>
                        <td>
                          <span className="course-pill-sm">
                            {getCourseShortName(lead.course)}
                          </span>
                        </td>
                        <td>
                          <span className="phone-text-sm">{lead.mobile}</span>
                        </td>
                        <td>
                          <div className="date-cell-sm">
                            <span className="date-text-val">
                              {formatDate(lead.enquiry_date)}
                            </span>
                            {renderPills(lead.source, "source")}
                          </div>
                        </td>
                        <td className="followup-cell-sm">
                          {formatDate(lead.followup_date)}
                        </td>
                        <td>{renderPills(lead.tags, "tag")}</td>
                        <td className="notes-cell-sm">{lead.notes || "—"}</td>
                        <td>
                          <div className="action-btns-sm">
                            <button
                              className="icon-btn-sm"
                              onClick={() => handleOpenDrawer(lead.id)}
                            >
                              <Eye size={16} />
                            </button>
                            <div className="action-menu-container">
                              <button
                                className={`icon-btn-sm ${
                                  activeMenuId === lead.id ? "active" : ""
                                }`}
                                onClick={() =>
                                  setActiveMenuId(
                                    activeMenuId === lead.id ? null : lead.id
                                  )
                                }
                              >
                                <MoreHorizontal size={16} />
                              </button>
                              {activeMenuId === lead.id && (
                                <div className="action-dropdown" ref={menuRef}>
                                  <button
                                    className="drop-item"
                                    onClick={() =>
                                      navigate(`/leads-edit/${lead.id}`)
                                    }
                                  >
                                    <Edit3 size={14} /> Edit
                                  </button>
                                  <button
                                    className="drop-item delete"
                                    onClick={() => handleDeleteLead(lead.id)}
                                  >
                                    <Trash2 size={14} /> Delete
                                  </button>
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
              <span className="showing-text">
                Showing page {page} of {totalPages}
              </span>
              <div className="pagination">
                <button
                  className="page-nav-btn"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft size={16} />
                </button>
                {getPageNumbers().map((num) => (
                  <button
                    key={num}
                    className={`page-num-btn ${page === num ? "active" : ""}`}
                    onClick={() => setPage(num)}
                  >
                    {num}
                  </button>
                ))}
                <button
                  className="page-nav-btn"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
      <LeadCreateDrawer
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onUpdate={fetchData}
      />
      <LeadDrawer
        leadId={selectedLeadId}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onUpdate={fetchData}
      />
    </div>
  );
};

export default LeadsView;
