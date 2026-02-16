import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  RotateCcw,
  Check,
  Instagram,
  Eye,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Edit3,
  Trash2,
} from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";
import "./CourseFeedbackManage.css";

const CourseFeedbackManage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Pagination & Filter States
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ profession: "", reviewStatus: "" });

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".cf-m-menu-container")) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://operating-media-backend.onrender.com/api/feedback/course/list/",
        {
          params: {
            page,
            size: pageSize,
            search,
            profession: filters.profession,
            review_status: filters.reviewStatus,
          },
        },
      );
      const dataResults = Array.isArray(res.data)
        ? res.data
        : res.data.results || [];
      setFeedbacks(dataResults);
      setTotalPages(res.data.total_pages || 1);
      setTotalCount(res.data.total_count || dataResults.length);
    } catch (err) {
      console.error("Fetch error:", err);
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize, filters, search]);

  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);
    for (let i = Math.max(1, startPage); i <= endPage; i++) pages.push(i);
    return pages;
  };

  return (
    <div id="course-feedback-management-portal">
      <Navbar onToggle={() => setIsCollapsed(!isCollapsed)} />

      <main className="cf-m-content-area">
        {/* FILTERS CARD */}
        <div className="cf-m-filter-card">
          <div className="cf-m-filter-header">
            <Filter size={16} /> <span>INSIGHT FILTERS</span>
          </div>
          <div className="cf-m-filter-grid">
            <div className="cf-m-filter-group">
              <label>PROFESSION</label>
              <select
                value={filters.profession}
                onChange={(e) =>
                  setFilters({ ...filters, profession: e.target.value })
                }
              >
                <option value="">All Professions</option>
                <option value="Student">Student</option>
                <option value="Professional">Working Professional</option>
              </select>
            </div>
            <div className="cf-m-filter-group">
              <label>REVIEW STATUS</label>
              <select
                value={filters.reviewStatus}
                onChange={(e) =>
                  setFilters({ ...filters, reviewStatus: e.target.value })
                }
              >
                <option value="">All Status</option>
                <option value="Yes">Review Submitted</option>
                <option value="No">Pending Review</option>
              </select>
            </div>
            <div className="cf-m-filter-actions">
              <button
                className="cf-m-btn-reset"
                onClick={() => {
                  setFilters({ profession: "", reviewStatus: "" });
                  setSearch("");
                  setPage(1);
                }}
              >
                <RotateCcw size={14} />
              </button>
              <button
                className="cf-m-btn-apply"
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

        {/* DATA TABLE CARD */}
        <div className="cf-m-data-card">
          <div className="cf-m-toolbar">
            <div className="cf-m-entries-select">
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
              </select>{" "}
              entries
            </div>
            <div className="cf-m-search-box">
              <span>Search:</span>
              <div className="cf-m-search-wrapper">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search student name..."
                />
              </div>
            </div>
          </div>

          <div className="cf-m-table-sticky-wrapper">
            <table className="cf-m-modern-table">
              <thead>
                <tr>
                  <th>STUDENT</th>
                  <th>SUBMISSION DATE</th>
                  <th>PROFESSION</th>
                  <th className="cf-m-center">REVIEW DONE?</th>
                  <th>INSTAGRAM</th>
                  <th className="cf-m-center">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="cf-m-table-loader">
                      Fetching logs...
                    </td>
                  </tr>
                ) : feedbacks.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="cf-m-table-loader">
                      No records found.
                    </td>
                  </tr>
                ) : (
                  feedbacks.map((item) => (
                    <tr key={item.id} className="cf-m-row">
                      <td className="cf-m-name-cell">
                        <strong>{item.name}</strong>
                      </td>
                      <td className="cf-m-date-cell">{item.date}</td>
                      <td className="cf-m-prof-cell">{item.profession}</td>
                      <td className="cf-m-center">
                        {item.review === "Yes" ? (
                          <CheckCircle2 size={18} color="#10b981" />
                        ) : (
                          <XCircle size={18} color="#ef4444" />
                        )}
                      </td>
                      <td className="cf-m-insta-cell">
                        <Instagram size={14} color="#e1306c" />
                        <span>{item.insta_handle}</span>
                      </td>
                      <td>
                        <div className="cf-m-action-btns">
                          <button className="cf-m-icon-btn">
                            <Eye size={16} />
                          </button>
                          <div className="cf-m-menu-container">
                            <button
                              className={`cf-m-icon-btn ${activeMenuId === item.id ? "active" : ""}`}
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
                              <div className="cf-m-dropdown-list">
                                <button className="cf-m-drop-item">
                                  <Edit3 size={14} /> Edit
                                </button>
                                <button className="cf-m-drop-item delete">
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

          {/* THE PAGINATION FOOTER */}
          <div className="cf-m-table-footer">
            <span className="cf-m-showing-text">
              Showing page <strong>{page}</strong> of{" "}
              <strong>{totalPages}</strong>
              <span className="cf-m-sep"> | </span> Total:{" "}
              <strong>{totalCount}</strong>
            </span>
            <div className="cf-m-pagination">
              <button
                className="cf-m-page-nav"
                disabled={page === 1}
                onClick={() => setPage(1)}
              >
                <ChevronsLeft size={16} />
              </button>
              <button
                className="cf-m-page-nav"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft size={16} />
              </button>
              {getPageNumbers().map((num) => (
                <button
                  key={num}
                  className={`cf-m-page-num ${page === num ? "active" : ""}`}
                  onClick={() => setPage(num)}
                >
                  {num}
                </button>
              ))}
              <button
                className="cf-m-page-nav"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                <ChevronRight size={16} />
              </button>
              <button
                className="cf-m-page-nav"
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
  );
};

export default CourseFeedbackManage;
