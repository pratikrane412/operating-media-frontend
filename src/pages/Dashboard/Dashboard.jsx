import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { Banknote, IndianRupee } from "lucide-react"; // Add these imports
import {
  Calendar,
  Clock,
  AlertCircle,
  User,
  Phone,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import "./Dashboard.css"; // Reusing your base dashboard styles

const Dashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [data, setData] = useState({ followups: [], stats: {} });
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
    if (!dateStr) return "N/A";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  };

  return (
    <div className={`app-container ${isCollapsed ? "is-collapsed" : ""}`}>
      <Sidebar isCollapsed={isCollapsed} />
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
            <div className="loader">Analyzing followups...</div>
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
                {/* NEW: REVENUE STAT CARD */}
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

              {/* FOLLOWUP LIST */}
              <div className="data-display-card mt-30">
                <div className="data-toolbar">
                  <span className="branch-title">Active Followup Queue</span>
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
                      {data.followups
                        .filter(
                          (f) => f.status === "today" || f.status === "upcoming"
                        ) // ADD THIS LINE
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
                              <span className={`status-pill ${item.status}`}>
                                {item.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="text-center">
                              <button
                                className="btn-icon-round"
                                onClick={() => navigate("/leads")}
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
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
