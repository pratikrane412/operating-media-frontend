import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  MoreHorizontal,
  Edit3,
  Trash2,
} from "lucide-react";
import AdmissionDrawer from "../../components/AdmissionDrawer/AdmissionDrawer";
import AdmissionViewDrawer from "../../components/AdmissionViewDrawer/AdmissionViewDrawer";
import Navbar from "../../components/Navbar/Navbar";
import "./ManageAdmission.css";
import { hasPermission } from "../../utils/permissionCheck";

const ManageAdmission = () => {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // --- STATES ---
  const [selectedAdmissionId, setSelectedAdmissionId] = useState(null);
  const [totalAdmissions, setTotalAdmissions] = useState(0);
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

  const handleViewClick = (id) => {
    setSelectedAdmissionId(id);
    setIsViewDrawerOpen(true);
  };

  const handleRowClick = (id, event) => {
    if (
      event.target.closest(".action-btns-sm") ||
      event.target.closest(".action-dropdown")
    )
      return;
    setSelectedAdmissionId(id);
    setIsViewDrawerOpen(true);
  };

  const fetchAdmissions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://operating-media-backend.onrender.com/api/admissions/manage/`,
        {
          params: { page, size: pageSize, search },
        },
      );
      setAdmissions(res.data.admissions);
      setTotalPages(res.data.total_pages);
      setTotalAdmissions(res.data.total_count || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Click outside menu closer
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target))
        setActiveMenuId(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch when page or page size changes
  useEffect(() => {
    fetchAdmissions();
  }, [page, pageSize]);

  // Automatic Search Timeout (Matches Leads View)
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setPage(1);
      fetchAdmissions();
    }, 500);
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [search]);

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
          `https://operating-media-backend.onrender.com/api/admissions/${id}/delete/`,
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
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);
    for (let i = Math.max(1, startPage); i <= endPage; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="app-container">
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

          <div className="leads-card">
            {/* TOOLBAR MATCHING LEADS VIEW */}
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
                  placeholder="Search name or ID..."
                />
              </div>
            </div>

            <div className="table-wrapper">
              <table className="leads-table">
                <thead>
                  <tr>
                    <th>STUDENT</th>
                    <th>SUBMISSION DATE</th>
                    <th>PHONE</th>
                    <th>EMAIL</th>
                    <th>COURSE</th>
                    <th>BRANCH</th>
                    <th>EMPLOYED</th>
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
                          {item.submission_time || "—"}
                        </td>
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
                        <td>
                          <span
                            className={`status-pill ${item.employed_status === "Yes" ? "active" : "disabled"}`}
                          >
                            {item.employed_status}
                          </span>
                        </td>
                        <td>
                          <div className="action-btns-sm">
                            <button
                              className="icon-btn-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewClick(item.id);
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
                                  {hasPermission("make admission") && (
                                    <button
                                      className="drop-item"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditClick(item.id);
                                      }}
                                    >
                                      <Edit3 size={14} /> Edit
                                    </button>
                                  )}
                                  {hasPermission("make admission") && (
                                    <button
                                      className="drop-item delete"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteAdmission(item.id);
                                      }}
                                    >
                                      <Trash2 size={14} /> Delete
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

            {/* FOOTER MATCHING LEADS VIEW */}
            <div className="table-footer">
              <span className="showing-text">
                Showing page <strong>{page}</strong> of{" "}
                <strong>{totalPages}</strong>
                <span className="count-separator"> | </span>
                Total Admissions: <strong>{totalAdmissions}</strong>
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
