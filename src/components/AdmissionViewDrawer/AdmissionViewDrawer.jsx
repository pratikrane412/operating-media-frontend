import React, { useState, useEffect } from "react";
import axios from "axios";
import { Image, DownloadCloud } from "lucide-react"; // Add these icons
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
  Eye,
  Download,      // Added this import
} from "lucide-react";
import "./AdmissionViewDrawer.css";

const AdmissionViewDrawer = ({ isOpen, onClose, admissionId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDocGallery, setShowDocGallery] = useState(false);

  // 1. ADD STATE FOR FULL PHOTO VIEW
  const [showFullPhoto, setShowFullPhoto] = useState(false);

  const handleDownload = async (url, filename) => {
    if (!url || url === "" || url === "—") {
        alert("Document not available.");
        return;
    }

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      // Fallback for CORS issues
      window.open(url, "_blank");
    }
  };

  // --- 2. ADDED MISSING handleDownloadAll FUNCTION ---
  const handleDownloadAll = () => {
    if (!data) return;
    if (data.photo) handleDownload(data.photo, `${data.first_name}_Photo.jpg`);
    if (data.aadhar_card_front) handleDownload(data.aadhar_card_front, `${data.first_name}_Aadhar_Front.jpg`);
    if (data.aadhar_card_back) handleDownload(data.aadhar_card_back, `${data.first_name}_Aadhar_Back.jpg`);
  };


  useEffect(() => {
    if (isOpen && admissionId) {
      setLoading(true);
      axios
        .get(
          `https://operating-media-backend.onrender.com/api/admissions/${admissionId}/`,
        )
        .then((res) => {
          setData(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [isOpen, admissionId]);

  if (!isOpen) return null;

  // --- ADD THIS HELPER TO FIX THE ERROR ---
  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === "—" || dateStr === "None" || dateStr === "") return "—";

    // Handles database format (2026-01-29) and converts to UI format (29/01/2026)
    const parts = dateStr.includes("/") ? dateStr.split("/") : dateStr.split("/");

    if (parts.length === 3) {
      if (parts[0].length === 4) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return `${parts[0]}/${parts[1]}/${parts[2]}`;
    }
    return dateStr;
  };
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
            {/* 2. ADD ONCLICK TO POP OUT PHOTO */}
            <div
              className="view-avatar"
              onClick={() => data?.photo && setShowFullPhoto(true)}
              style={{ cursor: data?.photo ? "pointer" : "default" }}
            >
              {data?.photo && data.photo !== "" ? (
                <img
                  src={data.photo}
                  alt="Student Profile"
                  className="avatar-img"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.innerText =
                      data?.first_name?.charAt(0);
                  }}
                />
              ) : (
                data?.first_name?.charAt(0)
              )}
            </div>
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
                    value={`${data.first_name} ${data.middle_name || ""} ${data.last_name
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
                      value={`${data.address1}, ${data.address2 || ""}, ${data.city
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
                    <span>
                      Registration{" "}
                      {data?.registration_date
                        ? `(${formatDate(data.registration_date)})`
                        : ""}
                    </span>
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

              {/* --- NEW: DOCUMENT ACTIONS AT THE BOTTOM --- */}
              <div className="view-card doc-actions-card">
                <h4 className="view-card-title">Admission Documents</h4>
                <div className="doc-btn-group">
                  <button className="btn-doc-view" onClick={() => setShowDocGallery(true)}>
                    <Eye size={16} /> View All Documents
                  </button>
                  <button className="btn-doc-download" onClick={handleDownloadAll}>
                    <DownloadCloud size={16} /> Download All (3)
                  </button>
                </div>
              </div>

              {showDocGallery && (
                <div className="gallery-overlay" onClick={() => setShowDocGallery(false)}>
                  <div className="gallery-content" onClick={(e) => e.stopPropagation()}>
                    <div className="gallery-header">
                      <h4>Student Documents</h4>
                      <button className="close-gallery" onClick={() => setShowDocGallery(false)}>
                        <X size={20} />
                      </button>
                    </div>

                    <div className="gallery-grid">
                      {/* DOCUMENT 1: PHOTO */}
                      <div className="gallery-item">
                        <div className="img-container">
                          <img src={data.photo || "/placeholder.png"} alt="Photo" />
                          <button
                            className="individual-download-btn"
                            onClick={() => handleDownload(data.photo, `${data.first_name}_Photo.jpg`)}
                          >
                            <Download size={16} /> Download Photo
                          </button>
                        </div>
                      </div>

                      {/* DOCUMENT 2: AADHAR FRONT */}
                      <div className="gallery-item">
                        <div className="img-container">
                          <img src={data.aadhar_card_front || "/placeholder.png"} alt="Aadhar Front" />
                          <button
                            className="individual-download-btn"
                            onClick={() => handleDownload(data.aadhar_card_front, `${data.first_name}_Aadhar_Front.jpg`)}
                          >
                            <Download size={16} /> Download Aadhar Front
                          </button>
                        </div>
                      </div>

                      {/* DOCUMENT 3: AADHAR BACK */}
                      <div className="gallery-item">
                        <div className="img-container">
                          <img src={data.aadhar_card_back || "/placeholder.png"} alt="Aadhar Back" />
                          <button
                            className="individual-download-btn"
                            onClick={() => handleDownload(data.aadhar_card_back, `${data.first_name}_Aadhar_Back.jpg`)}
                          >
                            <Download size={16} /> Download Aadhar Back
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="gallery-footer">
                      <button className="btn-download-all-main" onClick={() => {
                        handleDownload(data.photo, 'Photo.jpg');
                        handleDownload(data.aadhar_card_front, 'Aadhar_Front.jpg');
                        handleDownload(data.aadhar_card_back, 'Aadhar_Back.jpg');
                      }}>
                        <DownloadCloud size={18} /> Download Zip / All Files
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </>
          )}
        </div>
      </div>

      {/* 3. LIGHTBOX POPUP UI */}
      {showFullPhoto && (
        <div
          className="photo-lightbox-overlay"
          onClick={() => setShowFullPhoto(false)}
        >
          <div
            className="lightbox-container"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="lightbox-close-btn"
              onClick={() => setShowFullPhoto(false)}
            >
              <X size={24} />
            </button>
            <img
              src={data?.photo}
              alt="Full View"
              className="full-photo-view"
            />
          </div>
        </div>
      )}
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
