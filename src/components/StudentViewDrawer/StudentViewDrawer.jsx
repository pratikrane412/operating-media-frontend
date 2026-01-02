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
  Hash,
  CreditCard,
  CheckCircle,
  GraduationCap,
  Percent,
  Banknote,
  ShieldCheck,
} from "lucide-react";
import "./StudentViewDrawer.css";

const StudentViewDrawer = ({ isOpen, onClose, studentId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && studentId) {
      setLoading(true);
      axios
        .get(
          `https://operating-media-backend.onrender.com/api/students/${studentId}/`
        )
        .then((res) => {
          setData(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [isOpen, studentId]);

  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={onClose}></div>
      <div className="view-drawer-container">
        <div className="view-drawer-header">
          <div className="profile-summary">
            <div className="profile-avatar">
              {data?.first_name?.charAt(0)}
              {data?.last_name?.charAt(0)}
            </div>
            <div className="profile-title-set">
              <h3>
                {data?.first_name} {data?.last_name}
              </h3>
              <span className="profile-id-tag">
                Student ID: {data?.login_id || "N/A"}
              </span>
            </div>
          </div>
          <button className="view-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="view-drawer-content">
          {loading ? (
            <div className="view-loader">Fetching profile details...</div>
          ) : (
            <>
              {/* SECTION: PERSONAL */}
              <div className="view-section">
                <h4 className="section-title">
                  <User size={16} /> Personal Information
                </h4>
                <div className="info-grid">
                  <InfoBox
                    label="Father's Name"
                    value={data.father_name}
                    icon={User}
                  />
                  <InfoBox
                    label="Mobile Number"
                    value={data.mobile}
                    icon={Phone}
                  />
                  <InfoBox
                    label="Email Address"
                    value={data.email}
                    icon={Mail}
                  />
                  <InfoBox
                    label="Date of Birth"
                    value={data.dob}
                    icon={Calendar}
                  />
                  <InfoBox label="Gender" value={data.gender} icon={User} />
                  <InfoBox
                    label="Source"
                    value={data.source}
                    icon={CheckCircle}
                  />
                </div>
              </div>

              {/* SECTION: ACADEMIC */}
              <div className="view-section">
                <h4 className="section-title">
                  <GraduationCap size={16} /> Academic & Enrollment
                </h4>
                <div className="info-grid">
                  <InfoBox
                    label="Course"
                    value={data.course_label}
                    icon={BookOpen}
                  />
                  <InfoBox
                    label="Batch"
                    value={data.batch_name}
                    icon={Briefcase}
                  />
                  <InfoBox
                    label="Branch"
                    value={data.branch_label}
                    icon={Building2}
                  />
                  <InfoBox
                    label="Roll Number"
                    value={data.roll_no}
                    icon={Hash}
                  />
                  <InfoBox
                    label="College"
                    value={data.college}
                    icon={Building2}
                  />
                  <InfoBox
                    label="Passing Year"
                    value={data.college_year}
                    icon={Calendar}
                  />
                </div>
              </div>

              {/* SECTION: ADDRESS */}
              <div className="view-section">
                <h4 className="section-title">
                  <MapPin size={16} /> Contact Address
                </h4>
                <div className="full-width-info">
                  <div className="info-icon">
                    <MapPin size={18} />
                  </div>
                  <div className="info-text">
                    <label>Residential Address</label>
                    <p>{data.address || "No address provided"}</p>
                  </div>
                </div>
              </div>

              {/* SECTION: FINANCIALS */}
              <div className="view-section">
                <h4 className="section-title">
                  <Banknote size={16} /> Financial Overview
                </h4>
                <div className="info-grid">
                  <InfoBox
                    label="Fee Deposited"
                    value={`₹${data.fee_deposit}`}
                    icon={Banknote}
                  />
                  <InfoBox
                    label="Discount Applied"
                    value={`₹${data.discount}`}
                    icon={Percent}
                  />
                  <InfoBox
                    label="Counsellor"
                    value={data.counsellor_label}
                    icon={ShieldCheck}
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

const InfoBox = ({ label, value, icon: Icon }) => (
  <div className="info-item">
    <div className="info-icon">
      <Icon size={18} />
    </div>
    <div className="info-text">
      <label>{label}</label>
      <p>{value || "—"}</p>
    </div>
  </div>
);

export default StudentViewDrawer;
