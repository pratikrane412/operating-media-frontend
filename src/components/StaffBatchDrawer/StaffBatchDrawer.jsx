import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Layers, Calendar, Clock, Send } from "lucide-react";
import "./StaffBatchDrawer.css";

const StaffBatchDrawer = ({
  isOpen,
  onClose,
  staffId,
  staffName,
  onUpdate,
}) => {
  const [batches, setBatches] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    batch_name: "",
    start_date: "",
    start_time: "07:00",
    end_time: "09:00",
  });

  // Fetch batches when drawer opens
  useEffect(() => {
    if (isOpen && staffId) {
      axios
        .get(`https://operating-media-backend.onrender.com/api/staff/${staffId}/assign-batch/`)
        .then((res) => setBatches(res.data))
        .catch((err) => console.error(err));
    }
  }, [isOpen, staffId]);

  // Simple change handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(
        `https://operating-media-backend.onrender.com/api/staff/${staffId}/assign-batch/`,
        formData
      );
      alert("Batch assigned successfully!");
      if (onUpdate) onUpdate();
      onClose();
    } catch (err) {
      alert("Failed to assign batch");
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
            <Layers size={20} />
            <h3>Assign Batch to {staffName}</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form className="drawer-body" onSubmit={handleSubmit}>
          <div className="drawer-section">
            {/* SELECT BATCH - RAW JSX TO PREVENT FOCUS LOSS */}
            <div className="drawer-form-row">
              <label>Select Batch:</label>
              <div className="drawer-input-wrapper">
                {/* Change size to 20 */}
                <div className="drawer-icon-box">
                  <Layers size={20} />
                </div>
                <select
                  name="batch_name"
                  value={formData.batch_name}
                  required
                  onChange={handleChange}
                >
                  <option value="">Choose Batch...</option>
                  {batches.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="drawer-form-row">
              <label>Batch Start Date:</label>
              <div className="drawer-input-wrapper">
                <div className="drawer-icon-box">
                  <Calendar size={20} />
                </div>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  required
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="drawer-form-row">
              <label>Batch Start Time:</label>
              <div className="drawer-input-wrapper">
                <div className="drawer-icon-box">
                  <Clock size={20} />
                </div>
                <input
                  type="time"
                  name="start_time"
                  value={formData.start_time}
                  required
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="drawer-form-row">
              <label>Batch End Time:</label>
              <div className="drawer-input-wrapper">
                <div className="drawer-icon-box">
                  <Clock size={20} />
                </div>
                <input
                  type="time"
                  name="end_time"
                  value={formData.end_time}
                  required
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="drawer-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-save-blue"
              disabled={isSubmitting || !formData.batch_name}
            >
              <Send size={16} />
              {isSubmitting ? "Assigning..." : "Submit Assignment"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default StaffBatchDrawer;
