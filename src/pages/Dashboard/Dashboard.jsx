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
    stats: {},
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("admin") || "{}");

  useEffect(() => {
    const branchParam = user.branch_id ? `?branch_id=${user.branch_id}` : "";
    axios
      .get(
        `https://operating-media-backend.onrender.com/api/followups-dashboard/${branchParam}`
      )
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [user.branch_id]);

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === "None") return "N/A";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

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

              {/* FOLLOWUP LIST - FILTERED TO TODAY ONLY */}
              <div className="data-display-card mt-30">
                <div className="data-toolbar">
                  <span className="branch-title">
                    Today's Active Followup Queue
                  </span>
                </div>
                <div className="table-sticky-wrapper">
                  <table className="modern-data-table">
                    <thead>
                      <tr>
                        <th>CUSTOMER</th>
                        <th>PHONE</th>
                        <th>FOLLOWUP DATE</th>
                        <th>LAST REMARK</th>
                        <th>PRIORITY</th>
                        <th className="text-center">ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.followups.filter((f) => f.status === "today")
                        .length === 0 ? (
                        <tr>
                          <td colSpan="6" className="loader">
                            No followups scheduled for today.
                          </td>
                        </tr>
                      ) : (
                        data.followups
                          .filter((f) => f.status === "today")
                          .map((item) => (
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
                              <td>
                                <span className="join-date-text">
                                  {formatDate(item.followup_date)}
                                </span>
                              </td>
                              <td className="email-text-truncate">
                                {item.remark}
                              </td>
                              <td>
                                <span className={`status-pill today`}>
                                  TODAY
                                </span>
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

              {/* HOT LEADS TABLE - ADDED AS REQUESTED */}
              <div className="data-display-card mt-30 hot-leads-border">
                <div className="data-toolbar">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
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
                        <th>CUSTOMER</th>
                        <th>PHONE</th>
                        <th>COURSE</th>
                        <th>ENQUIRY DATE</th>
                        <th className="text-center">ACTION</th>
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
                                <div
                                  className="avatar-letter"
                                  style={{
                                    background: "#fef2f2",
                                    color: "#ef4444",
                                  }}
                                >
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
                            <td className="phone-num-text">
                              {formatDate(lead.enquiry_date)}
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

              {/* FEES REMINDERS */}
              <div className="data-display-card mt-40 fee-reminder-card">
                <div className="data-toolbar fee-toolbar">
                  <div className="toolbar-left">
                    <HandCoins size={18} className="title-icon-blue" />
                    <span className="branch-title">Fees Payment Reminders</span>
                  </div>
                </div>
                <div className="table-sticky-wrapper">
                  <table className="modern-data-table">
                    <thead>
                      <tr>
                        <th>STUDENT</th>
                        <th>COURSE</th>
                        <th>INSTALLMENT</th>
                        <th>DUE DATE</th>
                        <th>AMOUNT</th>
                        <th>STATUS</th>
                        <th className="text-center">ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.reminders?.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="loader">
                            No pending fees for this period.
                          </td>
                        </tr>
                      ) : (
                        data.reminders.map((fee, index) => (
                          <tr key={`${fee.id}-${index}`}>
                            <td>
                              <div className="user-profile-cell">
                                <div className="avatar-letter fee-avatar">
                                  {fee.customer_name.charAt(0)}
                                </div>
                                <span className="user-full-name">
                                  {fee.customer_name}
                                </span>
                              </div>
                            </td>
                            <td>
                              <span className="course-pill-lite">
                                {fee.course}
                              </span>
                            </td>
                            <td className="inst-text">
                              Installment {fee.installment_no}
                            </td>
                            <td className="due-date-text">
                              <CalendarClock size={14} />{" "}
                              {formatDate(fee.due_date)}
                            </td>
                            <td className="fee-amount-bold">₹{fee.amount}</td>
                            <td>
                              <span className={`status-pill ${fee.priority}`}>
                                {fee.priority.toUpperCase()}
                              </span>
                            </td>
                            <td className="text-right">
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
