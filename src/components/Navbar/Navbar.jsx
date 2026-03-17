import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Search,
  Bell,
  LayoutDashboard,
  Info,
  GraduationCap,
  Users,
  ClipboardList,
  Award,
  FileText,
  ChevronDown,
  Clock,
  Phone,
  X,
  Menu
} from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";
import { hasPermission } from "../../utils/permissionCheck";
import "./Navbar.css";

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const dropRef = useRef(null);
  const navRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // --- NOTIFICATION LOGIC ---

  const fetchNotifications = async () => {
    const userString = localStorage.getItem("admin");
    if (!userString) return;

    try {
      const adminData = JSON.parse(userString);

      // DEBUG: Open your console (F12) to see if this matches your DB
      console.log("Navbar Sending Name:", adminData.name);

      const res = await axios.get(
        "https://operating-media-backend.onrender.com/api/leads/check-reminders/",
        {
          params: {
            role: adminData.role,
            name: adminData.name
          }
        }
      );
      setNotifications(res.data || []);
    } catch (e) {
      console.error("Fetch Notif Error:", e);
    }
  };

  useEffect(() => {
    setIsMobileOpen(false); // Close menu on page change
  }, [location]);

  useEffect(() => {
    fetchNotifications();
    // Refresh notifications every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleDismissNotif = async (id) => {
    try {
      await axios.patch(
        `https://operating-media-backend.onrender.com/api/leads/${id}/dismiss/`,
      );
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (e) {
      console.error("Dismiss Error:", e);
    }
  };

  // --- UI INTERACTION LOGIC ---

  useEffect(() => {
    const clickOutside = (e) => {
      // Close nav dropdowns if clicked outside
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
      // Close profile if clicked outside
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
      // Close notifications if clicked outside
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
    // Close other panels
    setIsProfileOpen(false);
    setIsNotifOpen(false);
  };

  const toggleNotif = () => {
    setIsNotifOpen(!isNotifOpen);
    // Close other panels
    setActiveDropdown(null);
    setIsProfileOpen(false);
  };

  return (
    <nav className="header-nav">
      <div className="nav-left-section">
        <button className="mobile-menu-toggle" onClick={() => setIsMobileOpen(!isMobileOpen)}>
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="brand-box" onClick={() => navigate("/dashboard")}>
          <img
            src="/OPM.png"
            alt="Operating Media"
            className="brand-logo-img"
          />
        </div>

        <div className={`top-menu-links ${isMobileOpen ? "mobile-open" : ""}`} ref={navRef}>
          <NavLink to="/dashboard" className="top-link">
            <LayoutDashboard size={18} /> <span>Dashboard</span>
          </NavLink>

          {/* LEADS */}
          <div
            className={`top-nav-dropdown ${activeDropdown === "leads" ? "is-open" : ""}`}
          >
            <div
              className="top-link trigger"
              onClick={() => toggleDropdown("leads")}
            >
              <Info size={18} /> <span>Leads</span> <ChevronDown size={14} />
            </div>
            <div className="top-submenu">
              <NavLink to="/leads-view" onClick={() => setActiveDropdown(null)}>
                Leads Directory
              </NavLink>
            </div>
          </div>

          {/* COURSE & BATCH */}
          {(hasPermission("view batch") || hasPermission("view course")) && (
            <div
              className={`top-nav-dropdown ${activeDropdown === "courses" ? "is-open" : ""}`}
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
                {hasPermission("view training chart") && (
                  <NavLink
                    to="/training-chart"
                    onClick={() => setActiveDropdown(null)}
                  >
                    Training Chart
                  </NavLink>
                )}
              </div>
            </div>
          )}

          {/* STAFF */}
          {(hasPermission("view staff") || hasPermission("manage staff")) && (
            <div
              className={`top-nav-dropdown ${activeDropdown === "staff" ? "is-open" : ""}`}
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

          {/* ADMISSION */}
          <div
            className={`top-nav-dropdown ${activeDropdown === "admission" ? "is-open" : ""}`}
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

          {/* FORMS */}
          <div
            className={`top-nav-dropdown ${activeDropdown === "forms" ? "is-open" : ""}`}
          >
            <div
              className="top-link trigger"
              onClick={() => toggleDropdown("forms")}
            >
              <FileText size={18} /> <span>Forms</span>{" "}
              <ChevronDown size={14} />
            </div>
            <div className="top-submenu">
              <NavLink
                to="/counsellor-feedback-list"
                onClick={() => setActiveDropdown(null)}
              >
                Counsellor Feedback
              </NavLink>
              <NavLink
                to="/course-feedback-list"
                onClick={() => setActiveDropdown(null)}
              >
                Course Feedback
              </NavLink>
              <NavLink
                to="/trainer-feedback-list"
                onClick={() => setActiveDropdown(null)}
              >
                Trainer Feedback
              </NavLink>
            </div>
          </div>

          {/* CERTIFICATES */}
          <div
            className={`top-nav-dropdown ${activeDropdown === "certificates" ? "is-open" : ""}`}
          >
            <div
              className="top-link trigger"
              onClick={() => toggleDropdown("certificates")}
            >
              <Award size={18} /> <span>Certificates</span>{" "}
              <ChevronDown size={14} />
            </div>
            <div className="top-submenu">
              <NavLink
                to="/certificate-manage"
                onClick={() => setActiveDropdown(null)}
              >
                Manage certificates
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      <div className="header-actions">
        <button className="action-btn">
          <Search size={18} />
        </button>

        {/* BELL NOTIFICATIONS */}
        <div className="notif-container" ref={notifRef}>
          <button
            className={`action-btn ${isNotifOpen ? "active" : ""}`}
            onClick={toggleNotif}
          >
            <Bell size={18} />
            {notifications.length > 0 && (
              <span className="notif-badge">{notifications.length}</span>
            )}
          </button>

          {isNotifOpen && (
            <div className="notif-dropdown">
              <div className="notif-header">
                <h4>Notifications</h4>
                <span>{notifications.length} Pending</span>
              </div>
              <div className="notif-list">
                {notifications.length === 0 ? (
                  <div className="notif-empty">All Notifications cleared!</div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="notif-item">
                      <div className="notif-info">
                        <p className="notif-user">{n.name}</p>
                        <div className="notif-meta">
                          <span>
                            <Phone size={10} /> {n.phone}
                          </span>
                          <span>
                            <Clock size={10} /> {n.time}
                          </span>
                        </div>
                      </div>
                      <button
                        className="notif-dismiss"
                        onClick={() => handleDismissNotif(n.id)}
                        title="Dismiss"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* PROFILE */}
        <div className="profile-container" ref={dropRef}>
          <img
            src="/admin.jpg"
            alt="admin"
            className="header-avatar"
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotifOpen(false);
              setActiveDropdown(null);
            }}
          />
          {isProfileOpen && <ProfileDropdown />}
        </div>
      </div>
      {isMobileOpen && <div className="mobile-overlay" onClick={() => setIsMobileOpen(false)}></div>}
    </nav>
  );
};

export default Navbar;
