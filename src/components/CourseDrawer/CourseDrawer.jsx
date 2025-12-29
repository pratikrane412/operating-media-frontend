import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  X,
  BookOpen,
  Clock,
  DollarSign,
  CheckCircle,
  Send,
} from "lucide-react";
import "./CourseDrawer.css";

// Shaded Row Helper (Matches Duralux style)
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

const CourseDrawer = ({ isOpen, onClose, onUpdate, courseId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    fee: "",
    duration: "",
    status: 0,
  });

  // Detect mode: Edit or Create
  useEffect(() => {
    if (isOpen && courseId) {
      // Edit Mode: Fetch existing data
      axios
        .get(`http://127.0.0.1:8000/api/courses/${courseId}/`)
        .then((res) => setFormData(res.data))
        .catch((err) => console.error("Error fetching course", err));
    } else {
      // Create Mode: Reset form
      setFormData({ name: "", fee: "", duration: "", status: 0 });
    }
  }, [isOpen, courseId]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (courseId) {
        // UPDATE
        await axios.put(
          `http://127.0.0.1:8000/api/courses/${courseId}/`,
          formData
        );
      } else {
        // CREATE
        await axios.post("http://127.0.0.1:8000/api/courses/manage/", formData);
      }
      onUpdate(); // Refresh table
      onClose(); // Close drawer
    } catch (err) {
      alert(courseId ? "Failed to update course" : "Failed to create course");
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
            <BookOpen size={20} />
            <h3>{courseId ? "Edit Course" : "Create New Course"}</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form className="drawer-body" onSubmit={handleSubmit}>
          <div className="drawer-section">
            <FormRow label="Course Name" icon={BookOpen}>
              <input
                type="text"
                name="name"
                value={formData.name}
                placeholder="e.g. Graphic Design"
                required
                onChange={handleChange}
              />
            </FormRow>

            <FormRow label="Fee Structure" icon={DollarSign}>
              <input
                type="text"
                name="fee"
                value={formData.fee}
                placeholder="e.g. 25000"
                required
                onChange={handleChange}
              />
            </FormRow>

            <FormRow label="Duration" icon={Clock}>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                placeholder="e.g. 100 Hours"
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
              <Send size={16} />
              {isSubmitting
                ? "Processing..."
                : courseId
                ? "Update Course"
                : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CourseDrawer;
