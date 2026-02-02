import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  MoreHorizontal,
  Edit3,
  Filter,
  RotateCcw,
  Check,
  Calendar as CalendarIcon,
  X,
} from "lucide-react";
import AdmissionDrawer from "../../components/AdmissionDrawer/AdmissionDrawer";
import AdmissionViewDrawer from "../../components/AdmissionViewDrawer/AdmissionViewDrawer";
import Navbar from "../../components/Navbar/Navbar";
import "./ManageAdmission.css";
import { hasPermission } from "../../utils/permissionCheck";

const ManageAdmission = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("admin") || "{}");
  const isBranchUser = !!user.branch_id;

  // --- STATES ---
  const [selectedAdmissionId, setSelectedAdmissionId] = useState(null);
  const [totalAdmissions, setTotalAdmissions] = useState(0);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState("submission_time");
  const [sortOrder, setSortOrder] = useState("desc");

  const [options, setOptions] = useState({
    branches: [],
    counsellors: [],
    courses: [
      "Masters in Digital Marketing",
      "Advanced Diploma in Digital Marketing",
      "Diploma in Digital Marketing",
      "Pay Per Click Course",
      "Social Media Optimization Course",
      "Search Engine Optimization Course",
      "Google Analytics Course (GA4)",
      "WordPress Development Course",
    ],
  });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    branch: "",
    course: "",
    counsellor: user.role === "staff" ? user.name : "",
    fromDate: "",
    toDate: "",
  });

  const [activeMenuId, setActiveMenuId] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);
    for (let i = Math.max(1, startPage); i <= endPage; i++) pages.push(i);
    return pages;
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  useEffect(() => {
    axios
      .get("https://operating-media-backend.onrender.com/api/leads/create/")
      .then((res) => {
        setOptions((prev) => ({
          ...prev,
          branches: res.data.branches || [],
          counsellors: res.data.counsellors || [],
        }));
      })
      .catch((err) => console.error("Options error:", err));
  }, []);

  const fetchAdmissions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://operating-media-backend.onrender.com/api/admissions/manage/`,
        {
          params: {
            page,
            size: pageSize,
            search,
            branch_id: user.branch_id,
            branch: filters.branch,
            course: filters.course,
            counsellor: filters.counsellor,
            from: filters.fromDate,
            to: filters.toDate,
            sort_field: sortField,
            sort_order: sortOrder,
          },
        },
      );
      setAdmissions(res.data.admissions);
      setTotalPages(res.data.total_pages);
      setTotalAdmissions(res.data.total_count || 0);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, [
    page,
    pageSize,
    filters.branch,
    filters.course,
    filters.counsellor,
    filters.fromDate, // ADDED
    filters.toDate, // ADDED
    search, // ADDED
    sortField,
    sortOrder,
  ]);

  const handleRowClick = (id, event) => {
    if (
      event.target.closest(".action-btns-sm") ||
      event.target.closest(".action-dropdown")
    )
      return;
    setSelectedAdmissionId(id);
    setIsViewDrawerOpen(true);
  };

  const handleDateChange = (update) => {
    setDateRange(update);
    const [start, end] = update;
    setFilters({
      ...filters,
      fromDate: start ? start.toISOString().split("T")[0] : "",
      toDate: end ? end.toISOString().split("T")[0] : "",
    });
  };

  const clearDateRange = () => {
    setDateRange([null, null]);
    setFilters({
      ...filters,
      fromDate: "",
      toDate: "",
    });
  };

  return (
    <div className="app-container">
      <div className="main-viewport">
        <Navbar onToggle={() => setIsCollapsed(!isCollapsed)} />
        <main className="content-area">
          <div className="filter-card">
            <div className="filter-header-row">
              <div className="filter-title">
                <Filter size={16} /> SEARCH FILTERS
              </div>
            </div>
            <div className="filter-grid">
              {!isBranchUser && (
                <div className="filter-group">
                  <label>BRANCH</label>
                  <select
                    value={filters.branch}
                    onChange={(e) =>
                      setFilters({ ...filters, branch: e.target.value })
                    }
                  >
                    <option value="">All Branches</option>
                    {options.branches.map((b, i) => (
                      <option key={i} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="filter-group">
                <label>COURSE</label>
                <select
                  value={filters.course}
                  onChange={(e) =>
                    setFilters({ ...filters, course: e.target.value })
                  }
                >
                  <option value="">All Courses</option>
                  {options.courses.map((c, i) => (
                    <option key={i} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <label>COUNSELLOR</label>
                <select
                  value={filters.counsellor}
                  onChange={(e) =>
                    setFilters({ ...filters, counsellor: e.target.value })
                  }
                >
                  <option value="">All Counsellors</option>
                  {options.counsellors.map((name, i) => (
                    <option key={i} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              {/* DATE PICKER - MATCHING OTHER FILTERS */}
              <div className="filter-group range-group">
                <label>SUBMISSION DATE RANGE</label>
                <div className="date-picker-wrapper">
                  <CalendarIcon size={14} className="calendar-icon" />
                  <DatePicker
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={handleDateChange}
                    placeholderText="Select range (Start - End)"
                    dateFormat="MMM d, yyyy"
                    monthsShown={2}
                    className="date-input-field"
                    wrapperClassName="date-input-wrapper"
                  />
                  {(startDate || endDate) && (
                    <button
                      className="clear-date-btn"
                      onClick={clearDateRange}
                      type="button"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className="filter-actions-inline">
                <button
                  className="btn-reset"
                  title="Reset all filters"
                  onClick={() => {
                    // 1. Reset the calendar UI
                    setDateRange([null, null]);

                    // 2. Reset the search box text
                    setSearch("");

                    // 3. Reset the page to 1
                    setPage(1);

                    // 4. Reset all dropdown and date filters
                    // Because these are now in the useEffect above, the table refreshes INSTANTLY
                    setFilters({
                      branch: "",
                      course: "",
                      counsellor: user.role === "staff" ? user.name : "",
                      fromDate: "",
                      toDate: "",
                    });
                  }}
                >
                  <RotateCcw size={14} />
                </button>
                <button
                  className="btn-apply"
                  onClick={() => {
                    setPage(1);
                    fetchAdmissions();
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
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="200">200</option>
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
                    <th>STUDENT</th>
                    <th
                      className="sortable-header"
                      onClick={() => handleSort("submission_time")}
                      style={{ cursor: "pointer" }}
                    >
                      SUBMISSION DATE
                      {sortField === "submission_time" &&
                        (sortOrder === "asc" ? " ↑" : " ↓")}
                    </th>
                    <th>COUNSELLOR</th>
                    <th>PHONE</th>
                    <th>EMAIL</th>
                    <th>COURSE</th>
                    <th>BRANCH</th>
                    <th width="100" className="text-center">
                      ACTIONS
                    </th>
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
                    admissions.map((item) => (
                      <tr
                        key={item.id}
                        className="clickable-row"
                        onClick={(e) => handleRowClick(item.id, e)}
                      >
                        <td className="customer-name-cell">
                          <span>{item.name}</span>
                        </td>
                        <td className="branch-label-text">
                          {item.submission_time}
                        </td>
                        <td className="phone-num-text">{item.counsellor}</td>
                        <td>
                          <span className="phone-text-sm">{item.phone}</span>
                        </td>
                        <td className="email-text-truncate">{item.email}</td>
                        <td>
                          <span className="course-pill-sm">{item.course}</span>
                        </td>
                        <td>
                          <span className="branch-label-text">
                            {item.branch}
                          </span>
                        </td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <div className="action-btns-sm">
                            <button
                              className="icon-btn-sm"
                              onClick={() => {
                                setSelectedAdmissionId(item.id);
                                setIsViewDrawerOpen(true);
                              }}
                            >
                              <Eye size={16} />
                            </button>
                            <div className="action-menu-container">
                              <button
                                className={`icon-btn-sm ${activeMenuId === item.id ? "active" : ""}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuId(
                                    activeMenuId === item.id ? null : item.id,
                                  );
                                }}
                              >
                                <MoreHorizontal size={16} />
                              </button>
                              {activeMenuId === item.id && (
                                <div className="action-dropdown" ref={menuRef}>
                                  <button
                                    className="drop-item"
                                    onClick={() => {
                                      setSelectedAdmissionId(item.id);
                                      setIsDrawerOpen(true);
                                      setActiveMenuId(null);
                                    }}
                                  >
                                    <Edit3 size={14} /> Edit
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
                <span className="count-separator"> | </span>Total:{" "}
                <strong>{totalAdmissions}</strong>
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
      <AdmissionViewDrawer
        isOpen={isViewDrawerOpen}
        onClose={() => setIsViewDrawerOpen(false)}
        admissionId={selectedAdmissionId}
      />
      <AdmissionDrawer
        isOpen={isDrawerOpen}
        admissionId={selectedAdmissionId}
        onClose={() => setIsDrawerOpen(false)}
        onUpdate={fetchAdmissions}
      />
    </div>
  );
};

export default ManageAdmission;
