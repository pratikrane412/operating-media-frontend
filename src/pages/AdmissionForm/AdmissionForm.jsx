import React, { useState, useRef, useEffect } from "react";
import "./AdmissionForm.css";
import axios from "axios";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Globe,
  Calendar,
  Briefcase,
  GraduationCap,
  ShieldAlert,
  Upload,
  CheckCircle,
  ArrowRight,
  FileText,
  Image as ImageIcon,
  HeartPulse,
  Hash,
  Landmark,
  ChevronDown,
  Check,
} from "lucide-react";

// Custom Select Component
const CustomSelect = ({
  name,
  value,
  onChange,
  options,
  placeholder,
  required,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange({ target: { name, value: optionValue } });
    setIsOpen(false);
  };

  const displayValue = value || placeholder;

  return (
    <div className="custom-select" ref={selectRef}>
      <div
        className={`custom-select-trigger ${isOpen ? "open" : ""} ${!value ? "placeholder" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{displayValue}</span>
        <ChevronDown
          size={18}
          className={`custom-select-arrow ${isOpen ? "rotate" : ""}`}
        />
      </div>
      {isOpen && (
        <div className="custom-select-dropdown">
          {options.map((option, index) => (
            <div
              key={index}
              className={`custom-select-option ${value === option.value ? "selected" : ""}`}
              onClick={() => handleSelect(option.value)}
            >
              <span>{option.label}</span>
              {value === option.value && (
                <Check size={16} className="check-icon" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Custom Date Picker Component
const CustomDatePicker = ({ name, value, onChange, required }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    value ? new Date(value) : null,
  );
  const [showYearPicker, setShowYearPicker] = useState(false);
  const datePickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setShowYearPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (date) => {
    if (!date) return "Select Date";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const generateYearRange = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    // Generate years from 100 years ago to 10 years in the future
    for (let year = currentYear - 100; year <= currentYear + 10; year++) {
      years.push(year);
    }
    return years;
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    onChange({ target: { name, value: formatDate(date) } });
    setIsOpen(false);
    setShowYearPicker(false);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
    );
  };

  const handleYearSelect = (year) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
    setShowYearPicker(false);
  };

  const handleToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentMonth(today);
    onChange({ target: { name, value: formatDate(today) } });
    setIsOpen(false);
    setShowYearPicker(false);
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date &&
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date) => {
    return (
      selectedDate &&
      date &&
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const monthName = currentMonth.toLocaleDateString("en-US", {
    month: "long",
  });
  const currentYear = currentMonth.getFullYear();

  return (
    <div className="custom-datepicker" ref={datePickerRef}>
      <div
        className={`custom-datepicker-trigger ${isOpen ? "open" : ""} ${!selectedDate ? "placeholder" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{formatDisplayDate(selectedDate)}</span>
        <Calendar size={18} className="calendar-icon" />
      </div>
      {isOpen && (
        <div className="custom-datepicker-dropdown">
          <div className="datepicker-header">
            <button type="button" onClick={handlePrevMonth} className="nav-btn">
              <ChevronDown size={18} style={{ transform: "rotate(90deg)" }} />
            </button>
            <div className="month-year-selector">
              <span className="month-display">{monthName}</span>
              <button
                type="button"
                className="year-selector-btn"
                onClick={() => setShowYearPicker(!showYearPicker)}
              >
                {currentYear}
                <ChevronDown
                  size={14}
                  style={{
                    transform: showYearPicker
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </button>
            </div>
            <button type="button" onClick={handleNextMonth} className="nav-btn">
              <ChevronDown size={18} style={{ transform: "rotate(-90deg)" }} />
            </button>
          </div>

          {showYearPicker ? (
            <div className="year-picker-grid">
              {generateYearRange().map((year) => (
                <div
                  key={year}
                  className={`year-option ${year === currentYear ? "current" : ""}`}
                  onClick={() => handleYearSelect(year)}
                >
                  {year}
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="datepicker-weekdays">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <div key={day} className="weekday">
                    {day}
                  </div>
                ))}
              </div>
              <div className="datepicker-days">
                {getDaysInMonth(currentMonth).map((date, index) => (
                  <div
                    key={index}
                    className={`day ${!date ? "empty" : ""} ${isToday(date) ? "today" : ""} ${isSelected(date) ? "selected" : ""}`}
                    onClick={() => date && handleDateSelect(date)}
                  >
                    {date ? date.getDate() : ""}
                  </div>
                ))}
              </div>
              <div className="datepicker-footer">
                <button
                  type="button"
                  onClick={handleToday}
                  className="today-btn"
                >
                  Today
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const AdmissionForm = () => {
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
    employed: false,
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
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1200; // Resize to standard width
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Compress to 70% quality to save massive space
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
          setFormData({ ...formData, [name]: compressedBase64 });
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agree) return alert("Please agree to the declaration.");

    setIsSubmitting(true);
    try {
      await axios.post("https://operating-media-backend.onrender.com/api/admission/create/", formData);
      alert("Application Submitted Successfully!");
      setFormData(initialState);
    } catch (error) {
      alert("Submission failed. Please verify your details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="adm-portal-root">
      <div className="adm-full-wrapper">
        <form onSubmit={handleSubmit} className="adm-main-container">
          {/* PREMIUM HERO HEADER */}
          <header className="adm-masthead">
            <div className="adm-masthead-content">
              <span className="adm-badge">OFFICIAL ENROLLMENT</span>
              <h1>Admission Portal</h1>
              <p>Operating Media • Digital Career Academy</p>
            </div>
          </header>

          <div className="adm-grid-layout">
            {/* LEFT COLUMN */}
            <div className="adm-column">
              {/* PERSONAL IDENTITY */}
              <section className="adm-card">
                <div className="adm-card-header">
                  <User size={20} /> <h3>1. Personal Identity</h3>
                </div>
                <div className="adm-inner-grid">
                  <div className="adm-field">
                    <label>First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      placeholder="First Name"
                    />
                  </div>
                  <div className="adm-field">
                    <label>Middle Name *</label>
                    <input
                      type="text"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleChange}
                      required
                      placeholder="Middle Name"
                    />
                  </div>
                  <div className="adm-field">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      placeholder="Last Name"
                    />
                  </div>
                  <div className="adm-field">
                    <label>Date of Birth</label>
                    <CustomDatePicker
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="adm-field">
                    <label>Gender</label>
                    <CustomSelect
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      placeholder="Select"
                      options={[
                        { label: "Male", value: "Male" },
                        { label: "Female", value: "Female" },
                      ]}
                      required
                    />
                  </div>
                  <div className="adm-field">
                    <label>Marital Status</label>
                    <CustomSelect
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      placeholder="Select"
                      options={[
                        { label: "Single", value: "Single" },
                        { label: "Married", value: "Married" },
                      ]}
                      required
                    />
                  </div>
                </div>
              </section>

              {/* ADDRESS & LOCATION */}
              <section className="adm-card adm-mt-30">
                <div className="adm-card-header">
                  <MapPin size={20} /> <h3>2. Residential Address</h3>
                </div>
                <div className="adm-inner-grid">
                  <div className="adm-field adm-span-4">
                    <label>Street Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder="House No, Building, Street"
                    />
                  </div>
                  <div className="adm-field adm-span-4">
                    <label>Apartment / Suite / Area (Address 2)</label>
                    <input
                      type="text"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleChange}
                      placeholder="Landmark or Area"
                    />
                  </div>
                  <div className="adm-field">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Mumbai"
                    />
                  </div>
                  <div className="adm-field">
                    <label>State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Maharashtra"
                    />
                  </div>
                  <div className="adm-field">
                    <label>ZIP Code</label>
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleChange}
                      placeholder="400001"
                    />
                  </div>
                  <div className="adm-field">
                    <label>Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="India"
                    />
                  </div>
                </div>
              </section>

              {/* EMERGENCY CONTACT */}
              <section className="adm-card adm-mt-30 adm-accent-card">
                <div className="adm-card-header">
                  <ShieldAlert size={20} /> <h3>3. Emergency Contact</h3>
                </div>
                <div className="adm-inner-grid">
                  <div className="adm-field adm-span-2">
                    <label>Relative Name</label>
                    <input
                      type="text"
                      name="emergencyName"
                      value={formData.emergencyName}
                      onChange={handleChange}
                      placeholder="Contact Person Name"
                    />
                  </div>
                  <div className="adm-field adm-span-2">
                    <label>Relative Phone</label>
                    <input
                      type="tel"
                      name="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={handleChange}
                      placeholder="Mobile Number"
                    />
                  </div>
                </div>
              </section>
            </div>

            {/* RIGHT COLUMN */}
            <div className="adm-column">
              {/* CONTACT DETAILS */}
              <section className="adm-card">
                <div className="adm-card-header">
                  <Phone size={20} /> <h3>4. Communication Details</h3>
                </div>
                <div className="adm-inner-grid">
                  <div className="adm-field adm-span-2">
                    <label>Primary Mobile *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+91"
                    />
                  </div>
                  <div className="adm-field adm-span-2">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="example@mail.com"
                    />
                  </div>
                </div>
              </section>

              {/* PROFESSIONAL & ACADEMIC */}
              <section className="adm-card adm-mt-30">
                <div className="adm-card-header">
                  <GraduationCap size={20} />{" "}
                  <h3>5. Academic & Professional</h3>
                </div>
                <div className="adm-inner-grid">
                  <div className="adm-field adm-span-2">
                    <label>Preferred Course *</label>
                    <CustomSelect
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      placeholder="Select Path"
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
                      required
                    />
                  </div>
                  <div className="adm-field adm-span-2">
                    <label>Branch Center *</label>
                    <CustomSelect
                      name="branch"
                      value={formData.branch}
                      onChange={handleChange}
                      placeholder="Select Location"
                      options={[
                        { label: "Andheri", value: "Andheri" },
                        { label: "Borivali", value: "Borivali" },
                      ]}
                      required
                    />
                  </div>
                  <div className="adm-field adm-span-2">
                    <label>Employment Status</label>
                    <CustomSelect
                      name="employed"
                      value={formData.employed}
                      onChange={handleChange}
                      placeholder="Select Status"
                      options={[
                        { label: "Yes", value: true },
                        { label: "No", value: false },
                      ]}
                      required
                    />
                  </div>
                  <div className="adm-field adm-span-2">
                    <label>Organization Name</label>
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      placeholder="NA"
                    />
                  </div>
                </div>
              </section>

              {/* DOCUMENTS */}
              <section className="adm-card adm-mt-30 adm-doc-card">
                <div className="adm-card-header">
                  <Upload size={20} /> <h3>6. Document Verification</h3>
                </div>
                <div className="adm-upload-grid">
                  <div className="adm-upload-box">
                    <label>Aadhaar Front</label>
                    <input
                      type="file"
                      name="aadhaarFront"
                      onChange={handleFileChange}
                      required
                    />
                  </div>
                  <div className="adm-upload-box">
                    <label>Aadhaar Back</label>
                    <input
                      type="file"
                      name="aadhaarBack"
                      onChange={handleFileChange}
                      required
                    />
                  </div>
                  <div className="adm-upload-box">
                    <label>Passport Photo</label>
                    <input
                      type="file"
                      name="photo"
                      onChange={handleFileChange}
                      required
                    />
                  </div>
                </div>
              </section>

              {/* SUBMIT AREA */}
              <div className="adm-action-footer">
                <label className="adm-declaration">
                  <input
                    type="checkbox"
                    name="agree"
                    checked={formData.agree}
                    onChange={handleChange}
                    required
                  />
                  I hereby declare that all provided information is true to my
                  knowledge.
                </label>
                <br />
                <button
                  type="submit"
                  className="adm-btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Processing Application..."
                    : "Submit My Application"}
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdmissionForm;
