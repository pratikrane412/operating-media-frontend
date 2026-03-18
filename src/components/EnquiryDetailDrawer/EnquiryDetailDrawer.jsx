import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  X, User, Phone, Mail, MapPin, Calendar, Briefcase,
  BookOpen, UserCheck, Search, Target, Heart, Info,
  Building2, MessageSquare, Send
} from "lucide-react";
import "./EnquiryDetailDrawer.css";

const EnquiryDetailDrawer = ({ isOpen, onClose, data, onUpdate }) => {

  const [responseText, setResponseText] = useState("");
  const [statusColor, setStatusColor] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Sync state when drawer opens
  useEffect(() => {
    if (data) {
      setResponseText(data.response || "");
      setStatusColor(data.status_color || "");
    }
  }, [data]);

  if (!data) return null;

  const handleSaveResponse = async () => {

    if (!responseText.trim())
      return alert("Please enter a response.");

    setIsSaving(true);

    try {

      await axios.patch(
        `https://operating-media-backend.onrender.com/api/enquiries/${data.id}/response/`,
        {
          response: responseText,
          status_color: statusColor
        }
      );

      alert("Counsellor response updated!");
      if (onUpdate) onUpdate();
      onClose();
      if (onUpdate) onUpdate();

    } catch (err) {
      console.error(err);
      alert("Failed to save response.");
    }
    finally {
      setIsSaving(false);
    }

  };

  return (
    <>
      <div className={`enq-overlay ${isOpen ? "active" : ""}`} onClick={onClose}></div>

      <div className={`enq-drawer ${isOpen ? "open" : ""}`} id="enq-detail-drawer">

        {/* HEADER */}

        <div className="enq-header-premium">
          <div className="enq-header-content">
            <div className="enq-header-avatar">
              {data.name.charAt(0)}
            </div>

            <div className="enq-header-info">
              <h3>{data.name}</h3>
              <p>{data.courses} • ID: #{data.id}</p>
            </div>
          </div>

          <button className="enq-close-circle" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* BODY */}

        <div className="enq-body-premium">

          {/* PERSONAL DETAILS */}

          <section className="enq-info-card">
            <div className="enq-card-label">
              <User size={16} /> <span>Personal Details</span>
            </div>

            <div className="enq-info-grid">

              <div className="enq-info-item">
                <div className="icon-shade"><User size={14} /></div>
                <div>
                  <label>FULL NAME</label>
                  <p>{data.name}</p>
                </div>
              </div>

              <div className="enq-info-item">
                <div className="icon-shade"><Calendar size={14} /></div>
                <div>
                  <label>RECORDED DATE</label>
                  <p>{data.date}</p>
                </div>
              </div>

              <div className="enq-info-item">
                <div className="icon-shade"><Info size={14} /></div>
                <div>
                  <label>GENDER</label>
                  <p>{data.gender || "—"}</p>
                </div>
              </div>

              <div className="enq-info-item">
                <div className="icon-shade"><Heart size={14} /></div>
                <div>
                  <label>AGE</label>
                  <p>{data.age || "—"}</p>
                </div>
              </div>

            </div>
          </section>

          {/* CONTACT */}

          <section className="enq-info-card">
            <div className="enq-card-label">
              <Phone size={16} /> <span>Contact Information</span>
            </div>

            <div className="enq-info-grid">

              <div className="enq-info-item">
                <div className="icon-shade"><Phone size={14} /></div>
                <div>
                  <label>MOBILE</label>
                  <p>{data.phone}</p>
                </div>
              </div>

              <div className="enq-info-item">
                <div className="icon-shade"><Mail size={14} /></div>
                <div>
                  <label>EMAIL</label>
                  <p>{data.email}</p>
                </div>
              </div>

              <div className="enq-info-item full">
                <div className="icon-shade"><MapPin size={14} /></div>
                <div>
                  <label>LOCATION</label>
                  <p>{data.location || "—"}</p>
                </div>
              </div>

            </div>
          </section>


          {/* STATUS COLOR */}

          <section className="enq-info-card enq-action-card">

            <div className="enq-status-section">

              <div className="enq-card-label">
                <MessageSquare size={16} /> <span>Lead Status</span>
              </div>

              <div className="enq-status-buttons">

                <button
                  className={`status-btn green ${statusColor === "green" ? "active" : ""}`}
                  onClick={() => setStatusColor("green")}
                >
                  Green
                </button>

                <button
                  className={`status-btn yellow ${statusColor === "yellow" ? "active" : ""}`}
                  onClick={() => setStatusColor("yellow")}
                >
                  Yellow
                </button>

                <button
                  className={`status-btn red ${statusColor === "red" ? "active" : ""}`}
                  onClick={() => setStatusColor("red")}
                >
                  Red
                </button>

              </div>

            </div>
          </section>

          {/* COUNSELLOR RESPONSE */}

          <section className="enq-info-card enq-action-card">

            <div className="enq-card-label">
              <MessageSquare size={16} /> <span>Counsellor Response</span>
            </div>



            <div className="enq-action-container">

              <textarea
                className="enq-response-box"
                placeholder="Type follow-up status or internal remarks..."
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
              />

              <button
                className="enq-save-btn"
                onClick={handleSaveResponse}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : <><Send size={14} /> Save Response</>}
              </button>

            </div>

          </section>

        </div>
      </div>
    </>
  );
};

export default EnquiryDetailDrawer;