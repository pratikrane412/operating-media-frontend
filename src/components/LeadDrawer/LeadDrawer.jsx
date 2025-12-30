import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  X, User, Mail, Phone, MapPin, Calendar, BookOpen, Tag, Send, Plus, Check
} from "lucide-react";
import "./LeadDrawer.css";

const LeadDrawer = ({ leadId, isOpen, onClose, onUpdate }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form States
  const [showForm, setShowForm] = useState(false);
  const [newRemark, setNewRemark] = useState("");
  const [nextDate, setNextDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Tags Management States
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [tempTags, setTempTags] = useState([]);
  
  const allAvailableTags = [
    "Enrolled", "Interested", "Will Visit", "Visited", "No Response",
    "Call Back", "Invalid", "Looking for Job", "Placement Inquiry",
    "Not Interested", "Counseling Done", "Old Lead", "Future Admission", "Online Counseling"
  ];

  const formatList = (val) => {
    if (!val) return [];
    const cleanStr = val.replace(/[\[\]'"]/g, "");
    return cleanStr.split(",").map(item => item.trim()).filter(Boolean);
  };

  const fetchLeadDetails = () => {
    setLoading(true);
    axios.get(`https://operating-media-backend.onrender.com/api/leads/${leadId}/`)
      .then((res) => {
        setDetails(res.data);
        setTempTags(formatList(res.data.tags)); // Sync temp tags with DB
        setLoading(false);
      })
      .catch((err) => { console.error(err); setLoading(false); });
  };

  useEffect(() => {
    if (isOpen && leadId) {
      fetchLeadDetails();
      setShowForm(false);
      setIsEditingTags(false);
    }
  }, [leadId, isOpen]);

  const handleToggleTag = (tag) => {
    if (tempTags.includes(tag)) {
      setTempTags(tempTags.filter(t => t !== tag));
    } else {
      setTempTags([...tempTags, tag]);
    }
  };

  const handleSaveTags = async () => {
    try {
      await axios.patch(`https://operating-media-backend.onrender.com/api/leads/${leadId}/tags/`, { tags: tempTags });
      setIsEditingTags(false);
      fetchLeadDetails();
      if (onUpdate) onUpdate(); // Refresh main table
    } catch (err) {
      alert("Failed to update tags");
    }
  };

  const handleAddFollowup = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`https://operating-media-backend.onrender.com/api/leads/${leadId}/followup/`, {
        remark: newRemark,
        next_date: nextDate,
      });
      fetchLeadDetails();
      setNewRemark("");
      setNextDate("");
      setShowForm(false);
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
            <div className="drawer-avatar">{details?.first_name?.charAt(0)}</div>
            <div>
              <h3>{details?.first_name} {details?.last_name}</h3>
              <span className="id-tag">ID: #{details?.id}</span>
            </div>
          </div>
          <button className="close-drawer-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="drawer-body">
          {loading ? (
            <div className="drawer-loader">Loading Profile...</div>
          ) : (
            <>
              {/* --- ENHANCED TAGS SECTION --- */}
              <div className="drawer-section">
                <div className="section-header-row">
                  <h4 className="section-title">Tags & Status</h4>
                  <button className="btn-edit-small" onClick={() => setIsEditingTags(!isEditingTags)}>
                    {isEditingTags ? "Cancel" : "Manage"}
                  </button>
                </div>

                <div className="clean-tag-container">
                  <div className="pill-group">
                    {tempTags.length > 0 ? (
                      tempTags.map((tag, i) => (
                        <span key={i} className="status-badge-pill">
                          <Tag size={10} /> {tag}
                          {isEditingTags && (
                            <X size={12} className="remove-tag-icon" onClick={() => handleToggleTag(tag)} />
                          )}
                        </span>
                      ))
                    ) : !isEditingTags && <span className="no-tag-placeholder">No Tags Assigned</span>}
                  </div>

                  {isEditingTags && (
                    <div className="tag-selection-area">
                      <p className="selection-hint">Click to add/remove tags:</p>
                      <div className="selection-grid">
                        {allAvailableTags.map(tag => (
                          <div 
                            key={tag} 
                            className={`tag-option ${tempTags.includes(tag) ? 'selected' : ''}`}
                            onClick={() => handleToggleTag(tag)}
                          >
                            {tag} {tempTags.includes(tag) && <Check size={10} />}
                          </div>
                        ))}
                      </div>
                      <button className="btn-save-tags" onClick={handleSaveTags}>Save Tag Changes</button>
                    </div>
                  )}

                  <div className="source-info-box">
                    <span className="source-label">SOURCE</span>
                    <div className="source-values-list">
                      {formatList(details?.source).map((src, i) => (
                        <span key={i} className="source-value">
                          {src}{i < formatList(details?.source).length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* CONTACT DETAILS */}
              <div className="drawer-section">
                <h4 className="section-title">Contact Information</h4>
                <div className="info-grid">
                  <div className="info-item"><Mail size={16}/> <span>{details?.email}</span></div>
                  <div className="info-item"><Phone size={16}/> <span>{details?.mobile}</span></div>
                </div>
              </div>

              {/* TIMELINE */}
              <div className="drawer-section">
                <div className="section-header-row">
                  <h4 className="section-title">Timeline & Remarks</h4>
                  {!showForm && (
                    <button className="btn-add-inline" onClick={() => setShowForm(true)}>
                      <Plus size={14} /> Add New
                    </button>
                  )}
                </div>

                {showForm && (
                  <div className="followup-form-box">
                    <textarea 
                       placeholder="Write followup remark..." 
                       value={newRemark} 
                       onChange={(e) => setNewRemark(e.target.value)} 
                       required 
                    />
                    <div className="form-row-mini">
                      <div className="date-input-mini">
                        <Calendar size={14} />
                        <input type="date" value={nextDate} onChange={(e) => setNextDate(e.target.value)} required />
                      </div>
                      <div className="form-btns-mini">
                        <button className="btn-cancel-mini" onClick={() => setShowForm(false)}>Cancel</button>
                        <button className="btn-save-mini" onClick={handleAddFollowup} disabled={submitting || !newRemark || !nextDate}>
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
                        <div className="timeline-meta"><Calendar size={12} /> <span>{h.date}</span></div>
                        <p className="timeline-remark">{h.remark}</p>
                      </div>
                    </div>
                  ))}
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