import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  X,
  User,
  Phone,
  Mail,
  Briefcase,
  Calendar,
  CheckCircle,
  Send,
  Users,
} from "lucide-react";
import "./StaffDrawer.css";

// Shaded Row Helper (Moved outside to fix the typing focus issue)
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

const StaffDrawer = ({ isOpen, onClose, onUpdate, staffId }) => {
  const user = JSON.parse(localStorage.getItem("admin") || "{}");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    joining_date: new Date().toISOString().split("T")[0],
    job: "",
    type: 1,
    status: 0,
    branch_id: user.branch_id || 1,
  });

  useEffect(() => {
    if (isOpen && staffId) {
      axios
        .get(`https://operating-media-backend.onrender.com/api/staff/${staffId}/`)
        .then((res) => setFormData(res.data))
        .catch((err) => console.error(err));
    } else if (isOpen) {
      setFormData({
        name: "",
        phone: "",
        email: "",
        job: "",
        type: 1,
        status: 0,
        joining_date: new Date().toISOString().split("T")[0],
        branch_id: user.branch_id || 1,
      });
    }
  }, [isOpen, staffId, user.branch_id]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (staffId) {
        await axios.put(
          `https://operating-media-backend.onrender.com/api/staff/${staffId}/`,
          formData
        );
      } else {
        await axios.post("https://operating-media-backend.onrender.com/api/staff/manage/", formData);
      }
      onUpdate();
      onClose();
    } catch (err) {
      alert("Failed to save staff member");
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
            <Users size={20} />{" "}
            <h3>{staffId ? "Update Staff Profile" : "Add New Staff"}</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <form className="drawer-body" onSubmit={handleSubmit}>
          <div className="drawer-section">
            <FormRow label="Full Name" icon={User}>
              <input
                type="text"
                name="name"
                value={formData.name}
                placeholder="Enter name"
                required
                onChange={handleChange}
              />
            </FormRow>
            <FormRow label="Phone" icon={Phone}>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                placeholder="Mobile"
                required
                onChange={handleChange}
              />
            </FormRow>
            <FormRow label="Email" icon={Mail}>
              <input
                type="email"
                name="email"
                value={formData.email}
                placeholder="Email"
                onChange={handleChange}
              />
            </FormRow>
            <FormRow label="Joining Date" icon={Calendar}>
              <input
                type="date"
                name="joining_date"
                value={formData.joining_date}
                required
                onChange={handleChange}
              />
            </FormRow>
            <FormRow label="Designation" icon={Briefcase}>
              <input
                type="text"
                name="job"
                value={formData.job}
                placeholder="Job Title"
                onChange={handleChange}
              />
            </FormRow>
            <FormRow label="Staff Type" icon={Users}>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value={1}>Trainer</option>
                <option value={2}>Counsellor</option>
              </select>
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
            {/* CHANGED TO BLUE CLASS */}
            <button
              type="submit"
              className="btn-save-blue"
              disabled={isSubmitting}
            >
              <Send size={16} />
              {isSubmitting
                ? "Saving..."
                : staffId
                ? "Update Changes"
                : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
export default StaffDrawer;
