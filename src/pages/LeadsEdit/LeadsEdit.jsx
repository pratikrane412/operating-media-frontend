import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  User, Mail, Phone, MapPin, Calendar, Edit3, Send, Smartphone, 
  ChevronDown, ChevronRight, Link2, Building2, Briefcase, Check, Tag, BookOpen
} from "lucide-react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import "../LeadsCreate/LeadsCreate.css"; // Reusing the same CSS

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
    tags: [
      "Enrolled", "Interested", "Will Visit", "Visited", "No Response",
      "Call Back", "Invalid", "Looking for Job", "Placement Inquiry",
      "Not Interested", "Counseling Done", "Old Lead", "Future Admission", "Online Counseling"
    ],
  });

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
    email: "",
    gender: "Male",
    source: [], // Array for Multi-select
    preferred_batch: "",
    enquiry_date: "",
    next_followup: "",
    tags: [], // Array for Multi-select
    remarks: "",
    branch_id: "",
    counsellor_id: "",
    course: "",
  });

  useEffect(() => {
    // 1. Fetch dropdown options (Branches, Courses, etc.)
    axios.get("https://operating-media-backend.onrender.com/api/leads/create/").then((res) => {
      setOptions((prev) => ({ ...res.data, tags: prev.tags }));
    });

    // 2. Fetch specific Lead data and convert comma-strings to arrays
    axios.get(`https://operating-media-backend.onrender.com/api/leads/${leadId}/edit/`).then((res) => {
      const data = res.data;
      setFormData({
        ...data,
        // Convert "Tag1, Tag2" -> ["Tag1", "Tag2"] so UI works
        tags: data.tags ? data.tags.split(", ") : [],
        source: data.source ? data.source.split(", ") : [],
      });
    });
  }, [leadId]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Backend handles joining arrays back into strings
      await axios.put(`https://operating-media-backend.onrender.com/api/leads/${leadId}/edit/`, formData);
      alert("Lead Updated Successfully!");
      navigate("/leads-view");
    } catch (err) {
      alert("Failed to update lead");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- MODERN DROPDOWN COMPONENT (Multi-select capable) ---
  const ModernSelect = ({ name, value, options, placeholder, icon: Icon, isMulti = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropRef = useRef(null);

    useEffect(() => {
      const clickOutside = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setIsOpen(false); };
      document.addEventListener("mousedown", clickOutside);
      return () => document.removeEventListener("mousedown", clickOutside);
    }, []);

    const handleSelect = (opt) => {
      if (isMulti) {
        const newValue = value.includes(opt)
          ? value.filter((v) => v !== opt)
          : [...value, opt];
        setFormData({ ...formData, [name]: newValue });
      } else {
        setFormData({ ...formData, [name]: opt });
        setIsOpen(false);
      }
    };

    const displayText = isMulti 
      ? (value.length > 0 ? value.join(", ") : placeholder)
      : (value || placeholder);

    return (
      <div className="modern-select-container" ref={dropRef} style={{ zIndex: isOpen ? 100 : 1 }}>
        <div className={`modern-select-trigger ${isOpen ? "is-active" : ""}`} onClick={() => setIsOpen(!isOpen)}>
          <div className="icon-box-shaded"><Icon size={16} /></div>
          <span className={`selected-text ${(!value || value.length === 0) ? "is-placeholder" : ""}`}>
            {displayText}
          </span>
          <ChevronDown className={`arrow-icon ${isOpen ? "rotate" : ""}`} size={16} />
        </div>
        {isOpen && (
          <div className="modern-dropdown-list">
            {options.map((opt, i) => {
              const isSelected = isMulti ? value.includes(opt) : value === opt;
              return (
                <div key={i} className={`dropdown-option ${isSelected ? "is-selected" : ""}`} onClick={() => handleSelect(opt)}>
                  {opt} {isSelected && <Check size={14} />}
                </div>
              );
            })}
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
              <span>Dashboards</span> <ChevronRight size={12} /> <span>Leads</span> <ChevronRight size={12} /> <span className="active">Edit</span>
            </div>
            <h2 className="main-title">Edit Enquiry: {formData.first_name} {formData.last_name}</h2>
          </header>

          <div className="duralux-card-form">
            <form onSubmit={handleSubmit}>
              <div className="section-block">
                <h3 className="section-label-heading"><User size={16} /> PERSONAL DETAILS</h3>
                
                <div className="form-row-layout">
                  <label>First Name:</label>
                  <div className="input-field-box">
                    <div className="icon-box-shaded"><User size={16} /></div>
                    <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
                  </div>
                </div>

                <div className="form-row-layout">
                  <label>Last Name:</label>
                  <div className="input-field-box">
                    <div className="icon-box-shaded"><User size={16} /></div>
                    <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
                  </div>
                </div>

                <div className="form-row-layout">
                  <label>Mobile Number:</label>
                  <div className="input-field-box">
                    <div className="icon-box-shaded"><Smartphone size={16} /></div>
                    <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} required />
                  </div>
                </div>

                <div className="form-row-layout">
                  <label>Email Address:</label>
                  <div className="input-field-box">
                    <div className="icon-box-shaded"><Mail size={16} /></div>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} />
                  </div>
                </div>

                <div className="form-row-layout">
                  <label>Gender:</label>
                  <ModernSelect name="gender" value={formData.gender} options={["Male", "Female", "Other"]} icon={User} />
                </div>

                <div className="form-row-layout">
                  <label>Source:</label>
                  <ModernSelect 
                    name="source" 
                    value={formData.source} 
                    options={options.sources} 
                    icon={Link2} 
                    placeholder="Select Multiple Sources" 
                    isMulti={true} 
                  />
                </div>
              </div>

              <div className="ui-divider"></div>

              <div className="section-block">
                <h3 className="section-label-heading"><BookOpen size={16} /> COURSE DETAILS</h3>
                
                <div className="form-row-layout">
                  <label>Select Course:</label>
                  <ModernSelect name="course" value={formData.course} options={options.courses} icon={BookOpen} placeholder="Select Course" />
                </div>

                <div className="form-row-layout">
                  <label>Preferred Batch:</label>
                  <ModernSelect name="preferred_batch" value={formData.preferred_batch} options={options.batches} icon={Briefcase} placeholder="Select Batch" />
                </div>

                <div className="form-row-layout">
                  <label>Enquiry Date:</label>
                  <div className="input-field-box">
                    <div className="icon-box-shaded"><Calendar size={16} /></div>
                    <input type="date" name="enquiry_date" value={formData.enquiry_date} onChange={handleChange} />
                  </div>
                </div>

                <div className="form-row-layout">
                  <label>Followup Date:</label>
                  <div className="input-field-box">
                    <div className="icon-box-shaded"><Calendar size={16} /></div>
                    <input type="date" name="next_followup" value={formData.next_followup} onChange={handleChange} />
                  </div>
                </div>

                <div className="form-row-layout">
                  <label>Tags:</label>
                  <ModernSelect
                    name="tags"
                    value={formData.tags}
                    options={options.tags}
                    icon={Tag}
                    placeholder="Select Multiple Tags"
                    isMulti={true}
                  />
                </div>

                <div className="form-row-layout">
                  <label>Remarks:</label>
                  <div className="input-field-box">
                    <div className="icon-box-shaded"><Edit3 size={16} /></div>
                    <input type="text" name="remarks" value={formData.remarks} onChange={handleChange} />
                  </div>
                </div>

                <div className="form-row-layout">
                  <label>Counsellor:</label>
                  <ModernSelect name="counsellor_id" value={formData.counsellor_id} options={options.counsellors} icon={User} placeholder="Assign Counsellor" />
                </div>

                <div className="form-row-layout">
                  <label>Branch:</label>
                  <ModernSelect name="branch_id" value={formData.branch_id} options={options.branches} icon={Building2} placeholder="Select Branch" />
                </div>
              </div>

              <div className="form-footer-actions">
                <button type="button" className="btn-secondary-flat" onClick={() => navigate("/leads-view")}>CANCEL</button>
                <button type="submit" className="btn-primary-blue" disabled={isSubmitting}>
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