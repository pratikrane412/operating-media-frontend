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
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import "./ManageAdmission.css";

const ManageAdmission = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
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
          <header className="page-header-flex">
            <div className="header-left">
              <div className="breadcrumb-nav">
                <span
                  onClick={() => navigate("/dashboard")}
                  style={{ cursor: "pointer" }}
                >
                  Dashboards
                </span>
                <ChevronRight size={12} className="sep" />
                <span className="current">Manage Admission</span>
              </div>
              <h2 className="page-title-bold">Admission Directory</h2>
            </div>
          </header>

          <div className="data-card-white">
            <div className="data-toolbar">
              <div className="entries-box">
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
                </select>{" "}
                entries
              </div>
              <div className="search-input-wrapper">
                <Search size={16} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyUp={(e) => e.key === "Enter" && fetchAdmissions()}
                  placeholder="Search admissions..."
                />
              </div>
            </div>

            <div className="table-sticky-wrapper">
              <table className="modern-data-table">
                <thead>
                  <tr>
                    <th width="240">FULL NAME</th>
                    <th width="150">PHONE</th>
                    <th width="220">EMAIL</th>
                    <th width="200">COURSE</th>
                    <th width="120">BRANCH</th>
                    <th width="100">EMPLOYED</th>
                    <th className="text-right" width="120">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="table-loader-text">
                        Refreshing data...
                      </td>
                    </tr>
                  ) : (
                    admissions.map((item) => (
                      <tr key={item.id}>
                        <td className="user-profile-cell">
                          <div className="avatar-letter-box">
                            {item.name ? item.name.charAt(0) : "?"}
                          </div>
                          <span className="user-fullname">{item.name}</span>
                        </td>
                        <td className="text-muted-sm">{item.phone}</td>
                        <td className="text-muted-sm text-truncate">
                          {item.email}
                        </td>
                        <td>
                          <span className="pill-info-blue">{item.course}</span>
                        </td>
                        <td>
                          <span className="pill-branch-gray">
                            {item.branch}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`status-tag ${
                              item.employed_status === "Yes"
                                ? "active"
                                : "inactive"
                            }`}
                          >
                            {item.employed_status}
                          </span>
                        </td>
                        <td className="text-right">
                          <div className="actions-cluster">
                            <button className="btn-action-circle">
                              <Eye size={15} />
                            </button>
                            <div className="menu-anchor">
                              <button
                                className={`btn-action-circle ${
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
                                  className="menu-dropdown-box"
                                  ref={menuRef}
                                >
                                  <button className="drop-btn">
                                    <Edit3 size={13} /> Edit
                                  </button>
                                  <button className="drop-btn delete">
                                    <Trash2 size={13} /> Delete
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

            <div className="pagination-footer-clean">
              <span className="summary-label">
                Showing page {page} of {totalPages}
              </span>
              <div className="pagination-nav-group">
                <button
                  className="nav-btn-box"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft size={16} />
                </button>
                {getPageNumbers().map((n) => (
                  <button
                    key={n}
                    className={`num-btn ${page === n ? "active" : ""}`}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </button>
                ))}
                <button
                  className="nav-btn-box"
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

export default ManageAdmission;
