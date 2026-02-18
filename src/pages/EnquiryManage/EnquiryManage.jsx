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
  Filter,
  RotateCcw,
  Check,
  Calendar as CalendarIcon,
  X,
} from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";
import "./EnquiryManage.css";
import EnquiryDetailDrawer from "../../components/EnquiryDetailDrawer/EnquiryDetailDrawer";

const EnquiryManage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [filters, setFilters] = useState({
    branch: "",
    course: "",
    counselor: "",
    fromDate: "",
    toDate: "",
  });
  const [options, setOptions] = useState({ counsellors: [] });

  // Drag-to-scroll refs
  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const dragDistance = useRef(0);

  useEffect(() => {
    axios
      .get("https://operating-media-backend.onrender.com/api/leads/create/")
      .then((res) => {
        setOptions({ counsellors: res.data.counsellors || [] });
      })
      .catch((err) => console.error("Options error:", err));
  }, []);

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
          },
        },
      );
      const dataResults = Array.isArray(res.data)
        ? res.data
        : res.data.results || [];
      setEnquiries(dataResults);
      setTotalPages(res.data.total_pages || 1);
      setTotalCount(res.data.total_count || dataResults.length);
    } catch (err) {
      setEnquiries([]);
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

  // Drag-to-scroll handlers
  const handleMouseDown = (e) => {
    isDragging.current = true;
    dragDistance.current = 0;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.cursor = "grabbing";
    scrollRef.current.style.userSelect = "none";
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    dragDistance.current = Math.abs(walk);
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const stopDragging = () => {
    isDragging.current = false;
    if (scrollRef.current) {
      scrollRef.current.style.cursor = "grab";
      scrollRef.current.style.userSelect = "";
    }
  };

  const handleRowClick = (e, item) => {
    // Ignore click if the user was dragging (moved more than 5px)
    if (dragDistance.current > 5) return;
    setSelectedEnquiry(item);
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

  // Helper to render multiple items vertically
  const renderVerticalList = (str) => {
    if (!str || str === "—") return "—";
    return (
      <div className="enq-m-stack-box">
        {str.split(",").map((item, i) => (
          <span key={i} className="enq-m-item-pill">
            {item.trim()}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div id="enquiry-management-portal">
      <Navbar onToggle={() => setIsCollapsed(!isCollapsed)} />

      <main className="enq-m-viewport">
        <div className="enq-m-filter-section">
          <div className="enq-m-filter-head">
            <Filter size={16} /> <span>SEARCH FILTERS</span>
          </div>
          <div className="enq-m-filter-grid">
            <div className="enq-m-group">
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
            <div className="enq-m-group">
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
            <div className="enq-m-group">
              <label>COUNSELLOR</label>
              <select
                value={filters.counselor}
                onChange={(e) =>
                  setFilters({ ...filters, counselor: e.target.value })
                }
              >
                <option value="">All Counsellors</option>
                {options.counsellors.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="enq-m-group enq-m-range">
              <label>DATE RANGE</label>
              <div className="enq-m-date-input">
                <CalendarIcon size={14} />
                <DatePicker
                  selectsRange
                  startDate={startDate}
                  endDate={endDate}
                  onChange={handleDateChange}
                  placeholderText="Select Range"
                  dateFormat="MMM d, yyyy"
                  className="enq-m-picker-field"
                />
              </div>
            </div>
            <div className="enq-m-actions">
              <button
                className="enq-m-reset"
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
              <button className="enq-m-apply" onClick={fetchData}>
                <Check size={14} /> APPLY
              </button>
            </div>
          </div>
        </div>

        <div className="enq-m-data-container">
          <div className="enq-m-toolbar">
            <div className="enq-m-entries">
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
            <div className="enq-m-search">
              <span>Search:</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search student name or phone..."
              />
            </div>
          </div>

          <div
            className="enq-m-table-scroll"
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={stopDragging}
            onMouseLeave={stopDragging}
          >
            <table className="enq-m-table">
              <thead>
                <tr>
                  <th width="120">SUBMISSION DATE</th>
                  <th width="200">STUDENT NAME</th>
                  <th width="220">EMAIL</th>
                  <th width="140">PHONE</th>
                  <th width="160">LOCATION</th>
                  <th width="80">AGE</th>
                  <th width="100">GENDER</th>
                  <th width="150">PROFESSION</th>
                  <th width="180">SOURCE</th>
                  <th width="250">PURPOSE</th>
                  <th width="250">COURSES</th>
                  <th width="120">BATCH</th>
                  <th width="120">BRANCH</th>
                  <th width="160">COUNSELOR</th>
                  <th width="160">POC</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="15" className="enq-m-loader">
                      Syncing database records...
                    </td>
                  </tr>
                ) : enquiries.length === 0 ? (
                  <tr>
                    <td colSpan="15" className="enq-m-loader">
                      No records available.
                    </td>
                  </tr>
                ) : (
                  enquiries.map((item) => (
                    <tr
                      key={item.id}
                      className="enq-clickable-row"
                      onClick={(e) => handleRowClick(e, item)}
                    >
                      <td className="enq-m-txt-small">{item.date}</td>
                      <td className="enq-m-name-bold">{item.name}</td>
                      <td className="enq-m-txt-small">{item.email}</td>
                      <td className="enq-m-txt-small">{item.phone}</td>
                      <td className="enq-m-txt-small">{item.location}</td>
                      <td className="text-center">{item.age}</td>
                      <td className="enq-m-txt-small">{item.gender}</td>
                      <td className="enq-m-txt-small">{item.profession}</td>
                      <td>{renderVerticalList(item.source)}</td>
                      <td className="enq-m-long-text">{item.purpose}</td>
                      <td>{renderVerticalList(item.courses)}</td>
                      <td className="enq-m-txt-small">
                        {item.batch_preference}
                      </td>
                      <td className="enq-m-txt-small">
                        {item.branch_preference}
                      </td>
                      <td className="enq-m-txt-small">{item.counselor}</td>
                      <td className="enq-m-txt-small">{item.poc}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="enq-m-footer">
            <span className="enq-m-showing">
              Showing page <strong>{page}</strong> of{" "}
              <strong>{totalPages}</strong>
              <span className="enq-m-sep"> | </span> Total Enquiries:{" "}
              <strong>{totalCount}</strong>
            </span>
            <div className="enq-m-pagination">
              <button
                className="enq-m-nav"
                disabled={page === 1}
                onClick={() => setPage(1)}
              >
                <ChevronsLeft size={16} />
              </button>
              <button
                className="enq-m-nav"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft size={16} />
              </button>
              {getPageNumbers().map((num) => (
                <button
                  key={num}
                  className={`enq-m-num ${page === num ? "active" : ""}`}
                  onClick={() => setPage(num)}
                >
                  {num}
                </button>
              ))}
              <button
                className="enq-m-nav"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                <ChevronRight size={16} />
              </button>
              <button
                className="enq-m-nav"
                disabled={page === totalPages}
                onClick={() => setPage(totalPages)}
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>
          <EnquiryDetailDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            data={selectedEnquiry}
          />
        </div>
      </main>
    </div>
  );
};

export default EnquiryManage;
