import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreHorizontal,
  Plus,
  GraduationCap,
  Phone,
  Calendar,
  Hash,
} from "lucide-react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import "./ManageStudent.css";

const ManageStudent = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination & Filter States
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const user = JSON.parse(localStorage.getItem("admin") || "{}");

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const branchParam = user.branch_id ? `&branch_id=${user.branch_id}` : "";
      const res = await axios.get(
        `http://127.0.0.1:8000/api/students/manage/?page=${page}&size=${pageSize}&search=${search}${branchParam}`
      );
      setStudents(res.data.students);
      setTotalPages(res.data.total_pages);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, pageSize, user.branch_id]);

  const getPageNumbers = () => {
    const pages = [];
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);
    for (let i = Math.max(1, start); i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className={`app-container ${isCollapsed ? "is-collapsed" : ""}`}>
      <Sidebar isCollapsed={isCollapsed} />
      <div className="main-viewport">
        <Navbar onToggle={() => setIsCollapsed(!isCollapsed)} />

        <main className="content-area">
          {/* --- DURALUX STYLE HEADER --- */}
          <header className="page-header-flex">
            <div className="header-left">
              <div className="breadcrumb-nav">
                <span
                  onClick={() => navigate("/dashboard")}
                  style={{ cursor: "pointer" }}
                >
                  Dashboards
                </span>
                <ChevronRight size={12} className="breadcrumb-sep" />
                <span className="current-page">Manage Student</span>
              </div>
              <h2 className="page-title-bold">Student Directory</h2>
            </div>

            <button className="btn-add-primary">
              <Plus size={18} /> ADD NEW STUDENT
            </button>
          </header>

          {/* --- DATA CARD --- */}
          <div className="data-display-card">
            <div className="data-toolbar">
              <div className="entries-select">
                Show{" "}
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>{" "}
                entries
              </div>
              <div className="search-input-box">
                <Search size={16} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyUp={(e) => e.key === "Enter" && fetchStudents()}
                  placeholder="Search name or ID..."
                />
              </div>
            </div>

            <div className="table-sticky-wrapper">
              <table className="modern-data-table">
                <thead>
                  <tr>
                    <th width="50">
                      <input type="checkbox" />
                    </th>
                    <th width="220">CUSTOMER</th>
                    <th width="150">LOGIN ID</th>
                    <th width="250">COURSE & BATCH</th>
                    <th width="140">MOBILE</th>
                    <th width="180">JOINING INFO</th>
                    <th width="120">STATUS</th>
                    <th className="text-center" width="120">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="table-loading-msg">
                        Synchronizing records...
                      </td>
                    </tr>
                  ) : (
                    students.map((s) => (
                      <tr key={s.id}>
                        <td>
                          <input type="checkbox" />
                        </td>
                        <td className="user-profile-cell">
                          <div className="avatar-letter">
                            {s.name.charAt(0)}
                          </div>
                          <span className="user-full-name">{s.name}</span>
                        </td>
                        <td>
                          <span className="id-badge-blue">{s.login_id}</span>
                        </td>
                        <td>
                          <div className="course-batch-stack">
                            <span className="main-course-pill">{s.course}</span>
                            <span className="sub-batch-text">{s.batch}</span>
                          </div>
                        </td>
                        <td className="phone-num-text">{s.mobile}</td>
                        <td>
                          <div className="date-source-stack">
                            <span className="join-date-text">
                              {s.joining_date}
                            </span>
                            <span className="source-label-red">
                              Source: {s.source}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`status-pill ${
                              s.status === 0 ? "active" : "disabled"
                            }`}
                          >
                            {s.status === 0 ? "Active" : "Disabled"}
                          </span>
                        </td>
                        <td>
                          <div className="action-btn-row">
                            <button className="btn-icon-round">
                              <Eye size={15} />
                            </button>
                            <button className="btn-icon-round">
                              <MoreHorizontal size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="pagination-footer">
              <span className="footer-count">
                Showing page {page} of {totalPages}
              </span>
              <div className="pagination-nav">
                <button
                  className="nav-arrow-btn"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft size={16} />
                </button>
                {getPageNumbers().map((n) => (
                  <button
                    key={n}
                    className={`nav-num-btn ${page === n ? "active" : ""}`}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </button>
                ))}
                <button
                  className="nav-arrow-btn"
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
    </div>
  );
};

export default ManageStudent;
