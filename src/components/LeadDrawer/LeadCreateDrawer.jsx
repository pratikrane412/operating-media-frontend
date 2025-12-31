import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  X,
  User,
  Plus,
  ChevronDown,
  Mail,
  Phone,
  Link2,
  BookOpen,
  Calendar,
  Edit3,
  Tag,
  Send,
  Check,
  Briefcase,
  Building2,
  UserCheck,
} from "lucide-react";
import "./LeadCreateDrawer.css";

const LeadCreateDrawer = ({ isOpen, onClose, onUpdate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [options, setOptions] = useState({
    branches: [],
    counsellors: [],
    batches: [],
    sources: [],
    courses: [],
    tags: [],
  });

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
    email: "",
    gender: "Male",
    source: [],
    tags: [],
    course: "",
    preferred_batch: "",
    enquiry_date: new Date().toISOString().split("T")[0],
    next_followup: "",
    remarks: "",
    branch_id: "",
    counsellor_id: "",
  });

  // Fetch Dropdown Options from Backend
  useEffect(() => {
    if (isOpen) {
      axios
        .get("https://operating-media-backend.onrender.com/api/leads/create/")
        .then((res) => setOptions(res.data))
        .catch((err) => console.error("Error fetching options:", err));
    }
  }, [isOpen]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(
        "https://operating-media-backend.onrender.com/api/leads/create/",
        formData
      );
      alert("Lead Created Successfully!");
      onUpdate();
      onClose();
      setFormData({
        first_name: "",
        last_name: "",
        mobile: "",
        email: "",
        gender: "Male",
        source: [],
        tags: [],
        course: "",
        preferred_batch: "",
        enquiry_date: new Date().toISOString().split("T")[0],
        next_followup: "",
        remarks: "",
        branch_id: "",
        counsellor_id: "",
      });
    } catch (err) {
      alert("Error saving lead. Please check your inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- MODERN SELECT COMPONENT (Handles Single & Multi) ---
  const ModernSelect = ({
    name,
    value,
    opts,
    placeholder,
    icon: Icon,
    isMulti = false,
  }) => {
    const [show, setShow] = useState(false);
    const ref = useRef();

    useEffect(() => {
      const clickAway = (e) => {
        if (ref.current && !ref.current.contains(e.target)) setShow(false);
      };
      document.addEventListener("mousedown", clickAway);
      return () => document.removeEventListener("mousedown", clickAway);
    }, []);

    const handleToggle = (val) => {
      if (isMulti) {
        const newValue = value.includes(val)
          ? value.filter((v) => v !== val)
          : [...value, val];
        setFormData((prev) => ({ ...prev, [name]: newValue }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: val }));
        setShow(false);
      }
    };

    const displayText = isMulti
      ? value.length > 0
        ? value.join(", ")
        : placeholder
      : value || placeholder;

    return (
      <div className="drawer-form-row" ref={ref}>
        <label className="row-label">{placeholder}:</label>
        <div className="modern-select-container">
          <div
            className={`modern-select-trigger ${show ? "active" : ""}`}
            onClick={() => setShow(!show)}
          >
            <div className="icon-box-shaded">
              <Icon size={18} />
            </div>
            <span
              className={`selected-text ${
                !value || value.length === 0 ? "is-placeholder" : ""
              }`}
            >
              {displayText}
            </span>
            <ChevronDown
              className={`arrow-icon ${show ? "rotate" : ""}`}
              size={16}
            />
          </div>
          {show && (
            <div className="modern-dropdown-menu">
              {opts.map((o, i) => (
                <div
                  key={i}
                  className={`dropdown-option ${
                    isMulti
                      ? value.includes(o)
                        ? "selected"
                        : ""
                      : value === o
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => handleToggle(o)}
                >
                  {o}{" "}
                  {(isMulti ? value.includes(o) : value === o) && (
                    <Check size={14} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={onClose}></div>
      <div className={`drawer-container open`}>
        <div className="drawer-header">
          <div className="header-title-box">
            <Plus size={22} /> <h3>Create New Lead</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form className="drawer-body" onSubmit={handleSubmit}>
          <div className="drawer-section">
            <h4 className="section-subtitle">PERSONAL DETAILS</h4>

            <div className="drawer-form-row">
              <label className="row-label">First Name:</label>
              <div className="row-input-wrapper">
                <div className="icon-box-shaded">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  required
                  onChange={handleChange}
                  placeholder="Enter first name"
                />
              </div>
            </div>

            <div className="drawer-form-row">
              <label className="row-label">Last Name:</label>
              <div className="row-input-wrapper">
                <div className="icon-box-shaded">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  required
                  onChange={handleChange}
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div className="drawer-form-row">
              <label className="row-label">Mobile:</label>
              <div className="row-input-wrapper">
                <div className="icon-box-shaded">
                  <Phone size={18} />
                </div>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  required
                  onChange={handleChange}
                  placeholder="Phone number"
                />
              </div>
            </div>

            <div className="drawer-form-row">
              <label className="row-label">Email Address:</label>
              <div className="row-input-wrapper">
                <div className="icon-box-shaded">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <ModernSelect
              name="source"
              value={formData.source}
              opts={options.sources}
              icon={Link2}
              placeholder="Source"
              isMulti={true}
            />
            <ModernSelect
              name="gender"
              value={formData.gender}
              opts={["Male", "Female", "Other"]}
              icon={User}
              placeholder="Gender"
            />
          </div>

          <div className="form-divider"></div>

          <div className="drawer-section">
            <h4 className="section-subtitle">COURSE & FOLLOWUP</h4>

            <ModernSelect
              name="course"
              value={formData.course}
              opts={options.courses}
              icon={BookOpen}
              placeholder="Course"
            />
            <ModernSelect
              name="preferred_batch"
              value={formData.preferred_batch}
              opts={options.batches}
              icon={Briefcase}
              placeholder="Batch"
            />
            <ModernSelect
              name="tags"
              value={formData.tags}
              opts={options.tags}
              icon={Tag}
              placeholder="Status Tags"
              isMulti={true}
            />

            <div className="drawer-form-row">
              <label className="row-label">Enquiry Date:</label>
              <div className="row-input-wrapper">
                <div className="icon-box-shaded">
                  <Calendar size={18} />
                </div>
                <input
                  type="date"
                  name="enquiry_date"
                  value={formData.enquiry_date}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="drawer-form-row">
              <label className="row-label">Next Followup:</label>
              <div className="row-input-wrapper">
                <div className="icon-box-shaded">
                  <Calendar size={18} />
                </div>
                <input
                  type="date"
                  name="next_followup"
                  value={formData.next_followup}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="drawer-form-row">
              <label className="row-label">Remarks:</label>
              <div className="row-input-wrapper">
                <div className="icon-box-shaded">
                  <Edit3 size={18} />
                </div>
                <input
                  type="text"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  placeholder="Enter notes..."
                />
              </div>
            </div>

            <ModernSelect
              name="branch_id"
              value={formData.branch_id}
              opts={options.branches}
              icon={Building2}
              placeholder="Branch"
            />
            <ModernSelect
              name="counsellor_id"
              value={formData.counsellor_id}
              opts={options.counsellors}
              icon={UserCheck}
              placeholder="Counsellor"
            />
          </div>

          <div className="drawer-footer-sticky">
            <button
              type="submit"
              className="btn-save-lead-blue"
              disabled={isSubmitting}
            >
              <Send size={16} /> {isSubmitting ? "CREATING..." : "CREATE LEAD"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default LeadCreateDrawer;
