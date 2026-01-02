import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Building2,
  Briefcase,
  HeartPulse,
  ShieldAlert,
  Banknote,
  CheckCircle,
  Clock,
} from "lucide-react";
import "./AdmissionViewDrawer.css";

const AdmissionViewDrawer = ({ isOpen, onClose, admissionId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && admissionId) {
      setLoading(true);
      axios
        .get(
          `https://operating-media-backend.onrender.com/api/admissions/${admissionId}/`
        )
        .then((res) => {
          setData(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [isOpen, admissionId]);

  if (!isOpen) return null;

  // Financial Calculations
  const calculateFinances = () => {
    if (!data) return { totalPaid: 0, balance: 0, percent: 0 };
    const totalFees = parseFloat(data.total_fees) || 0;
    const reg = parseFloat(data.registration_amount) || 0;

    let installmentPaid = 0;
    for (let i = 1; i <= 8; i++) {
      if (data[`inst_${i}_status`] === "Paid") {
        installmentPaid += parseFloat(data[`inst_${i}_amount`]) || 0;
      }
    }

    const totalPaid = reg + installmentPaid;
    const balance = totalFees - totalPaid;
    const percent = totalFees > 0 ? (totalPaid / totalFees) * 100 : 0;

    return { totalPaid, balance, percent };
  };

  const finances = calculateFinances();

  return (
    <>
      <div className="view-drawer-overlay" onClick={onClose}></div>
      <div className="view-drawer-container">
        <div className="view-drawer-header">
          <div className="view-profile-summary">
            <div className="view-avatar">{data?.first_name?.charAt(0)}</div>
            <div className="view-name-stack">
              <h3>
                {data?.first_name} {data?.last_name}
              </h3>
              <span>
                {data?.course} • ID: #{data?.id}
              </span>
            </div>
          </div>
          <button className="view-close-x" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="view-drawer-content">
          {loading ? (
            <div className="view-loader">Fetching profile details...</div>
          ) : (
            <>
              {/* FINANCIAL DASHBOARD */}
              <div className="view-card financial-card">
                <h4 className="view-card-title">
                  <Banknote size={16} /> Payment Summary
                </h4>
                <div className="fin-grid">
                  <div className="fin-item">
                    <label>Total Fees</label>
                    <p>₹{data.total_fees}</p>
                  </div>
                  <div className="fin-item">
                    <label>Amount Paid</label>
                    <p className="text-green">₹{finances.totalPaid}</p>
                  </div>
                  <div className="fin-item">
                    <label>Balance</label>
                    <p className="text-red">₹{finances.balance}</p>
                  </div>
                </div>
                <div className="progress-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${finances.percent}%` }}
                  ></div>
                </div>
                <span className="progress-label">
                  {Math.round(finances.percent)}% of total fees cleared
                </span>
              </div>

              {/* PERSONAL INFO */}
              <div className="view-card">
                <h4 className="view-card-title">
                  <User size={16} /> Personal Details
                </h4>
                <div className="view-info-grid">
                  <InfoItem
                    label="Full Name"
                    value={`${data.first_name} ${data.middle_name || ""} ${
                      data.last_name
                    }`}
                    icon={User}
                  />
                  <InfoItem
                    label="Date of Birth"
                    value={data.dob}
                    icon={Calendar}
                  />
                  <InfoItem label="Gender" value={data.gender} icon={User} />
                  <InfoItem
                    label="Marital Status"
                    icon={HeartPulse}
                    value={data.status}
                  />
                </div>
              </div>

              {/* CONTACT INFO */}
              <div className="view-card">
                <h4 className="view-card-title">
                  <Phone size={16} /> Contact Information
                </h4>
                <div className="view-info-grid">
                  <InfoItem label="Mobile" value={data.phone} icon={Phone} />
                  <InfoItem label="Email" value={data.email} icon={Mail} />
                  <div className="full-row">
                    <InfoItem
                      label="Residential Address"
                      value={`${data.address1}, ${data.address2 || ""}, ${
                        data.city
                      }, ${data.state} - ${data.pincode}`}
                      icon={MapPin}
                    />
                  </div>
                </div>
              </div>

              {/* INSTALLMENT TIMELINE */}
              <div className="view-card">
                <h4 className="view-card-title">
                  <Clock size={16} /> Payment Schedule
                </h4>
                <div className="payment-list">
                  <div className="payment-row">
                    <span>Registration</span>
                    <span className="pay-amt">₹{data.registration_amount}</span>
                    <span className="pay-status paid">Paid</span>
                  </div>
                  {[...Array(parseInt(data.no_of_installments))].map((_, i) => {
                    const num = i + 1;
                    const status = data[`inst_${num}_status`];
                    return (
                      <div className="payment-row" key={num}>
                        <span>
                          Installment {num} ({data[`inst_${num}_date`]})
                        </span>
                        <span className="pay-amt">
                          ₹{data[`inst_${num}_amount`]}
                        </span>
                        <span className={`pay-status ${status.toLowerCase()}`}>
                          {status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* EMERGENCY */}
              <div className="view-card">
                <h4 className="view-card-title">
                  <ShieldAlert size={16} /> Emergency Contact
                </h4>
                <div className="view-info-grid">
                  <InfoItem
                    label="Contact Name"
                    value={data.emergency_name}
                    icon={User}
                  />
                  <InfoItem
                    label="Contact Phone"
                    value={data.emergency_phone}
                    icon={Phone}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

const InfoItem = ({ label, value, icon: Icon }) => (
  <div className="view-info-item">
    <div className="info-icon-box">
      <Icon size={14} />
    </div>
    <div className="info-text-box">
      <label>{label}</label>
      <p>{value || "—"}</p>
    </div>
  </div>
);

export default AdmissionViewDrawer;
