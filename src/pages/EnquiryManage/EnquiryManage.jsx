import React, { useState, useEffect, useRef } from "react";
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
  Trash2,
} from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";
import "./EnquiryManage.css";

const EnquiryManage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Pagination & Search States
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Filter States
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [filters, setFilters] = useState({
    branch: "",
    course: "",
    counselor: "",
    fromDate: "",
    toDate: "",
  });

  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://operating-media-backend.onrender.com/api/enquiries/list/",
        {
          params: {
            page,
            size: pageSize,
            search,
            branch: filters.branch,
            course: filters.course,
            counselor: filters.counselor,
            from: filters.fromDate,
            to: filters.toDate,
            sort_field: sortField,
            sort_order: sortOrder,
          },
        },
      );
      // The API returns a direct array or results object
      const dataResults = Array.isArray(res.data)
        ? res.data
        : res.data.results || [];
      setEnquiries(dataResults);
      setTotalPages(res.data.total_pages || 1);
      setTotalCount(res.data.total_count || dataResults.length);
    } catch (err) {
      console.error("Fetch error:", err);
      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize, filters, search, sortField, sortOrder]);

  const handleDateChange = (update) => {
    setDateRange(update);
    const [start, end] = update;
    setFilters({
      ...filters,
      fromDate: start ? start.toISOString().split("T")[0] : "",
      toDate: end ? end.toISOString().split("T")[0] : "",
    });
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
    <div id="enquiry-management-portal">
      <Navbar onToggle={() => setIsCollapsed(!isCollapsed)} />

      <main className="enq-content-area">
        {/* FILTERS CARD */}
        <div className="enq-filter-card">
          <div className="enq-filter-header">
            <Filter size={16} /> <span>SEARCH FILTERS</span>
          </div>
          <div className="enq-filter-grid">
            <div className="enq-filter-group">
              <label>BRANCH</label>
              <select
                value={filters.branch}
                onChange={(e) =>
                  setFilters({ ...filters, branch: e.target.value })
                }
              >
                <option value="">All Branches</option>
                <option value="Andheri">Andheri</option>
                <option value="Borivali">Borivali</option>
              </select>
            </div>
            <div className="enq-filter-group">
              <label>COURSE</label>
              <select
                value={filters.course}
                onChange={(e) =>
                  setFilters({ ...filters, course: e.target.value })
                }
              >
                <option value="">All Courses</option>
                <option value="Masters">Masters in Digital Marketing</option>
                <option value="Advanced">Advanced Diploma</option>
              </select>
            </div>
            <div className="enq-filter-group">
              <label>COUNSELLOR</label>
              <select
                value={filters.counselor}
                onChange={(e) =>
                  setFilters({ ...filters, counselor: e.target.value })
                }
              >
                <option value="">All Counselors</option>
                <option value="Rahul">Harsh Pareek</option>
                <option value="Priya">koomal Pareek</option>
              </select>
            </div>
            <div className="enq-filter-group range-group">
              <label>SUBMISSION DATE RANGE</label>
              <div className="enq-date-wrapper">
                <CalendarIcon size={14} className="enq-cal-icon" />
                <DatePicker
                  selectsRange
                  startDate={startDate}
                  endDate={endDate}
                  onChange={handleDateChange}
                  placeholderText="Select range (Start - End)"
                  dateFormat="MMM d, yyyy"
                  monthsShown={2}
                  className="enq-date-field"
                />
                {(startDate || endDate) && (
                  <button
                    className="enq-clear-date"
                    onClick={() => {
                      setDateRange([null, null]);
                      setFilters({ ...filters, fromDate: "", toDate: "" });
                    }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
            <div className="enq-filter-actions">
              <button
                className="enq-btn-reset"
                onClick={() => {
                  setFilters({
                    branch: "",
                    course: "",
                    counselor: "",
                    fromDate: "",
                    toDate: "",
                  });
                  setDateRange([null, null]);
                  setSearch("");
                }}
              >
                <RotateCcw size={14} />
              </button>
              <button className="enq-btn-apply" onClick={fetchData}>
                <Check size={14} /> APPLY
              </button>
            </div>
          </div>
        </div>

        {/* DATA TABLE CARD */}
        <div className="enq-data-card">
          <div className="enq-toolbar">
            <div className="enq-entries">
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
            <div className="enq-search-box">
              <span>Search:</span>
              <div className="enq-search-input-wrapper">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search student name or phone..."
                />
              </div>
            </div>
          </div>

          <div className="enq-table-sticky-wrapper">
            <table className="enq-modern-table">
              <thead>
                <tr>
                  <th>STUDENT</th>
                  <th>SUBMISSION DATE</th>
                  <th>COUNSELLOR</th>
                  <th>PHONE</th>
                  <th>EMAIL</th>
                  <th>COURSE</th>
                  <th>BRANCH</th>
                  <th className="text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="enq-table-loader">
                      Syncing data records...
                    </td>
                  </tr>
                ) : enquiries.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="enq-table-loader">
                      No enquiries found.
                    </td>
                  </tr>
                ) : (
                  enquiries.map((item) => (
                    <tr key={item.id} className="enq-clickable-row">
                      <td className="enq-student-cell">
                        <strong>{item.name}</strong>
                      </td>
                      <td className="enq-date-text">{item.date}</td>
                      <td className="enq-counselor-text">{item.counselor}</td>
                      <td className="enq-phone-text">{item.phone}</td>
                      <td className="enq-email-text">{item.email}</td>
                      <td>
                        <span className="enq-course-pill">
                          {item.courses?.split(",")[0]}
                        </span>
                      </td>
                      <td className="enq-branch-text">
                        {item.branch_preference}
                      </td>
                      <td>
                        <div className="enq-action-btns">
                          <button className="enq-icon-btn">
                            <Eye size={16} />
                          </button>
                          <div className="enq-menu-container">
                            <button
                              className={`enq-icon-btn ${activeMenuId === item.id ? "active" : ""}`}
                              onClick={() =>
                                setActiveMenuId(
                                  activeMenuId === item.id ? null : item.id,
                                )
                              }
                            >
                              <MoreHorizontal size={16} />
                            </button>
                            {activeMenuId === item.id && (
                              <div className="enq-dropdown-list">
                                <button className="enq-drop-item">
                                  <Edit3 size={14} /> Edit
                                </button>
                                <button className="enq-drop-item delete">
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

          {/* PAGINATION FOOTER */}
          <div className="enq-table-footer">
            <span className="enq-showing-text">
              Showing page <strong>{page}</strong> of{" "}
              <strong>{totalPages}</strong>
              <span className="enq-sep"> | </span> Total:{" "}
              <strong>{totalCount}</strong>
            </span>
            <div className="enq-pagination">
              <button
                className="enq-page-nav"
                disabled={page === 1}
                onClick={() => setPage(1)}
              >
                <ChevronsLeft size={16} />
              </button>
              <button
                className="enq-page-nav"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft size={16} />
              </button>
              {getPageNumbers().map((num) => (
                <button
                  key={num}
                  className={`enq-page-num ${page === num ? "active" : ""}`}
                  onClick={() => setPage(num)}
                >
                  {num}
                </button>
              ))}
              <button
                className="enq-page-nav"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                <ChevronRight size={16} />
              </button>
              <button
                className="enq-page-nav"
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

export default EnquiryManage;
