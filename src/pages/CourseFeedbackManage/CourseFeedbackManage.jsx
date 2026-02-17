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
  X,
} from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";
import "./CourseFeedbackManage.css";

const CourseFeedbackManage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ profession: "", reviewStatus: "" });

  // --- DRAG SCROLL LOGIC ---
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };
  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

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

      <main className="cf-m-viewport">
        {/* FILTERS */}
        <div className="cf-m-filter-card">
          <div className="cf-m-filter-head">
            <Filter size={16} /> <span>INSIGHT FILTERS</span>
          </div>
          <div className="cf-m-filter-grid">
            <div className="cf-m-group">
              <label>PROFESSION</label>
              <select
                value={filters.profession}
                onChange={(e) =>
                  setFilters({ ...filters, profession: e.target.value })
                }
              >
                <option value="">All Professions</option>
                <option value="Student">Student</option>
                <option value="Working Pro">Working Professional</option>
              </select>
            </div>
            <div className="cf-m-group">
              <label>REVIEW STATUS</label>
              <select
                value={filters.reviewStatus}
                onChange={(e) =>
                  setFilters({ ...filters, reviewStatus: e.target.value })
                }
              >
                <option value="">All Status</option>
                <option value="Yes">Yes (Submitted)</option>
                <option value="No">No (Pending)</option>
              </select>
            </div>
            <div className="cf-m-actions">
              <button
                className="cf-m-btn-reset"
                onClick={() => {
                  setFilters({ profession: "", reviewStatus: "" });
                  setSearch("");
                  setPage(1);
                }}
              >
                <RotateCcw size={16} />
              </button>
              <button className="cf-m-btn-apply" onClick={fetchData}>
                <Check size={16} /> APPLY
              </button>
            </div>
          </div>
        </div>

        {/* DATA TABLE */}
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

          <div
            className={`cf-m-table-scroll ${isDragging ? "is-dragging" : ""}`}
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            <table className="cf-m-table">
              <thead>
                <tr>
                  <th style={{ width: "220px" }}>STUDENT NAME</th>
                  <th style={{ width: "140px" }}>SUBMISSION DATE</th>
                  <th style={{ width: "180px" }}>PROFESSION</th>
                  <th style={{ width: "100px" }} className="cf-m-center">
                    REVIEW
                  </th>
                  <th style={{ width: "180px" }}>INSTAGRAM</th>
                  <th style={{ width: "450px" }}>REASON FOR DM</th>
                  <th style={{ width: "450px" }}>COURSE IMPACT</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="cf-m-loader">
                      Syncing feedback records...
                    </td>
                  </tr>
                ) : (
                  feedbacks.map((item) => (
                    <tr key={item.id}>
                      <td className="cf-m-bold">
                        <strong>{item.name}</strong>
                      </td>
                      <td className="cf-m-small">{item.date}</td>
                      <td className="cf-m-small">{item.profession}</td>
                      <td className="cf-m-center">
                        <span
                          className={`cf-m-status ${item.review.toLowerCase()}`}
                        >
                          {item.review}
                        </span>
                      </td>
                      <td className="cf-m-insta">
                        <Instagram size={13} /> {item.insta_handle}
                      </td>
                      <td className="cf-m-long-text">{item.reason_dm}</td>
                      <td className="cf-m-long-text">{item.impact}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="cf-m-table-footer">
            <span className="cf-m-showing">
              Showing page <strong>{page}</strong> of{" "}
              <strong>{totalPages}</strong>
              <span className="cf-m-sep"> | </span> Total Records:{" "}
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
