import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Briefcase, Clock, Calendar, Building2, CheckCircle, Send } from 'lucide-react';
import './BatchDrawer.css';

// --- MOVE THIS OUTSIDE THE MAIN COMPONENT ---
const FormRow = ({ label, icon: Icon, children }) => (
    <div className="drawer-form-row">
        <label>{label}:</label>
        <div className="drawer-input-wrapper">
            <div className="drawer-icon-box"><Icon size={16} /></div>
            {children}
        </div>
    </div>
);

const BatchDrawer = ({ isOpen, onClose, onUpdate }) => {
    const user = JSON.parse(localStorage.getItem('admin') || '{}');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        timing: '',
        starting_date: '',
        end_date: '',
        status: 0,
        branch_id: user.branch_id || 1
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axios.post('http://127.0.0.1:8000/api/batches/manage/', formData);
            setFormData({ name: '', timing: '', starting_date: '', end_date: '', status: 0, branch_id: user.branch_id || 1 });
            onUpdate(); 
            onClose();  
        } catch (err) {
            alert("Failed to create batch");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="drawer-overlay" onClick={onClose}></div>
            <div className={`drawer-container ${isOpen ? 'open' : ''}`}>
                <div className="drawer-header">
                    <div className="header-title">
                        <Briefcase size={20} />
                        <h3>Create New Batch</h3>
                    </div>
                    <button className="close-btn" onClick={onClose}><X size={20}/></button>
                </div>

                <form className="drawer-body" onSubmit={handleSubmit}>
                    <div className="drawer-section">
                        <FormRow label="Batch Name" icon={Briefcase}>
                            <input 
                                type="text" 
                                name="name" 
                                value={formData.name}
                                placeholder="e.g. Weekend Master" 
                                required 
                                onChange={handleChange} 
                            />
                        </FormRow>
                        
                        <FormRow label="Timing" icon={Clock}>
                            <input 
                                type="text" 
                                name="timing" 
                                value={formData.timing}
                                placeholder="e.g. 10AM - 1PM" 
                                required 
                                onChange={handleChange} 
                            />
                        </FormRow>

                        <FormRow label="Start Date" icon={Calendar}>
                            <input 
                                type="date" 
                                name="starting_date" 
                                value={formData.starting_date}
                                required 
                                onChange={handleChange} 
                            />
                        </FormRow>

                        <FormRow label="End Date" icon={Calendar}>
                            <input 
                                type="date" 
                                name="end_date" 
                                value={formData.end_date}
                                onChange={handleChange} 
                            />
                        </FormRow>

                        <FormRow label="Status" icon={CheckCircle}>
                            <select name="status" value={formData.status} onChange={handleChange}>
                                <option value={0}>Active</option>
                                <option value={1}>Disabled</option>
                            </select>
                        </FormRow>

                        {!user.branch_id && (
                            <FormRow label="Branch" icon={Building2}>
                                <select name="branch_id" value={formData.branch_id} onChange={handleChange}>
                                    <option value={1}>Andheri</option>
                                    <option value={2}>Borivali</option>
                                </select>
                            </FormRow>
                        )}
                    </div>

                    <div className="drawer-footer">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-save" disabled={isSubmitting}>
                            <Send size={16} /> {isSubmitting ? 'Saving...' : 'Create Batch'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default BatchDrawer;