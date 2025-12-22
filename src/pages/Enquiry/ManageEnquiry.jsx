import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Search,
  Plus,
  FileUp,
  Filter,
  RefreshCcw,
  MessageSquare,
  Edit3,
  Trash2,
  Calendar,
} from "lucide-react";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./ManageEnquiry.css";

const ManageEnquiry = () => {
  const { branchId } = useParams();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/branch/${branchId}/enquiries/`)
      .then((res) => {
        setEnquiries(res.data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [branchId]);

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <main className="dashboard-main">
        <header className="page-header">
          <div className="header-left">
            <div className="breadcrumb">
              <span onClick={() => navigate("/dashboard")}>Dashboard</span>
              <span className="separator">/</span>
              <span className="current">Manage Enquiry</span>
            </div>
            <h2 className="page-title">Enquiry Management</h2>
          </div>
          <div className="header-actions">
            <button className="btn-secondary">
              <FileUp size={18} /> UPLOAD EXCEL
            </button>
            <button className="btn-primary">
              <Plus size={18} /> ADD NEW
            </button>
          </div>
        </header>

        {/* Modern Filter Section */}
        <div className="filter-card">
          <div className="filter-header">
            <Filter size={16} /> FILTERS
          </div>
          <div className="filter-grid">
            <div className="filter-group">
              <label>Student Source</label>
              <select>
                <option>Select Source</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Select Counsellor</label>
              <select>
                <option>All Counsellor</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Date Range</label>
              <div className="date-inputs">
                <input type="date" />
                <input type="date" />
              </div>
            </div>
          </div>
          <div className="filter-actions">
            <button className="btn-reset">RESET</button>
            <button className="btn-apply">APPLY FILTERS</button>
          </div>
        </div>

        {/* Enquiry Table */}
        <div className="table-card">
          <table className="enquiry-table">
            <thead>
              <tr>
                {" "}
                {/* Ensure this TR exists around your TH tags */}
                <th>
                  <input type="checkbox" />
                </th>
                <th>Student Details</th>
                <th>Course</th>
                <th>Contact</th>
                <th>Enquiry Date</th>
                <th>Status</th>
                <th className="text-right">Options</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((item) => (
                <tr key={item.id}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>
                    <div className="student-info">
                      <p className="name">{item.name}</p>
                      <span className="source-tag">
                        Ref: {item.source || "Direct"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="course-name">
                      {item.course || "Digital Marketing"}
                    </span>
                  </td>
                  <td>
                    <span className="mobile-no">{item.mobile}</span>
                  </td>
                  <td>
                    <div className="date-info">
                      <Calendar size={14} />
                      {item.created_at}
                    </div>
                  </td>
                  <td>
                    <span className="status-completed">Completed</span>
                  </td>
                  <td>
                    <div className="action-row">
                      <button className="row-btn cycle">
                        <RefreshCcw size={14} />
                      </button>
                      <button className="row-btn plus">
                        <Plus size={14} />
                      </button>
                      <button className="row-btn msg">
                        <MessageSquare size={14} />
                      </button>
                      <button className="row-btn edit">
                        <Edit3 size={14} />
                      </button>
                      <button className="row-btn del">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default ManageEnquiry;
