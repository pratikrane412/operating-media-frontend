import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  X,
  Briefcase,
  Clock,
  Calendar,
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

  const [formData, setFormData] = useState({
    name: "",
    timing: "",
    starting_date: "",
    end_date: "",
    status: 0,
    branch_id: user.branch_id || 1,
    selected_student_ids: [],
  });

  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
      // Fetch All Students
      axios
        .get(
          `https://operating-media-backend.onrender.com/api/admissions/manage/`
        )
        .then((res) => setStudentsList(res.data.admissions || []))
        .catch((err) => console.error("Error fetching students", err));

      if (batchId) {
        axios
          .get(
            `https://operating-media-backend.onrender.com/api/batches/${batchId}/`
          )
          .then((res) => setFormData((prev) => ({ ...prev, ...res.data })))
          .catch((err) => console.error("Error fetching batch", err));
      } else {
        setFormData({
          name: "",
          timing: "",
          starting_date: "",
          end_date: "",
          status: 0,
          branch_id: user.branch_id || 1,
          selected_student_ids: [],
        });
      }
    }
  }, [isOpen, batchId, user.branch_id]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target))
        setIsDropOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  // Helper to Select All/Deselect All filtered students
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
        await axios.put(
          `https://operating-media-backend.onrender.com/api/batches/${batchId}/`,
          formData
        );
      } else {
        await axios.post(
          "https://operating-media-backend.onrender.com/api/batches/manage/",
          formData
        );
      }
      onUpdate();
      onClose();
    } catch (err) {
      alert("Error processing batch");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

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
              />
            </FormRow>

            <div className="drawer-form-row" ref={dropRef}>
              <label>Assign Students:</label>
              <div className="multi-select-wrapper">
                <div
                  className={`drawer-input-wrapper select-trigger ${
                    isDropOpen ? "active" : ""
                  }`}
                  onClick={() => setIsDropOpen(!isDropOpen)}
                >
                  <div className="drawer-icon-box">
                    <Users size={16} />
                  </div>
                  <div className="selected-placeholder">
                    {formData.selected_student_ids.length > 0
                      ? `${formData.selected_student_ids.length} Students Selected`
                      : "Search & Select Students..."}
                  </div>
                  <ChevronDown
                    size={14}
                    className={`arrow ${isDropOpen ? "rotate" : ""}`}
                  />
                </div>

                {isDropOpen && (
                  <div className="multi-dropdown-list">
                    <div className="dropdown-search-container">
                      <SearchIcon size={14} className="inner-search-icon" />
                      <input
                        type="text"
                        className="inner-search-input"
                        placeholder="Type name to search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    {/* Select All Buttons */}
                    <div className="select-actions-row">
                      <button
                        type="button"
                        onClick={() => handleSelectAll(true)}
                      >
                        <UserPlus size={12} /> Select Filtered
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectAll(false)}
                      >
                        <UserMinus size={12} /> Clear Filtered
                      </button>
                    </div>

                    <div className="options-scroll-area">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                          <div
                            key={student.id}
                            className={`student-option ${
                              formData.selected_student_ids.includes(student.id)
                                ? "selected"
                                : ""
                            }`}
                            onClick={() => toggleStudent(student.id)}
                          >
                            <div className="checkbox">
                              {formData.selected_student_ids.includes(
                                student.id
                              ) && <Check size={12} />}
                            </div>
                            {/* FIX: Ensure this is {student.name} and not a hardcoded index */}
                            <span>{student.name}</span>
                          </div>
                        ))
                      ) : (
                        <div className="no-results">No students found</div>
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
                placeholder="e.g. 10AM - 1PM"
                required
                onChange={handleChange}
              />
            </FormRow>

            <FormRow label="Start Date" icon={Calendar}>
              <input
                type="date"
                name="starting_date"
                value={formData.starting_date}
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
          </div>

          <div className="drawer-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={isSubmitting}>
              <Send size={16} /> Submit Batch
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default BatchDrawer;
