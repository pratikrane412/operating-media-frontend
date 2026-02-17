import React from "react";
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  BookOpen,
  UserCheck,
  Search,
  Target,
  Heart,
  Hash,
  Info,
  Building2,
} from "lucide-react";
import "./EnquiryDetailDrawer.css";

const EnquiryDetailDrawer = ({ isOpen, onClose, data }) => {
  if (!data) return null;

  return (
    <>
      <div
        className={`enq-overlay ${isOpen ? "active" : ""}`}
        onClick={onClose}
      ></div>
      <div
        className={`enq-drawer ${isOpen ? "open" : ""}`}
        id="enq-detail-drawer"
      >
        {/* PREMIUM HEADER - COMPACT FONT */}
        <div className="enq-header-premium">
          <div className="enq-header-content">
            <div className="enq-header-avatar">{data.name.charAt(0)}</div>
            <div className="enq-header-info">
              <h3>{data.name}</h3>
              <p>
                {data.courses} • ID: #{data.id}
              </p>
            </div>
          </div>
          <button className="enq-close-circle" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* DRAWER BODY */}
        <div className="enq-body-premium">
          {/* SECTION 1: PERSONAL DETAILS */}
          <section className="enq-info-card">
            <div className="enq-card-label">
              <User size={16} /> <span>Personal Details</span>
            </div>
            <div className="enq-info-grid">
              <div className="enq-info-item">
                <div className="icon-shade">
                  <User size={14} />
                </div>
                <div>
                  <label>FULL NAME</label>
                  <p>{data.name}</p>
                </div>
              </div>
              <div className="enq-info-item">
                <div className="icon-shade">
                  <Calendar size={14} />
                </div>
                <div>
                  <label>RECORDED DATE</label>
                  <p>{data.date}</p>
                </div>
              </div>
              <div className="enq-info-item">
                <div className="icon-shade">
                  <Info size={14} />
                </div>
                <div>
                  <label>GENDER</label>
                  <p>{data.gender || "—"}</p>
                </div>
              </div>
              <div className="enq-info-item">
                <div className="icon-shade">
                  <Heart size={14} />
                </div>
                <div>
                  <label>AGE</label>
                  <p>{data.age || "—"}</p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: CONTACT INFORMATION */}
          <section className="enq-info-card">
            <div className="enq-card-label">
              <Phone size={16} /> <span>Contact Information</span>
            </div>
            <div className="enq-info-grid">
              <div className="enq-info-item">
                <div className="icon-shade">
                  <Phone size={14} />
                </div>
                <div>
                  <label>MOBILE</label>
                  <p>{data.phone}</p>
                </div>
              </div>
              <div className="enq-info-item">
                <div className="icon-shade">
                  <Mail size={14} />
                </div>
                <div>
                  <label>EMAIL</label>
                  <p>{data.email}</p>
                </div>
              </div>
              <div className="enq-info-item full">
                <div className="icon-shade">
                  <MapPin size={14} />
                </div>
                <div>
                  <label>LOCATION</label>
                  <p>{data.location || "—"}</p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: ACADEMIC PREFERENCES */}
          <section className="enq-info-card">
            <div className="enq-card-label">
              <BookOpen size={16} /> <span>Academic Preferences</span>
            </div>
            <div className="enq-info-grid">
              <div className="enq-info-item full">
                <div className="icon-shade">
                  <Target size={14} />
                </div>
                <div>
                  <label>COURSES OF INTEREST</label>
                  <p className="enq-pills-text">{data.courses}</p>
                </div>
              </div>
              <div className="enq-info-item">
                <div className="icon-shade">
                  <Briefcase size={14} />
                </div>
                <div>
                  <label>BATCH TYPE</label>
                  <p>{data.batch_preference || "—"}</p>
                </div>
              </div>
              <div className="enq-info-item">
                <div className="icon-shade">
                  <Building2 size={14} />
                </div>
                <div>
                  <label>BRANCH OFFICE</label>
                  <p>{data.branch_preference || "—"}</p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: ASSIGNMENT */}
          <section className="enq-info-card">
            <div className="enq-card-label">
              <UserCheck size={16} /> <span>Internal Assignment</span>
            </div>
            <div className="enq-info-grid">
              <div className="enq-info-item">
                <div className="icon-shade">
                  <Search size={14} />
                </div>
                <div>
                  <label>LEAD SOURCE</label>
                  <p>{data.source || "Reference"}</p>
                </div>
              </div>
              <div className="enq-info-item">
                <div className="icon-shade">
                  <User size={14} />
                </div>
                <div>
                  <label>POC</label>
                  <p>{data.poc || "—"}</p>
                </div>
              </div>
              <div className="enq-info-item full">
                <div className="icon-shade">
                  <UserCheck size={14} />
                </div>
                <div>
                  <label>ASSIGNED COUNSELOR</label>
                  <p>{data.counselor || "System"}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default EnquiryDetailDrawer;
