import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, Mail, Phone, MapPin, Calendar, Edit3, Send, X, BookOpen, 
  Smartphone, ChevronDown, ChevronRight, Link2, Building2, 
  Briefcase, Search, Check
} from "lucide-react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import "./LeadsCreate.css";

const LeadsCreate = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const [options] = useState({
    branches: ["Andheri", "Borivali", "Thane", "Pune"],
    counsellors: ["Alexandra Della", "Nancy Elliot", "Henry Leach", "Marianne Audrey"],
    batches: ["Weekday Morning", "Weekday Evening", "Weekend Batch"],
    sources: ["Facebook", "Google", "Website", "Direct Call", "Reference", "Whatsapp"],
    courses: [
      "Masters in Digital Marketing", "Diploma in Digital Marketing", 
      "Mobile Marketing", "SEO Expert", "Social Media Ads", 
      "Google Analytics", "Wordpress Development"
    ],
  });

  const [formData, setFormData] = useState({
    first_name: "", last_name: "", father_name: "", mobile: "", other_contact: "",
    email: "", gender: "Male", source: "", location: "", preferred_batch: "",
    enquiry_date: new Date().toISOString().split("T")[0],
    next_followup: "", remarks: "", branch_id: "", counsellor_id: "",
    course: "",
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const ModernSelect = ({ name, value, options, placeholder, icon: Icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropRef = useRef(null);

    useEffect(() => {
      const clickOutside = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setIsOpen(false); };
      document.addEventListener("mousedown", clickOutside);
      return () => document.removeEventListener("mousedown", clickOutside);
    }, []);

    return (
      <div className="modern-select-container" ref={dropRef}>
        <div className={`modern-select-trigger ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
          <div className="icon-box-left"><Icon size={16} /></div>
          <span className={`selected-value ${!value ? 'placeholder' : ''}`}>
            {value || placeholder}
          </span>
          <ChevronDown className={`select-arrow-icon ${isOpen ? 'rotate' : ''}`} size={16} />
        </div>

        {isOpen && (
          <div className="modern-dropdown-menu">
            {options.map((opt, i) => (
              <div 
                key={i} 
                className={`dropdown-item ${value === opt ? 'selected' : ''}`}
                onClick={() => {
                  setFormData({ ...formData, [name]: opt });
                  setIsOpen(false);
                }}
              >
                {opt}
                {value === opt && <Check size={14} className="check-mark" />}
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
          <header className="leads-page-header">
            <div className="header-left">
              <div className="breadcrumb">
                <span>Dashboards</span> <ChevronRight size={12} className="sep" />
                <span>Home</span> <ChevronRight size={12} className="sep" />
                <span className="current">Create Lead</span>
              </div>
              <h2 className="page-title">Add New Enquiry</h2>
            </div>
          </header>

          <div className="form-card-duralux">
            <form className="enquiry-form" onSubmit={(e) => e.preventDefault()}>
              
              {/* HEADING 1: PERSONAL DETAILS */}
              <h3 className="duralux-section-title">
                <User size={18} /> PERSONAL DETAILS
              </h3>

              <div className="form-section-block">
                <div className="duralux-form-row">
                  <label className="row-label">First Name:</label>
                  <div className="row-input-wrapper">
                    <div className="icon-box-left"><User size={16} /></div>
                    <input type="text" name="first_name" placeholder="Name" onChange={handleChange} />
                  </div>
                </div>

                <div className="duralux-form-row">
                  <label className="row-label">Last Name:</label>
                  <div className="row-input-wrapper">
                    <div className="icon-box-left"><User size={16} /></div>
                    <input type="text" name="last_name" placeholder="Last Name" onChange={handleChange} />
                  </div>
                </div>

                <div className="duralux-form-row">
                  <label className="row-label">Mobile:</label>
                  <div className="row-input-wrapper">
                    <div className="icon-box-left"><Smartphone size={16} /></div>
                    <input type="text" name="mobile" placeholder="Phone" onChange={handleChange} />
                  </div>
                </div>

                <div className="duralux-form-row">
                  <label className="row-label">Gender:</label>
                  <ModernSelect name="gender" value={formData.gender} options={["Male", "Female", "Other"]} icon={User} />
                </div>

                <div className="duralux-form-row">
                  <label className="row-label">Source:</label>
                  <ModernSelect name="source" value={formData.source} options={options.sources} placeholder="Select Source" icon={Link2} />
                </div>
              </div>

              <div className="form-divider"></div>

              {/* HEADING 2: COURSE DETAILS */}
              <h3 className="duralux-section-title">
                <BookOpen size={18} /> COURSE DETAILS
              </h3>

              <div className="form-section-block">
                <div className="duralux-form-row">
                  <label className="row-label">Select Course:</label>
                  <ModernSelect name="course" value={formData.course} options={options.courses} placeholder="Select Primary Course" icon={BookOpen} />
                </div>

                <div className="duralux-form-row">
                  <label className="row-label">Preferred Batch:</label>
                  <ModernSelect name="preferred_batch" value={formData.preferred_batch} options={options.batches} placeholder="Select Batch" icon={Briefcase} />
                </div>

                <div className="duralux-form-row">
                  <label className="row-label">Enquiry Date:</label>
                  <div className="row-input-wrapper">
                    <div className="icon-box-left"><Calendar size={16} /></div>
                    <input type="date" name="enquiry_date" value={formData.enquiry_date} onChange={handleChange} />
                  </div>
                </div>

                <div className="duralux-form-row">
                  <label className="row-label">Remarks:</label>
                  <div className="row-input-wrapper">
                    <div className="icon-box-left"><Edit3 size={16} /></div>
                    <input type="text" name="remarks" placeholder="Notes / Remarks" onChange={handleChange} />
                  </div>
                </div>

                <div className="duralux-form-row">
                  <label className="row-label">Counsellor:</label>
                  <ModernSelect name="counsellor_id" value={formData.counsellor_id} options={options.counsellors} placeholder="Assign Counsellor" icon={User} />
                </div>

                <div className="duralux-form-row">
                  <label className="row-label">Branch:</label>
                  <ModernSelect name="branch_id" value={formData.branch_id} options={options.branches} placeholder="Select Branch" icon={Building2} />
                </div>
              </div>

              <div className="duralux-form-footer">
                <button type="button" className="btn-cancel-flat" onClick={() => navigate("/leads-view")}>CANCEL</button>
                <button type="submit" className="btn-submit-primary"><Send size={14} /> CREATE </button>
              </div>

            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LeadsCreate;