import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, ShieldCheck, Check, Save, Info, Stars, Trash2 } from "lucide-react";
import "./StaffPermDrawer.css";
import { hasPermission } from "../../utils/permissionCheck"; // Added import

const PERMISSION_DATA = {
  "Manage Batch": ["add batch", "edit batch", "delete batch", "view batch"],
  "Manage Course": [
    "add course",
    "edit course",
    "delete course",
    "view course",
  ],
  "Manage Staff": [
    "add staff",
    "edit staff",
    "delete staff",
    "staff permission",
    "manage staff",
    "manage staff attendance",
    "view staff attendance",
    "add staff attendance",
    "delete staff attendance",
    "view staff",
    "manage staff sallery",
  ],
  "Manage Enquiry": [
    "manage enquiry",
    "view enquiry",
    "add enquiry",
    "edit enquiry",
    "delete enquiry",
    "make admission",
    "view enquiry followup dashboard",
    "enquiry followup",
  ],
  "Manage Student": [
    "manage student",
    "view student",
    "manage student attendance",
    "manage trial student",
    "manage passout student",
    "view trial student",
    "admission trial student",
    "view passout student",
    "passout student",
    "readmit passout student",
    "view trial expiry dashboard",
  ],
  "Manage Fee": [
    "manage fee deposit",
    "manage fee reminder",
    "deposit fee",
    "delete fee",
    "view fee reminder",
    "view fee reminder dashboard",
    "view fee deposit dashboard",
    "view expense dashboard",
  ],
  "Manage Expense": [
    "manage expense",
    "add expense",
    "edit expense",
    "delete expense",
  ],
  "Manage Reporting": [
    "fee report",
    "student report",
    "expense report",
    "send sms",
    "enquiry report",
    "attendance report",
  ],
  "Manage App": [
    "manage app seeting",
    "app homepage",
    "view notice",
    "add notice",
    "edit notice",
    "delete notice",
    "manage assignment",
    "view assignment",
    "add assignment",
    "edit assignment",
    "delete assignment",
    "send push notification",
  ],
  Job: ["manage job"],
  Exam: ["manage exam"],
};

const StaffPermDrawer = ({ isOpen, onClose, staffId, staffName }) => {
  const [selectedPerms, setSelectedPerms] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && staffId) {
      setLoading(true);
      axios
        .get(
          `https://operating-media-backend.onrender.com/api/staff/${staffId}/permissions/`
        )
        .then((res) => {
          const permString = res.data.perm || "";
          setSelectedPerms(
            permString
              .split(",")
              .map((p) => p.trim())
              .filter((p) => p !== "")
          );
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [isOpen, staffId]);

  const togglePermission = (perm) => {
    setSelectedPerms((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const toggleGroup = (groupName) => {
    const groupPerms = PERMISSION_DATA[groupName];
    const allSelected = groupPerms.every((p) => selectedPerms.includes(p));
    if (allSelected) {
      setSelectedPerms((prev) => prev.filter((p) => !groupPerms.includes(p)));
    } else {
      setSelectedPerms((prev) => [...new Set([...prev, ...groupPerms])]);
    }
  };

  const selectAll = () =>
    setSelectedPerms(Object.values(PERMISSION_DATA).flat());
  const deselectAll = () => setSelectedPerms([]);

  const handleSave = async () => {
    try {
      const permString = selectedPerms.join(",");
      await axios.put(
        `https://operating-media-backend.onrender.com/api/staff/${staffId}/permissions/`,
        { perm: permString }
      );
      alert("Permissions saved successfully!");
      onClose();
    } catch (err) {
      alert("Failed to update permissions");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={onClose}></div>
      <div className="perm-drawer-container">
        <div className="perm-drawer-header">
          <div className="header-left">
            <ShieldCheck size={22} />
            <div className="header-text">
              <h3>Assign Permission</h3>
              <p>
                Setting access for <span>{staffName}</span>
              </p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="perm-warning-banner">
          <Info size={14} />
          <p>This staff can access only modules that you will assign here.</p>
        </div>
        <div className="perm-drawer-body">
          {loading ? (
            <div className="loader">Fetching data...</div>
          ) : (
            <>
              <div className="global-actions">
                <div className="all-perms-toggle" onClick={selectAll}>
                  <Stars size={16} /> Select All
                </div>
                <div className="all-perms-toggle clear" onClick={deselectAll}>
                  <Trash2 size={16} /> Clear All
                </div>
              </div>
              {Object.entries(PERMISSION_DATA).map(([group, list]) => (
                <div key={group} className="perm-group-section">
                  <div className="group-header-flex">
                    <h4 className="group-title">{group}</h4>
                    <button
                      type="button"
                      className="group-toggle-btn"
                      onClick={() => toggleGroup(group)}
                    >
                      {list.every((p) => selectedPerms.includes(p))
                        ? "Deselect Group"
                        : "Select Group"}
                    </button>
                  </div>
                  <div className="perm-grid">
                    {list.map((perm) => (
                      <div
                        key={perm}
                        className={`perm-item ${
                          selectedPerms.includes(perm) ? "active" : ""
                        }`}
                        onClick={() => togglePermission(perm)}
                      >
                        <div className="custom-checkbox">
                          {selectedPerms.includes(perm) && <Check size={12} />}
                        </div>
                        <span className="perm-text">{perm}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
        <div className="perm-drawer-footer">
          <button className="btn-cancel-text" onClick={onClose}>
            Cancel
          </button>
          {hasPermission("staff permission") ? (
            <button
              className="btn-save-perms"
              onClick={handleSave}
              disabled={loading}
            >
              <Save size={18} /> Save Permissions
            </button>
          ) : (
            <span
              style={{ fontSize: "11px", fontWeight: "800", color: "#ef4444" }}
            >
              VIEW ONLY
            </span>
          )}
        </div>
      </div>
    </>
  );
};
export default StaffPermDrawer;
