import React, { useState } from "react";
import "./CounsellorForm.css";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  User, Mail, MapPin, Briefcase, BookOpen, 
  UserCheck, ArrowRight, Check, Smartphone, 
  Target, Hash, Info, Building2
} from "lucide-react";

const CounsellorForm = () => {
  const initialState = {
    full_name: "", email: "", phone: "", location: "", age: "",
    gender: "", profession: "", source: [], purpose: "",
    courses: [], batch_preference: "", branch_preference: "",
    poc: "", counselor_name: [],
  };

  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggle = (field, value) => {
    setFormData((prev) => {
      const existing = prev[field];
      const updated = existing.includes(value)
        ? existing.filter((i) => i !== value)
        : [...existing, value];
      return { ...prev, [field]: updated };
    });
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(
        "https://operating-media-backend.onrender.com/api/enquiries/submit/",
        formData,
      );
      alert("Enquiry Recorded Successfully!");
      setFormData(initialState);
    } catch (err) {
      alert("Submission failed. Check network.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="executive-portal-root">
      <div className="exec-shell">
        <form onSubmit={handleSubmit}>
          {/* CORPORATE HEADER */}
          <header className="exec-header">
            <div className="exec-brand-line">
              <span className="exec-tag">Administration</span>
              <h1>Course Counseling Form</h1>
              <p>Operating Media • Digital Career Academy Enrollment</p>
            </div>
          </header>

          <div className="exec-workflow">
            {/* SECTION 1 - PRIMARY DATA */}
            <section className="exec-card">
              <div className="exec-card-head"><User size={18} /> <h3>1. Primary Lead Information</h3></div>
              <div className="exec-grid grid-3">
                <div className="exec-group"><label>Full Name *</label><input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required placeholder="Student's Name" /></div>
                <div className="exec-group"><label>Email Address *</label><input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Email ID" /></div>
                <div className="exec-group">
                  <label>WhatsApp Number *</label>
                  <PhoneInput country={"in"} value={formData.phone} onChange={(v) => setFormData({ ...formData, phone: v })} containerClass="exec-tel-box" inputClass="exec-tel-input" buttonClass="exec-tel-btn" dropdownClass="exec-tel-drop" specialLabel="" />
                </div>
              </div>

              <div className="exec-grid grid-3 mt-25">
                <div className="exec-group"><label>Location *</label><input type="text" name="location" value={formData.location} onChange={handleChange} required placeholder="Area/City" /></div>
                <div className="exec-group"><label>Age *</label><input type="number" name="age" value={formData.age} onChange={handleChange} required placeholder="Age" /></div>
                <div className="exec-group">
                  <label>Gender *</label>
                  <div className="exec-toggle-row">
                    {["Male", "Female"].map((g) => (
                      <div key={g} className={`exec-toggle-btn ${formData.gender === g ? "active" : ""}`} onClick={() => setFormData({...formData, gender: g})}>
                        {g}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 2 - BACKGROUND */}
            <section className="exec-card">
              <div className="exec-card-head"><Briefcase size={18} /> <h3>2. Career Background</h3></div>
              <div className="exec-grid grid-2">
                <div className="exec-group">
                  <label>Current Profession *</label>
                  <div className="exec-select-grid">
                    {["Student", "Working Pro", "Business", "Graduated"].map((p) => (
                      <div key={p} className={`exec-select-box ${formData.profession === p ? "active" : ""}`} onClick={() => setFormData({ ...formData, profession: p })}>
                        {p} {formData.profession === p && <Check size={14} />}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="exec-group">
                  <label>Marketing Source *</label>
                  <div className="exec-check-grid">
                    {["Google", "Instagram", "Facebook", "Justdial", "Sulekha", "Webinar", "Reference"].map((s) => (
                      <div key={s} className={`exec-check-item ${formData.source.includes(s) ? "active" : ""}`} onClick={() => handleToggle("source", s)}>
                        <div className="exec-box">{formData.source.includes(s) && <Check size={12} />}</div>
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="exec-group full-width mt-25">
                <label>Purpose of Course Joining *</label>
                <textarea name="purpose" value={formData.purpose} onChange={handleChange} required placeholder="Enter student goals..." rows="3" />
              </div>
            </section>

            {/* SECTION 3 - PREFERENCES */}
            <section className="exec-card">
              <div className="exec-card-head"><BookOpen size={18} /> <h3>3. Academic Selection</h3></div>
              <div className="exec-grid grid-60-40">
                <div className="exec-group">
                  <label>Courses Selected (Multiple)</label>
                  <div className="exec-course-list">
                    {["Master's Program", "Advanced Diploma", "SEO", "PPC", "Social Media", "Analytics", "Wordpress"].map((c) => (
                      <div key={c} className={`exec-course-row ${formData.courses.includes(c) ? "active" : ""}`} onClick={() => handleToggle("courses", c)}>
                        <div className="exec-checkbox-mini">{formData.courses.includes(c) && <Check size={12} />}</div>
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="exec-sidebar">
                  <div className="exec-group">
                    <label>Batch *</label>
                    <div className="exec-toggle-row">
                      {["Weekday", "Weekend"].map((b) => (
                        <div key={b} className={`exec-toggle-btn ${formData.batch_preference === b ? "active" : ""}`} onClick={() => setFormData({ ...formData, batch_preference: b })}>
                          {b}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="exec-group mt-20">
                    <label>Branch *</label>
                    <select name="branch_preference" value={formData.branch_preference} onChange={handleChange} required>
                      <option value="">Select Center</option>
                      <option value="Andheri">Andheri West</option>
                      <option value="Borivali">Borivali East</option>
                      <option value="Online">Online Sessions</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 4 - ASSIGNMENT */}
            <section className="exec-card">
              <div className="exec-card-head"><UserCheck size={18} /> <h3>4. Staff Assignment</h3></div>
              <div className="exec-grid grid-2">
                <div className="exec-group">
                  <label>Point of Contact (POC)</label>
                  <div className="exec-staff-list">
                    {["Pooja Parab", "Aniket Pawar", "Mayuri Patel", "Komal", "Ashwini"].map((p) => (
                      <div key={p} className={`exec-staff-item ${formData.poc === p ? "active" : ""}`} onClick={() => setFormData({ ...formData, poc: p })}>
                        <div className="staff-dot"></div>
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="exec-group">
                  <label>Counselors</label>
                  <div className="exec-check-grid">
                    {["Harsh Pareek", "Pooja Parab", "Aniket Pawar", "Mayuri Patel", "Komal", "Hemant Mane", "Shraddha Rane"].map((c) => (
                      <div key={c} className={`exec-check-item ${formData.counselor_name.includes(c) ? "active" : ""}`} onClick={() => handleToggle("counselor_name", c)}>
                         <div className="exec-box">{formData.counselor_name.includes(c) && <Check size={12} />}</div>
                         <span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* FOOTER */}
            <div className="exec-footer">
              <button type="submit" className="exec-btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "PROCESSING DATA..." : "SUBMIT COUNSELING FORM"} <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CounsellorForm;