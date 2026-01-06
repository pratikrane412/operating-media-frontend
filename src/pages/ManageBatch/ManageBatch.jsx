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
  ChevronRight,
  Calendar,
} from "lucide-react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import BatchDrawer from "../../components/BatchDrawer/BatchDrawer";
import "./ManageBatch.css";
import { hasPermission } from "../../utils/permissionCheck"; // Added import

const ManageBatch = () => {
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("admin") || "{}");

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === "N/A" || dateStr === "No Date") return dateStr;
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}/${month}/${year}`;
    }
    return dateStr;
  };

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const branchParam = user.branch_id ? `?branch_id=${user.branch_id}` : "";
      const res = await axios.get(
        `https://operating-media-backend.onrender.com/api/batches/manage/${branchParam}`
      );
      setBatches(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, [user.branch_id]);

  const handleDeleteBatch = async (id) => {
    if (window.confirm("Are you sure you want to delete this batch?")) {
      try {
        await axios.delete(
          `https://operating-media-backend.onrender.com/api/batches/${id}/delete/`
        );
        fetchBatches();
      } catch (err) {
        alert("Failed to delete batch.");
      }
    }
  };

  const handleEditClick = (id) => {
    setSelectedBatchId(id);
    setIsDrawerOpen(true);
  };

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

            {/* PERMISSION CHECK: ADD BATCH */}
            {hasPermission("add batch") && (
              <button
                className="btn-add-new"
                onClick={() => {
                  setSelectedBatchId(null);
                  setIsDrawerOpen(true);
                }}
              >
                <Plus size={18} /> ADD NEW BATCH
              </button>
            )}
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
                        <td className="text-right">
                          <div className="action-btns-group">
                            {/* PERMISSION CHECK: EDIT BATCH */}
                            {hasPermission("edit batch") && (
                              <button
                                className="btn-action edit"
                                onClick={() => handleEditClick(batch.id)}
                              >
                                <Edit3 size={16} />
                              </button>
                            )}

                            {/* PERMISSION CHECK: DELETE BATCH */}
                            {hasPermission("delete batch") && (
                              <button
                                className="btn-action delete"
                                onClick={() => handleDeleteBatch(batch.id)}
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
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

      <BatchDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedBatchId(null);
        }}
        onUpdate={fetchBatches}
        batchId={selectedBatchId}
      />
    </div>
  );
};

export default ManageBatch;
