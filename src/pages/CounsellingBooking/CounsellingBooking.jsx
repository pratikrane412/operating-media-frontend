import React, { useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  Clock,
  Globe,
  ChevronLeft,
  User,
  Mail,
  Phone,
  Building2,
  CheckCircle,
  Send,
  Calendar as CalIcon,
  ShieldCheck,
  Zap,
  Video,
} from "lucide-react";
import "./CounsellingBooking.css";

const CounsellingBooking = () => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    center: "",
  });

  // --- LOGIC: 2 WEEK RESTRICTION ---
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 14);

  const timeSlots = [
    "9:00am",
    "10:00am",
    "11:00am",
    "12:00pm",
    "1:00pm",
    "2:00pm",
    "3:00pm",
    "4:00pm",
    "5:00pm",
    "6:00pm",
    "7:00pm",
  ];

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...formData,
      date: selectedDate.toISOString().split("T")[0],
      time: selectedTime,
    };
    try {
      await axios.post(
        "https://operating-media-backend.onrender.com/api/counseling-scheduling/",
        payload,
      );
      setStep(3);
    } catch (err) {
      alert(err.response?.data?.error || "Booking failed.");
    } finally {
      setLoading(false);
    }
  };

  if (step === 3)
    return (
      <div id="counselling-scheduling-page">
        <div className="success-overlay fade-in">
          <div className="success-card">
            <CheckCircle size={80} className="success-icon" />
            <h2>Appointment Confirmed!</h2>
            <p>
              We've scheduled your session for <strong>{selectedTime}</strong>{" "}
              on <strong>{selectedDate.toDateString()}</strong>.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-finish"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div id="counselling-scheduling-page">
      <div className="booking-wrapper">
        {/* LEFT SIDEBAR: CONTEXT */}
        <aside className="service-sidebar">
          <div className="brand-logo">
            <img src="/OPM.png" alt="Operating Media" />
          </div>
          <div className="service-info">
            <span className="badge-new">Consultation</span>
            <h2>Digital Marketing Career Counseling</h2>
            <div className="info-meta-stack">
              <div className="meta-row">
                <Clock size={16} /> <span>45 Minutes</span>
              </div>
              <div className="meta-row">
                <Video size={16} /> <span>Face-to-Face or Online</span>
              </div>
              <div className="meta-row">
                <Globe size={16} /> <span>India Standard Time (IST)</span>
              </div>
            </div>
            <p className="description">
              Meet our career experts to find the right digital marketing path
              for your goals.
            </p>
          </div>
          <div className="trust-pills">
            <div className="pill">
              <Zap size={14} /> Personalized Advice
            </div>
            <div className="pill">
              <ShieldCheck size={14} /> Verified Curriculum
            </div>
          </div>
        </aside>

        {/* RIGHT SIDE: INTERACTION */}
        <main className="booking-main">
          <div className="booking-stepper">
            <div className={`step-item ${step === 1 ? "active" : "completed"}`}>
              <div className="step-num">
                {step > 1 ? <CheckCircle size={14} /> : "1"}
              </div>
              <label>Date & Time</label>
            </div>
            <div className="step-connector"></div>
            <div className={`step-item ${step === 2 ? "active" : ""}`}>
              <div className="step-num">2</div>
              <label>Contact Info</label>
            </div>
          </div>

          <div className="step-content">
            {step === 1 ? (
              <div className="selection-view fade-in">
                <div className="calendar-card">
                  <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    minDate={today}
                    maxDate={maxDate}
                    className="modern-calendar"
                  />
                </div>
                <div className="slots-card">
                  <div className="slots-header">
                    <h4>Available Slots</h4>
                    <span>
                      {selectedDate.toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                  <div className="slots-grid">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        className={`slot-pill ${selectedTime === slot ? "active" : ""}`}
                        onClick={() => {
                          setSelectedTime(slot);
                          setStep(2);
                        }}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <form className="details-form fade-in" onSubmit={handleBooking}>
                <button
                  type="button"
                  className="back-link"
                  onClick={() => setStep(1)}
                >
                  <ChevronLeft size={16} /> Back to calendar
                </button>
                <h3>Your contact info</h3>
                <div className="input-grid">
                  <div className="field-group">
                    <input
                      type="text"
                      placeholder="First Name"
                      required
                      value={formData.first_name}
                      onChange={(e) =>
                        setFormData({ ...formData, first_name: e.target.value })
                      }
                    />
                  </div>
                  <div className="field-group">
                    <input
                      type="text"
                      placeholder="Last Name"
                      required
                      value={formData.last_name}
                      onChange={(e) =>
                        setFormData({ ...formData, last_name: e.target.value })
                      }
                    />
                  </div>
                  <div className="field-group full">
                    <input
                      type="email"
                      placeholder="Email Address"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="field-group full">
                    <input
                      type="text"
                      placeholder="Phone Number"
                      required
                      maxLength="10"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="field-group full">
                    <select
                      required
                      value={formData.center}
                      onChange={(e) =>
                        setFormData({ ...formData, center: e.target.value })
                      }
                    >
                      <option value="">Choose Center</option>
                      <option value="Andheri">Andheri (W) Branch</option>
                      <option value="Borivali">Borivali (W) Branch</option>
                      <option value="Online">Online / Google Meet</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn-confirm-booking"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Schedule Appointment"}
                </button>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CounsellingBooking;
