import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  Send,
  Smartphone,
  ChevronDown,
  ChevronRight,
  Link2,
  Building2,
  Briefcase,
  Check,
  Tag,
  BookOpen
} from "lucide-react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import "../LeadsCreate/LeadsCreate.css"; // Reuse the same CSS

const LeadsEdit = () => {
  const { leadId } = useParams();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const [options, setOptions] = useState({
    branches: [],
    counsellors: [],
    batches: [],
    sources: [],
    courses: [],
    tags: ["Hot Lead", "Cold Lead", "Warm Lead"],
  });

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
    email: "",
    gender: "Male",
    source: "",
    preferred_batch: "",
    enquiry_date: "",
    next_followup: "",
    tags: "",
    remarks: "",
    branch_id: "",
    counsellor_id: "",
    course: "",
  });

  useEffect(() => {
    // 1. Fetch dropdown options
    axios.get("http://127.0.0.1:8000/api/leads/create/").then((res) => {
      setOptions((prev) => ({ ...res.data, tags: prev.tags }));
    });

    // 2. Fetch specific Lead data
    axios.get(`http://127.0.0.1:8000/api/leads/${leadId}/edit/`).then((res) => {
      setFormData(res.data);
    });
  }, [leadId]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/leads/${leadId}/edit/`,
        formData
      );
      alert("Lead Updated Successfully!");
      navigate("/leads-view");
    } catch (err) {
      alert("Failed to update lead");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- REUSE THE SAME ModernSelect AND UI CODE FROM LEADS CREATE ---
  const ModernSelect = ({ name, value, options, placeholder, icon: Icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropRef = useRef(null);
    useEffect(() => {
      const clickOutside = (e) => {
        if (dropRef.current && !dropRef.current.contains(e.target))
          setIsOpen(false);
      };
      document.addEventListener("mousedown", clickOutside);
      return () => document.removeEventListener("mousedown", clickOutside);
    }, []);
    return (
      <div className="modern-select-container" ref={dropRef}>
        <div
          className={`modern-select-trigger ${isOpen ? "is-active" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="icon-box-shaded">
            <Icon size={16} />
          </div>
          <span className={`selected-text ${!value ? "is-placeholder" : ""}`}>
            {value || placeholder}
          </span>
          <ChevronDown
            className={`arrow-icon ${isOpen ? "rotate" : ""}`}
            size={16}
          />
        </div>
        {isOpen && (
          <div className="modern-dropdown-list">
            {options.map((opt, i) => (
              <div
                key={i}
                className={`dropdown-option ${
                  value === opt ? "is-selected" : ""
                }`}
                onClick={() => {
                  setFormData({ ...formData, [name]: opt });
                  setIsOpen(false);
                }}
              >
                {opt} {value === opt && <Check size={14} />}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`app-container ${isCollapsed ? "is-collapsed" : ""}`}>
      <Sidebar isCollapsed={isCollapsed} />
      <div className="main-viewport">
        <Navbar onToggle={() => setIsCollapsed(!isCollapsed)} />
        <main className="content-area">
          <header className="page-header-minimal">
            <div className="breadcrumb-nav">
              <span>Dashboards</span> <ChevronRight size={12} />{" "}
              <span>Leads</span> <ChevronRight size={12} />{" "}
              <span className="active">Edit</span>
            </div>
            <h2 className="main-title">Edit Enquiry: {formData.first_name}</h2>
          </header>
          <div className="duralux-card-form">
            <form onSubmit={handleSubmit}>
              <div className="section-block">
                <h3 className="section-label-heading">
                  <User size={16} /> PERSONAL DETAILS
                </h3>
                <div className="form-row-layout">
                  <label>First Name:</label>
                  <div className="input-field-box">
                    <div className="icon-box-shaded">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-row-layout">
                  <label>Last Name:</label>
                  <div className="input-field-box">
                    <div className="icon-box-shaded">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-row-layout">
                  <label>Mobile:</label>
                  <div className="input-field-box">
                    <div className="icon-box-shaded">
                      <Smartphone size={16} />
                    </div>
                    <input
                      type="text"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-row-layout">
                  <label>Email:</label>
                  <div className="input-field-box">
                    <div className="icon-box-shaded">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-row-layout">
                  <label>Gender:</label>
                  <ModernSelect
                    name="gender"
                    value={formData.gender}
                    options={["Male", "Female", "Other"]}
                    icon={User}
                  />
                </div>
                <div className="form-row-layout">
                  <label>Source:</label>
                  <ModernSelect
                    name="source"
                    value={formData.source}
                    options={options.sources}
                    icon={Link2}
                  />
                </div>
              </div>
              <div className="ui-divider"></div>
              <div className="section-block">
                <h3 className="section-label-heading">
                  <BookOpen size={16} /> COURSE DETAILS
                </h3>
                <div className="form-row-layout">
                  <label>Course:</label>
                  <ModernSelect
                    name="course"
                    value={formData.course}
                    options={options.courses}
                    icon={BookOpen}
                  />
                </div>
                <div className="form-row-layout">
                  <label>Batch:</label>
                  <ModernSelect
                    name="preferred_batch"
                    value={formData.preferred_batch}
                    options={options.batches}
                    icon={Briefcase}
                  />
                </div>
                <div className="form-row-layout">
                  <label>Enquiry Date:</label>
                  <div className="input-field-box">
                    <div className="icon-box-shaded">
                      <Calendar size={16} />
                    </div>
                    <input
                      type="date"
                      name="enquiry_date"
                      value={formData.enquiry_date}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-row-layout">
                  <label>Tags:</label>
                  <ModernSelect
                    name="tags"
                    value={formData.tags}
                    options={options.tags}
                    icon={Tag}
                  />
                </div>
                <div className="form-row-layout">
                  <label>Remarks:</label>
                  <div className="input-field-box">
                    <div className="icon-box-shaded">
                      <Edit3 size={16} />
                    </div>
                    <input
                      type="text"
                      name="remarks"
                      value={formData.remarks}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-row-layout">
                  <label>Counsellor:</label>
                  <ModernSelect
                    name="counsellor_id"
                    value={formData.counsellor_id}
                    options={options.counsellors}
                    icon={User}
                  />
                </div>
                <div className="form-row-layout">
                  <label>Branch:</label>
                  <ModernSelect
                    name="branch_id"
                    value={formData.branch_id}
                    options={options.branches}
                    icon={Building2}
                  />
                </div>
              </div>
              <div className="form-footer-actions">
                <button
                  type="button"
                  className="btn-secondary-flat"
                  onClick={() => navigate("/leads-view")}
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="btn-primary-blue"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "UPDATING..." : "UPDATE LEAD"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LeadsEdit;
