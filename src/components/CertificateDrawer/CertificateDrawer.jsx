import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Award, User, Calendar, BookOpen, Star, Send } from "lucide-react";
import "./CertificateDrawer.css";

const CertificateDrawer = ({ isOpen, onClose, onUpdate, editData }) => {
  const [formData, setFormData] = useState({
    certificate_id: "",
    name: "",
    date: "",
    course: "",
    rating: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  // If editData is passed, populate form (for Edit mode)
  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      setFormData({
        certificate_id: "",
        name: "",
        date: "",
        course: "",
        rating: "",
      });
    }
  }, [editData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editData) {
        // PUT request for editing
        await axios.put(
          `https://operating-media-backend.onrender.com/api/certificates/${editData.id}/update/`,
          formData,
        );
      } else {
        // POST request for new
        await axios.post(
          "https://operating-media-backend.onrender.com/api/certificates/create/",
          formData,
        );
      }
      alert(
        editData ? "Certificate updated!" : "Certificate issued successfully!",
      );
      onUpdate(); // Refresh the table
      onClose(); // Close drawer
    } catch (err) {
      alert("Error saving certificate. Please check fields.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div
        className={`cert-draw-overlay ${isOpen ? "active" : ""}`}
        onClick={onClose}
      ></div>
      <div className={`cert-draw-panel ${isOpen ? "open" : ""}`}>
        <div className="cert-draw-header">
          <div className="cert-draw-title">
            <div className="cert-draw-icon">
              <Award size={20} />
            </div>
            <div>
              <h3>{editData ? "Edit Certificate" : "Issue New Certificate"}</h3>
              <p>Enter student achievement details</p>
            </div>
          </div>
          <button className="cert-draw-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form className="cert-draw-body" onSubmit={handleSubmit}>
          <div className="cert-draw-group">
            <label>
              <User size={14} /> STUDENT FULL NAME
            </label>
            <input
              type="text"
              required
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="cert-draw-group">
            <label>
              <Award size={14} /> CERTIFICATE ID
            </label>
            <input
              type="text"
              required
              placeholder="e.g. OM/15/3/1455"
              value={formData.certificate_id}
              onChange={(e) =>
                setFormData({ ...formData, certificate_id: e.target.value })
              }
            />
          </div>

          <div className="cert-draw-grid">
            <div className="cert-draw-group">
              <label>
                <Calendar size={14} /> ISSUE DATE
              </label>
              <input
                type="text"
                required
                placeholder="e.g. May, 2024"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>
            <div className="cert-draw-group">
              <label>
                <Star size={14} /> RATING (Out of 10)
              </label>
              <input
                type="number"
                step="0.1"
                max="10"
                required
                placeholder="9.5"
                value={formData.rating}
                onChange={(e) =>
                  setFormData({ ...formData, rating: e.target.value })
                }
              />
            </div>
          </div>

          <div className="cert-draw-group">
            <label>
              <BookOpen size={14} /> COURSE NAME
            </label>
            <select
              required
              value={formData.course}
              onChange={(e) =>
                setFormData({ ...formData, course: e.target.value })
              }
            >
              <option value="">Select Course</option>
              <option value="Masters in Digital Marketing">
                Masters in Digital Marketing
              </option>
              <option value="Advanced Diploma in Digital Marketing">
                Advanced Diploma in Digital Marketing
              </option>
              <option value="Diploma in Digital Marketing">
                Diploma in Digital Marketing
              </option>
              <option value="Pay Per Click Course">
                Pay Per Click Course
              </option>
              <option value="Social Media Optimization Course">
                Social Media Optimization Course
              </option>
              <option value="Search Engine Optimization Course">
                Search Engine Optimization Course
              </option>
              <option value="Google Analytics Course (GA4)">
                Google Analytics Course (GA4)
              </option>
              <option value="WordPress Development Course">
                WordPress Development Course
              </option>
            </select>
          </div>

          <div className="cert-draw-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Discard
            </button>
            <button type="submit" className="btn-save" disabled={isSaving}>
              {isSaving ? (
                "Processing..."
              ) : (
                <>
                  <Send size={14} />{" "}
                  {editData ? "Update Certificate" : "Issue Certificate"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CertificateDrawer;
