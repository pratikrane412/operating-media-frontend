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
  Star,
} from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";
import TrainerFeedbackDetailDrawer from "../../components/TrainerFeedbackDetailDrawer/TrainerFeedbackDetailDrawer";
import "./TrainerFeedbackManage.css";

const TrainerFeedbackManage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    trainer: "",
    startDate: "",
    endDate: "",
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

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
        "https://operating-media-backend.onrender.com/api/feedback/trainer/list/",
        {
          params: {
            page,
            size: pageSize,
            search,
            trainer: filters.trainer,
            start_date: filters.startDate,
            end_date: filters.endDate,
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

  const openDetails = (item) => {
    setSelectedFeedback(item);
    setIsDrawerOpen(true);
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
    <div id="trainer-feedback-management-portal">
      <Navbar onToggle={() => setIsCollapsed(!isCollapsed)} />

      <main className="tf-m-viewport">
        {/* FILTERS */}
        <div className="tf-m-filter-card">
          <div className="tf-m-filter-head">
            <Filter size={16} /> <span>TRAINING INSIGHT FILTERS</span>
          </div>
          <div className="tf-m-filter-grid">
            <div className="tf-m-group">
              <label>TRAINER</label>
              <select
                value={filters.trainer}
                onChange={(e) =>
                  setFilters({ ...filters, trainer: e.target.value })
                }
              >
                <option value="">All Trainers</option>
                <option value="Harsh Pareek">Harsh Pareek</option>
                <option value="Trainer A">Trainer A</option>
              </select>
            </div>

            <div className="tf-m-group">
              <label>START DATE</label>
              <div className="tf-m-date-input-wrapper">
                <input
                  type="date"
                  className="tf-m-picker-field"
                  value={filters.startDate}
                  onChange={(e) =>
                    setFilters({ ...filters, startDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="tf-m-group">
              <label>END DATE</label>
              <div className="tf-m-date-input-wrapper">
                <input
                  type="date"
                  className="tf-m-picker-field"
                  value={filters.endDate}
                  onChange={(e) =>
                    setFilters({ ...filters, endDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="tf-m-actions">
              <button
                className="tf-m-btn-reset"
                onClick={() => {
                  setFilters({ trainer: "", startDate: "", endDate: "" });
                  setSearch("");
                  setPage(1);
                }}
              >
                <RotateCcw size={16} />
              </button>
              <button className="tf-m-btn-apply" onClick={fetchData}>
                <Check size={16} /> APPLY
              </button>
            </div>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="tf-m-data-card">
          <div className="tf-m-toolbar">
            <div className="tf-m-entries-select">
              Show
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(e.target.value);
                  setPage(1);
                }}
              >
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              entries
            </div>

            <div className="tf-m-search-box">
              <span>Search:</span>
              <div className="tf-m-search-wrapper">
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
            className={`tf-m-table-scroll ${isDragging ? "is-dragging" : ""}`}
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            <table className="tf-m-table">
              <thead>
                <tr>
                  <th style={{ width: "220px" }}>STUDENT NAME</th>
                  <th style={{ width: "150px" }}>SUBMISSION DATE</th>
                  <th style={{ width: "250px" }}>COURSE NAME</th>
                  <th style={{ width: "200px" }}>TRAINER NAME</th>
                  <th style={{ width: "180px" }}>KNOWLEDGE</th>
                  <th style={{ width: "180px" }}>COVERAGE</th>
                  <th style={{ width: "180px" }}>COMMUNICATION</th>
                  <th style={{ width: "120px" }}>RATING</th>
                  <th style={{ width: "450px" }}>ADDITIONAL COMMENTS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="tf-m-loader">
                      Syncing trainer feedback...
                    </td>
                  </tr>
                ) : feedbacks.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="tf-m-loader">
                      No records found.
                    </td>
                  </tr>
                ) : (
                  feedbacks.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => openDetails(item)}
                      className="tf-m-row-clickable"
                    >
                      <td className="tf-m-bold">{item.student_name}</td>
                      <td className="tf-m-small">{item.date}</td>
                      <td className="tf-m-small">{item.course_name}</td>
                      <td className="tf-m-bold" style={{ color: "#475569" }}>
                        {item.trainer_name}
                      </td>
                      <td>
                        <span className="tf-m-pill">
                          {item.trainer_knowledge}
                        </span>
                      </td>
                      <td>
                        <span className="tf-m-pill">
                          {item.content_coverage}
                        </span>
                      </td>
                      <td>
                        <span className="tf-m-pill">{item.communication}</span>
                      </td>
                      <td>
                        <div className="tf-m-rating-box">
                          <Star size={12} fill="#eab308" color="#eab308" />
                          <strong>{item.rating}/10</strong>
                        </div>
                      </td>
                      <td className="tf-m-long-text">{item.comments}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="tf-m-table-footer">
            <span className="tf-m-showing">
              Showing page <strong>{page}</strong> of{" "}
              <strong>{totalPages}</strong>
              <span className="tf-m-sep"> | </span> Total Records:{" "}
              <strong>{totalCount}</strong>
            </span>

            <div className="tf-m-pagination">
              <button
                className="tf-m-page-nav"
                disabled={page === 1}
                onClick={() => setPage(1)}
              >
                <ChevronsLeft size={16} />
              </button>
              <button
                className="tf-m-page-nav"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft size={16} />
              </button>
              {getPageNumbers().map((num) => (
                <button
                  key={num}
                  className={`tf-m-page-num ${page === num ? "active" : ""}`}
                  onClick={() => setPage(num)}
                >
                  {num}
                </button>
              ))}
              <button
                className="tf-m-page-nav"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                <ChevronRight size={16} />
              </button>
              <button
                className="tf-m-page-nav"
                disabled={page === totalPages}
                onClick={() => setPage(totalPages)}
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>

      <TrainerFeedbackDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        data={selectedFeedback}
        onUpdate={fetchData}
      />
    </div>
  );
};

export default TrainerFeedbackManage;
