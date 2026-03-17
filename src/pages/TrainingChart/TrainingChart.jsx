import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import { Layers, RefreshCcw, Check, Clock, XCircle } from "lucide-react";
import "./TrainingChart.css";

const TrainingChart = () => {
    const [branch, setBranch] = useState("Andheri");
    const [data, setData] = useState({ modules: [], batches: [] });
    const [loading, setLoading] = useState(true);
    const [activePopover, setActivePopover] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const popoverRef = useRef(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`https://operating-media-backend.onrender.com/api/training-chart/?branch=${branch}`);
            setData(res.data);
        } catch (err) {
            console.error("Matrix Load Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [branch]);

    // Handle click outside popover to close it
    useEffect(() => {
        const handleOutside = (e) => {
            if (popoverRef.current && !popoverRef.current.contains(e.target)) {
                setActivePopover(null);
            }
        };
        document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, []);

    // --- HELPER: COURSE SHORTENER ---
    const getShortCourse = (name) => {
        if (!name || name === "NA") return "NA";
        const n = name.toLowerCase();
        if (n.includes("masters")) return "Masters";
        if (n.includes("advanced diploma")) return "Adv. Dip";
        if (n.includes("diploma")) return "Diploma";
        if (n.includes("search engine optimization")) return "SEO";
        if (n.includes("social media")) return "SMM";
        if (n.includes("pay per click")) return "PPC";
        if (n.includes("wordpress")) return "WP";
        return name;
    };

    const openStatusMenu = (e, studentId, moduleId, batchId, currentStatus) => {
        const rect = e.target.getBoundingClientRect();
        // Position popover relative to the clicked cell
        setActivePopover({
            studentId, moduleId, batchId, currentStatus,
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX
        });
    };

    const updateStatus = async (status) => {
        setIsSaving(true);
        try {
            await axios.post(`https://operating-media-backend.onrender.com/api/training-chart/update/`, {
                student_id: activePopover.studentId,
                module_id: activePopover.moduleId,
                batch_id: activePopover.batchId,
                status: status
            });

            // Local state update for immediate feedback
            const newData = { ...data };
            const batch = newData.batches.find(b => b.id === activePopover.batchId);
            const student = batch.students.find(s => s.id === activePopover.studentId);
            student.statuses[activePopover.moduleId] = status;

            setData(newData);
            setActivePopover(null);
        } catch (err) {
            alert("Failed to update status");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return (
        <div id="training-chart-portal">
            <div className="matrix-loader-box"><div className="spinner"></div><p>Building Training Matrix...</p></div>
        </div>
    );

    return (
        <div id="training-chart-portal">
            <Navbar />
            <main className="chart-viewport">
                {/* HEADER SECTION */}
                <div className="chart-top-bar">
                    <div className="title-section">
                        <Layers size={22} className="title-icon" />
                        <div className="text-group">
                            <h2>Training Progress Matrix</h2>
                            <p>Branch: {branch} Center</p>
                        </div>
                    </div>
                    <select value={branch} onChange={(e) => setBranch(e.target.value)} className="branch-nav-select">
                        <option value="Andheri">Andheri</option>
                        <option value="Borivali">Borivali</option>
                    </select>
                </div>

                {/* TABLE SECTION */}
                <div className="matrix-wrapper custom-scroll">
                    <table className="matrix-table">
                        <thead>
                            {/* ROW 1: BATCHES */}
                            <tr className="row-batch">
                                <th className="sticky-col first-head">MODULES</th>
                                {data.batches.map(b => (
                                    <th key={b.id} colSpan={b.students.length} className="batch-header-cell">
                                        {b.name}
                                    </th>
                                ))}
                            </tr>
                            {/* ROW 2: NAMES */}
                            <tr className="row-name">
                                <th className="sticky-col second-head"></th>
                                {data.batches.map(b =>
                                    b.students.map(s => <th key={s.id} className="student-name-cell">{s.name.split(' ')[0]}</th>)
                                )}
                            </tr>
                            {/* ROW 3: COURSE/DATE */}
                            <tr className="row-meta">
                                <th className="sticky-col third-head"></th>
                                {data.batches.map(b =>
                                    b.students.map(s => (
                                        <th key={s.id} className="student-meta-cell">
                                            <div className="meta-stack">
                                                <span>{getShortCourse(s.course)}</span>
                                                <small>{s.adm_date}</small>
                                            </div>
                                        </th>
                                    ))
                                )}
                            </tr>
                        </thead>

                        <tbody>
                            {data.modules.map(mod => (
                                <tr key={mod.id}>
                                    <td className="sticky-col module-label-cell" style={{ borderLeft: `6px solid ${mod.color || '#cbd5e1'}` }}>
                                        {mod.name}
                                    </td>
                                    {data.batches.map(b =>
                                        b.students.map(s => {
                                            const status = s.statuses[mod.id] || "—";
                                            return (
                                                <td
                                                    key={`${s.id}-${mod.id}`}
                                                    className={`status-cell clickable ${status.toLowerCase()}`}
                                                    onClick={(e) => openStatusMenu(e, s.id, mod.id, b.id, status)}
                                                >
                                                    {status}
                                                </td>
                                            );
                                        })
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* CLICK POPOVER MENU */}
                {activePopover && (
                    <div
                        className="status-popover"
                        ref={popoverRef}
                        style={{ top: activePopover.top, left: activePopover.left }}
                    >
                        <button onClick={() => updateStatus("YES")} className="opt-yes"><Check size={14} /> YES</button>
                        <button onClick={() => updateStatus("Ongoing")} className="opt-ongoing"><Clock size={14} /> Ongoing</button>
                        <button onClick={() => updateStatus("Missed")} className="opt-missed"><XCircle size={14} /> Missed</button>
                        <button onClick={() => updateStatus("—")} className="opt-reset">Reset</button>
                        {isSaving && <div className="popover-loading"><RefreshCcw className="spin" size={16} /></div>}
                    </div>
                )}
            </main>
        </div>
    );
};

export default TrainingChart;