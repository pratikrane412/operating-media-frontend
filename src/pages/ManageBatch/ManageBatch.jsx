import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Users,
  Clock,
  Calendar,
  ChevronRight,
} from "lucide-react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import "./ManageBatch.css";

const ManageBatch = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("admin") || "{}");

  useEffect(() => {
    const fetchBatches = async () => {
      setLoading(true);
      try {
        const branchParam = user.branch_id
          ? `?branch_id=${user.branch_id}`
          : "";
        const res = await axios.get(
          `http://127.0.0.1:8000/api/batches/manage/${branchParam}`
        );
        setBatches(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBatches();
  }, [user.branch_id]);

  const filtered = batches.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`app-container ${isCollapsed ? "is-collapsed" : ""}`}>
      <Sidebar isCollapsed={isCollapsed} />
      <div className="main-viewport">
        <Navbar onToggle={() => setIsCollapsed(!isCollapsed)} />
        <main className="content-area">
          <header className="batch-header">
            <div className="header-left">
              <div className="breadcrumb">
                <span
                  onClick={() => navigate("/dashboard")}
                  style={{ cursor: "pointer" }}
                >
                  Dashboards
                </span>
                <ChevronRight size={12} className="sep" />
                <span className="current">Manage Batch</span>
              </div>
              <h2 className="page-title">Batch Directory</h2>
            </div>
            <button className="btn-add-new">
              <Plus size={18} /> ADD NEW BATCH
            </button>
          </header>

          <div className="batch-card">
            <div className="batch-toolbar">
              <div className="search-wrapper">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by batch name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="table-container">
              <table className="duralux-table">
                <thead>
                  <tr>
                    <th>Batch Details</th>
                    <th>Branch</th>
                    <th>Schedule & Timing</th>
                    <th className="text-center">Students</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="table-loader">
                        Loading Batches...
                      </td>
                    </tr>
                  ) : (
                    filtered.map((batch) => (
                      <tr key={batch.id}>
                        <td>
                          <div className="batch-primary">
                            <span className="batch-name">{batch.name}</span>
                          </div>
                        </td>
                        <td>
                          <span className="branch-tag">{batch.branch}</span>
                        </td>
                        <td>
                          <div className="schedule-box">
                            <div className="sch-item"></div>
                            <div className="sch-item">
                              <Clock size={14} /> {batch.timing}
                            </div>
                          </div>
                        </td>
                        <td className="text-center">
                          <div className="student-badge">
                            <Users size={14} />
                            <span>{batch.student_count}</span>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`status-badge ${
                              batch.status === 0 ? "active" : "inactive"
                            }`}
                          >
                            {batch.status === 0 ? "Active" : "Disabled"}
                          </span>
                        </td>
                        <td>
                          <div className="action-btns-group">
                            <button className="btn-action edit">
                              <Edit3 size={16} />
                            </button>
                            <button className="btn-action delete">
                              <Trash2 size={16} />
                            </button>
                          </div>
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
    </div>
  );
};

export default ManageBatch;
