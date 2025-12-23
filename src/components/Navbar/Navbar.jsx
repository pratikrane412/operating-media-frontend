import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, Bell } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';
import './Navbar.css';

const Navbar = ({ onToggle }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropRef = useRef(null);

    useEffect(() => {
        const clickOutside = (e) => {
            if (dropRef.current && !dropRef.current.contains(e.target)) setIsProfileOpen(false);
        };
        document.addEventListener('mousedown', clickOutside);
        return () => document.removeEventListener('mousedown', clickOutside);
    }, []);

    return (
        <nav className="header-nav">
            <button className="hamburger-btn" onClick={onToggle}>
                <Menu size={20} />
            </button>

            <div className="header-actions">
                <button className="action-btn"><Search size={18} /></button>
                <button className="action-btn"><Bell size={18} /></button>
                <div className="profile-container" ref={dropRef}>
                    <img 
                        src="https://i.pravatar.cc/150?u=admin" 
                        alt="admin" 
                        className="header-avatar"
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                    />
                    {isProfileOpen && <ProfileDropdown />}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;