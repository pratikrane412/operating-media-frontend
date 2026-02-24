import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Bell, X, Phone, Clock } from "lucide-react";
import "./ReminderAlert.css";

const ReminderAlert = () => {
  const [activeAlerts, setActiveAlerts] = useState([]);

  const checkServer = useCallback(async () => {
    const userString = localStorage.getItem("admin");

    if (!userString) {
      console.log("ReminderAlert: No user found in storage, skipping check.");
      return;
    }

    try {
      const adminData = JSON.parse(userString);
      console.log(
        `ReminderAlert: Checking for ${adminData.name} (${adminData.role})...`,
      );

      const res = await axios.get(
        "https://operating-media-backend.onrender.com/api/leads/check-reminders/",
        {
          params: {
            role: adminData.role,
            name: adminData.name,
          },
        },
      );

      console.log("ReminderAlert: Data received from server:", res.data);

      // Simple array comparison to prevent unnecessary renders
      if (res.data && res.data.length !== activeAlerts.length) {
        setActiveAlerts(res.data);
      }
    } catch (e) {
      console.error("ReminderAlert: Polling error:", e);
    }
  }, [activeAlerts.length]);

  useEffect(() => {
    // Initial check
    checkServer();

    // Polling every 30 seconds
    const interval = setInterval(checkServer, 30000);

    return () => clearInterval(interval);
  }, [checkServer]);

  const dismiss = async (id) => {
    try {
      await axios.patch(
        `https://operating-media-backend.onrender.com/api/leads/${id}/dismiss/`,
      );
      setActiveAlerts((prev) => prev.filter((a) => a.id !== id));
      console.log(`ReminderAlert: Alert ${id} dismissed.`);
    } catch (e) {
      console.error("ReminderAlert: Dismiss error:", e);
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
            <label>FOLLOW-UP DUE NOW</label>
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
