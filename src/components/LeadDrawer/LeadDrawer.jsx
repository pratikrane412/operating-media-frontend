import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  Tag,
  Send,
  Check,
  Link2,
} from "lucide-react";
import "./LeadDrawer.css";
import { hasPermission } from "../../utils/permissionCheck";

const LeadDrawer = ({ leadId, isOpen, onClose, onUpdate }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Followup Form States
  const [newRemark, setNewRemark] = useState("");
  const [nextDate, setNextDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Tags Management States
  const [tempTags, setTempTags] = useState([]);
  const [tempSources, setTempSources] = useState([]); // NEW: Temporary state for editing sources

  const allAvailableTags = [
    "Enrolled",
    "Interested",
    "Will Visit",
    "Visited",
    "No Response",
    "Call Back",
    "Invalid",
    "Looking for Job",
    "Placement Inquiry",
    "Not Interested",
    "Counseling Done",
    "Old Lead",
    "Future Admission",
    "Online Counseling",
  ];

  const allAvailableSources = [
    "Direct Call",
    "Website",
    "Google",
    "Reference",
    "WhatsApp",
    "Facebook",
    "Instagram",
    "LinkedIn",
  ];

  const formatList = (val) => {
    if (!val || val === "[]" || val === "No Tag" || val === "Reference")
      return [];
    // Handles cleanup for both bracketed strings and plain comma-separated strings
    return val
      .replace(/[\[\]"']/g, "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const fetchLeadDetails = () => {
    setLoading(true);
    axios
      .get(`https://operating-media-backend.onrender.com/api/leads/${leadId}/`)
      .then((res) => {
        setDetails(res.data);
        setTempTags(formatList(res.data.tags));
        setTempSources(formatList(res.data.source)); // Set initial sources
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching lead:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (isOpen && leadId) {
      fetchLeadDetails();
    }
  }, [leadId, isOpen]);

  // --- TAG LOGIC ---
  const handleToggleTag = (tag) => {
    setTempTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSaveTags = async () => {
    try {
      // Use PUT to the edit endpoint
      const res = await axios.put(
        `https://operating-media-backend.onrender.com/api/leads/${leadId}/edit/`,
        {
          tags: tempTags, // The array of selected tags
        }
      );

      if (res.status === 200) {
        alert("Tags updated successfully");
        if (onUpdate) onUpdate(); // This refreshes the table in the background
        onClose(); // This closes the drawer automatically
      }
    } catch (err) {
      alert("Failed to update tags");
    }
  };

  // --- SOURCE LOGIC (NEW) ---
  const handleToggleSource = (src) => {
    setTempSources((prev) =>
      prev.includes(src) ? prev.filter((s) => s !== src) : [...prev, src]
    );
  };

  const handleSaveSources = async () => {
    try {
      // Use PUT to the edit endpoint
      const res = await axios.put(
        `https://operating-media-backend.onrender.com/api/leads/${leadId}/edit/`,
        {
          source: tempSources, // The array of selected sources
        }
      );

      if (res.status === 200) {
        alert("Sources updated successfully");
        if (onUpdate) onUpdate(); // Refresh table
        onClose(); // Close drawer
      }
    } catch (err) {
      alert("Failed to update sources");
    }
  };

  const handleAddFollowup = async (e) => {
    e.preventDefault();
    if (!newRemark || !nextDate) {
      alert("Please fill both remark and date");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`https://operating-media-backend.onrender.com/api/leads/${leadId}/followup/`, {
        remark: newRemark,
        next_date: nextDate,
      });
      fetchLeadDetails();
      setNewRemark("");
      setNextDate("");
      if (onUpdate) onUpdate();
    } catch (err) {
      alert("Failed to add followup");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={onClose}></div>
      <div className={`drawer-container ${isOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <div className="header-user">
            <div className="drawer-avatar">
              {details?.first_name?.charAt(0)}
            </div>
            <div>
              <h3>
                {details?.first_name} {details?.last_name}
              </h3>
              <span className="id-tag">ID: #{details?.id}</span>
            </div>
          </div>
          <button className="close-drawer-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="drawer-body">
          {loading ? (
            <div className="drawer-loader">Loading details...</div>
          ) : (
            <>
              {/* TAGS SECTION */}
              <div className="drawer-section">
                <h4 className="section-title">Tags & Status</h4>
                <div className="tag-selection-area">
                  <div className="selection-grid">
                    {allAvailableTags.map((tag) => (
                      <div
                        key={tag}
                        className={`tag-option ${
                          tempTags.includes(tag) ? "selected" : ""
                        }`}
                        onClick={() => handleToggleTag(tag)}
                      >
                        {tag} {tempTags.includes(tag) && <Check size={10} />}
                      </div>
                    ))}
                  </div>
                  {hasPermission("edit enquiry") && (
                    <button className="btn-save-tags" onClick={handleSaveTags}>
                      Save Tag Changes
                    </button>
                  )}
                </div>
              </div>

              {/* SOURCE SECTION - NOW EDITABLE */}
              <div className="drawer-section">
                <h4 className="section-title">Lead Source</h4>
                <div className="tag-selection-area">
                  <div className="selection-grid">
                    {allAvailableSources.map((src) => (
                      <div
                        key={src}
                        className={`tag-option ${
                          tempSources.includes(src) ? "selected" : ""
                        }`}
                        onClick={() => handleToggleSource(src)}
                      >
                        {src} {tempSources.includes(src) && <Check size={10} />}
                      </div>
                    ))}
                  </div>
                  {hasPermission("edit enquiry") && (
                    <button
                      className="btn-save-tags"
                      onClick={handleSaveSources}
                    >
                      Update Source
                    </button>
                  )}
                </div>
              </div>

              {/* CONTACT DETAILS */}
              <div className="drawer-section">
                <h4 className="section-title">Contact Information</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <Mail size={16} /> <span>{details?.email}</span>
                  </div>
                  <div className="info-item">
                    <Phone size={16} /> <span>{details?.mobile}</span>
                  </div>
                </div>
              </div>

              {/* TIMELINE & REMARKS */}
              <div className="drawer-section">
                <h4 className="section-title">Timeline & Remarks</h4>
                {hasPermission("enquiry followup") && (
                  <div className="followup-form-box">
                    <textarea
                      placeholder="Type new followup remark here..."
                      value={newRemark}
                      onChange={(e) => setNewRemark(e.target.value)}
                      required
                    />
                    <div className="form-row-mini">
                      <div className="date-input-mini">
                        <Calendar size={14} />
                        <input
                          type="date"
                          value={nextDate}
                          onChange={(e) => setNextDate(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-btns-mini">
                        <button
                          className="btn-save-mini"
                          onClick={handleAddFollowup}
                          disabled={submitting || !newRemark || !nextDate}
                        >
                          {submitting ? "..." : <Send size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                <div className="timeline">
                  {details?.history?.map((h, i) => (
                    <div key={i} className="timeline-item">
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <div className="timeline-meta">
                          <Calendar size={12} /> <span>{h.date}</span>
                        </div>
                        <p className="timeline-remark">{h.remark}</p>
                      </div>
                    </div>
                  ))}
                  {details?.history?.length === 0 && (
                    <p className="no-history">No history yet.</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default LeadDrawer;
