import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  User, Mail, Phone, MapPin, Calendar, Edit3, Send, X, BookOpen, 
  Smartphone, ChevronDown, ChevronRight, Link2, Building2, 
  Briefcase, Check
} from "lucide-react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import "./LeadsCreate.css";

const LeadsCreate = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const [options, setOptions] = useState({
    branches: [], counsellors: [], batches: [], sources: [], courses: [],
  });

  const [formData, setFormData] = useState({
    first_name: "", last_name: "", father_name: "", mobile: "", other_contact: "",
    email: "", gender: "Male", source: "", location: "", preferred_batch: "",
    enquiry_date: new Date().toISOString().split("T")[0],
    next_followup: "", remarks: "", branch_id: "", counsellor_id: "", course: "",
  });

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/leads/create/")
      .then((res) => setOptions(res.data))
      .catch((err) => console.error("Database connection error", err));
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // --- MODERN DROPDOWN COMPONENT ---
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
        <div className={`modern-select-trigger ${isOpen ? 'is-active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
          <div className="icon-box-shaded"><Icon size={16} /></div>
          <span className={`selected-text ${!value ? 'is-placeholder' : ''}`}>
            {value || placeholder}
          </span>
          <ChevronDown className={`arrow-icon ${isOpen ? 'rotate' : ''}`} size={16} />
        </div>

        {isOpen && (
          <div className="modern-dropdown-list">
            {options && options.length > 0 ? options.map((opt, i) => (
              <div key={i} className={`dropdown-option ${value === opt ? 'is-selected' : ''}`}
                onClick={() => { setFormData({ ...formData, [name]: opt }); setIsOpen(false); }}>
                {opt}
                {value === opt && <Check size={14} />}
              </div>
            )) : <div className="dropdown-option disabled">No data available</div>}
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
              <span>Dashboards</span> <ChevronRight size={12} /> <span>Home</span> <ChevronRight size={12} /> <span className="active">Create Lead</span>
            </div>
            <h2 className="main-title">Add New Enquiry</h2>
          </header>

          <div className="duralux-card-form">
            <form onSubmit={(e) => e.preventDefault()}>
              
              {/* SECTION 1: PERSONAL DETAILS */}
              <div className="section-block">
                <h3 className="section-label-heading"><User size={16} /> PERSONAL DETAILS</h3>
                
                <div className="form-row-layout">
                  <label>First Name:</label>
                  <div className="input-field-box">
                    <div className="icon-box-shaded"><User size={16} /></div>
                    <input type="text" name="first_name" placeholder="Enter first name" onChange={handleChange} />
                  </div>
                </div>

                <div className="form-row-layout">
                  <label>Last Name:</label>
                  <div className="input-field-box">
                    <div className="icon-box-shaded"><User size={16} /></div>
                    <input type="text" name="last_name" placeholder="Enter last name" onChange={handleChange} />
                  </div>
                </div>

                <div className="form-row-layout">
                  <label>Mobile Number:</label>
                  <div className="input-field-box">
                    <div className="icon-box-shaded"><Smartphone size={16} /></div>
                    <input type="text" name="mobile" placeholder="Phone" onChange={handleChange} />
                  </div>
                </div>

                <div className="form-row-layout">
                  <label>Gender:</label>
                  <ModernSelect name="gender" value={formData.gender} options={["Male", "Female", "Other"]} icon={User} />
                </div>

                <div className="form-row-layout">
                  <label>Source:</label>
                  <ModernSelect name="source" value={formData.source} options={options.sources} placeholder="Select Source" icon={Link2} />
                </div>
              </div>

              <div className="ui-divider"></div>

              {/* SECTION 2: COURSE DETAILS */}
              <div className="section-block">
                <h3 className="section-label-heading"><BookOpen size={16} /> COURSE DETAILS</h3>

                <div className="form-row-layout">
                  <label>Select Course:</label>
                  <ModernSelect name="course" value={formData.course} options={options.courses} placeholder="Select Primary Course" icon={BookOpen} />
                </div>

                <div className="form-row-layout">
                  <label>Preferred Batch:</label>
                  <ModernSelect name="preferred_batch" value={formData.preferred_batch} options={options.batches} placeholder="Select Batch" icon={Briefcase} />
                </div>

                <div className="form-row-layout">
                  <label>Enquiry Date:</label>
                  <div className="input-field-box">
                    <div className="icon-box-shaded"><Calendar size={16} /></div>
                    <input type="date" name="enquiry_date" value={formData.enquiry_date} onChange={handleChange} />
                  </div>
                </div>

                <div className="form-row-layout">
                  <label>Remarks:</label>
                  <div className="input-field-box">
                    <div className="icon-box-shaded"><Edit3 size={16} /></div>
                    <input type="text" name="remarks" placeholder="Notes / Remarks" onChange={handleChange} />
                  </div>
                </div>

                <div className="form-row-layout">
                  <label>Counsellor:</label>
                  <ModernSelect name="counsellor_id" value={formData.counsellor_id} options={options.counsellors} placeholder="Assign Counsellor" icon={User} />
                </div>

                <div className="form-row-layout">
                  <label>Branch:</label>
                  <ModernSelect name="branch_id" value={formData.branch_id} options={options.branches} placeholder="Select Branch" icon={Building2} />
                </div>
              </div>

              <div className="form-footer-actions">
                <button type="button" className="btn-secondary-flat" onClick={() => navigate("/leads-view")}>CANCEL</button>
                <button type="submit" className="btn-primary-blue"><Send size={14} /> CREATE </button>
              </div>

            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LeadsCreate;