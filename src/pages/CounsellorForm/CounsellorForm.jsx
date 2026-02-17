import React, { useState } from "react";
import "./CounsellorForm.css";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  BookOpen,
  UserCheck,
  ArrowRight,
  Check,
  Smartphone,
  CheckCircle,
} from "lucide-react";

const CounsellorForm = () => {
  const initialState = {
    full_name: "",
    email: "",
    phone: "",
    location: "",
    age: "",
    gender: "",
    profession: "",
    source: [],
    purpose: "",
    courses: [],
    batch_preference: "",
    branch_preference: "",
    poc: "",
    counselor_name: "",
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
    if (formData.phone.length < 10)
      return alert("Please enter a valid phone number");
    if (formData.courses.length === 0)
      return alert("Please select at least one course");

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "https://operating-media-backend.onrender.com/api/enquiries/submit/",
        formData,
      );
      if (response.status === 201 || response.status === 200) {
        alert("Enquiry Recorded Successfully!");
        setFormData(initialState);
      }
    } catch (err) {
      alert("Submission failed. Check network.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="counsellor-portal-scoped">
      <div className="cf-shell">
        <form onSubmit={handleSubmit}>
          <header className="cf-header">
            <div className="cf-brand-line">
              <h1>Operating Media - Counseling Form</h1>
              <p>Operating Media • Digital Career Academy Enrollment</p>
            </div>
          </header>

          <div className="cf-workflow">
            {/* SECTION 1 - PERSONAL DATA */}
            <section className="cf-card">
              <div className="cf-card-head">
                <User size={18} /> <h3>1. Primary Information</h3>
              </div>
              <div className="cf-grid grid-3">
                <div className="cf-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    placeholder="Student's Name"
                  />
                </div>
                <div className="cf-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Email ID"
                  />
                </div>
                <div className="cf-group">
                  <label>WhatsApp Number *</label>
                  <PhoneInput
                    country={"in"}
                    value={formData.phone}
                    onChange={(v) => setFormData({ ...formData, phone: v })}
                    containerClass="cf-tel-box"
                    inputClass="cf-tel-input"
                    buttonClass="cf-tel-btn"
                    dropdownClass="cf-tel-drop"
                    specialLabel=""
                  />
                </div>
              </div>

              <div className="cf-grid grid-3 mt-25">
                <div className="cf-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    placeholder="Area/City"
                  />
                </div>
                <div className="cf-group">
                  <label>Age *</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    placeholder="Age"
                  />
                </div>
                <div className="cf-group">
                  <label>Gender *</label>
                  <div className="cf-toggle-row">
                    {["Male", "Female"].map((g) => (
                      <div
                        key={g}
                        className={`cf-toggle-btn ${formData.gender === g ? "active" : ""}`}
                        onClick={() => setFormData({ ...formData, gender: g })}
                      >
                        {g}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 2 - BACKGROUND */}
            <section className="cf-card">
              <div className="cf-card-head">
                <Briefcase size={18} /> <h3>2. Career Background</h3>
              </div>
              <div className="cf-grid">
                <div className="cf-group">
                  <label>Current Profession *</label>
                  <div className="cf-select-grid">
                    {["Student", "Working Pro", "Business", "Graduated"].map(
                      (p) => (
                        <div
                          key={p}
                          className={`cf-select-box ${formData.profession === p ? "active" : ""}`}
                          onClick={() =>
                            setFormData({ ...formData, profession: p })
                          }
                        >
                          {p} {formData.profession === p && <Check size={14} />}
                        </div>
                      ),
                    )}
                  </div>
                </div>
                
              </div>
              <div className="cf-group full-width mt-25">
                <label>Purpose of Joining *</label>
                <textarea
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  required
                  placeholder="Enter student goals..."
                  rows="3"
                />
              </div>
            </section>

            {/* SECTION 3 - PREFERENCES */}
            <section className="cf-card">
              <div className="cf-card-head">
                <BookOpen size={18} /> <h3>3. Academic Selection</h3>
              </div>
              <div className="cf-grid grid-60-40">
                <div className="cf-group">
                  <label>Courses Selected (Multiple)</label>
                  <div className="cf-course-list">
                    {[
                      "Master's Program in Digital Marketing",
                      "Advanced Diploma in Digital Marketing",
                      "Search Engine Optimization",
                      "Pay Per Click",
                      "Social Media Marketing",
                      "Google Analytics",
                      "Wordpress",
                    ].map((c) => (
                      <div
                        key={c}
                        className={`cf-course-row ${formData.courses.includes(c) ? "active" : ""}`}
                        onClick={() => handleToggle("courses", c)}
                      >
                        <div className="cf-checkbox-mini">
                          {formData.courses.includes(c) && <Check size={12} />}
                        </div>
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="cf-sidebar">
                  <div className="cf-group">
                    <label>Batch *</label>
                    <div className="cf-toggle-row">
                      {["Weekday", "Weekend"].map((b) => (
                        <div
                          key={b}
                          className={`cf-toggle-btn ${formData.batch_preference === b ? "active" : ""}`}
                          onClick={() =>
                            setFormData({ ...formData, batch_preference: b })
                          }
                        >
                          {b}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="cf-group mt-20">
                    <label>Branch *</label>
                    <select
                      name="branch_preference"
                      value={formData.branch_preference}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Branch</option>
                      <option value="Andheri">Andheri</option>
                      <option value="Borivali">Borivali</option>
                      <option value="Online">Online</option>
                    </select>
                  </div>
                  <br />
                  <div className="cf-group">
                  <label>Marketing Source *</label>
                  <div className="cf-check-grid">
                    {[
                      "Google",
                      "Instagram",
                      "Facebook",
                      "Justdial",
                      "Sulekha",
                      "Webinar",
                      "Reference",
                    ].map((s) => (
                      <div
                        key={s}
                        className={`cf-check-item ${formData.source.includes(s) ? "active" : ""}`}
                        onClick={() => handleToggle("source", s)}
                      >
                        <div className="cf-box">
                          {formData.source.includes(s) && <Check size={12} />}
                        </div>
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
                </div>
              </div>
            </section>

            {/* SECTION 4 - ASSIGNMENT */}
            <section className="cf-card">
              <div className="cf-card-head">
                <UserCheck size={18} /> <h3>4. Staff Assignment</h3>
              </div>
              <div className="cf-grid grid-2">
                <div className="cf-group">
                  <label>Point of Contact (POC)</label>
                  <div className="cf-staff-list">
                    {[
                      "Pooja Parab",
                      "Aniket Pawar",
                      "Mayuri Patel",
                      "Komal",
                      "Ashwini",
                    ].map((p) => (
                      <div
                        key={p}
                        className={`cf-staff-item ${formData.poc === p ? "active" : ""}`}
                        onClick={() => setFormData({ ...formData, poc: p })}
                      >
                        <div className="staff-dot"></div>
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="cf-group">
                  <label>Counselor</label>
                  <div className="cf-radio-grid">
                    {[
                      "Harsh Pareek",
                      "Pooja Parab",
                      "Aniket Pawar",
                      "Mayuri Patel",
                      "Komal",
                      "Hemant Mane",
                      "Shraddha Rane",
                    ].map((c) => (
                      <div
                        key={c}
                        className={`cf-radio-item ${
                          formData.counselor_name === c ? "active" : ""
                        }`}
                        onClick={() =>
                          setFormData({ ...formData, counselor_name: c })
                        }
                      >
                        <div className="cf-radio-circle">
                          {formData.counselor_name === c && (
                            <div className="cf-radio-dot"></div>
                          )}
                        </div>
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <div className="cf-footer">
              <button
                type="submit"
                className="cf-btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "PROCESSING..." : "SUBMIT COUNSELING FORM"}{" "}
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CounsellorForm;
