import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import { Layers, RefreshCcw, Check, Clock, XCircle, BookOpen } from "lucide-react";
import "./TrainingChart.css";

const TrainingChart = () => {
    const location = useLocation();
    const [branch, setBranch] = useState("Andheri");
    const [data, setData] = useState({ modules: [], batches: [] });
    const [loading, setLoading] = useState(true);
    const [activePopover, setActivePopover] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const popoverRef = useRef(null);

    // --- DRAG SCROLL LOGIC ---
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
        scrollRef.current.style.cursor = "grabbing";
    };
    const handleMouseLeave = () => {
        setIsDragging(false);
        scrollRef.current.style.cursor = "grab";
    };
    const handleMouseUp = () => {
        setIsDragging(false);
        scrollRef.current.style.cursor = "grab";
    };
    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 1.5; // Scroll speed
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`https://operating-media-backend.onrender.com/api/training-chart/?branch=${branch}`);
            setData(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, [branch]);

    useEffect(() => {
        const handleOutside = (e) => { if (popoverRef.current && !popoverRef.current.contains(e.target)) setActivePopover(null); };
        document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, []);

    const getShortCourse = (name) => {
        if (!name || name === "NA") return "NA";
        const n = name.toLowerCase();
        if (n.includes("masters")) return "Masters";
        if (n.includes("advanced diploma")) return "Adv. Dip";
        if (n.includes("diploma")) return "Dip";
        if (n.includes("search engine")) return "SEO";
        if (n.includes("social media")) return "SMM";
        if (n.includes("pay per click")) return "PPC";
        if (n.includes("wordpress")) return "WP";
        return "DM";
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
            const newData = { ...data };
            const batch = newData.batches.find(b => b.id === activePopover.batchId);
            const student = batch.students.find(s => s.id === activePopover.studentId);
            student.statuses[activePopover.moduleId] = status;
            setData(newData);
            setActivePopover(null);
        } catch (err) { alert("Failed"); }
        finally { setIsSaving(false); }
    };

    if (loading) return (
        <div id="training-chart-portal">
            <div className="matrix-loader-box"><div className="spinner"></div><p>Loading Chart...</p></div>
        </div>
    );

    return (
        <div id="training-chart-portal">
            <Navbar />
            <main className="chart-viewport">
                <div className="chart-top-bar">
                    <div className="title-section">
                        <Layers size={40} className="title-icon" />
                        <div className="text-group">
                            <h2>Training Chart</h2>
                            <p>Branch: {branch}</p>
                        </div>
                    </div>

                    <div className="filter-section">
                        <select
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                            className="branch-nav-select"
                        >
                            <option value="Andheri">Andheri</option>
                            <option value="Borivali">Borivali</option>
                        </select>
                    </div>
                </div>

                <div
                    className={`matrix-wrapper custom-scroll ${isDragging ? "is-dragging" : ""}`}
                    ref={scrollRef}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                >
                    <table className="matrix-table">
                        <thead>
                            {/* ROW 1: BATCH NAMES */}
                            <tr className="row-batch">
                                <th className="sticky-col first-head"><BookOpen size={14} /> MODULES</th>
                                <th className="hours-header-cell">NUMBER OF HOURS</th> {/* ADDED HOURS HEADER */}
                                {data.batches.map(b => (
                                    <React.Fragment key={b.id}>
                                        <th colSpan={b.students.length} className="batch-header-cell">{b.name}</th>
                                        <th className="batch-gap-header"></th>
                                    </React.Fragment>
                                ))}
                            </tr>
                            {/* ROW 2: NAMES */}
                            <tr className="row-name">
                                <th className="sticky-col second-head">Student Name</th>
                                <th className="hours-header-cell"></th> {/* ADDED ALIGNMENT CELL */}
                                {data.batches.map(b => (
                                    <React.Fragment key={b.id}>
                                        {b.students.map(s => <th key={s.id} className="student-name-cell">{s.name.split(' ')[0]}</th>)}
                                        <th className="batch-gap-header"></th>
                                    </React.Fragment>
                                ))}
                            </tr>
                            {/* ROW 3: META */}
                            <tr className="row-meta">
                                <th className="sticky-col third-head">Course / Date</th>
                                <th className="hours-header-cell"></th> {/* ADDED ALIGNMENT CELL */}
                                {data.batches.map(b => (
                                    <React.Fragment key={b.id}>
                                        {b.students.map(s => (
                                            <th key={s.id} className="student-meta-cell">
                                                <div className="meta-stack">
                                                    <span>{getShortCourse(s.course)}</span>
                                                    <small>{s.adm_date}</small>
                                                </div>
                                            </th>
                                        ))}
                                        <th className="batch-gap-header"></th>
                                    </React.Fragment>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {data.modules.map(mod => (
                                <tr key={mod.id}>
                                    <td
                                        className="sticky-col module-label-cell"
                                        style={{
                                            borderLeft: `6px solid ${mod.color || '#cbd5e1'}`,
                                            background: `${mod.color}30` // ← 18 = ~10% opacity in hex
                                        }}
                                    >
                                        {mod.name}
                                    </td>
                                    <td className="hours-data-cell"> {/* ADDED HOURS DATA CELL */}
                                        {mod.hours}
                                    </td>
                                    {data.batches.map(b => (
                                        <React.Fragment key={b.id}>
                                            {b.students.map(s => {
                                                const status = s.statuses[mod.id] || "—";
                                                return (
                                                    <td
                                                        key={`${s.id}-${mod.id}`}
                                                        className={`status-cell clickable ${status.toLowerCase()}`}
                                                        onClick={(e) => {
                                                            if (isDragging) return;
                                                            const rect = e.target.getBoundingClientRect();
                                                            setActivePopover({ studentId: s.id, moduleId: mod.id, batchId: b.id, currentStatus: status, top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
                                                        }}
                                                    >
                                                        {status}
                                                    </td>
                                                );
                                            })}
                                            <td className="batch-gap-cell"></td>
                                        </React.Fragment>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {activePopover && (
                    <div className="status-popover" ref={popoverRef} style={{ top: activePopover.top, left: activePopover.left }}>
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