import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreHorizontal,
  Plus,
  Edit3,
  Trash2,
} from "lucide-react";
import StudentDrawer from "../../components/StudentDrawer/StudentDrawer.jsx";
import StudentViewDrawer from "../../components/StudentViewDrawer/StudentViewDrawer.jsx";
// import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import "./ManageStudent.css";

const ManageStudent = () => {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [viewingStudentId, setViewingStudentId] = useState(null);

  // Pagination & Filter States
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  // Menu State
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("admin") || "{}");

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const branchParam = user.branch_id ? `&branch_id=${user.branch_id}` : "";
      const res = await axios.get(
        `https://operating-media-backend.onrender.com/api/students/manage/?page=${page}&size=${pageSize}&search=${search}${branchParam}`
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

  const handleDeleteStudent = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await axios.delete(
          `https://operating-media-backend.onrender.com/api/students/${id}/delete/`
        );
        setActiveMenuId(null);
        fetchStudents();
      } catch (err) {
        alert("Failed to delete student. Check if they have linked records.");
      }
    }
  };

  // Function to open View Drawer
  const handleViewClick = (id) => {
    setViewingStudentId(id);
    setIsViewDrawerOpen(true);
  };

  const handleEditClick = (id) => {
    setSelectedStudentId(id);
    setIsDrawerOpen(true);
  };

  const formatDate = (dateStr) => {
  if (!dateStr || dateStr === "N/A" || dateStr === "No Date") return dateStr;
  
  // Checks for YYYY-MM-DD format
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }
  
  return dateStr; // Fallback if format is different
};

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
      {/* <Sidebar isCollapsed={isCollapsed} /> */}
      <div className="main-viewport">
        <Navbar onToggle={() => setIsCollapsed(!isCollapsed)} />

        <main className="content-area">
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

            <button
              className="btn-add-primary"
              onClick={() => {
                setSelectedStudentId(null);
                setIsDrawerOpen(true);
              }}
            >
              <Plus size={18} /> ADD NEW STUDENT
            </button>
          </header>

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
                    <th>CUSTOMER</th>
                    <th>LOGIN ID</th>
                    <th>COURSE & BATCH</th>
                    <th>MOBILE</th>
                    <th>JOINING INFO</th>
                    <th>STATUS</th>
                    <th className="text-center">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="table-loading-msg">
                        Synchronizing records...
                      </td>
                    </tr>
                  ) : (
                    students.map((s) => (
                      <tr key={s.id}>
                        <td>
                          <div className="user-profile-cell">
                            <div className="avatar-letter">
                              {s.name.charAt(0)}
                            </div>
                            <span className="user-full-name">{s.name}</span>
                          </div>
                        </td>
                        <td>
                          <span className="id-badge-blue"># {s.login_id}</span>
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
                              {formatDate(s.joining_date)}
                            </span>
                            <span className="source-label-red">
                              Source:{" "}
                              {s.source?.replace(/[\[\]'"]/g, "") || "Direct"}
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
                            <button
                              className="btn-icon-round"
                              onClick={() => handleViewClick(s.id)} // Added onClick
                            >
                              <Eye size={15} />
                            </button>

                            <div className="action-menu-container">
                              <button
                                className={`btn-icon-round ${
                                  activeMenuId === s.id ? "active" : ""
                                }`}
                                onClick={() =>
                                  setActiveMenuId(
                                    activeMenuId === s.id ? null : s.id
                                  )
                                }
                              >
                                <MoreHorizontal size={15} />
                              </button>

                              {activeMenuId === s.id && (
                                <div
                                  className="action-dropdown-list"
                                  ref={menuRef}
                                >
                                  <button
                                    className="drop-item"
                                    onClick={() => handleEditClick(s.id)}
                                  >
                                    <Edit3 size={14} /> Edit Profile
                                  </button>
                                  <button
                                    className="drop-item delete"
                                    onClick={() => handleDeleteStudent(s.id)}
                                  >
                                    <Trash2 size={14} /> Delete Student
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
      <StudentViewDrawer
        isOpen={isViewDrawerOpen}
        onClose={() => {
          setIsViewDrawerOpen(false);
          setViewingStudentId(null);
        }}
        studentId={viewingStudentId}
      />
      <StudentDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedStudentId(null);
        }}
        onUpdate={fetchStudents}
        studentId={selectedStudentId}
      />
    </div>
  );
};

export default ManageStudent;
