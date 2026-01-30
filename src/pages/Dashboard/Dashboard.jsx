import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";
import "./Dashboard.css";

const Dashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [data, setData] = useState({
    followups: [],
    hot_leads: [],
    reminders: [],
    counsellors: [],
    stats: {},
  });
  const [loading, setLoading] = useState(true);

  const [feeBranchFilter, setFeeBranchFilter] = useState("All");
  const [followupCounsellorFilter, setFollowupCounsellorFilter] =
    useState("All");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("admin") || "{}");

  useEffect(() => {
    const params = new URLSearchParams();
    if (user.branch_id) params.append("branch_id", user.branch_id);
    if (user.role === "staff" && user.name)
      params.append("counsellor", user.name);

    axios
      .get(
        `https://operating-media-backend.onrender.com/api/followups-dashboard/?${params.toString()}`,
      )
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [user.branch_id, user.name, user.role]);

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === "None" || dateStr === "N/A") return "N/A";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  // FILTER LOGIC FOR FOLLOWUPS
  const filteredFollowups = data.followups.filter((f) => {
    const isToday = f.status === "today";

    const filterFirstName = followupCounsellorFilter.split(" ")[0];

    const matchesCounsellor =
      followupCounsellorFilter === "All" ||
      f.counsellor.toLowerCase().includes(filterFirstName.toLowerCase());

    return isToday && matchesCounsellor;
  });

  // FILTER LOGIC FOR FEES
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

          {loading ? (
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

              {/* TODAY'S FOLLOWUP LIST */}
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
                                onClick={() => navigate("/leads-view")}
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
                <div className="data-toolbar hot-toolbar">
                  <div className="toolbar-left">
                    <Zap size={18} className="title-icon-red" />
                    <span className="branch-title">
                      Hot Leads Priority Queue
                    </span>
                  </div>
                </div>
                <div className="table-sticky-wrapper">
                  <table className="modern-data-table">
                    <thead>
                      <tr>
                        <th style={{ width: "25%" }}>CUSTOMER</th>
                        <th style={{ width: "18%" }}>PHONE</th>
                        <th style={{ width: "35%" }}>COURSE</th>
                        <th style={{ width: "14%" }}>ENQUIRY DATE</th>
                        <th style={{ width: "8%" }} className="text-center">
                          ACTION
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.hot_leads?.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="loader">
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
                            <td>
                              <span className="course-pill-lite">
                                {lead.course}
                              </span>
                            </td>
                            <td className="join-date-text">
                              {formatDate(lead.enquiry_date)}
                            </td>
                            <td className="text-center">
                              <button
                                className="btn-icon-round hot-btn"
                                onClick={() => navigate("/leads-view")}
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

              {/* FEES REMINDERS */}
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
                  <table className="modern-data-table">
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
                      {filteredFees.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="loader">
                            No pending fees found for {feeBranchFilter}.
                          </td>
                        </tr>
                      ) : (
                        filteredFees.map((fee, index) => (
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
                                onClick={() => navigate("/manage-admission")}
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
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
