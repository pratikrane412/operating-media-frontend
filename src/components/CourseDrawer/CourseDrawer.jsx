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
import { hasPermission } from "../../utils/permissionCheck"; // Added import

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

  useEffect(() => {
    if (isOpen && courseId) {
      axios
        .get(
          `https://operating-media-backend.onrender.com/api/courses/${courseId}/`
        )
        .then((res) => setFormData(res.data))
        .catch((err) => console.error("Error fetching course", err));
    } else {
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
        await axios.put(
          `https://operating-media-backend.onrender.com/api/courses/${courseId}/`,
          formData
        );
      } else {
        await axios.post(
          "https://operating-media-backend.onrender.com/api/courses/manage/",
          formData
        );
      }
      onUpdate();
      onClose();
    } catch (err) {
      alert("Action failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Determine required permission based on mode
  const requiredPermission = courseId ? "edit course" : "add course";

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

            {/* PERMISSION CHECKED SUBMIT BUTTON */}
            {hasPermission(requiredPermission) ? (
              <button
                type="submit"
                className="btn-save"
                disabled={isSubmitting}
              >
                <Send size={16} />
                {isSubmitting
                  ? "Processing..."
                  : courseId
                  ? "Update Course"
                  : "Create Course"}
              </button>
            ) : (
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#ef4444",
                }}
              >
                READ ONLY MODE
              </span>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default CourseDrawer;
