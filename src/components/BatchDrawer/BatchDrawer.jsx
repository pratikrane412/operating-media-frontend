import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  X, Briefcase, Clock, Building2, CheckCircle, Send, Users,
  Check, ChevronDown, Search as SearchIcon, UserPlus, UserMinus
} from "lucide-react";
import "./BatchDrawer.css";
import { hasPermission } from "../../utils/permissionCheck";

// Helper to convert 24h (browser) to 12h (SaaS standard)
const formatTimeTo12h = (time24) => {
  if (!time24) return "";
  const [hours, minutes] = time24.split(":");
  const h = parseInt(hours);
  const suffix = h >= 12 ? "PM" : "AM";
  const displayH = h % 12 || 12;
  return `${displayH}:${minutes} ${suffix}`;
};

// Helper to convert 12h back to 24h
const formatTimeTo24h = (time12) => {
  if (!time12 || !time12.includes(" ")) return "";
  const [time, modifier] = time12.split(" ");
  let [hours, minutes] = time.split(":");
  if (hours === "12") hours = "00";
  if (modifier === "PM") hours = parseInt(hours, 10) + 12;
  return `${String(hours).padStart(2, "0")}:${minutes}`;
};

const FormRow = ({ label, icon: Icon, children, isMulti = false }) => (
  <div className="batch-draw-row">
    <label className="batch-draw-label">
      <Icon size={12} className="label-icon" /> {label}
    </label>
    <div className={`batch-draw-field-container ${isMulti ? 'multi-layer' : ''}`}>
      {children}
    </div>
  </div>
);

const BatchDrawer = ({ isOpen, onClose, onUpdate, batchId }) => {
  const user = JSON.parse(localStorage.getItem("admin") || "{}");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [studentsList, setStudentsList] = useState([]);
  const [isDropOpen, setIsDropOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const dropRef = useRef(null);

  const [options, setOptions] = useState({ branches: [], counsellors: [] });
  const [formData, setFormData] = useState({
    name: "", status: 0, branch_id: user.branch_id || 1, selected_student_ids: []
  });

  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
      axios.get("https://operating-media-backend.onrender.com/api/leads/create/").then((res) => setOptions(res.data));
      axios.get(`https://operating-media-backend.onrender.com/api/admissions/all-list/`).then((res) => setStudentsList(res.data || []));

      if (batchId) {
        axios.get(`https://operating-media-backend.onrender.com/api/batches/${batchId}/`).then((res) => {
          const { timing, ...rest } = res.data;
          setFormData((prev) => ({ ...prev, ...rest }));
          if (timing && timing.includes(" - ")) {
            const [start, end] = timing.split(" - ");
            setStartTime(formatTimeTo24h(start));
            setEndTime(formatTimeTo24h(end));
          }
        });
      } else {
        setFormData({ name: "", status: 0, branch_id: user.branch_id || 1, selected_student_ids: [] });
        setStartTime(""); setEndTime("");
      }
    }
  }, [isOpen, batchId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setIsDropOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const combinedTiming = `${formatTimeTo12h(startTime)} - ${formatTimeTo12h(endTime)}`;
    const finalData = { ...formData, timing: combinedTiming };
    try {
      if (batchId) {
        await axios.put(`https://operating-media-backend.onrender.com/api/batches/${batchId}/`, finalData);
      } else {
        await axios.post("https://operating-media-backend.onrender.com/api/batches/manage/", finalData);
      }
      onUpdate(); onClose();
    } catch (err) { alert("Error processing submission."); }
    finally { setIsSubmitting(false); }
  };

  if (!isOpen) return null;

  const filteredStudents = studentsList.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <>
      <div className="batch-draw-overlay" onClick={onClose}></div>
      <div className={`batch-draw-container ${isOpen ? "open" : ""}`}>

        <div className="batch-draw-header">
          <div className="header-title-flex">
            <div className="icon-badge-navy"><Briefcase size={18} /></div>
            <div>
              <h3>{batchId ? "Edit Batch Details" : "Create New Batch"}</h3>
              <p>Internal Academic Scheduling</p>
            </div>
          </div>
          <button className="batch-draw-close" onClick={onClose}><X size={20} /></button>
        </div>

        <form className="batch-draw-body" onSubmit={handleSubmit}>

          <FormRow label="BATCH NAME" icon={Briefcase}>
            <input type="text" name="name" value={formData.name} required onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Master DM Evening" />
          </FormRow>

          {/* CUSTOM MULTI-SELECT */}
          <div className="batch-draw-row" ref={dropRef}>
            <label className="batch-draw-label"><Users size={12} className="label-icon" /> ASSIGN STUDENTS</label>
            <div className="custom-multi-select">
              <div className={`select-trigger-premium ${isDropOpen ? 'active' : ''}`} onClick={() => setIsDropOpen(!isDropOpen)}>
                <span>{formData.selected_student_ids.length > 0 ? `${formData.selected_student_ids.length} Students Selected` : "Choose Students..."}</span>
                <ChevronDown size={16} className={isDropOpen ? "rotate" : ""} />
              </div>

              {isDropOpen && (
                <div className="premium-drop-list">
                  <div className="drop-search-wrap">
                    <SearchIcon size={14} />
                    <input autoFocus placeholder="Search students..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onClick={(e) => e.stopPropagation()} />
                  </div>
                  <div className="drop-scroll-area custom-scroll">
                    {filteredStudents.map(s => (
                      <div key={s.id} className={`drop-item-premium ${formData.selected_student_ids.includes(s.id) ? 'selected' : ''}`} onClick={() => {
                        const ids = formData.selected_student_ids.includes(s.id)
                          ? formData.selected_student_ids.filter(i => i !== s.id)
                          : [...formData.selected_student_ids, s.id];
                        setFormData({ ...formData, selected_student_ids: ids });
                      }}>
                        <div className="check-box">{formData.selected_student_ids.includes(s.id) && <Check size={12} />}</div>
                        <span>{s.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="batch-draw-grid">
            <FormRow label="START TIME" icon={Clock}>
              <input type="time" value={startTime} required onChange={(e) => setStartTime(e.target.value)} />
            </FormRow>
            <FormRow label="END TIME" icon={Clock}>
              <input type="time" value={endTime} required onChange={(e) => setEndTime(e.target.value)} />
            </FormRow>
          </div>

          <div className="batch-draw-grid">
            <FormRow label="STATUS" icon={CheckCircle}>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                <option value={0}>Active</option>
                <option value={1}>Disabled</option>
              </select>
            </FormRow>

            {!user.branch_id && (
              <FormRow label="BRANCH" icon={Building2}>
                <select value={formData.branch_id} onChange={(e) => setFormData({ ...formData, branch_id: e.target.value })} required>
                  <option value="">Select</option>
                  {options.branches.map((b, i) => <option key={i} value={i + 1}>{b}</option>)}
                </select>
              </FormRow>
            )}
          </div>

          <div className="batch-draw-footer">
            <button type="button" className="btn-cancel-flat" onClick={onClose}>Discard</button>
            <button type="submit" className="btn-save-navy" disabled={isSubmitting}>
              {isSubmitting ? "..." : <><Send size={14} /> {batchId ? "Update Batch" : "Create Batch"}</>}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default BatchDrawer;