import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  Send,
  X,
  BookOpen,
  Smartphone,
  ChevronDown,
  ChevronRight,
  Link2,
  Building2,
  Briefcase,
  Check,
  Tag,
} from "lucide-react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import "./LeadsCreate.css";

const LeadsCreate = () => {
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
        "Enrolled",
        "Interested",
        "Will Visit",
        "Visited",
        "No Response",
        "Call Back",
        "Invalid",
        "Looking for Job",
        "Placement Inquiry",
        "Not Interested",
        "Counseling Done",
        "Old Lead",
        "Future Admission",
        "Online Counseling"
    ],
  });

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    father_name: "",
    mobile: "",
    other_contact: "",
    email: "",
    gender: "Male",
    source: [], // CHANGED TO ARRAY for multi-select
    location: "",
    preferred_batch: "",
    enquiry_date: new Date().toISOString().split("T")[0],
    next_followup: "",
    tags: [], // Array for multi-select
    remarks: "",
    branch_id: "",
    counsellor_id: "",
    course: "",
  });

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/leads/create/")
      .then((res) => {
        setOptions((prev) => ({ ...res.data, tags: prev.tags }));
      })
      .catch((err) => console.error("Database connection error", err));
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/leads/create/",
        formData
      );
      if (response.status === 201) {
        alert("Lead Created Successfully!");
        navigate("/leads-view");
      }
    } catch (err) {
      console.error("Submission Error:", err);
      alert("Failed to create lead. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- UPDATED MODERN SELECT (Supports Multi-Select) ---
  const ModernSelect = ({ name, value, options, placeholder, icon: Icon, isMulti = false }) => {
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

    const displayValue = isMulti 
      ? (value.length > 0 ? value.join(", ") : placeholder)
      : (value || placeholder);

    return (
      <div className="modern-select-container" ref={dropRef}>
        <div
          className={`modern-select-trigger ${isOpen ? "is-active" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="icon-box-shaded">
            <Icon size={16} />
          </div>
          <span className={`selected-text ${(!value || value.length === 0) ? "is-placeholder" : ""}`}>
            {displayValue}
          </span>
          <ChevronDown
            className={`arrow-icon ${isOpen ? "rotate" : ""}`}
            size={16}
          />
        </div>

        {isOpen && (
          <div className="modern-dropdown-list">
            {options && options.length > 0 ? (
              options.map((opt, i) => {
                const isSelected = isMulti ? value.includes(opt) : value === opt;
                return (
                  <div
                    key={i}
                    className={`dropdown-option ${isSelected ? "is-selected" : ""}`}
                    onClick={() => handleSelect(opt)}
                  >
                    {opt}
                    {isSelected && <Check size={14} />}
                  </div>
                );
              })
            ) : (
              <div className="dropdown-option disabled">No data available</div>
            )}
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
              <span>Home</span> <ChevronRight size={12} />{" "}
              <span className="active">Create Lead</span>
            </div>
            <h2 className="main-title">Add New Enquiry</h2>
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
                    <div className="icon-box-shaded"><User size={16} /></div>
                    <input type="text" name="first_name" placeholder="Enter first name" required onChange={handleChange} />
                  </div>
                </div>

                <div className="form-row-layout">
                  <label>Last Name:</label>
                  <div className="input-field-box">
                    <div className="icon-box-shaded"><User size={16} /></div>
                    <input type="text" name="last_name" placeholder="Enter last name" required onChange={handleChange} />
                  </div>
                </div>

                <div className="form-row-layout">
                  <label>Mobile Number:</label>
                  <div className="input-field-box">
                    <div className="icon-box-shaded"><Smartphone size={16} /></div>
                    <input type="text" name="mobile" placeholder="Phone" required onChange={handleChange} />
                  </div>
                </div>

                <div className="form-row-layout">
                  <label>Email Address:</label>
                  <div className="input-field-box">
                    <div className="icon-box-shaded"><Mail size={16} /></div>
                    <input type="email" name="email" placeholder="Enter email address" value={formData.email} onChange={handleChange} />
                  </div>
                </div>

                <div className="form-row-layout">
                  <label>Gender:</label>
                  <ModernSelect name="gender" value={formData.gender} options={["Male", "Female", "Other"]} icon={User} />
                </div>

                {/* UPDATED SOURCE FIELD (MULTI-SELECT) */}
                <div className="form-row-layout">
                  <label>Source:</label>
                  <ModernSelect 
                    name="source" 
                    value={formData.source} 
                    options={options.sources} 
                    placeholder="Select Multiple Sources" 
                    icon={Link2} 
                    isMulti={true}
                  />
                </div>
              </div>

              <div className="ui-divider"></div>

              <div className="section-block">
                <h3 className="section-label-heading">
                  <BookOpen size={16} /> COURSE DETAILS
                </h3>

                <div className="form-row-layout">
                  <label>Select Course:</label>
                  <ModernSelect name="course" value={formData.course} options={options.courses} placeholder="Select Course" icon={BookOpen} />
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
                  <label>Followup Date:</label>
                  <div className="input-field-box">
                    <div className="icon-box-shaded"><Calendar size={16} /></div>
                    <input type="date" name="next_followup" onChange={handleChange} />
                  </div>
                </div>

                {/* UPDATED TAGS FIELD (MULTI-SELECT) */}
                <div className="form-row-layout">
                  <label>Tags:</label>
                  <ModernSelect
                    name="tags"
                    value={formData.tags}
                    options={options.tags}
                    placeholder="Select Multiple Tags"
                    icon={Tag}
                    isMulti={true}
                  />
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
                <button type="submit" className="btn-primary-blue" disabled={isSubmitting}>
                  <Send size={14} /> {isSubmitting ? "CREATING..." : "CREATE"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LeadsCreate;