import React, { useState } from "react";
import "./FeedbackForm.css";
import axios from "axios";
import {
  User,
  Briefcase,
  MessageSquare,
  Instagram,
  Star,
  ThumbsUp,
  ArrowRight,
  ExternalLink,
  CheckCircle,
  Check,
} from "lucide-react";

const FeedbackForm = () => {
  const initialState = {
    name: "",
    profession: "",
    reason_dm: "",
    course_impact: "",
    insta_handle: "",
    review_submitted: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.review_submitted)
      return alert("Please select if you have added a review.");

    setIsSubmitting(true);
    try {
      await axios.post(
        "https://operating-media-backend.onrender.com/api/feedback/submit/",
        formData,
      );
      alert("Success! Thank you for your feedback.");
      setFormData(initialState);
    } catch (err) {
      alert("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="feedback-portal-wrapper">
      <div className="feed-mesh-bg"></div>
      <div className="feed-shell-full">
        <form onSubmit={handleSubmit}>
          <header className="feed-main-header">
            <div className="feed-brand-info">
              <h1>Course Feedback Form</h1>
              <p>Operating Media • Digital Career Academy</p>
            </div>
          </header>

          <div className="feed-sections-stack">
            {/* 1. STUDENT PROFILE */}
            <section className="feed-glass-card">
              <div className="feed-card-head">
                <User size={18} /> <h3>1. Student Profile</h3>
              </div>
              <div className="feed-grid-2">
                <div className="feed-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Student Name"
                  />
                </div>
                <div className="feed-group">
                  <label>What was your profession (if a student - what was your specialization in?) *</label>
                  <input
                    type="text"
                    name="profession"
                    value={formData.profession}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Student, Graphic Designer"
                  />
                </div>
              </div>
            </section>

            {/* 2. LEARNING JOURNEY */}
            <section className="feed-glass-card">
              <div className="feed-card-head">
                <MessageSquare size={18} /> <h3>2. Educational Journey</h3>
              </div>
              <div className="feed-grid-1">
                <div className="feed-group">
                  <label>Why did you choose Digital Marketing? *</label>
                  <textarea
                    name="reason_dm"
                    value={formData.reason_dm}
                    onChange={handleChange}
                    required
                    placeholder="Share your motivation..."
                    rows="3"
                  />
                </div>
                <div className="feed-group mt-25">
                  <label>
                    How well did our course help you achieve your goal? *
                  </label>
                  <textarea
                    name="course_impact"
                    value={formData.course_impact}
                    onChange={handleChange}
                    required
                    placeholder="Describe the career impact..."
                    rows="3"
                  />
                </div>
              </div>
            </section>

            {/* 3. SOCIAL & REVIEWS */}
            <section className="feed-glass-card">
              <div className="feed-card-head">
                <Star size={18} /> <h3>3. Social Connectivity & Reviews</h3>
              </div>
              <div className="feed-grid-2">
                <div className="feed-group">
                  <label>
                    <Instagram size={12} /> Instagram Handle *
                  </label>
                  <input
                    type="text"
                    name="insta_handle"
                    value={formData.insta_handle}
                    onChange={handleChange}
                    required
                    placeholder="@username"
                  />
                </div>
                <div className="feed-group">
                  <label>
                    Have you added your reviews on Facebook & Google? *
                  </label>
                  <div className="feed-toggle-group">
                    {["Yes", "No"].map((opt) => (
                      <div
                        key={opt}
                        className={`feed-toggle-box ${formData.review_submitted === opt ? "active" : ""}`}
                        onClick={() =>
                          setFormData({ ...formData, review_submitted: opt })
                        }
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* PROFESSIONAL LINKS CARD */}
              <div className="feed-review-resource">
                <div className="resource-info">
                  <ThumbsUp size={18} />
                  <span>
                    Your support helps us grow. Please leave a review if you
                    haven't yet:
                  </span>
                </div>
                <div className="resource-links">
                  <a
                    href="http://bitly.ws/sjRf"
                    target="_blank"
                    rel="noreferrer"
                    className="res-link-btn"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    <span>Google Business</span>
                    <ExternalLink size={14} className="external-icon" />
                  </a>
                  <a
                    href="http://bitly.ws/sjRK"
                    target="_blank"
                    rel="noreferrer"
                    className="res-link-btn"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="#1877F2"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>Facebook Page</span>
                    <ExternalLink size={14} className="external-icon" />
                  </a>
                </div>
              </div>
            </section>

            <div className="feed-submit-area">
              <button
                type="submit"
                className="feed-primary-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "STORING FEEDBACK..." : "SUBMIT FINAL FEEDBACK"}
                <ArrowRight size={22} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
