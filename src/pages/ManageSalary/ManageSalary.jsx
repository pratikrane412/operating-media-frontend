import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Search,
  IndianRupee,
  Phone,
  Briefcase,
  Calendar,
  ChevronRight,
  Download,
} from "lucide-react";
// import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import "./ManageSalary.css";

const ManageSalary = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("admin") || "{}");

  useEffect(() => {
    const fetchSalaryData = async () => {
      setLoading(true);
      try {
        const branchParam = user.branch_id
          ? `?branch_id=${user.branch_id}`
          : "";
        const res = await axios.get(
          `https://operating-media-backend.onrender.com/api/staff/salary-list/${branchParam}`
        );
        setStaffList(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSalaryData();
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

  const filteredStaff = staffList.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`app-container ${isCollapsed ? "is-collapsed" : ""}`}>
      {/* <Sidebar isCollapsed={isCollapsed} /> */}
      <div className="main-viewport">
        <Navbar onToggle={() => setIsCollapsed(!isCollapsed)} />
        <main className="content-area">
          <header className="salary-header">
            <div className="header-left">
              <div className="breadcrumb">
                <span onClick={() => navigate("/dashboard")}>Dashboards</span>
                <ChevronRight size={12} className="sep" />
                <span className="current">Staff Salary</span>
              </div>
              <h2 className="page-title">Payroll Management</h2>
            </div>
            <button className="btn-export">
              <Download size={18} /> EXPORT REPORT
            </button>
          </header>

          <div className="salary-card">
            <div className="salary-toolbar">
              <div className="search-wrapper">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search staff name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="table-container">
              <table className="duralux-salary-table">
                <thead>
                  <tr>
                    <th>Staff Member</th>
                    <th>Contact</th>
                    <th>Joining Date</th>
                    <th>Designation</th>
                    <th className="text-right">Monthly Salary</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="table-loader">
                        Loading Payroll Data...
                      </td>
                    </tr>
                  ) : (
                    filteredStaff.map((s) => (
                      <tr key={s.id}>
                        <td>
                          <div className="staff-primary">
                            <div className="avatar-mini">
                              {s.name.charAt(0)}
                            </div>
                            <div className="name-box">
                              <span className="staff-name">{s.name}</span>
                              <span className="staff-id">ID: #{s.id}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="info-row">
                            <Phone size={14} /> {s.phone}
                          </div>
                        </td>
                        <td>
                          <div className="info-row">
                            <Calendar size={14} /> {formatDate(s.joining_date)}
                          </div>
                        </td>
                        <td>
                          <div className="info-row">
                            <Briefcase size={14} /> {s.job}
                          </div>
                        </td>
                        <td className="text-right">
                          <div className="salary-pill">
                            <IndianRupee size={14} />
                            <span>
                              {parseFloat(s.salary).toLocaleString("en-IN")}
                            </span>
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

export default ManageSalary;
