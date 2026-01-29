import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar as CalendarIcon } from "lucide-react";
import axios from "axios";
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
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

  // 1. DEFINE STATIC VARIABLES FIRST
  const user = JSON.parse(localStorage.getItem("admin") || "{}");
  const isBranchUser = !!user.branch_id;

  // 2. NOW DEFINE ALL STATES
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [totalLeads, setTotalLeads] = useState(0);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState({
    branches: [],
    sources: [],
    counsellors: [],
    tags: [],
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [activeMenuId, setActiveMenuId] = useState(null);

  const [filters, setFilters] = useState({
    branch: "",
    source: "",
    counsellor: user.role === "staff" ? user.name : "",
    tags: "",
    fromDate: "",
    toDate: "",
  });

  const [sortField, setSortField] = useState("followup_date");
  const [sortOrder, setSortOrder] = useState("desc");

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

  const getTagColorClass = (val) => {
    if (!val) return "";
    const t = val.toLowerCase();
    if (t === "enrolled") return "tag-green";
    if (t === "hot lead") return "tag-cyan";
    if (["interested", "call back"].includes(t)) return "tag-yellow";
    if (
      [
        "invalid",
        "looking for job",
        "not interested",
        "placement inquiry",
      ].includes(t)
    )
      return "tag-red";
    if (
      [
        "will visit",
        "visited",
        "counseling done",
        "online counseling",
      ].includes(t)
    )
      return "tag-orange";
    if (t === "future admission") return "tag-purple";
    return "";
  };

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === "—" || dateStr === "No Date") return "—";

    const [day, month, year] = dateStr.split("/").map(Number);
    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
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
            className={
              type === "source"
                ? "source-pill-item"
                : `tag-pill ${getTagColorClass(item)}`
            }
          >
            {item}
          </span>
        ))}
      </div>
    );
  };

  // IMPROVED NOTES RENDERING - HORIZONTAL LAYOUT
  const renderNotes = (notesString) => {
    if (!notesString || notesString === "—" || notesString.trim() === "") {
      return <span className="no-notes-text">—</span>;
    }

    // Enhanced date regex to match dates in format: DD/MM/YYYY or D/M/YYYY
    const dateRegex = /(\d{1,2}\/\d{1,2}\/\d{2,4})/g;

    // Split by dates while keeping the dates
    const parts = notesString.split(dateRegex).filter((text) => text.trim());

    if (parts.length === 0) {
      return <span className="no-notes-text">—</span>;
    }

    // Group notes by date
    const noteEntries = [];
    let currentDate = null;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i].trim();

      // Check if this part is a date
      if (dateRegex.test(part)) {
        dateRegex.lastIndex = 0; // Reset regex
        currentDate = part;
      } else if (currentDate && part) {
        // Clean up the note text
        let noteText = part
          .replace(/^[-–—,\s]+/, "") // Remove leading dashes, commas, spaces
          .replace(/[-–—,\s]+$/, "") // Remove trailing dashes, commas, spaces
          .trim();

        if (noteText) {
          noteEntries.push({
            date: currentDate,
            text: noteText,
          });
        }
      }
    }

    // If no proper date-note pairs found, show the original text
    if (noteEntries.length === 0) {
      return <div className="note-entry-simple">{notesString}</div>;
    }

    // Sort entries by date (most recent first)
    noteEntries.sort((a, b) => {
      const [d1, m1, y1] = a.date.split("/").map(Number);
      const [d2, m2, y2] = b.date.split("/").map(Number);
      const date1 = new Date(y1, m1 - 1, d1);
      const date2 = new Date(y2, m2 - 1, d2);
      return date2 - date1;
    });

    // Show only the last 3 entries
    const recentEntries = noteEntries.slice(0, 3);

    // Format date to "28 Jan 2026" style
    const formatNoteDate = (dateStr) => {
      const [day, month, year] = dateStr.split("/").map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    };

    return (
      <div className="notes-timeline">
        {recentEntries.map((entry, index) => (
          <div key={index} className="note-entry-horizontal">
            <span className="note-bullet-icon">○</span>
            <span className="note-date-horizontal">
              {formatNoteDate(entry.date)}
            </span>
            <span className="note-text-horizontal">{entry.text}</span>
          </div>
        ))}
      </div>
    );
  };

  // --- SORTING FUNCTIONS ---
  const parseDate = (dateStr) => {
    if (!dateStr || dateStr === "—" || dateStr === "No Date")
      return new Date(0);
    const parts = dateStr.split("/");
    return new Date(parts[2], parts[1] - 1, parts[0]);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const getSortedLeads = () => {
    if (!leads || leads.length === 0) return [];
    return [...leads].sort((a, b) => {
      let aValue, bValue;
      if (sortField === "enquiry_date" || sortField === "followup_date") {
        aValue = parseDate(a[sortField]);
        bValue = parseDate(b[sortField]);
      } else if (sortField === "name") {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      } else {
        aValue = a[sortField] || "";
        bValue = b[sortField] || "";
      }
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  };

  // --- LOGIC ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target))
        setActiveMenuId(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    axios
      .get("https://operating-media-backend.onrender.com/api/leads/create/")
      .then((res) => {
        setOptions({
          branches: res.data.branches,
          sources: res.data.sources,
          counsellors: res.data.counsellors,
          tags: res.data.tags,
        });
      })
      .catch((err) => console.error(err));
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`https://operating-media-backend.onrender.com/api/leads-view/`, {
        params: {
          page,
          size: pageSize,
          search,
          branch_id: isBranchUser ? user.branch_id : undefined,
          branch: isBranchUser ? "" : filters.branch,
          source: filters.source,
          counsellor: filters.counsellor,
          tags: filters.tags,
          from: filters.fromDate,
          to: filters.toDate,
        },
      });
      setLeads(res.data.leads);
      setTotalPages(res.data.total_pages);
      setTotalLeads(res.data.total_count || 0);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [
    page,
    pageSize,
    filters.branch,
    filters.source,
    filters.counsellor,
    filters.tags,
  ]);

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setPage(1);
      fetchData();
    }, 500);
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [search]);

  const handleDeleteLead = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(`https://operating-media-backend.onrender.com/api/leads/${id}/delete/`);
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

  const handleRowClick = (leadId, event) => {
    if (
      event.target.closest(".action-btns-sm") ||
      event.target.closest(".action-dropdown")
    )
      return;
    handleOpenDrawer(leadId);
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
                  <label>Branch</label>
                  <select
                    value={filters.branch}
                    onChange={(e) =>
                      setFilters({ ...filters, branch: e.target.value })
                    }
                  >
                    <option value="">All</option>
                    {options.branches.map((b, i) => (
                      <option key={i} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="filter-group">
                <label>Source</label>
                <select
                  value={filters.source}
                  onChange={(e) =>
                    setFilters({ ...filters, source: e.target.value })
                  }
                >
                  <option value="">All</option>
                  {options.sources.map((s, i) => (
                    <option key={i} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <label>Counsellor</label>
                <select
                  value={filters.counsellor}
                  onChange={(e) =>
                    setFilters({ ...filters, counsellor: e.target.value })
                  }
                >
                  <option value="">All</option>
                  {options.counsellors?.map((c, i) => (
                    <option key={i} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <label>Tags</label>
                <select
                  value={filters.tags}
                  onChange={(e) =>
                    setFilters({ ...filters, tags: e.target.value })
                  }
                >
                  <option value="">All</option>
                  {options.tags?.map((t, i) => (
                    <option key={i} value={t}>
                      {t}
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
              <div className="filter-actions-inline">
                <button
                  className="btn-reset"
                  onClick={() => {
                    setFilters({
                      branch: "",
                      source: "",
                      counsellor: user.role === "staff" ? user.name : "",
                      tags: "",
                      fromDate: "",
                      toDate: "",
                    });
                    setSearch("");
                    setPage(1);
                    fetchData();
                  }}
                >
                  <RotateCcw size={14} />
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
                  <option value="100">100</option>
                </select>{" "}
                entries
              </div>
              <div className="search-box">
                <span>Search:</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name or mobile..."
                />
              </div>
            </div>

            <div className="table-wrapper">
              <table className="leads-table">
                <thead>
                  <tr>
                    <th width="80">COURSE</th>
                    <th
                      width="160"
                      className="sortable-header"
                      onClick={() => handleSort("name")}
                    >
                      CUSTOMER{" "}
                      {sortField === "name" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th width="130">PHONE</th>
                    <th
                      width="140"
                      className="sortable-header"
                      onClick={() => handleSort("enquiry_date")}
                    >
                      DATE{" "}
                      {sortField === "enquiry_date" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      width="120"
                      className="sortable-header"
                      onClick={() => handleSort("followup_date")}
                    >
                      FOLLOWUP{" "}
                      {sortField === "followup_date" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th width="120">TAGS</th>
                    <th width="130">COUNSELLOR</th>
                    <th width="400">NOTES</th>
                    <th width="100">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="9" className="table-loader">
                        Syncing data...
                      </td>
                    </tr>
                  ) : (
                    getSortedLeads().map((lead) => (
                      <tr
                        key={lead.id}
                        className="clickable-row"
                        onClick={(e) => handleRowClick(lead.id, e)}
                      >
                        <td>
                          <span className="course-pill-sm">
                            {getCourseShortName(lead.course)}
                          </span>
                        </td>
                        <td className="customer-name-cell">
                          <span>{lead.name}</span>
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
                        <td>
                          <span className="counsellor-text-sm">
                            {lead.counsellor}
                          </span>
                        </td>
                        <td className="notes-cell-sm">
                          {renderNotes(lead.notes)}
                        </td>
                        <td>
                          <div className="action-btns-sm">
                            <button
                              className="icon-btn-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDrawer(lead.id);
                              }}
                            >
                              <Eye size={16} />
                            </button>
                            <div className="action-menu-container">
                              <button
                                className={`icon-btn-sm ${activeMenuId === lead.id ? "active" : ""}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuId(
                                    activeMenuId === lead.id ? null : lead.id,
                                  );
                                }}
                              >
                                <MoreHorizontal size={16} />
                              </button>
                              {activeMenuId === lead.id && (
                                <div className="action-dropdown" ref={menuRef}>
                                  <button
                                    className="drop-item"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(`/leads-edit/${lead.id}`);
                                    }}
                                  >
                                    <Edit3 size={14} /> Edit
                                  </button>
                                  <button
                                    className="drop-item delete"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteLead(lead.id);
                                    }}
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
                Showing page <strong>{page}</strong> of{" "}
                <strong>{totalPages}</strong>
                <span className="count-separator"> | </span>Total Leads:{" "}
                <strong>{totalLeads}</strong>
              </span>
              <div className="pagination">
                <button
                  className="page-nav-btn"
                  disabled={page === 1}
                  onClick={() => setPage(1)}
                >
                  <ChevronsLeft size={16} />
                </button>
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
                <button
                  className="page-nav-btn"
                  disabled={page === totalPages}
                  onClick={() => setPage(totalPages)}
                >
                  <ChevronsRight size={16} />
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
