import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreHorizontal,
  Edit3,
  Trash2,
} from "lucide-react";
// import Sidebar from "../../components/Sidebar/Sidebar";
import AdmissionDrawer from "../../components/AdmissionDrawer/AdmissionDrawer";
import AdmissionViewDrawer from "../../components/AdmissionViewDrawer/AdmissionViewDrawer";
import Navbar from "../../components/Navbar/Navbar";
import "./ManageAdmission.css";
import { hasPermission } from "../../utils/permissionCheck"; // Added import

const ManageAdmission = () => {
  const navigate = useNavigate();
  const [selectedAdmissionId, setSelectedAdmissionId] = useState(null);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);

  const handleViewClick = (id) => {
    setSelectedAdmissionId(id);
    setIsViewDrawerOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchAdmissions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://operating-media-backend.onrender.com/api/admissions/manage/?page=${page}&size=${pageSize}&search=${search}`
      );
      setAdmissions(res.data.admissions);
      setTotalPages(res.data.total_pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, [page, pageSize]);

  const handleEditClick = (id) => {
    setSelectedAdmissionId(id);
    setIsDrawerOpen(true);
    setActiveMenuId(null);
  };

  const handleDeleteAdmission = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this admission record?")
    ) {
      try {
        await axios.delete(
          `https://operating-media-backend.onrender.com/api/admissions/${id}/delete/`
        );
        setActiveMenuId(null);
        fetchAdmissions();
      } catch (err) {
        alert("Failed to delete admission record.");
      }
    }
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
                <span onClick={() => navigate("/dashboard")}>Dashboards</span>
                <ChevronRight size={12} className="breadcrumb-sep" />
                <span className="current-page">Manage Admission</span>
              </div>
              <h2 className="page-title-bold">Admission Directory</h2>
            </div>
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
                  onKeyUp={(e) => e.key === "Enter" && fetchAdmissions()}
                  placeholder="Search name or ID..."
                />
              </div>
            </div>

            <div className="table-sticky-wrapper">
              <table className="modern-data-table">
                <thead>
                  <tr>
                    <th>CUSTOMER</th>
                    <th>PHONE</th>
                    <th>EMAIL</th>
                    <th>COURSE</th>
                    <th>BRANCH</th>
                    <th>EMPLOYED</th>
                    <th className="text-center">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="table-loading-msg">
                        Refreshing records...
                      </td>
                    </tr>
                  ) : (
                    admissions.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="user-profile-cell">
                            {/* <div className="avatar-letter">
                              {item.name?.charAt(0) || "?"}
                            </div> */}
                            <span className="user-full-name">{item.name}</span>
                          </div>
                        </td>
                        <td className="phone-num-text">{item.phone}</td>
                        <td className="email-text-truncate">{item.email}</td>
                        <td>
                          <span className="main-course-pill">
                            {item.course}
                          </span>
                        </td>
                        <td>
                          <span className="branch-label-text">
                            {item.branch}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`status-pill ${
                              item.employed_status === "Yes"
                                ? "active"
                                : "disabled"
                            }`}
                          >
                            {item.employed_status === "Yes" ? "Yes" : "No"}
                          </span>
                        </td>
                        <td>
                          <div className="action-btn-row">
                            {/* View button is visible to anyone who can see this page */}
                            <button
                              className="btn-icon-round"
                              onClick={() => handleViewClick(item.id)}
                            >
                              <Eye size={15} />
                            </button>
                            <div className="action-menu-container">
                              <button
                                className={`btn-icon-round ${
                                  activeMenuId === item.id ? "active" : ""
                                }`}
                                onClick={() =>
                                  setActiveMenuId(
                                    activeMenuId === item.id ? null : item.id
                                  )
                                }
                              >
                                <MoreHorizontal size={15} />
                              </button>
                              {activeMenuId === item.id && (
                                <div
                                  className="action-dropdown-list"
                                  ref={menuRef}
                                >
                                  {/* PERMISSION CHECK: EDIT (make admission) */}
                                  {hasPermission("make admission") && (
                                    <button
                                      className="drop-item"
                                      onClick={() => handleEditClick(item.id)}
                                    >
                                      <Edit3 size={14} /> Edit Request
                                    </button>
                                  )}

                                  {/* PERMISSION CHECK: DELETE (Assuming delete admission or same as make) */}
                                  {hasPermission("make admission") && (
                                    <button
                                      className="drop-item delete"
                                      onClick={() =>
                                        handleDeleteAdmission(item.id)
                                      }
                                    >
                                      <Trash2 size={14} /> Delete Record
                                    </button>
                                  )}
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
      <AdmissionViewDrawer
        isOpen={isViewDrawerOpen}
        onClose={() => {
          setIsViewDrawerOpen(false);
          setSelectedAdmissionId(null);
        }}
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
