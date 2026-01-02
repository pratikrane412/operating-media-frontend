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
  Banknote,
  ListOrdered,
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
    // Fee Fields
    total_fees: 0,
    registration_amount: 0,
    no_of_installments: 0,
    inst_1_amount: 0,
    inst_1_date: "",
    inst_1_status: "Unpaid",
    inst_2_amount: 0,
    inst_2_date: "",
    inst_2_status: "Unpaid",
    inst_3_amount: 0,
    inst_3_date: "",
    inst_3_status: "Unpaid",
    inst_4_amount: 0,
    inst_4_date: "",
    inst_4_status: "Unpaid",
    inst_5_amount: 0,
    inst_5_date: "",
    inst_5_status: "Unpaid",
    inst_6_amount: 0,
    inst_6_date: "",
    inst_6_status: "Unpaid",
    inst_7_amount: 0,
    inst_7_date: "",
    inst_7_status: "Unpaid",
    inst_8_amount: 0,
    inst_8_date: "",
    inst_8_status: "Unpaid",
  });

  const addMonths = (date, months) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d.toISOString().split("T")[0];
  };

  // FETCH DATA LOGIC
  useEffect(() => {
    if (isOpen && admissionId) {
      setLoading(true);
      axios
        .get(
          `https://operating-media-backend.onrender.com/api/admissions/${admissionId}/`
        )
        .then((res) => {
          setFormData(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Fetch Error:", err);
          setLoading(false);
        });
    }
  }, [isOpen, admissionId]);

  // FEE CALCULATION LOGIC
  useEffect(() => {
    const total = parseFloat(formData.total_fees) || 0;
    const reg = parseFloat(formData.registration_amount) || 0;
    const count = parseInt(formData.no_of_installments) || 0;
    const today = new Date().toISOString().split("T")[0];

    if (count > 0) {
      const remaining = total - reg;
      const installmentVal = remaining > 0 ? (remaining / count).toFixed(2) : 0;

      let updatedInstallments = {};
      for (let i = 1; i <= 8; i++) {
        if (i <= count) {
          updatedInstallments[`inst_${i}_amount`] = installmentVal;
          updatedInstallments[`inst_${i}_date`] = addMonths(today, i - 1);
        } else {
          updatedInstallments[`inst_${i}_amount`] = 0;
          updatedInstallments[`inst_${i}_date`] = "";
          updatedInstallments[`inst_${i}_status`] = "Unpaid";
        }
      }
      setFormData((prev) => ({ ...prev, ...updatedInstallments }));
    }
  }, [
    formData.total_fees,
    formData.registration_amount,
    formData.no_of_installments,
  ]);

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

              {/* SECTION 5: FEE CONTROL */}
              <h4 className="drawer-section-label">
                <Banknote size={15} /> 5. Financial Information
              </h4>
              <FormRow label="Total Fees" icon={Banknote}>
                <input
                  type="number"
                  name="total_fees"
                  value={formData.total_fees || ""}
                  onChange={handleChange}
                />
              </FormRow>
              <FormRow label="Reg. Amount" icon={CheckCircle}>
                <input
                  type="number"
                  name="registration_amount"
                  value={formData.registration_amount || ""}
                  onChange={handleChange}
                />
              </FormRow>
              <FormRow label="Installments" icon={ListOrdered}>
                <select
                  name="no_of_installments"
                  value={formData.no_of_installments || 0}
                  onChange={handleChange}
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </FormRow>

              {/* DYNAMIC INSTALLMENT ROWS */}
              {Array.from({ length: formData.no_of_installments || 0 }).map(
                (_, i) => {
                  const num = i + 1;
                  return (
                    <div key={num} className="installment-row-container">
                      <span className="inst-num-label">Installment {num}</span>
                      <div className="inst-inputs">
                        {/* Editable Amount */}
                        <input
                          type="number"
                          name={`inst_${num}_amount`}
                          value={formData[`inst_${num}_amount`] || 0}
                          onChange={handleChange}
                        />
                        {/* Editable Date */}
                        <input
                          type="date"
                          name={`inst_${num}_date`}
                          value={formData[`inst_${num}_date`] || ""}
                          onChange={handleChange}
                        />
                        {/* Status Dropdown */}
                        <select
                          name={`inst_${num}_status`}
                          value={formData[`inst_${num}_status`]}
                          onChange={handleChange}
                          className={
                            formData[`inst_${num}_status`] === "Paid"
                              ? "status-paid"
                              : "status-unpaid"
                          }
                        >
                          <option value="Unpaid">Unpaid</option>
                          <option value="Paid">Paid</option>
                        </select>
                      </div>
                    </div>
                  );
                }
              )}
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
