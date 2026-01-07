import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  BookOpen,
  Clock,
  ChevronRight,
} from "lucide-react";
// import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import CourseDrawer from "../../components/CourseDrawer/CourseDrawer";
import "./ManageCourse.css";
import { hasPermission } from "../../utils/permissionCheck"; // Added import

const ManageCourse = () => {
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://operating-media-backend.onrender.com/api/courses/manage/`
      );
      setCourses(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleEditClick = (id) => {
    setSelectedCourseId(id);
    setIsDrawerOpen(true);
  };

  const handleAddNewClick = () => {
    setSelectedCourseId(null);
    setIsDrawerOpen(true);
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await axios.delete(
          `https://operating-media-backend.onrender.com/api/courses/${id}/delete/`
        );
        fetchCourses();
      } catch (err) {
        alert("Failed to delete course.");
      }
    }
  };

  const filtered = courses.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`app-container ${isCollapsed ? "is-collapsed" : ""}`}>
      {/* <Sidebar isCollapsed={isCollapsed} /> */}
      <div className="main-viewport">
        <Navbar onToggle={() => setIsCollapsed(!isCollapsed)} />
        <main className="content-area">
          <header className="course-header">
            <div className="header-left">
              <div className="breadcrumb">
                <span
                  onClick={() => navigate("/dashboard")}
                  style={{ cursor: "pointer" }}
                >
                  Dashboards
                </span>
                <ChevronRight size={12} className="sep" />
                <span className="current">Manage Course</span>
              </div>
              <h2 className="page-title">Course Directory</h2>
            </div>

            {/* PERMISSION CHECK: ADD COURSE */}
            {hasPermission("add course") && (
              <button className="btn-add-new" onClick={handleAddNewClick}>
                <Plus size={18} /> ADD NEW COURSE
              </button>
            )}
          </header>

          <div className="course-card">
            <div className="course-toolbar">
              <div className="search-wrapper">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by course name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="table-container">
              <table className="duralux-table">
                <thead>
                  <tr>
                    <th width="80">Sr. No.</th>
                    <th>Course Name</th>
                    <th>Fee Structure</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="table-loader">
                        Loading SQL data...
                      </td>
                    </tr>
                  ) : (
                    filtered.map((course, index) => (
                      <tr key={course.id}>
                        <td className="sr-no">{index + 1}</td>
                        <td>
                          <div className="course-primary">
                            <BookOpen size={16} className="title-icon" />
                            <span className="course-name">{course.name}</span>
                          </div>
                        </td>
                        <td>
                          <span className="fee-badge">{course.fee}</span>
                        </td>
                        <td>
                          <div className="duration-info">
                            <Clock size={14} /> {course.duration}
                          </div>
                        </td>
                        <td>
                          <span
                            className={`status-badge ${
                              course.status === 0 ? "active" : "inactive"
                            }`}
                          >
                            {course.status === 0 ? "Active" : "Disabled"}
                          </span>
                        </td>
                        <td className="text-right">
                          <div className="action-btns-group">
                            {/* PERMISSION CHECK: EDIT COURSE */}
                            {hasPermission("edit course") && (
                              <button
                                className="btn-action edit"
                                title="Edit Course"
                                onClick={() => handleEditClick(course.id)}
                              >
                                <Edit3 size={16} />
                              </button>
                            )}

                            {/* PERMISSION CHECK: DELETE COURSE */}
                            {hasPermission("delete course") && (
                              <button
                                className="btn-action delete"
                                title="Delete Course"
                                onClick={() => handleDeleteCourse(course.id)}
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
      <CourseDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedCourseId(null);
        }}
        onUpdate={fetchCourses}
        courseId={selectedCourseId}
      />
    </div>
  );
};

export default ManageCourse;
