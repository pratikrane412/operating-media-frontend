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
  Users,
  GraduationCap,
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
  const [revBranch, setRevBranch] = useState("All");
  const [revCounsellor, setRevCounsellor] = useState("All");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  // --- INDEPENDENT SORT STATES ---
  const [sortFol, setSortFol] = useState({
    field: "followup_date",
    order: "desc",
  });
  const [sortHot, setSortHot] = useState({
    field: "enquiry_date",
    order: "desc",
  });
  const [sortFee, setSortFee] = useState({ field: "due_date", order: "asc" });
  const [sortRev, setSortRev] = useState({ field: "date", order: "desc" });

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("admin") || "{}");

  // --- HELPERS ---
  const parseDate = (dateStr) => {
    if (!dateStr || dateStr === "—" || dateStr === "None") return new Date(0);
    // Handle YYYY-MM-DD
    if (dateStr.includes("-") && dateStr.split("-")[0].length === 4)
      return new Date(dateStr);
    // Handle DD/MM/YYYY
    if (dateStr.includes("/")) {
      const [d, m, y] = dateStr.split("/");
      return new Date(y, m - 1, d);
    }
    return new Date(dateStr);
  };

  const sortData = (list, sortObj) => {
    return [...list].sort((a, b) => {
      let valA = a[sortObj.field];
      let valB = b[sortObj.field];
      if (sortObj.field.includes("date") || sortObj.field.includes("time")) {
        valA = parseDate(valA);
        valB = parseDate(valB);
      }
      if (valA < valB) return sortObj.order === "asc" ? -1 : 1;
      if (valA > valB) return sortObj.order === "asc" ? 1 : -1;
      return 0;
    });
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("branch", revBranch);
      params.append("counsellor", revCounsellor);
      if (startDate && endDate) {
        params.append("start_date", startDate.toISOString().split("T")[0]);
        params.append("end_date", endDate.toISOString().split("T")[0]);
      }
      const res = await axios.get(
        `https://operating-media-backend.onrender.com/api/followups-dashboard/?${params.toString()}`,
      );
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

  // --- DYNAMIC TOTALS ---
  const revenueTotals = data.revenue_details?.reduce(
    (acc, item) => ({
      totalFees: acc.totalFees + (parseFloat(item.total_fees) || 0),
      totalReceived: acc.totalReceived + (parseFloat(item.received) || 0),
      totalPending: acc.totalPending + (parseFloat(item.pending) || 0),
    }),
    { totalFees: 0, totalReceived: 0, totalPending: 0 },
  );

  // --- FILTERED & SORTED LISTS ---
  const followupList = sortData(
    data.followups.filter((f) => {
      const nameMatch =
        followupCounsellorFilter === "All" ||
        f.counsellor
          .toLowerCase()
          .includes(followupCounsellorFilter.split(" ")[0].toLowerCase());
      return f.status === "today" && nameMatch;
    }),
    sortFol,
  );

  const hotLeadsList = sortData(data.hot_leads || [], sortHot);

  const feesList = sortData(
    data.reminders?.filter(
      (f) =>
        feeBranchFilter === "All" ||
        f.branch?.toLowerCase().includes(feeBranchFilter.toLowerCase()),
    ) || [],
    sortFee,
  );

  const revenueList = sortData(data.revenue_details || [], sortRev);

  // Sorting Handler Helper
  const toggleSort = (setter, current, field) => {
    setter({
      field,
      order:
        current.field === field && current.order === "asc" ? "desc" : "asc",
    });
  };

  return (
    <div className={`app-container ${isCollapsed ? "is-collapsed" : ""}`}>
      <div className="main-viewport">
        <Navbar onToggle={() => setIsCollapsed(!isCollapsed)} />
        <main className="content-scroll-area">
           

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
                    <p>Immediate action</p>
                  </div>
                </div>
                <div className="crm-stat-card blue">
                  <div className="card-header">
                    <div className="icon-box">
                      <Users size={20} />
                    </div>
                    <span className="card-label">Total Leads</span>
                  </div>
                  <div className="card-body">
                    <h3>{data.stats.total_leads || 0}</h3>
                    <p>Registered enquiries</p>
                  </div>
                </div>
                <div className="crm-stat-card purple">
                  <div className="card-header">
                    <div
                      className="icon-box"
                      style={{ background: "#f3e8ff", color: "#7e22ce" }}
                    >
                      <GraduationCap size={20} />
                    </div>
                    <span className="card-label">Total Admissions</span>
                  </div>
                  <div className="card-body">
                    <h3>{data.stats.total_admissions || 0}</h3>
                    <p>Enrolled students</p>
                  </div>
                </div>
                <div className="crm-stat-card green">
                  <div className="card-header">
                    <div className="icon-box">
                      <IndianRupee size={20} />
                    </div>
                    <span className="card-label">Gross Collection</span>
                  </div>
                  <div className="card-body">
                    <h3>₹{data.stats.revenue?.toLocaleString("en-IN") || 0}</h3>
                    <p>Total Revenue</p>
                  </div>
                </div>
              </div>

              {/* TODAY'S ACTIVE FOLLOWUP QUEUE */}
              <div className="data-display-card mt-30">
                <div className="data-toolbar">
                  <div className="toolbar-content">
                    <span className="branch-title">TODAY'S ACTIVE FOLLOWUP QUEUE</span>
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
                        <th style={{ width: "18%" }}>CUSTOMER</th>
                        <th style={{ width: "12%" }}>PHONE</th>
                        <th style={{ width: "12%" }}>COUNSELLOR</th>
                        <th
                          style={{ width: "12%", cursor: "pointer" }}
                          onClick={() =>
                            toggleSort(setSortFol, sortFol, "enquiry_date")
                          }
                        >
                          ENQUIRY DATE{" "}
                          {sortFol.field === "enquiry_date" &&
                            (sortFol.order === "asc" ? "↑" : "↓")}
                        </th>
                        <th
                          style={{ width: "12%", cursor: "pointer" }}
                          onClick={() =>
                            toggleSort(setSortFol, sortFol, "followup_date")
                          }
                        >
                          FOLLOWUP DATE{" "}
                          {sortFol.field === "followup_date" &&
                            (sortFol.order === "asc" ? "↑" : "↓")}
                        </th>
                        <th style={{ width: "26%" }}>LAST REMARK</th>
                        <th style={{ width: "8%" }} className="text-center">
                          ACTION
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {followupList.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="loader">
                            No followups scheduled for today.
                          </td>
                        </tr>
                      ) : (
                        followupList.map((item) => (
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
                                {formatDate(item.enquiry_date)}
                              </span>
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

              {/* HOT LEADS */}
              <div className="data-display-card mt-30 hot-leads-border">
                <div className="data-toolbar">
                  <div className="toolbar-left">
                    <Zap size={18} color="#ef4444" />
                    <span className="branch-title">Priority Hot Leads</span>
                  </div>
                </div>
                <div className="table-sticky-wrapper">
                  <table className="modern-data-table">
                    <thead>
                      <tr>
                        <th style={{ width: "16%" }}>CUSTOMER</th>
                        <th style={{ width: "11%" }}>PHONE</th>
                        <th style={{ width: "11%" }}>COUNSELLOR</th>
                        <th style={{ width: "14%" }}>COURSE</th>
                        <th
                          style={{ width: "11%", cursor: "pointer" }}
                          onClick={() =>
                            toggleSort(setSortHot, sortHot, "enquiry_date")
                          }
                        >
                          ENQUIRY DATE{" "}
                          {sortHot.field === "enquiry_date" &&
                            (sortHot.order === "asc" ? "↑" : "↓")}
                        </th>
                        <th
                          style={{ width: "11%", cursor: "pointer" }}
                          onClick={() =>
                            toggleSort(setSortHot, sortHot, "followup_date")
                          }
                        >
                          FOLLOWUP DATE{" "}
                          {sortHot.field === "followup_date" &&
                            (sortHot.order === "asc" ? "↑" : "↓")}
                        </th>
                        <th style={{ width: "18%" }}>LAST REMARK</th>
                        <th style={{ width: "8%" }} className="text-center">
                          ACTION
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {hotLeadsList.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="loader">
                            No hot leads tagged.
                          </td>
                        </tr>
                      ) : (
                        hotLeadsList.map((lead) => (
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
                            <td>
                              <span className="join-date-text">
                                {formatDate(lead.enquiry_date)}
                              </span>
                            </td>
                            <td>
                              <span className="join-date-text">
                                {formatDate(lead.followup_date)}
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

              {/* PENDING PAYMENTS */}
              <div className="data-display-card mt-40 fee-reminder-card">
                <div className="data-toolbar">
                  <div className="toolbar-content">
                    <div className="toolbar-left">
                      <HandCoins size={18} className="title-icon-blue" />
                      <span className="branch-title">Pending Payments</span>
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
                        <th style={{ width: "18%" }}>STUDENT</th>
                        <th style={{ width: "24%" }}>COURSE</th>
                        <th
                          style={{ width: "12%", cursor: "pointer" }}
                          onClick={() =>
                            toggleSort(setSortFee, sortFee, "admission_date")
                          }
                        >
                          ADMISSION DATE{" "}
                          {sortFee.field === "admission_date" &&
                            (sortFee.order === "asc" ? "↑" : "↓")}
                        </th>
                        <th
                          style={{ width: "12%", cursor: "pointer" }}
                          onClick={() =>
                            toggleSort(setSortFee, sortFee, "due_date")
                          }
                        >
                          DUE DATE{" "}
                          {sortFee.field === "due_date" &&
                            (sortFee.order === "asc" ? "↑" : "↓")}
                        </th>
                        <th style={{ width: "12%" }}>AMOUNT</th>
                        <th style={{ width: "14%" }}>STATUS</th>
                        <th style={{ width: "8%" }} className="text-center">
                          ACTION
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {feesList.map((fee, index) => (
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
                          <td>
                            <span className="join-date-text">
                              {formatDate(fee.admission_date)}
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

              {/* REVENUE DETAILS SECTION */}
              <div className="data-display-card mt-40">
                <div className="data-toolbar" style={{ background: "#fcfdfe" }}>
                  <div className="toolbar-content">
                    <div className="toolbar-left">
                      <IndianRupee size={18} className="title-icon-blue" />
                      <span className="branch-title">Revenue Details</span>
                    </div>
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
                          placeholderText="Filter by Date"
                          dateFormat="MMM d, yyyy"
                          monthsShown={1}
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
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
                        title="Reset"
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
                <div className="revenue-table-container">
                  <div className="revenue-table-scroll-wrapper">
                    <table
                      className="modern-data-table"
                      style={{ tableLayout: "fixed", width: "100%" }}
                    >
                      <thead>
                        <tr>
                          <th style={{ width: "22%" }}>STUDENT NAME</th>
                          <th
                            style={{ width: "12%", cursor: "pointer" }}
                            onClick={() =>
                              toggleSort(setSortRev, sortRev, "date")
                            }
                          >
                            ADMISSION DATE{" "}
                            {sortRev.field === "date" &&
                              (sortRev.order === "asc" ? "↑" : "↓")}
                          </th>
                          <th style={{ width: "20%" }}>COURSE</th>
                          <th style={{ width: "14%" }}>COUNSELLOR</th>
                          <th style={{ width: "11%" }}>TOTAL FEE</th>
                          <th style={{ width: "10%" }}>RECEIVED</th>
                          <th style={{ width: "11%" }}>PENDING</th>
                        </tr>
                      </thead>
                      <tbody>
                        {revenueList.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="loader">
                              No collection records found.
                            </td>
                          </tr>
                        ) : (
                          revenueList.map((item, index) => (
                            <tr key={index}>
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
                              <td className="join-date-text">
                                {formatDate(item.date)}
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
                  {data.revenue_details?.length > 0 && (
                    <div className="revenue-fixed-footer">
                      <table style={{ tableLayout: "fixed", width: "100%" }}>
                        <tbody>
                          <tr className="table-summary-footer">
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
                                <span style={{ marginRight: "10px" }}>
                                  TOTALS:
                                </span>
                              </div>
                            </td>
                            <td
                              className="summary-value summary-total"
                              style={{ width: "11%" }}
                            >
                              ₹{revenueTotals.totalFees.toLocaleString("en-IN")}
                            </td>
                            <td
                              className="summary-value summary-received"
                              style={{ width: "10%" }}
                            >
                              ₹
                              {revenueTotals.totalReceived.toLocaleString(
                                "en-IN",
                              )}
                            </td>
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
