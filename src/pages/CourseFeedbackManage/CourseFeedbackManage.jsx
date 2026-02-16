import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  Eye,
  MessageCircle,
  Instagram,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";
import "./CourseFeedbackManage.css";

const CourseFeedbackManage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://operating-media-backend.onrender.com/api/feedback/course/list/",
      );
      const results = Array.isArray(res.data)
        ? res.data
        : res.data.results || [];
      setData(results);
    } catch (err) {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  return (
    <div id="fb-management-module">
      <Navbar onToggle={() => setIsCollapsed(!isCollapsed)} />
      <main className="fb-m-content">
        <header className="fb-m-header">
          <div className="fb-m-badge">Student Insights</div>
          <h2>Course Feedback Management</h2>
        </header>

        <div className="fb-m-card">
          <div className="fb-m-toolbar">
            <div className="fb-m-search">
              <Search size={16} />{" "}
              <input
                type="text"
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="fb-m-scroll">
            <table className="fb-m-table">
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>STUDENT</th>
                  <th>PROFESSION</th>
                  <th>REVIEW DONE?</th>
                  <th>INSTAGRAM</th>
                  <th className="fb-m-center">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="fb-m-msg">
                      Loading insights...
                    </td>
                  </tr>
                ) : (
                  data.map((item) => (
                    <tr key={item.id}>
                      <td className="fb-m-date">{item.date}</td>
                      <td className="fb-m-student">
                        <strong>{item.name}</strong>
                      </td>
                      <td>{item.profession}</td>
                      <td className="fb-m-center">
                        {item.review === "Yes" ? (
                          <CheckCircle2 size={18} color="#10b981" />
                        ) : (
                          <XCircle size={18} color="#ef4444" />
                        )}
                      </td>
                      <td className="fb-m-insta">
                        <Instagram size={14} /> {item.insta_handle || "@-"}
                      </td>
                      <td className="fb-m-center">
                        <button className="fb-m-btn-view">
                          <Eye size={16} />
                        </button>
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
  );
};
export default CourseFeedbackManage;
