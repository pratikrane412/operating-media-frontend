import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Smartphone,
  ChevronDown,
  Building2,
  Briefcase,
  Send,
  CheckCircle,
  Check,
  ShieldAlert,
  HeartPulse,
  MapPinned,
  Globe,
  Hash,
} from "lucide-react";
import "./AdmissionDrawer.css";

const FormRow = ({ label, icon: Icon, children }) => (
  <div className="drawer-form-row">
    <label>{label}:</label>
    <div className="modern-input-group">
      <div className="drawer-icon-box">
        <Icon size={18} />
      </div>
      {children}
    </div>
  </div>
);

const AdmissionDrawer = ({ isOpen, onClose, onUpdate, admissionId }) => {
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    phone: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    gender: "",
    status: "",
    dob: "",
    employed_status: "",
    organization: "",
    course: "",
    branch: "",
    emergency_name: "",
    emergency_phone: "",
  });

  // FETCH DATA LOGIC
  useEffect(() => {
    if (isOpen && admissionId) {
      setLoading(true);
      axios
        .get(
          `https://operating-media-backend.onrender.com/api/admissions/${admissionId}/`
        )
        .then((res) => {
          setFormData(res.data); // This populates the inputs
          setLoading(false);
        })
        .catch((err) => {
          console.error("Fetch Error:", err);
          setLoading(false);
        });
    }
  }, [isOpen, admissionId]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.put(
        `https://operating-media-backend.onrender.com/api/admissions/${admissionId}/`,
        formData
      );
      onUpdate();
      onClose();
    } catch (err) {
      alert("Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={onClose}></div>
      <div className="drawer-container">
        <div className="drawer-header">
          <div className="header-title">
            <CheckCircle size={22} color="#003873" />
            <h3>Review Admission Request</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form className="drawer-body" onSubmit={handleSubmit}>
          {loading ? (
            <div className="loader-container">Fetching data from server...</div>
          ) : (
            <>
              {/* SECTION 1 */}
              <h4 className="drawer-section-label">
                <User size={15} /> 1. Personal Information
              </h4>
              <FormRow label="First Name" icon={User}>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name || ""}
                  onChange={handleChange}
                />
              </FormRow>
              <FormRow label="Middle Name" icon={User}>
                <input
                  type="text"
                  name="middle_name"
                  value={formData.middle_name || ""}
                  onChange={handleChange}
                />
              </FormRow>
              <FormRow label="Last Name" icon={User}>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name || ""}
                  onChange={handleChange}
                />
              </FormRow>
              <FormRow label="Date of Birth" icon={Calendar}>
                <input
                  type="text"
                  name="dob"
                  value={formData.dob || ""}
                  onChange={handleChange}
                  placeholder="YYYY-MM-DD"
                />
              </FormRow>

              <FormRow label="Gender" icon={User}>
                <select
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleChange}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </FormRow>

              <FormRow label="Marital Status" icon={HeartPulse}>
                <select
                  name="status"
                  value={formData.status || ""}
                  onChange={handleChange}
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                </select>
              </FormRow>

              {/* SECTION 2 */}
              <h4 className="drawer-section-label">
                <Smartphone size={15} /> 2. Contact Details
              </h4>
              <FormRow label="Phone" icon={Phone}>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                />
              </FormRow>
              <FormRow label="Email" icon={Mail}>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                />
              </FormRow>
              <FormRow label="Address 1" icon={MapPin}>
                <input
                  type="text"
                  name="address1"
                  value={formData.address1 || ""}
                  onChange={handleChange}
                />
              </FormRow>
              <FormRow label="Address 2" icon={MapPin}>
                <input
                  type="text"
                  name="address2"
                  value={formData.address2 || ""}
                  onChange={handleChange}
                />
              </FormRow>
              <FormRow label="City" icon={Building2}>
                <input
                  type="text"
                  name="city"
                  value={formData.city || ""}
                  onChange={handleChange}
                />
              </FormRow>
              <FormRow label="State" icon={MapPinned}>
                <input
                  type="text"
                  name="state"
                  value={formData.state || ""}
                  onChange={handleChange}
                />
              </FormRow>
              <FormRow label="Pincode" icon={Hash}>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode || ""}
                  onChange={handleChange}
                />
              </FormRow>
              <FormRow label="Country" icon={Globe}>
                <input
                  type="text"
                  name="country"
                  value={formData.country || ""}
                  onChange={handleChange}
                />
              </FormRow>

              {/* SECTION 3 */}
              <h4 className="drawer-section-label">
                <Briefcase size={15} /> 3. Professional & Course Info
              </h4>
              <FormRow label="Employed" icon={Briefcase}>
                <select
                  name="employed_status"
                  value={formData.employed_status || ""}
                  onChange={handleChange}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </FormRow>
              <FormRow label="Organization" icon={Building2}>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization || ""}
                  onChange={handleChange}
                />
              </FormRow>
              <FormRow label="Course" icon={BookOpen}>
                <input
                  type="text"
                  name="course"
                  value={formData.course || ""}
                  onChange={handleChange}
                />
              </FormRow>
              <FormRow label="Branch" icon={MapPinned}>
                <input
                  type="text"
                  name="branch"
                  value={formData.branch || ""}
                  onChange={handleChange}
                />
              </FormRow>

              {/* SECTION 4 */}
              <h4 className="drawer-section-label">
                <ShieldAlert size={15} /> 4. Emergency Contact
              </h4>
              <FormRow label="Emergency Name" icon={User}>
                <input
                  type="text"
                  name="emergency_name"
                  value={formData.emergency_name || ""}
                  onChange={handleChange}
                />
              </FormRow>
              <FormRow label="Emergency Phone" icon={Phone}>
                <input
                  type="text"
                  name="emergency_phone"
                  value={formData.emergency_phone || ""}
                  onChange={handleChange}
                />
              </FormRow>
            </>
          )}

          <div className="drawer-footer-sticky">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit-primary"
              disabled={isSubmitting}
            >
              <Send size={18} />{" "}
              {isSubmitting ? "Updating..." : "Update Admission"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AdmissionDrawer;
