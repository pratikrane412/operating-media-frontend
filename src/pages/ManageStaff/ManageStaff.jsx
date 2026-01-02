import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Phone,
  Briefcase,
  Calendar,
  ChevronRight,
  PlusSquare, // Added for Assign Batch
} from "lucide-react";
import StaffDrawer from "../../components/StaffDrawer/StaffDrawer";
import StaffBatchDrawer from "../../components/StaffBatchDrawer/StaffBatchDrawer";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import "./ManageStaff.css";

const ManageStaff = () => {
  const [isAssignDrawerOpen, setIsAssignDrawerOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState({ id: null, name: "" });
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("admin") || "{}");

  const handleEditClick = (id) => {
    setSelectedStaffId(id);
    setIsDrawerOpen(true);
  };

  const handleAddNewClick = () => {
    setSelectedStaffId(null);
    setIsDrawerOpen(true);
  };

  // Logic for when the Assign button is clicked
  const handleAssignClick = (id, name) => {
    setCurrentStaff({ id, name });
    setIsAssignDrawerOpen(true);
  };

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const branchParam = user.branch_id ? `?branch_id=${user.branch_id}` : "";
      const res = await axios.get(
        `https://operating-media-backend.onrender.com/api/staff/manage/${branchParam}`
      );
      setStaff(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [user.branch_id]);

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === "N/A") return dateStr;
    
    // Check if the date contains '-' (standard YYYY-MM-DD)
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}/${month}/${year}`;
    }
    
    return dateStr; // Return original if format doesn't match
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this staff member?")) {
      try {
        await axios.delete(`https://operating-media-backend.onrender.com/api/staff/delete/${id}/`);
        fetchStaff();
      } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to remove staff member.");
      }
    }
  };

  const filtered = staff.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`app-container ${isCollapsed ? "is-collapsed" : ""}`}>
      <Sidebar isCollapsed={isCollapsed} />
      <div className="main-viewport">
        <Navbar onToggle={() => setIsCollapsed(!isCollapsed)} />
        <main className="content-area">
          <header className="staff-header-flex">
            <div className="header-left">
              <div className="breadcrumb">
                <span
                  onClick={() => navigate("/dashboard")}
                  style={{ cursor: "pointer" }}
                >
                  Dashboards
                </span>
                <ChevronRight size={12} className="sep" />
                <span className="current">Manage Staff</span>
              </div>
              <h2 className="page-title">Staff Management</h2>
            </div>
            <button className="btn-primary-blue" onClick={handleAddNewClick}>
              <Plus size={18} /> ADD NEW STAFF
            </button>
          </header>

          <div className="staff-card-ui">
            <div className="staff-toolbar-ui">
              <div className="search-input-wrapper">
                <Search size={18} className="search-icon-fixed" />
                <input
                  type="text"
                  placeholder="Search staff by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="table-wrapper-scroll">
              <table className="duralux-staff-table">
                <thead>
                  <tr>
                    <th>Staff Identity</th>
                    <th>Contact</th>
                    <th>Designation</th>
                    <th>Joining Date</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="loader-text">
                        Fetching Records...
                      </td>
                    </tr>
                  ) : (
                    filtered.map((member) => (
                      <tr key={member.id}>
                        <td>
                          <div className="staff-info-col">
                            <span
                              className={`role-tag ${member.type.toLowerCase()}`}
                            >
                              {member.type}
                            </span>
                            <span className="name-bold">{member.name}</span>
                            <span className="id-muted">ID: #{member.id}</span>
                          </div>
                        </td>
                        <td>
                          <div className="item-row">
                            <Phone size={14} /> {member.phone}
                          </div>
                        </td>
                        <td>
                          <div className="item-row">
                            <Briefcase size={14} /> {member.job}
                          </div>
                        </td>
                        <td>
                          <div className="item-row">
                            <Calendar size={14} /> {formatDate(member.joining_date)}
                          </div>
                        </td>
                        <td>
                          <span
                            className={`status-pill-modern ${
                              member.status === 0
                                ? "active-green"
                                : "disabled-red"
                            }`}
                          >
                            {member.status === 0 ? "Active" : "Disabled"}
                          </span>
                        </td>
                        <td>
                          <div className="action-row-group">
                            {/* --- NEW ASSIGN BATCH BUTTON (BLUE) --- */}
                            <button
                              className="btn-round-action assign-blue"
                              onClick={() =>
                                handleAssignClick(member.id, member.name)
                              }
                            >
                              <PlusSquare size={16} />
                            </button>

                            {/* Existing Edit and Delete */}
                            <button
                              className="btn-round-action edit-green"
                              title="Edit"
                              onClick={() => handleEditClick(member.id)}
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              className="btn-round-action delete-red"
                              title="Delete"
                              onClick={() => handleDelete(member.id)}
                            >
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
      <StaffDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedStaffId(null);
        }}
        onUpdate={fetchStaff}
        staffId={selectedStaffId}
      />
      <StaffBatchDrawer
        isOpen={isAssignDrawerOpen}
        onClose={() => setIsAssignDrawerOpen(false)}
        staffId={currentStaff.id}
        staffName={currentStaff.name}
      />
    </div>
  );
};

export default ManageStaff;
