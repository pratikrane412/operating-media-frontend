import React, { useState, useRef, useEffect } from "react";
import "./AdmissionForm.css";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  User,
  Mail,
  MapPin,
  Calendar,
  GraduationCap,
  ShieldAlert,
  Upload,
  ArrowRight,
  ChevronDown,
  Check,
  CheckCircle,
  Fingerprint,
  FileCheck,
} from "lucide-react";

// --- CUSTOM SELECT ---
const EliteSelect = ({ name, value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  useEffect(() => {
    const close = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const selected = options.find((opt) => opt.value === value);
  const label = selected ? selected.label : placeholder;

  return (
    <div className="adm-elite-field-box" ref={selectRef}>
      <div
        className={`adm-elite-trigger ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={!value && value !== false ? "is-placeholder" : ""}>
          {label}
        </span>
        <ChevronDown
          size={16}
          className={`chevron ${isOpen ? "rotate" : ""}`}
        />
      </div>
      {isOpen && (
        <div className="adm-elite-dropdown">
          {options.map((opt, i) => (
            <div
              key={i}
              className={`adm-elite-option ${value === opt.value ? "is-selected" : ""}`}
              onClick={() => {
                onChange({ target: { name, value: opt.value } });
                setIsOpen(false);
              }}
            >
              {opt.label} {value === opt.value && <Check size={14} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- CUSTOM DATE PICKER ---
const EliteDatePicker = ({ name, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [curr, setCurr] = useState(new Date());
  const pickerRef = useRef(null);
  useEffect(() => {
    const close = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const days = [];
  const start = new Date(curr.getFullYear(), curr.getMonth(), 1).getDay();
  const end = new Date(curr.getFullYear(), curr.getMonth() + 1, 0).getDate();
  for (let i = 0; i < start; i++) days.push(null);
  for (let i = 1; i <= end; i++) days.push(i);

  return (
    <div className="adm-elite-field-box" ref={pickerRef}>
      <div
        className={`adm-elite-trigger ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={!value ? "is-placeholder" : ""}>
          {value ? new Date(value).toLocaleDateString("en-GB") : "Select Date"}
        </span>
        <Calendar size={16} />
      </div>
      {isOpen && (
        <div className="adm-elite-datepicker">
          <div className="adm-dp-header">
            <button
              type="button"
              onClick={() =>
                setCurr(new Date(curr.getFullYear(), curr.getMonth() - 1))
              }
            >
              ‹
            </button>
            <div className="adm-dp-title">
              <select
                className="adm-dp-month"
                value={curr.getMonth()}
                onChange={(e) =>
                  setCurr(
                    new Date(curr.getFullYear(), parseInt(e.target.value), 1),
                  )
                }
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <option key={i} value={i}>
                    {new Date(0, i).toLocaleString("en-US", { month: "long" })}
                  </option>
                ))}
              </select>

              <select
                className="adm-dp-year"
                value={curr.getFullYear()}
                onChange={(e) =>
                  setCurr(
                    new Date(parseInt(e.target.value), curr.getMonth(), 1),
                  )
                }
              >
                {Array.from({ length: 100 }).map((_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
            <button
              type="button"
              onClick={() =>
                setCurr(new Date(curr.getFullYear(), curr.getMonth() + 1))
              }
            >
              ›
            </button>
          </div>
          <div className="adm-dp-grid">
            {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
              <div key={d} className="adm-dp-w">
                {d}
              </div>
            ))}
            {days.map((d, i) => (
              <div
                key={i}
                className={`adm-dp-d ${!d ? "empty" : ""} ${value && new Date(value).getDate() === d ? "active" : ""}`}
                onClick={() =>
                  d &&
                  (onChange({
                    target: {
                      name,
                      value: `${curr.getFullYear()}-${curr.getMonth() + 1}-${d}`,
                    },
                  }),
                  setIsOpen(false))
                }
              >
                {d}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- CUSTOM UPLOAD BOX ---
const EliteUpload = ({ label, name, value, onChange }) => {
  const inputRef = useRef(null);
  return (
    <div
      className={`adm-upload-box ${value ? "is-active" : ""}`}
      onClick={() => inputRef.current.click()}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={onChange}
        name={name}
        style={{ display: "none" }}
        accept="image/*"
      />
      <div className="icon-circ">
        {value ? (
          <CheckCircle size={22} color="#10b981" />
        ) : (
          <Upload size={22} />
        )}
      </div>
      <span className="box-label">{label}</span>
      <span className="box-subtext">
        {value ? "Document Selected" : "Click to upload image"}
      </span>
    </div>
  );
};

const AdmissionPortal = () => {
  const initialState = {
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
    gender: "",
    status: "",
    dob: "",
    employed: "",
    organization: "NA",
    course: "",
    branch: "",
    emergencyName: "",
    emergencyPhone: "",
    aadhaarFront: null,
    aadhaarBack: null,
    photo: null,
    agree: false,
  };

  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, [name]: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";

    if (!formData.middleName.trim())
      newErrors.middleName = "Middle name is required";

    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!formData.phone || formData.phone.length < 10)
      newErrors.phone = "Valid mobile number is required";

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.address.trim())
      newErrors.address = "Street address is required";

    if (!formData.gender) newErrors.gender = "Gender is required";

    if (!formData.dob) newErrors.dob = "Date of birth is required";

    if (!formData.course) newErrors.course = "Course selection is required";

    if (!formData.branch) newErrors.branch = "Branch selection is required";

    if (!formData.emergencyName.trim())
      newErrors.emergencyName = "Emergency name is required";

    if (!formData.emergencyPhone || formData.emergencyPhone.length < 10)
      newErrors.emergencyPhone = "Valid emergency number required";

    if (!formData.aadhaarFront)
      newErrors.aadhaarFront = "Aadhaar front image required";

    if (!formData.aadhaarBack)
      newErrors.aadhaarBack = "Aadhaar back image required";

    if (!formData.photo) newErrors.photo = "Passport photo required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    if (!formData.agree) {
      alert("Please accept declaration");
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(
        "https://operating-media-backend.onrender.com/api/admission/create/",
        formData,
      );

      alert("Registration Successful!");
      setFormData(initialState);
      setErrors({});
    } catch (err) {
      alert("Error submitting form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="elite-admission-wrapper">
      <div className="adm-mesh-bg"></div>
      <div className="adm-shell">
        <form onSubmit={handleSubmit}>
          <header className="adm-hero">
            <span className="adm-pill">Admission Form</span>

            <div className="adm-hero-logo">
              <img src="/OOPM.png" alt="Operating Media Logo" />
            </div>

            <p>Complete your enrollment process below</p>
          </header>

          <div className="adm-workflow">
            <section className="adm-card">
              <div className="adm-card-header">
                <User /> <h2>1. Personal Identity</h2>
              </div>
              <div className="adm-grid grid-3">
                <div className="adm-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="First Name"
                  />
                  {errors.firstName && (
                    <span className="adm-error">{errors.firstName}</span>
                  )}
                </div>
                <div className="adm-group">
                  <label>Middle Name</label>
                  <input
                    type="text"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                    required
                    placeholder="Middle Name"
                  />
                </div>
                <div className="adm-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Last Name"
                  />
                  {errors.lastName && (
                    <span className="adm-error">{errors.lastName}</span>
                  )}
                </div>
                <div className="adm-group">
                  <label>Date of Birth</label>
                  <EliteDatePicker
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                  />
                  {errors.dob && (
                    <span className="adm-error">{errors.dob}</span>
                  )}
                </div>
                <div className="adm-group">
                  <label>Gender</label>
                  <EliteSelect
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    options={[
                      { label: "Male", value: "Male" },
                      { label: "Female", value: "Female" },
                    ]}
                    placeholder="Select Gender"
                  />
                  {errors.gender && (
                    <span className="adm-error">{errors.gender}</span>
                  )}
                </div>
                <div className="adm-group">
                  <label>Marital Status</label>
                  <EliteSelect
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    options={[
                      { label: "Single", value: "Single" },
                      { label: "Married", value: "Married" },
                    ]}
                    placeholder="Select Status"
                  />
                </div>
              </div>
            </section>

            <section className="adm-card">
              <div className="adm-card-header">
                <MapPin /> <h2>2. Residential Address</h2>
              </div>
              <div className="adm-grid grid-4">
                <div className="adm-group span-full">
                  <label>Street Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="House No, Building, Area"
                  />
                  {errors.address && (
                    <span className="adm-error">{errors.address}</span>
                  )}
                </div>
                <div className="adm-group">
                  <label>Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </div>
                <div className="adm-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                  />
                </div>
                <div className="adm-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City Name"
                  />
                </div>

                <div className="adm-group">
                  <label>ZIP Code</label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    placeholder="Pincode"
                  />
                </div>
              </div>
            </section>

            <section className="adm-card">
              <div className="adm-card-header">
                <Fingerprint /> <h2>3. Communication Details</h2>
              </div>
              <div className="adm-grid grid-2">
                <div className="adm-group">
                  <label>Primary Mobile</label>
                  <PhoneInput
                    country={"in"}
                    value={formData.phone}
                    onChange={(v) => setFormData({ ...formData, phone: v })}
                    containerClass="adm-tel-root"
                    inputClass="adm-tel-input"
                    buttonClass="adm-tel-btn"
                    dropdownClass="adm-tel-drop"
                    specialLabel=""
                  />
                  {errors.phone && (
                    <span className="adm-error">{errors.phone}</span>
                  )}
                </div>
                <div className="adm-group">
                  <label>Personal Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="email@example.com"
                  />
                  {errors.email && (
                    <span className="adm-error">{errors.email}</span>
                  )}
                </div>
              </div>
            </section>

            <section className="adm-card">
              <div className="adm-card-header">
                <ShieldAlert /> <h2>4. Emergency Contact</h2>
              </div>
              <div className="adm-grid grid-2">
                <div className="adm-group">
                  <label>Emergency Name</label>
                  <input
                    type="text"
                    name="emergencyName"
                    value={formData.emergencyName}
                    onChange={handleChange}
                    placeholder="Relative Name"
                  />
                  {errors.emergencyName && (
                    <span className="adm-error">{errors.emergencyName}</span>
                  )}
                </div>
                <div className="adm-group">
                  <label>Emergency Phone</label>
                  <input
                    type="tel"
                    name="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={handleChange}
                    placeholder=""
                  />
                  {errors.emergencyPhone && (
                    <span className="adm-error">{errors.emergencyPhone}</span>
                  )}
                </div>
              </div>
            </section>

            <section className="adm-card">
              <div className="adm-card-header">
                <GraduationCap /> <h2>5. Academic & Professional</h2>
              </div>
              <div className="adm-grid grid-3">
                <div className="adm-group">
                  <label>Course</label>
                  <EliteSelect
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    options={[
                      {
                        label: "Masters in Digital Marketing",
                        value: "Masters in Digital Marketing",
                      },
                      {
                        label: "Advanced Diploma in Digital Marketing",
                        value: "Advanced Diploma in Digital Marketing",
                      },
                      {
                        label: "Diploma in Digital Marketing",
                        value: "Diploma in Digital Marketing",
                      },
                      {
                        label: "Pay Per Click Course",
                        value: "Pay Per Click Course",
                      },
                      {
                        label: "Social Media Optimization Course",
                        value: "Social Media Optimization Course",
                      },
                      {
                        label: "Search Engine Optimization Course",
                        value: "Search Engine Optimization Course",
                      },
                      {
                        label: "Google Analytics Course (GA4)",
                        value: "Google Analytics Course (GA4)",
                      },
                      {
                        label: "WordPress Development Course",
                        value: "WordPress Development Course",
                      },
                    ]}
                    placeholder="Select Path"
                  />
                  {errors.course && (
                    <span className="adm-error">{errors.course}</span>
                  )}
                </div>
                <div className="adm-group">
                  <label>Branch</label>
                  <EliteSelect
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    options={[
                      { label: "Andheri", value: "Andheri" },
                      { label: "Borivali", value: "Borivali" },
                      { label: "Online", value: "Online" },
                    ]}
                    placeholder="Choose Center"
                  />
                  {errors.branch && (
                    <span className="adm-error">{errors.branch}</span>
                  )}
                </div>
                <div className="adm-group">
                  <label>Employment Status</label>
                  <EliteSelect
                    name="employed"
                    value={formData.employed}
                    onChange={handleChange}
                    options={[
                      { label: "Yes", value: true },
                      { label: "No", value: false },
                    ]}
                    placeholder="Select Status"
                  />
                </div>
              </div>
            </section>

            <section className="adm-card">
              <div className="adm-card-header">
                <FileCheck /> <h2>6. Document Verification</h2>
              </div>
              <div className="adm-upload-grid">
                <EliteUpload
                  label="Aadhaar Front"
                  name="aadhaarFront"
                  value={formData.aadhaarFront}
                  onChange={handleFileChange}
                />
                {errors.aadhaarFront && (
                  <span className="adm-error">{errors.aadhaarFront}</span>
                )}
                <EliteUpload
                  label="Aadhaar Back"
                  name="aadhaarBack"
                  value={formData.aadhaarBack}
                  onChange={handleFileChange}
                />
                {errors.aadhaarBack && (
                  <span className="adm-error">{errors.aadhaarBack}</span>
                )}
                <EliteUpload
                  label="Passport Photo"
                  name="photo"
                  value={formData.photo}
                  onChange={handleFileChange}
                />
                {errors.photo && (
                  <span className="adm-error">{errors.photo}</span>
                )}
              </div>
            </section>

            <div className="adm-footer">
              <label className="adm-agree">
                <input
                  type="checkbox"
                  name="agree"
                  checked={formData.agree}
                  onChange={handleChange}
                />

                <span>
                  I hereby declare that the information provided by me is true
                  to the best of my knowledge. I take sole responsibility for
                  any misrepresentation and Operating Media shall not be held
                  liable for it. By ticking, I agree to the{" "}
                  <a
                    href="/terms-and-conditions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="adm-terms-link"
                  >
                    Terms and Conditions
                  </a>
                  .
                </span>
              </label>
              <br />
              <button
                type="submit"
                className="adm-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "PROCESSING..." : "SUBMIT APPLICATION"}{" "}
                <ArrowRight />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdmissionPortal;
