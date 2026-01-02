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
  Hash,
  CreditCard,
  Send,
  UserCheck,
  Link2,
  CheckCircle,
  GraduationCap,
  Percent,
  Banknote,
  Edit3,
  Check,
  MapPinned,
} from "lucide-react";
import "./StudentDrawer.css";

// --- HELPER 1: MODERN DROPDOWN ---
const ModernSelect = ({
  label,
  value,
  options,
  placeholder,
  icon: Icon,
  onSelect,
  name,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="drawer-form-row" ref={dropRef}>
      <label>{label}:</label>
      <div className="modern-select-container">
        <div
          className={`modern-select-trigger ${isOpen ? "is-active" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="drawer-icon-box">
            <Icon size={20} />
          </div>
          <span className={`selected-text ${!value ? "is-placeholder" : ""}`}>
            {value || placeholder}
          </span>
          <ChevronDown
            className={`select-arrow ${isOpen ? "rotate" : ""}`}
            size={16}
          />
        </div>

        {isOpen && (
          <div className="modern-dropdown-menu">
            {options && options.length > 0 ? (
              options.map((opt, i) => {
                // Fixed: Handle both 'name' and 'branch_name' for different tables
                const labelText = opt.branch_name || opt.name || opt;
                const valText = opt.id !== undefined ? opt.id : opt;

                return (
                  <div
                    key={i}
                    className={`dropdown-item ${
                      value === labelText ? "selected" : ""
                    }`}
                    onClick={() => {
                      onSelect(name, valText, labelText);
                      setIsOpen(false);
                    }}
                  >
                    {labelText}
                    {value === labelText && (
                      <Check size={14} className="check-icon" />
                    )}
                  </div>
                );
              })
            ) : (
              <div className="dropdown-item disabled">No options available</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// --- HELPER 2: STANDARD INPUT ROW ---
const FormRow = ({ label, icon: Icon, children }) => (
  <div className="drawer-form-row">
    <label>{label}:</label>
    <div className="drawer-input-wrapper">
      <div className="drawer-icon-box">
        <Icon size={20} />
      </div>
      {children}
    </div>
  </div>
);

const StudentDrawer = ({ isOpen, onClose, onUpdate, studentId }) => {
  const [options, setOptions] = useState({
    courses: [],
    batches: [],
    branches: [],
    counsellors: [],
    sources: [],
    years: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    admission_type: "Admission",
    joining_date: new Date().toISOString().split("T")[0],
    first_name: "",
    last_name: "",
    father_name: "",
    dob: "",
    mobile: "",
    email: "",
    gender: "Male",
    occupation: "Student",
    source: "", // Added missing field
    college: "",
    college_year: "",
    address: "",
    branch_id: "",
    batch_name: "",
    course_id: "",
    roll_no: "",
    fee_deposit: "",
    discount: "",
    payment_mode: "Cash",
    remarks: "",
    counsellor_id: "",
    // Display labels for UI persistence
    course_label: "",
    branch_label: "",
    counsellor_label: "",
    occupation_label: "Student",
    gender_label: "Male",
    payment_mode_label: "Cash",
  });

  const years = Array.from({ length: 36 }, (_, i) => (2025 - i).toString());

  useEffect(() => {
    if (isOpen) {
      // 1. Fetch all options
      axios
        .get("https://operating-media-backend.onrender.com/api/students/create/")
        .then((res) => setOptions({ ...res.data, years }));

      // 2. If editing, fetch lead data and map labels
      if (studentId) {
        axios
          .get(`https://operating-media-backend.onrender.com/api/students/${studentId}/`)
          .then((res) => {
            const data = res.data;
            setFormData({
              ...data,
              // Fix: Convert "Source1, Source2" string into Array for multi-select UI
              source: data.source ? data.source.split(", ") : [],
              // Ensure display labels are set so dropdowns don't look empty
              branch_label: data.branch_label,
              course_label: data.course_label,
              counsellor_label: data.counsellor_label,
            });
          });
      } else {
        // Reset for Add Mode
        setFormData({
          admission_type: "Admission",
          joining_date: new Date().toISOString().split("T")[0],
          first_name: "",
          last_name: "",
          father_name: "",
          dob: "",
          mobile: "",
          email: "",
          gender: "Male",
          source: [],
          college: "",
          college_year: "",
          address: "",
          branch_id: "",
          batch_name: "",
          course_id: "",
          roll_no: "",
          fee_deposit: "",
          discount: "",
          payment_mode: "Cash",
          remarks: "",
          counsellor_id: "",
        });
      }
    }
  }, [isOpen, studentId]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSelectChange = (name, val, label) => {
    if (name === "source") {
      // Multi-select logic for Source
      const currentSources = Array.isArray(formData.source)
        ? formData.source
        : [];
      const newSources = currentSources.includes(label)
        ? currentSources.filter((s) => s !== label)
        : [...currentSources, label];

      setFormData((prev) => ({ ...prev, source: newSources }));
    } else {
      // Standard single-select logic for others
      setFormData((prev) => ({
        ...prev,
        [name]: val,
        [`${name.replace("_id", "")}_label`]: label,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (studentId) {
        // UPDATE MODE
        await axios.put(
          `https://operating-media-backend.onrender.com/api/students/${studentId}/`,
          formData
        );
      } else {
        // CREATE MODE
        await axios.post(
          "https://operating-media-backend.onrender.com/api/students/create/",
          formData
        );
      }
      onUpdate();
      onClose();
    } catch (err) {
      alert("Error saving student");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={onClose}></div>
      <div className="drawer-container wide">
        <div className="drawer-header">
          <div className="header-title">
            <GraduationCap size={22} />{" "}
            <h3>
              {studentId ? "Update Student Profile" : "New Student Admission"}
            </h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form className="drawer-body" onSubmit={handleSubmit}>
          <h4 className="drawer-section-label">
            <CheckCircle size={14} /> 1. Admission Details
          </h4>
          <ModernSelect
            label="Admission Type"
            icon={CheckCircle}
            name="admission_type"
            value={formData.admission_type}
            options={["Admission", "Demo"]}
            onSelect={handleSelectChange}
          />

          <FormRow label="Joining Date" icon={Calendar}>
            <input
              type="date"
              name="joining_date"
              value={formData.joining_date}
              required
              onChange={handleChange}
            />
          </FormRow>

          <ModernSelect
            label="Select Branch"
            icon={MapPinned}
            name="branch_id"
            value={formData.branch_label}
            options={options.branches}
            placeholder="Choose Branch"
            onSelect={handleSelectChange}
          />

          <h4 className="drawer-section-label mt-20">
            <User size={14} /> 2. Personal Information
          </h4>
          <FormRow label="First Name" icon={User}>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              required
              onChange={handleChange}
              placeholder="First Name *"
            />
          </FormRow>
          <FormRow label="Last Name" icon={User}>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              required
              onChange={handleChange}
              placeholder="Last Name *"
            />
          </FormRow>
          <FormRow label="Father Name" icon={User}>
            <input
              type="text"
              name="father_name"
              value={formData.father_name}
              onChange={handleChange}
              placeholder="Father Name"
            />
          </FormRow>
          <FormRow label="Date of Birth" icon={Calendar}>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />
          </FormRow>
          <FormRow label="Mobile" icon={Smartphone}>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              required
              onChange={handleChange}
              placeholder="Primary Mobile *"
            />
          </FormRow>
          <FormRow label="Email Address" icon={Mail}>
            <input
              type="email"
              name="email"
              value={formData.email}
              required
              onChange={handleChange}
              placeholder="Email Address *"
            />
          </FormRow>

          <ModernSelect
            label="Gender"
            icon={User}
            name="gender"
            value={formData.gender_label}
            options={["Male", "Female", "Other"]}
            onSelect={handleSelectChange}
          />

          <ModernSelect
            label="Occupation"
            icon={Briefcase}
            name="occupation"
            value={formData.occupation_label}
            options={["Student", "Working Professional"]}
            onSelect={handleSelectChange}
          />

          <ModernSelect
            label="Source"
            icon={Link2}
            name="source"
            value={formData.source} // This will now show "Google, Website"
            options={options.sources}
            placeholder="Select Source"
            onSelect={handleSelectChange}
            isMulti={true} // <--- ENSURE THIS IS TRUE
          />

          <h4 className="drawer-section-label mt-20">
            <Building2 size={14} /> 3. Academic Info
          </h4>
          <FormRow label="College Name" icon={Building2}>
            <input
              type="text"
              name="college"
              value={formData.college}
              onChange={handleChange}
              placeholder="Type College Name"
            />
          </FormRow>
          <ModernSelect
            label="Passing Year"
            icon={Calendar}
            name="college_year"
            value={formData.college_year}
            options={years}
            placeholder="Select Year"
            onSelect={handleSelectChange}
          />

          <h4 className="drawer-section-label mt-20">
            <MapPin size={14} /> 4. Address
          </h4>
          <FormRow label="Full Address" icon={MapPin}>
            <input
              type="text"
              name="address"
              value={formData.address}
              required
              onChange={handleChange}
              placeholder="Residential Address *"
            />
          </FormRow>

          <h4 className="drawer-section-label mt-20">
            <BookOpen size={14} /> 5. Enrollment
          </h4>
          <ModernSelect
            label="Select Course"
            icon={BookOpen}
            name="course_id"
            value={formData.course_label}
            options={options.courses}
            placeholder="Choose Course"
            onSelect={handleSelectChange}
          />

          <ModernSelect
            label="Select Batch"
            icon={Briefcase}
            name="batch_name"
            value={formData.batch_name}
            options={options.batches}
            placeholder="Choose Batch"
            onSelect={handleSelectChange}
          />

          <FormRow label="Roll Number" icon={Hash}>
            <input
              type="text"
              name="roll_no"
              value={formData.roll_no}
              onChange={handleChange}
              placeholder="Enrollment No"
            />
          </FormRow>

          <h4 className="drawer-section-label mt-20">
            <Banknote size={14} /> 6. Financials
          </h4>
          <FormRow label="Fee Deposit" icon={Banknote}>
            <input
              type="number"
              name="fee_deposit"
              value={formData.fee_deposit}
              onChange={handleChange}
              placeholder="Amount Paid"
            />
          </FormRow>
          <FormRow label="Discount" icon={Percent}>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              placeholder="Discount"
            />
          </FormRow>

          <ModernSelect
            label="Payment Mode"
            icon={CreditCard}
            name="payment_mode"
            value={formData.payment_mode_label}
            options={["Cash", "Online Transfer", "By Cheque"]}
            onSelect={handleSelectChange}
          />

          <ModernSelect
            label="Counsellor"
            icon={UserCheck}
            name="counsellor_id"
            value={formData.counsellor_label}
            options={options.counsellors}
            placeholder="Select Counsellor"
            onSelect={handleSelectChange}
          />

          <FormRow label="Remarks" icon={Edit3}>
            <input
              type="text"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Notes"
            />
          </FormRow>

          <div className="drawer-footer-sticky">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit-blue"
              disabled={isSubmitting}
            >
              <Send size={18} />{" "}
              {isSubmitting ? "Processing..." : "Submit Admission"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default StudentDrawer;
