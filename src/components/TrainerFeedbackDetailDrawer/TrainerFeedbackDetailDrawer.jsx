import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  X,
  User,
  Calendar,
  BookOpen,
  Star,
  MessageSquare,
  Send,
  Info,
  CheckCircle,
  Award,
  Layers,
} from "lucide-react";
import "./TrainerFeedbackDetailDrawer.css";

const TrainerFeedbackDetailDrawer = ({ isOpen, onClose, data, onUpdate }) => {
  const [remarks, setRemarks] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setRemarks(data.management_remarks || "");
    }
  }, [data]);

  if (!data) return null;

  const handleSaveRemarks = async () => {
    setIsSaving(true);
    try {
      await axios.patch(
        `https://operating-media-backend.onrender.com/api/feedback/trainer/${data.id}/remarks/`,
        { remarks: remarks },
      );
      alert("Management remarks updated!");
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error(err);
      alert("Failed to save remarks.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div
        className={`tf-overlay ${isOpen ? "active" : ""}`}
        onClick={onClose}
      ></div>
      <div
        className={`tf-drawer ${isOpen ? "open" : ""}`}
        id="tf-detail-drawer"
      >
        <div className="tf-header-premium">
          <div className="tf-header-content">
            <div className="tf-header-avatar">
              {data.student_name.charAt(0)}
            </div>
            <div className="tf-header-info">
              <h3>{data.student_name}</h3>
              <p>
                {data.trainer_name} • Rating: {data.rating}/10
              </p>
            </div>
          </div>
          <button className="tf-close-circle" onClick={onClose}>
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <div className="tf-body-premium">
          <section className="tf-info-card">
            <div className="tf-card-label">
              <Info size={16} /> <span>Session Overview</span>
            </div>
            <div className="tf-info-grid">
              <div className="tf-info-item">
                <div className="icon-shade">
                  <Calendar size={14} />
                </div>
                <div className="tf-item-content">
                  <label>SUBMISSION DATE</label>
                  <p>{data.date}</p>
                </div>
              </div>
              <div className="tf-info-item">
                <div className="icon-shade">
                  <BookOpen size={14} />
                </div>
                <div className="tf-item-content">
                  <label>COURSE NAME</label>
                  <p>{data.course_name}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="tf-info-card">
            <div className="tf-card-label">
              <Award size={16} /> <span>Performance Metrics</span>
            </div>
            <div className="tf-info-grid">
              <div className="tf-info-item">
                <div className="icon-shade">
                  <Star size={14} />
                </div>
                <div className="tf-item-content">
                  <label>TRAINER KNOWLEDGE</label>
                  <span className="tf-status-pill">
                    {data.trainer_knowledge}
                  </span>
                </div>
              </div>
              <div className="tf-info-item">
                <div className="icon-shade">
                  <CheckCircle size={14} />
                </div>
                <div className="tf-item-content">
                  <label>COMMUNICATION</label>
                  <span className="tf-status-pill">{data.communication}</span>
                </div>
              </div>
              <div className="tf-info-item">
                <div className="icon-shade">
                  <Layers size={14} />
                </div>
                <div className="tf-item-content">
                  <label>CONTENT COVERAGE</label>
                  <span className="tf-status-pill">
                    {data.content_coverage}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="tf-info-card">
            <div className="tf-card-label">
              <MessageSquare size={16} /> <span>Additional Comments</span>
            </div>
            <div className="tf-comment-box">
              {data.comments || "No additional comments provided."}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default TrainerFeedbackDetailDrawer;
