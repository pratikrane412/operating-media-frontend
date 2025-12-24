import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { X, User, Mail, Phone, MapPin, Calendar, BookOpen, Clock, Tag, MessageSquare } from 'lucide-react';
import './LeadDrawer.css';

const LeadDrawer = ({ leadId, isOpen, onClose }) => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && leadId) {
            setLoading(true);
            axios.get(`http://127.0.0.1:8000/api/leads/${leadId}/`)
                .then(res => { setDetails(res.data); setLoading(false); })
                .catch(err => { console.error(err); setLoading(false); });
        }
    }, [leadId, isOpen]);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="drawer-overlay" onClick={onClose}></div>
            
            {/* Drawer */}
            <div className={`drawer-container ${isOpen ? 'open' : ''}`}>
                <div className="drawer-header">
                    <div className="header-user">
                        <div className="drawer-avatar">{details?.first_name?.charAt(0)}</div>
                        <div>
                            <h3>{details?.first_name} {details?.last_name}</h3>
                            <span className="id-tag">ID: #{details?.id}</span>
                        </div>
                    </div>
                    <button className="close-drawer-btn" onClick={onClose}><X size={20}/></button>
                </div>

                <div className="drawer-body">
                    {loading ? <div className="drawer-loader">Loading Profile...</div> : (
                        <>
                            {/* Tags Section */}
                            <div className="drawer-section">
                                <div className="tag-row">
                                    <span className="profile-tag"><Tag size={12}/> {details?.tags}</span>
                                    <span className="source-tag">{details?.source}</span>
                                </div>
                            </div>

                            {/* Contact Details */}
                            <div className="drawer-section">
                                <h4 className="section-title">Contact Information</h4>
                                <div className="info-grid">
                                    <div className="info-item"><Mail size={16}/> <span>{details?.email}</span></div>
                                    <div className="info-item"><Phone size={16}/> <span>{details?.mobile}</span></div>
                                    <div className="info-item"><MapPin size={16}/> <span>{details?.location}</span></div>
                                </div>
                            </div>

                            {/* Academic Details */}
                            <div className="drawer-section">
                                <h4 className="section-title">Course Interest</h4>
                                <div className="course-list">
                                    {details?.courses.map((c, i) => (
                                        <span key={i} className="drawer-course-pill"><BookOpen size={12}/> {c}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Followup History Timeline */}
                            <div className="drawer-section">
                                <h4 className="section-title">Timeline & Remarks</h4>
                                <div className="timeline">
                                    {details?.history.map((h, i) => (
                                        <div key={i} className="timeline-item">
                                            <div className="timeline-dot"></div>
                                            <div className="timeline-content">
                                                <div className="timeline-meta">
                                                    <Calendar size={12}/> <span>{h.date}</span>
                                                </div>
                                                <p className="timeline-remark">{h.remark}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                
            </div>
        </>
    );
};

export default LeadDrawer;