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
  UserCheck,
} from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";
import "./EnquiryManage.css";

const EnquiryManage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [filters, setFilters] = useState({
    branch: "",
    poc: "",
    counselor: "",
  });

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
            ...filters,
            from: dateRange[0]?.toISOString().split("T")[0],
            to: dateRange[1]?.toISOString().split("T")[0],
          },
        },
      );
      const results = Array.isArray(res.data)
        ? res.data
        : res.data.results || [];
      setData(results);
      setTotalCount(res.data.total_count || results.length);
    } catch (err) {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize, filters, search]);

  return (
    <div id="enq-management-module">
      <Navbar onToggle={() => setIsCollapsed(!isCollapsed)} />
      <main className="enq-m-content">
        <div className="enq-m-filter-card">
          <div className="enq-m-title">
            <Filter size={16} /> <span>ENQUIRY FILTERS</span>
          </div>
          <div className="enq-m-filter-grid">
            <div className="enq-m-group">
              <label>Branch</label>
              <select
                className="enq-m-select"
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
              <label>Counselor</label>
              <input
                type="text"
                className="enq-m-input"
                placeholder="Name..."
                value={filters.counselor}
                onChange={(e) =>
                  setFilters({ ...filters, counselor: e.target.value })
                }
              />
            </div>
            <div className="enq-m-group">
              <label>Date Range</label>
              <div className="enq-m-date-box">
                <CalendarIcon size={14} />
                <DatePicker
                  selectsRange
                  startDate={dateRange[0]}
                  endDate={dateRange[1]}
                  onChange={(update) => setDateRange(update)}
                  placeholderText="Select Range"
                  className="enq-m-datepicker"
                />
              </div>
            </div>
            <div className="enq-m-actions">
              <button
                className="enq-m-btn-reset"
                onClick={() => {
                  setFilters({ branch: "", poc: "", counselor: "" });
                  setDateRange([null, null]);
                }}
              >
                <RotateCcw size={14} />
              </button>
              <button className="enq-m-btn-apply" onClick={fetchData}>
                <Check size={14} /> APPLY
              </button>
            </div>
          </div>
        </div>

        <div className="enq-m-table-card">
          <div className="enq-m-toolbar">
            <div className="enq-m-search">
              <Search size={16} />{" "}
              <input
                type="text"
                placeholder="Search name/phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="enq-m-table-wrapper">
            <table className="enq-m-table">
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>STUDENT</th>
                  <th>PHONE</th>
                  <th>COURSES</th>
                  <th>BRANCH</th>
                  <th>COUNSELOR</th>
                  <th className="enq-m-center">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="enq-m-msg">
                      Loading Enquiries...
                    </td>
                  </tr>
                ) : (
                  data.map((item) => (
                    <tr key={item.id}>
                      <td>{item.date}</td>
                      <td className="enq-m-name">
                        <strong>{item.name}</strong>
                      </td>
                      <td>{item.phone}</td>
                      <td>
                        <span className="enq-m-pill">{item.course}</span>
                      </td>
                      <td>{item.branch_preference || "N/A"}</td>
                      <td>{item.counsellor || "System"}</td>
                      <td className="enq-m-center">
                        <button className="enq-m-view">
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
export default EnquiryManage;
