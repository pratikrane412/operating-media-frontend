import React, { useState } from "react";
import "./TrainerFeedback.css";
import axios from "axios";
import {
  User,
  BookOpen,
  Star,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  Award,
  Zap,
} from "lucide-react";

const TrainerFeedback = () => {
  const initialState = {
    name: "",
    course: "",
    trainer: "",
    knowledge_rating: "",
    coverage_rating: "",
    communication: "",
    overall_rating: null,
    comments: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.overall_rating) {
      alert("Please select a rating from 1 to 10");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "https://operating-media-backend.onrender.com/api/feedback/trainer/",
        formData,
      );

      if (response.status === 201) {
        alert("Feedback submitted successfully!");
        setFormData(initialState); // Clear form
      }
    } catch (err) {
      console.error("Submission Error:", err);
      alert("Error saving feedback.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="trainer-feedback-wrapper">
      <div className="tf-shell-full">
        <form onSubmit={handleSubmit}>
          <header className="tf-header">
            <div className="tf-brand-info">
              <h1>Trainer's Feedback Form</h1>
              <p>
                Operating Media • Digital Career Academy
              </p>
            </div>
          </header>

          <div className="tf-stack">
            {/* SECTION 1: PRIMARY INFO */}
            <section className="tf-card">
              <div className="tf-card-head">
                <User size={18} /> <h3>1. Enrollment Details</h3>
              </div>
              <div className="tf-grid-3">
                <div className="tf-group">
                  <label>Your Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Student Name"
                  />
                </div>
                <div className="tf-group">
                  <label>Which Course? *</label>
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Course</option>
                    <option value="Master's Program in Digital Marketing">
                      Master's Program in Digital Marketing
                    </option>
                    <option value="Advanced Diploma in Digital Marketing">
                      Advanced Diploma in Digital Marketing
                    </option>
                    <option value="Search Engine Optimization">
                      Search Engine Optimization
                    </option>
                    <option value="Pay Per Click">
                      Pay Per Click
                    </option>
                    <option value="Social Media Marketing">
                      Social Media Marketing
                    </option>
                    <option value="Google Analytics">
                      Google Analytics
                    </option>
                    <option value="Wordpress">
                      Wordpress
                    </option>
                  </select>
                </div>
                <div className="tf-group">
                  <label>Trainer's Name *</label>
                  <select
                    name="trainer"
                    value={formData.trainer}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Trainer</option>
                    <option value="Shraddha Rane">Shraddha Rane</option>
                    <option value="Harsh Pareek">Harsh Pareek</option>
                    <option value="Vikram Kamble">Vikram Kamble</option>
                    <option value="Dashmeet Bhogal">Dashmeet Bhogal</option>
                    <option value="Rahul Shende">Rahul Shende</option>
                    <option value="Surbhi Samant">Surbhi Samant</option>
                    <option value="Prachi Gala">Prachi Gala</option>
                    <option value="Mahima Priyolkar">Mahima Priyolkar</option>
                  </select>
                </div>
              </div>
            </section>

            {/* SECTION 2: EVALUATION */}
            <section className="tf-card">
              <div className="tf-card-head">
                <Award size={18} /> <h3>2. Trainer Evaluation</h3>
              </div>
              <div className="tf-grid-2">
                <div className="tf-group">
                  <label>Quality & Knowledge of Trainer? *</label>
                  <div className="tf-toggle-grid">
                    {[
                      "Excellent",
                      "Very Good",
                      "Decent",
                      "Average",
                      "Below Average",
                    ].map((opt) => (
                      <div
                        key={opt}
                        className={`tf-toggle-item ${formData.knowledge_rating === opt ? "active" : ""}`}
                        onClick={() =>
                          setFormData({ ...formData, knowledge_rating: opt })
                        }
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="tf-group">
                  <label>How was the Course Content Covered? *</label>
                  <div className="tf-toggle-grid">
                    {[
                      "In-Depth",
                      "Above Average",
                      "Average",
                      "Below Average",
                    ].map((opt) => (
                      <div
                        key={opt}
                        className={`tf-toggle-item ${formData.coverage_rating === opt ? "active" : ""}`}
                        onClick={() =>
                          setFormData({ ...formData, coverage_rating: opt })
                        }
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 3: COMMUNICATION & RATING */}
            <section className="tf-card">
              <div className="tf-card-head">
                <Zap size={18} /> <h3>3. Communication & Final Rating</h3>
              </div>
              <div className="tf-grid-1">
                <div className="tf-group">
                  <label>
                    Was the Content and Language in Which the Trainer
                    Communicated to You Was Understandable? *
                  </label>
                  <div className="tf-btn-row">
                    {["Yes", "No", "Partially"].map((opt) => (
                      <div
                        key={opt}
                        className={`tf-btn-choice ${formData.communication === opt ? "active" : ""}`}
                        onClick={() =>
                          setFormData({ ...formData, communication: opt })
                        }
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="tf-group mt-30">
                  <label>Rate the Trainer (1 to 10) *</label>
                  {/* CHANGE THIS CLASS NAME */}
                  <div className="tf-rating-grid">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <div
                        key={num}
                        className={`tf-rating-box ${formData.overall_rating === num ? "active" : ""}`}
                        onClick={() =>
                          setFormData({ ...formData, overall_rating: num })
                        }
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 4: COMMENTS */}
            <section className="tf-card">
              <div className="tf-card-head">
                <MessageSquare size={18} /> <h3>4. Additional Comments</h3>
              </div>
              <textarea
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                placeholder="Share any specific suggestions for the trainer or the institute..."
                rows="4"
              />
            </section>

            <button
              type="submit"
              className="tf-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "STORING FEEDBACK..." : "SUBMIT TRAINER FEEDBACK"}{" "}
              <ArrowRight size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrainerFeedback;
