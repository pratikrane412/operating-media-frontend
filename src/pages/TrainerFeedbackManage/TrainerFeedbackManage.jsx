import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  RotateCcw,
  Check,
  Calendar as CalendarIcon,
  Eye,
  Star,
} from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";
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
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const [filters, setFilters] = useState({
    trainer: "",
    course: "",
    fromDate: "",
    toDate: "",
  });

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
            course: filters.course,
            from: filters.fromDate,
            to: filters.toDate,
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

  const handleDateChange = (update) => {
    setDateRange(update);
    const [start, end] = update;
    setFilters({
      ...filters,
      fromDate: start ? start.toISOString().split("T")[0] : "",
      toDate: end ? end.toISOString().split("T")[0] : "",
    });
  };

  const getRatingColor = (rating) => {
    if (rating >= 9) return "tf-m-rating-excellent";
    if (rating >= 7) return "tf-m-rating-good";
    if (rating >= 5) return "tf-m-rating-average";
    return "tf-m-rating-poor";
  };

  return (
    <div className="tf-m-page-root">
      <Navbar onToggle={() => setIsCollapsed(!isCollapsed)} />

      {/* SCOPE STARTS HERE - APPLYING TO MAIN CONTENT ONLY */}
      <main className="tf-m-content-container">
        {/* FILTERS */}
        <div className="tf-m-card-filter">
          <div className="tf-m-card-head">
            <Filter size={16} /> <span>FILTER FEEDBACK</span>
          </div>
          <div className="tf-m-filter-flex">
            <div className="tf-m-input-group">
              <label>TRAINER</label>
              <select
                className="tf-m-select-field"
                value={filters.trainer}
                onChange={(e) =>
                  setFilters({ ...filters, trainer: e.target.value })
                }
              >
                <option value="">All Trainers</option>
                <option value="Harsh Pareek">Harsh Pareek</option>
                <option value="Pooja Parab">Pooja Parab</option>
              </select>
            </div>
            <div className="tf-m-input-group">
              <label>COURSE</label>
              <select
                className="tf-m-select-field"
                value={filters.course}
                onChange={(e) =>
                  setFilters({ ...filters, course: e.target.value })
                }
              >
                <option value="">All Courses</option>
                <option value="Masters">Masters in DM</option>
              </select>
            </div>
            <div className="tf-m-input-group">
              <label>DATE RANGE</label>
              <div className="tf-m-date-box">
                <CalendarIcon size={14} />
                <DatePicker
                  selectsRange
                  startDate={startDate}
                  endDate={endDate}
                  onChange={handleDateChange}
                  placeholderText="Select Range"
                  dateFormat="MMM d, yyyy"
                  className="tf-m-datepicker-input"
                />
              </div>
            </div>
            <div className="tf-m-btn-group">
              <button
                className="tf-m-btn-reset"
                onClick={() => {
                  setFilters({
                    trainer: "",
                    course: "",
                    fromDate: "",
                    toDate: "",
                  });
                  setDateRange([null, null]);
                  setSearch("");
                }}
              >
                <RotateCcw size={14} />
              </button>
              <button className="tf-m-btn-apply" onClick={fetchData}>
                <Check size={14} /> APPLY
              </button>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="tf-m-card-table">
          <div className="tf-m-table-toolbar">
            <div className="tf-m-entries-ctrl">
              Show{" "}
              <select
                className="tf-m-mini-select"
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value)}
              >
                <option value="50">50</option>
              </select>{" "}
              entries
            </div>
            <div className="tf-m-search-box">
              <Search size={16} />
              <input
                type="text"
                className="tf-m-search-input"
                placeholder="Search student..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="tf-m-scroll-area">
            <table className="tf-m-data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Trainer</th>
                  <th className="tf-m-txt-center">Rating</th>
                  <th>Date</th>
                  <th className="tf-m-txt-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="tf-m-status-msg">
                      Loading...
                    </td>
                  </tr>
                ) : feedbacks.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="tf-m-status-msg">
                      No records.
                    </td>
                  </tr>
                ) : (
                  feedbacks.map((item) => (
                    <tr key={item.id}>
                      <td className="tf-m-bold-name">{item.student}</td>
                      <td>{item.trainer}</td>
                      <td className="tf-m-txt-center">
                        <div
                          className={`tf-m-rating-pill ${getRatingColor(item.rating)}`}
                        >
                          <Star size={12} fill="currentColor" /> {item.rating}
                          /10
                        </div>
                      </td>
                      <td className="tf-m-date-val">{item.date}</td>
                      <td className="tf-m-txt-center">
                        <button className="tf-m-circle-btn">
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="tf-m-table-footer">
            <span className="tf-m-total-txt">Total: {totalCount} records</span>
            <div className="tf-m-pagination-nav">
              <button
                className="tf-m-nav-btn"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft size={16} />
              </button>
              <span className="tf-m-page-indicator">{page}</span>
              <button
                className="tf-m-nav-btn"
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
  );
};

export default TrainerFeedbackManage;
