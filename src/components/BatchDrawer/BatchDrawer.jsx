import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  X,
  Briefcase,
  Clock,
  Building2,
  CheckCircle,
  Send,
  Users,
  Check,
  ChevronDown,
  Search as SearchIcon,
  UserPlus,
  UserMinus,
} from "lucide-react";
import "./BatchDrawer.css";
import { hasPermission } from "../../utils/permissionCheck";

const FormRow = ({ label, icon: Icon, children }) => (
  <div className="drawer-form-row">
    <label>{label}:</label>
    <div className="drawer-input-wrapper">
      <div className="drawer-icon-box">
        <Icon size={16} />
      </div>
      {children}
    </div>
  </div>
);

const BatchDrawer = ({ isOpen, onClose, onUpdate, batchId }) => {
  const user = JSON.parse(localStorage.getItem("admin") || "{}");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [studentsList, setStudentsList] = useState([]);
  const [isDropOpen, setIsDropOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropRef = useRef(null);

  const [options, setOptions] = useState({
    branches: [],
    counsellors: [],
  });

  const [formData, setFormData] = useState({
    name: "",
    timing: "",
    status: 0,
    branch_id: user.branch_id || 1,
    selected_student_ids: [],
  });

  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");

      // 1. Fetch Branches for the dropdown
      axios
        .get("https://operating-media-backend.onrender.com/api/leads/create/")
        .then((res) => setOptions(res.data))
        .catch((err) => console.error("Options error:", err));

      // 2. Fetch EVERY student (New specialized API)
      axios
        .get(`https://operating-media-backend.onrender.com/api/admissions/all-list/`)
        .then((res) => {
          setStudentsList(res.data || []);
        })
        .catch((err) => console.error("Error fetching all students", err));

      // 3. If Editing, fetch current batch details
      if (batchId) {
        axios
          .get(`https://operating-media-backend.onrender.com/api/batches/${batchId}/`)
          .then((res) => setFormData((prev) => ({ ...prev, ...res.data })))
          .catch((err) => console.error("Error fetching batch", err));
      } else {
        setFormData({
          name: "",
          timing: "",
          status: 0,
          branch_id: user.branch_id || 1,
          selected_student_ids: [],
        });
      }
    }
  }, [isOpen, batchId, user.branch_id]);

  // --- FIXED: Handle clicking outside the student dropdown ---
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setIsDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside); // FIXED NAME HERE
  }, []);

  const filteredStudents = studentsList.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleStudent = (id) => {
    setFormData((prev) => {
      const ids = prev.selected_student_ids.includes(id)
        ? prev.selected_student_ids.filter((item) => item !== id)
        : [...prev.selected_student_ids, id];
      return { ...prev, selected_student_ids: ids };
    });
  };

  const handleSelectAll = (select) => {
    const filteredIds = filteredStudents.map((s) => s.id);
    setFormData((prev) => ({
      ...prev,
      selected_student_ids: select
        ? [...new Set([...prev.selected_student_ids, ...filteredIds])]
        : prev.selected_student_ids.filter((id) => !filteredIds.includes(id)),
    }));
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (batchId) {
        await axios.put(`https://operating-media-backend.onrender.com/api/batches/${batchId}/`, formData);
      } else {
        await axios.post("https://operating-media-backend.onrender.com/api/batches/manage/", formData);
      }
      onUpdate();
      onClose();
    } catch (err) {
      alert("Error processing batch submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const requiredPermission = batchId ? "edit batch" : "add batch";

  return (
    <>
      <div className="drawer-overlay" onClick={onClose}></div>
      <div className={`drawer-container ${isOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <div className="header-title">
            <Briefcase size={20} />
            <h3>{batchId ? "Edit Batch" : "Create New Batch"}</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form className="drawer-body" onSubmit={handleSubmit}>
          <div className="drawer-section">

            <FormRow label="Batch Name" icon={Briefcase}>
              <input
                type="text"
                name="name"
                value={formData.name}
                required
                onChange={handleChange}
                placeholder="e.g. Master DM - Evening"
              />
            </FormRow>

            <div className="drawer-form-row" ref={dropRef}>
              <label>Assign Students:</label>
              <div className="multi-select-wrapper">
                <div
                  className={`drawer-input-wrapper select-trigger ${isDropOpen ? "active" : ""}`}
                  onClick={() => setIsDropOpen(!isDropOpen)}
                >
                  <div className="drawer-icon-box"><Users size={16} /></div>
                  <div className="selected-placeholder">
                    {formData.selected_student_ids.length > 0
                      ? `${formData.selected_student_ids.length} Students Selected`
                      : "Choose Students..."}
                  </div>
                  <ChevronDown size={14} className={`arrow ${isDropOpen ? "rotate" : ""}`} />
                </div>

                {isDropOpen && (
                  <div className="multi-dropdown-list">
                    <div className="dropdown-search-container">
                      <SearchIcon size={14} className="inner-search-icon" />
                      <input
                        type="text"
                        className="inner-search-input"
                        placeholder="Search all students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    <div className="select-actions-row">
                      <button type="button" onClick={() => handleSelectAll(true)}>
                        <UserPlus size={12} /> Select All
                      </button>
                      <button type="button" onClick={() => handleSelectAll(false)}>
                        <UserMinus size={12} /> Clear
                      </button>
                    </div>

                    <div className="options-scroll-area">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                          <div
                            key={student.id}
                            className={`student-option ${formData.selected_student_ids.includes(student.id) ? "selected" : ""}`}
                            onClick={() => toggleStudent(student.id)}
                          >
                            <div className="checkbox">
                              {formData.selected_student_ids.includes(student.id) && <Check size={12} />}
                            </div>
                            <span>{student.name}</span>
                          </div>
                        ))
                      ) : (
                        <div className="no-results">No matches found</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <FormRow label="Timing" icon={Clock}>
              <input
                type="text"
                name="timing"
                value={formData.timing}
                placeholder="e.g. 10:00 AM - 1:00 PM"
                required
                onChange={handleChange}
              />
            </FormRow>

            <FormRow label="Status" icon={CheckCircle}>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value={0}>Active</option>
                <option value={1}>Disabled</option>
              </select>
            </FormRow>

            {!user.branch_id && (
              <FormRow label="Branch" icon={Building2}>
                <select
                  name="branch_id"
                  value={formData.branch_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Branch</option>
                  {options.branches.map((b, i) => (
                    <option key={i} value={i + 1}>
                      {b}
                    </option>
                  ))}
                </select>
              </FormRow>
            )}
          </div>

          <div className="drawer-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            {hasPermission(requiredPermission) ? (
              <button type="submit" className="btn-save" disabled={isSubmitting}>
                <Send size={16} />{" "}
                {isSubmitting ? "Processing..." : batchId ? "Update Batch" : "Create Batch"}
              </button>
            ) : (
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#ef4444" }}>
                READ ONLY MODE
              </span>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default BatchDrawer;