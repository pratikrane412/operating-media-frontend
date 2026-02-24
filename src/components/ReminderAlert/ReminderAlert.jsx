import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Bell, X, Phone, Clock } from "lucide-react";
import "./ReminderAlert.css";

const ReminderAlert = () => {
  const [activeAlerts, setActiveAlerts] = useState([]);

  const checkServer = useCallback(async () => {
    try {
      // 1. Pull user data from localStorage (Duralux logic)
      const adminData = JSON.parse(localStorage.getItem("admin"));

      // If not logged in, don't check for reminders
      if (!adminData) return;

      // 2. Pass role and name as parameters to the API
      const res = await axios.get(
        "https://operating-media-backend.onrender.com/api/leads/check-reminders/",
        {
          params: {
            role: adminData.role, // e.g., 'admin' or 'super_admin'
            name: adminData.name, // e.g., 'Darshan'
          },
        },
      );

      if (res.data && res.data.length > 0) {
        setActiveAlerts(res.data);
      }
    } catch (e) {
      console.error("Polling error:", e);
    }
  }, []);

  useEffect(() => {
    checkServer();
    const interval = setInterval(checkServer, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [checkServer]);

  const dismiss = async (id) => {
    try {
      await axios.patch(
        `https://operating-media-backend.onrender.com/api/leads/${id}/dismiss/`,
      );
      setActiveAlerts((prev) => prev.filter((a) => a.id !== id));
    } catch (e) {
      console.error("Dismiss error:", e);
    }
  };

  if (activeAlerts.length === 0) return null;

  return (
    <div className="global-alert-stack">
      {activeAlerts.map((alert) => (
        <div key={alert.id} className="reminder-popup">
          <div className="popup-icon">
            <Bell size={20} className="ring-anim" />
          </div>
          <div className="popup-info">
            <label>FOLLOW-UP REMINDER</label>
            <h4>{alert.name}</h4>
            <p>
              <Phone size={12} /> {alert.phone} | <Clock size={12} />{" "}
              {alert.time}
            </p>
          </div>
          <button className="popup-close" onClick={() => dismiss(alert.id)}>
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ReminderAlert;
