import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Navbar from "../../components/Navbar/Navbar";
import {
  IndianRupee,
  AlertCircle,
  Clock,
  Zap,
  HandCoins,
  CalendarClock,
  ChevronRight,
  ArrowRight,
  RotateCcw,
  Calendar as CalendarIcon,
  X,
} from "lucide-react";
import "./Dashboard.css";

const Dashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    followups: [],
    hot_leads: [],
    reminders: [],
    revenue_details: [],
    counsellors: [],
    stats: {},
  });

  // --- FILTER STATES ---
  const [feeBranchFilter, setFeeBranchFilter] = useState("All");
  const [followupCounsellorFilter, setFollowupCounsellorFilter] =
    useState("All");

  // States for Total Fee Generated Section
  const [revBranch, setRevBranch] = useState("All");
  const [revCounsellor, setRevCounsellor] = useState("All");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("admin") || "{}");

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      // Pass filters to backend
      params.append("branch", revBranch);
      params.append("counsellor", revCounsellor);
      if (startDate)
        params.append("start_date", startDate.toISOString().split("T")[0]);
      if (endDate)
        params.append("end_date", endDate.toISOString().split("T")[0]);

      const res = await axios.get(
        `https://operating-media-backend.onrender.com/api/followups-dashboard/?${params.toString()}`,
      );
      setData(res.data);
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch data whenever the primary filters change
  useEffect(() => {
    fetchDashboardData();
  }, [revBranch, revCounsellor, startDate, endDate]);

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === "None" || dateStr === "N/A" || dateStr === "—")
      return "—";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  const revenueTotals = data.revenue_details?.reduce(
    (acc, item) => {
      return {
        totalFees: acc.totalFees + (parseFloat(item.total_fees) || 0),
        totalReceived: acc.totalReceived + (parseFloat(item.received) || 0),
        totalPending: acc.totalPending + (parseFloat(item.pending) || 0),
      };
    },
    { totalFees: 0, totalReceived: 0, totalPending: 0 },
  );

  // --- FILTER LOGIC (FRONTEND ONLY) ---
  const filteredFollowups = data.followups.filter((f) => {
    const isToday = f.status === "today";
    const filterFirstName = followupCounsellorFilter.split(" ")[0];
    const matchesCounsellor =
      followupCounsellorFilter === "All" ||
      f.counsellor.toLowerCase().includes(filterFirstName.toLowerCase());
    return isToday && matchesCounsellor;
  });

  const filteredFees =
    data.reminders?.filter((f) => {
      if (feeBranchFilter === "All") return true;
      return f.branch?.toLowerCase().includes(feeBranchFilter.toLowerCase());
    }) || [];

  return (
    <div className={`app-container ${isCollapsed ? "is-collapsed" : ""}`}>
      <div className="main-viewport">
        <Navbar onToggle={() => setIsCollapsed(!isCollapsed)} />

        <main className="content-scroll-area">
          <header className="page-header-flex">
            <div className="header-left">
              <div className="breadcrumb-nav">
                <span onClick={() => navigate("/dashboard")}>Dashboards</span>
                <ChevronRight size={12} />
                <span className="current-page">Dashboard Analysis</span>
              </div>
              <h2 className="page-title-bold">Dashboard Queue</h2>
            </div>
          </header>

          {loading && !data.stats.revenue ? (
            <div className="loader">Analyzing Dashboard...</div>
          ) : (
            <>
              {/* TOP STATS */}
              <div className="dashboard-grid">
                <div className="crm-stat-card red">
                  <div className="card-header">
                    <div className="icon-box">
                      <AlertCircle size={20} />
                    </div>
                    <span className="card-label">Today's Followups</span>
                  </div>
                  <div className="card-body">
                    <h3>{data.stats.today || 0}</h3>
                    <p>Needs immediate action</p>
                  </div>
                </div>
                <div className="crm-stat-card blue">
                  <div className="card-header">
                    <div className="icon-box">
                      <Clock size={20} />
                    </div>
                    <span className="card-label">Upcoming</span>
                  </div>
                  <div className="card-body">
                    <h3>{data.stats.upcoming || 0}</h3>
                    <p>Scheduled for future</p>
                  </div>
                </div>
                <div className="crm-stat-card green">
                  <div className="card-header">
                    <div className="icon-box">
                      <IndianRupee size={20} />
                    </div>
                    <span className="card-label">Revenue Generated</span>
                  </div>
                  <div className="card-body">
                    <h3>₹{data.stats.revenue?.toLocaleString("en-IN") || 0}</h3>
                    <p>Total Paid Collections</p>
                  </div>
                </div>
              </div>

              {/* TODAY'S ACTIVE FOLLOWUP QUEUE */}
              <div className="data-display-card mt-30">
                <div className="data-toolbar">
                  <div className="toolbar-content">
                    <span className="branch-title">
                      Today's Active Followup Queue
                    </span>
                    <select
                      className="branch-filter-select"
                      value={followupCounsellorFilter}
                      onChange={(e) =>
                        setFollowupCounsellorFilter(e.target.value)
                      }
                    >
                      <option value="All">All Counsellors</option>
                      {data.counsellors?.map((name, i) => (
                        <option key={i} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="table-sticky-wrapper">
                  <table className="modern-data-table">
                    <thead>
                      <tr>
                        <th style={{ width: "20%" }}>CUSTOMER</th>
                        <th style={{ width: "14%" }}>PHONE</th>
                        <th style={{ width: "14%" }}>COUNSELLOR</th>
                        <th style={{ width: "13%" }}>FOLLOWUP DATE</th>
                        <th style={{ width: "31%" }}>LAST REMARK</th>
                        <th style={{ width: "8%" }} className="text-center">
                          ACTION
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFollowups.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="loader">
                            No followups scheduled for today.
                          </td>
                        </tr>
                      ) : (
                        filteredFollowups.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <div className="user-profile-cell">
                                <div className="avatar-letter">
                                  {item.customer_name.charAt(0)}
                                </div>
                                <span className="user-full-name">
                                  {item.customer_name}
                                </span>
                              </div>
                            </td>
                            <td className="phone-num-text">{item.mobile}</td>
                            <td className="counsellor-name">
                              {item.counsellor}
                            </td>
                            <td>
                              <span className="join-date-text">
                                {formatDate(item.followup_date)}
                              </span>
                            </td>
                            <td className="email-text-truncate">
                              {item.remark}
                            </td>
                            <td className="text-center">
                              <button
                                className="btn-icon-round"
                                onClick={() =>
                                  navigate("/leads-view", {
                                    state: { openLeadId: item.id },
                                  })
                                }
                              >
                                <ArrowRight size={15} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* HOT LEADS PRIORITY QUEUE */}
              <div className="data-display-card mt-30 hot-leads-border">
                <div className="data-toolbar">
                  <div className="toolbar-left">
                    <Zap size={18} color="#ef4444" />
                    <span className="branch-title">
                      Hot Leads Priority Queue
                    </span>
                  </div>
                </div>
                <div className="table-sticky-wrapper">
                  <table className="modern-data-table">
                    <thead>
                      <tr>
                        <th style={{ width: "18%" }}>CUSTOMER</th>
                        <th style={{ width: "12%" }}>PHONE</th>
                        <th style={{ width: "12%" }}>COUNSELLOR</th>
                        <th style={{ width: "20%" }}>COURSE</th>
                        <th style={{ width: "30%" }}>LAST REMARK</th>
                        <th style={{ width: "8%" }} className="text-center">
                          ACTION
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.hot_leads?.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="loader">
                            No hot leads tagged yet.
                          </td>
                        </tr>
                      ) : (
                        data.hot_leads.map((lead) => (
                          <tr key={lead.id}>
                            <td>
                              <div className="user-profile-cell">
                                <div className="avatar-letter hot-avatar">
                                  {lead.name.charAt(0)}
                                </div>
                                <span className="user-full-name">
                                  {lead.name}
                                </span>
                              </div>
                            </td>
                            <td className="phone-num-text">{lead.mobile}</td>
                            <td
                              className="phone-num-text"
                              style={{ color: "#003873", fontWeight: "700" }}
                            >
                              {lead.counsellor}
                            </td>
                            <td>
                              <span className="course-pill-lite">
                                {lead.course}
                              </span>
                            </td>
                            <td
                              className="email-text-truncate"
                              title={lead.last_remark}
                            >
                              {lead.last_remark}
                            </td>
                            <td className="text-center">
                              <button
                                className="btn-icon-round hot-btn"
                                onClick={() =>
                                  navigate("/leads-view", {
                                    state: { openLeadId: lead.id },
                                  })
                                }
                              >
                                <ArrowRight size={15} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* UPCOMING & OVERDUE FEES */}
              <div className="data-display-card mt-40 fee-reminder-card">
                <div className="data-toolbar fee-toolbar">
                  <div className="toolbar-content">
                    <div className="toolbar-left">
                      <HandCoins size={18} className="title-icon-blue" />
                      <span className="branch-title">
                        Upcoming & Overdue Fees
                      </span>
                    </div>
                    <select
                      className="branch-filter-select"
                      value={feeBranchFilter}
                      onChange={(e) => setFeeBranchFilter(e.target.value)}
                    >
                      <option value="All">All Branches</option>
                      <option value="Andheri">Andheri</option>
                      <option value="Borivali">Borivali</option>
                    </select>
                  </div>
                </div>
                <div className="table-sticky-wrapper">
                  <table
                    className="modern-data-table"
                    style={{ tableLayout: "fixed", width: "100%" }}
                  >
                    <thead>
                      <tr>
                        <th style={{ width: "23%" }}>STUDENT</th>
                        <th style={{ width: "30%" }}>COURSE</th>
                        <th style={{ width: "13%" }}>DUE DATE</th>
                        <th style={{ width: "12%" }}>AMOUNT</th>
                        <th style={{ width: "14%" }}>STATUS</th>
                        <th style={{ width: "8%" }} className="text-center">
                          ACTION
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFees.map((fee, index) => (
                        <tr key={index}>
                          <td>
                            <div className="user-profile-cell">
                              <div
                                className={`avatar-letter ${fee.priority === "overdue" ? "bg-red-shaded" : "fee-avatar"}`}
                              >
                                {fee.customer_name.charAt(0)}
                              </div>
                              <span className="user-full-name truncate-text">
                                {fee.customer_name}
                              </span>
                            </div>
                          </td>
                          <td>
                            <span className="course-pill-lite">
                              {fee.course}
                            </span>
                          </td>
                          <td className="due-date-text">
                            {formatDate(fee.due_date)}
                          </td>
                          <td className="fee-amount-bold">₹{fee.amount}</td>
                          <td>
                            <span className={`status-pill ${fee.priority}`}>
                              {fee.priority.toUpperCase()}
                            </span>
                          </td>
                          <td className="text-center">
                            <button
                              className="btn-icon-round fee-btn"
                              onClick={() =>
                                navigate("/manage-admission", {
                                  state: { openAdmissionId: fee.id },
                                })
                              }
                            >
                              <ArrowRight size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* NEW SECTION: TOTAL FEE GENERATED DETAILS */}
              {/* NEW SECTION: TOTAL FEE GENERATED DETAILS */}
              <div className="data-display-card mt-40">
                <div className="data-toolbar" style={{ background: "#fcfdfe" }}>
                  <div className="toolbar-content">
                    <div className="toolbar-left">
                      <IndianRupee size={18} className="title-icon-blue" />
                      <span className="branch-title">Revenue Details</span>
                    </div>

                    {/* CONSOLIDATED FILTERS FOR REVENUE SECTION */}
                    <div
                      className="rev-filter-group"
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                      }}
                    >
                      <select
                        className="branch-filter-select"
                        value={revBranch}
                        onChange={(e) => setRevBranch(e.target.value)}
                      >
                        <option value="All">All Branches</option>
                        <option value="Andheri">Andheri</option>
                        <option value="Borivali">Borivali</option>
                      </select>

                      <select
                        className="branch-filter-select"
                        value={revCounsellor}
                        onChange={(e) => setRevCounsellor(e.target.value)}
                      >
                        <option value="All">All Counsellors</option>
                        {data.counsellors?.map((name, i) => (
                          <option key={i} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>

                      <div
                        className="date-picker-wrapper"
                        style={{ height: "36px", minWidth: "220px" }}
                      >
                        <CalendarIcon size={14} className="calendar-icon" />
                        <DatePicker
                          selectsRange={true}
                          startDate={startDate}
                          endDate={endDate}
                          onChange={(update) => setDateRange(update)}
                          placeholderText="Date Range Selection"
                          dateFormat="MMM d, yyyy"
                          className="date-input-field"
                        />
                        {(startDate || endDate) && (
                          <button
                            className="clear-date-btn"
                            onClick={() => setDateRange([null, null])}
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>

                      <button
                        className="btn-icon-round"
                        title="Reset Filters"
                        onClick={() => {
                          setRevBranch("All");
                          setRevCounsellor("All");
                          setDateRange([null, null]);
                        }}
                      >
                        <RotateCcw size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* WRAPPED CONTAINER FOR FIXED FOOTER */}
                <div className="revenue-table-container">
                  <div className="revenue-table-scroll-wrapper">
                    <table
                      className="modern-data-table"
                      style={{ tableLayout: "fixed", width: "100%" }}
                    >
                      <thead>
                        <tr>
                          <th style={{ width: "12%" }}>DATE</th>
                          <th style={{ width: "22%" }}>STUDENT NAME</th>
                          <th style={{ width: "20%" }}>COURSE</th>
                          <th style={{ width: "14%" }}>COUNSELLOR</th>
                          <th style={{ width: "11%" }}>TOTAL FEE</th>
                          <th style={{ width: "10%" }}>RECEIVED</th>
                          <th style={{ width: "11%" }}>PENDING</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.revenue_details?.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="loader">
                              No collection records found.
                            </td>
                          </tr>
                        ) : (
                          data.revenue_details?.map((item, index) => (
                            <tr key={index}>
                              <td className="join-date-text">
                                {formatDate(item.date)}
                              </td>
                              <td>
                                <div className="user-profile-cell">
                                  <div className="avatar-letter">
                                    {item.name ? item.name.charAt(0) : "?"}
                                  </div>
                                  <span className="user-full-name truncate-text">
                                    {item.name}
                                  </span>
                                </div>
                              </td>

                              <td>
                                <span className="course-pill-lite">
                                  {item.course}
                                </span>
                              </td>
                              <td className="counsellor-name">
                                {item.counsellor}
                              </td>
                              <td className="fee-amount-bold">
                                ₹{item.total_fees?.toLocaleString("en-IN")}
                              </td>
                              <td
                                className="fee-amount-bold"
                                style={{ color: "#16a34a" }}
                              >
                                ₹{item.received?.toLocaleString("en-IN")}
                              </td>
                              <td
                                className="fee-amount-bold"
                                style={{ color: "#dc2626" }}
                              >
                                ₹{item.pending?.toLocaleString("en-IN")}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* FIXED FOOTER OUTSIDE SCROLL AREA */}
                  {data.revenue_details?.length > 0 && (
                    <div className="revenue-fixed-footer">
                      <table style={{ tableLayout: "fixed", width: "100%" }}>
                        <tbody>
                          <tr>
                            {/* Label spanning first 4 columns: DATE + STUDENT NAME + COURSE + COUNSELLOR */}
                            <td
                              colSpan="4"
                              className="summary-label"
                              style={{ width: "68%" }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <span
                                  style={{
                                    color: "#003873",
                                    fontWeight: "800",
                                  }}
                                >
                                  TOTAL STUDENTS:{" "}
                                  <span style={{ fontSize: "15px" }}>
                                    {data.revenue_details.length}
                                  </span>
                                </span>
                                <span>TOTAL:</span>
                              </div>
                            </td>

                            {/* TOTAL FEE COLUMN (11%) */}
                            <td
                              className="summary-value summary-total"
                              style={{ width: "11%" }}
                            >
                              ₹{revenueTotals.totalFees.toLocaleString("en-IN")}
                            </td>

                            {/* RECEIVED COLUMN (10%) */}
                            <td
                              className="summary-value summary-received"
                              style={{ width: "10%" }}
                            >
                              ₹
                              {revenueTotals.totalReceived.toLocaleString(
                                "en-IN",
                              )}
                            </td>

                            {/* PENDING COLUMN (11%) */}
                            <td
                              className="summary-value summary-pending"
                              style={{ width: "11%" }}
                            >
                              ₹
                              {revenueTotals.totalPending.toLocaleString(
                                "en-IN",
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
