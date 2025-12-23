import React from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Settings, Bell } from "lucide-react";
import "./ProfileDropdown.css";

const ProfileDropdown = () => {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("admin") || "{}");
  const logout = () => {
    localStorage.removeItem("admin");
    navigate("/admin");
  };

  return (
    <div className="pd-card">
      <div className="pd-header">
        <img src="https://i.pravatar.cc/150?u=admin" className="pd-img" />
        <div className="pd-info">
          <p className="pd-name">
            {admin.name} <span className="badge">PRO</span>
          </p>
          <p className="pd-email">{admin.email}</p>
        </div>
      </div>
      <div className="pd-menu">
        <div className="pd-item">
          <User size={16} /> Profile Details
        </div>
        <div className="pd-item">
          <Settings size={16} /> Account Settings
        </div>
        <button onClick={logout} className="pd-logout">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
};
export default ProfileDropdown;
