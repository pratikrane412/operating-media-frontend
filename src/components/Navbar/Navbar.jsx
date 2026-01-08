import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  LayoutDashboard,
  Info,
  GraduationCap,
  Users,
  UserCheck,
  ClipboardList,
  ChevronDown,
} from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";
import { hasPermission } from "../../utils/permissionCheck";
import "./Navbar.css";

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropRef = useRef(null);
  const navRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const clickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target))
        setActiveDropdown(null);
      if (dropRef.current && !dropRef.current.contains(e.target))
        setIsProfileOpen(false);
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <nav className="header-nav">
      <div className="nav-left-section">
        <div className="brand-box" onClick={() => navigate("/dashboard")}>
          <div className="brand-logo">O</div>
          <span className="brand-name">Operating Media</span>
        </div>

        <div className="top-menu-links" ref={navRef}>
          <NavLink to="/dashboard" className="top-link">
            <LayoutDashboard size={18} /> <span>Dashboard</span>
          </NavLink>

          {/* Inside Navbar.jsx */}

          {(hasPermission("view enquiry") ||
            hasPermission("manage enquiry")) && (
            <div
              className={`top-nav-dropdown ${
                activeDropdown === "leads" ? "is-open" : ""
              }`}
            >
              <div
                className="top-link trigger"
                onClick={() => toggleDropdown("leads")}
              >
                <Info size={18} /> <span>Leads</span> <ChevronDown size={14} />
              </div>
              <div className="top-submenu">
                <NavLink
                  to="/leads-view"
                  onClick={() => setActiveDropdown(null)}
                >
                  Leads Directory
                </NavLink>
              </div>
            </div>
          )}

          {(hasPermission("view batch") || hasPermission("view course")) && (
            <div
              className={`top-nav-dropdown ${
                activeDropdown === "courses" ? "is-open" : ""
              }`}
            >
              <div
                className="top-link trigger"
                onClick={() => toggleDropdown("courses")}
              >
                <GraduationCap size={18} /> <span>Course & Batch</span>{" "}
                <ChevronDown size={14} />
              </div>
              <div className="top-submenu">
                {hasPermission("view batch") && (
                  <NavLink
                    to="/manage-batch"
                    onClick={() => setActiveDropdown(null)}
                  >
                    Manage Batches
                  </NavLink>
                )}
                {hasPermission("view course") && (
                  <NavLink
                    to="/manage-course"
                    onClick={() => setActiveDropdown(null)}
                  >
                    Manage Courses
                  </NavLink>
                )}
              </div>
            </div>
          )}

          {(hasPermission("view staff") || hasPermission("manage staff")) && (
            <div
              className={`top-nav-dropdown ${
                activeDropdown === "staff" ? "is-open" : ""
              }`}
            >
              <div
                className="top-link trigger"
                onClick={() => toggleDropdown("staff")}
              >
                <Users size={18} /> <span>Staff</span> <ChevronDown size={14} />
              </div>
              <div className="top-submenu">
                <NavLink
                  to="/manage-staff"
                  onClick={() => setActiveDropdown(null)}
                >
                  Staff Management
                </NavLink>
                {hasPermission("manage staff sallery") && (
                  <NavLink
                    to="/manage-salary"
                    onClick={() => setActiveDropdown(null)}
                  >
                    Manage Salary
                  </NavLink>
                )}
              </div>
            </div>
          )}

          {/* {(hasPermission("view student") ||
            hasPermission("manage student")) && (
            <div
              className={`top-nav-dropdown ${
                activeDropdown === "students" ? "is-open" : ""
              }`}
            >
              <div
                className="top-link trigger"
                onClick={() => toggleDropdown("students")}
              >
                <UserCheck size={18} /> <span>Students</span>{" "}
                <ChevronDown size={14} />
              </div>
              <div className="top-submenu">
                <NavLink
                  to="/manage-student"
                  onClick={() => setActiveDropdown(null)}
                >
                  Student Directory
                </NavLink>
              </div>
            </div>
          )} */}

          {hasPermission("make admission") && (
            <div
              className={`top-nav-dropdown ${
                activeDropdown === "admission" ? "is-open" : ""
              }`}
            >
              <div
                className="top-link trigger"
                onClick={() => toggleDropdown("admission")}
              >
                <ClipboardList size={18} /> <span>Admission</span>{" "}
                <ChevronDown size={14} />
              </div>
              <div className="top-submenu">
                <NavLink
                  to="/manage-admission"
                  onClick={() => setActiveDropdown(null)}
                >
                  Manage Admission
                </NavLink>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="header-actions">
        <button className="action-btn">
          <Search size={18} />
        </button>
        <button className="action-btn">
          <Bell size={18} />
        </button>
        <div className="profile-container" ref={dropRef}>
          <img
            src="/admin.jpg"
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
