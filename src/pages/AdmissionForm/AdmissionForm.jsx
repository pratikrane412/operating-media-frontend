import React, { useState } from "react";
import "./AdmissionForm.css";
import axios from "axios";

const AdmissionForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
    gender: "",
    status: "",
    dob: "",
    employed: false,
    organization: "",
    course: "",
    branch: "",
    emergencyName: "",
    emergencyPhone: "",

    aadhaarFront: null,
    aadhaarBack: null,
    photo: null,
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("https://api.dmsoi.org/api/admission/create/", formData);

      alert("Admission submitted successfully");
      setFormData(initialState); // optional reset
    } catch (error) {
      alert("Failed to submit admission");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admission-form-card">
      {/* Banner */}
      <div className="form-banner">
        <div className="banner-overlay">
          <h1>ADMISSION FORM</h1>
          <p>OPERATINGMEDIA.COM</p>
        </div>
      </div>

      <h2 className="form-title">Admission Form</h2>

      {/* Name Row */}
      <div className="form-row">
        <div className="form-field">
          <label>First Name *</label>
          <input
            type="text"
            name="firstName"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label>Middle Name *</label>
          <input
            type="text"
            name="middleName"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label>Last Name *</label>
          <input type="text" name="lastName" onChange={handleChange} required />
        </div>
      </div>

      {/* Contact Row */}
      <div className="form-row">
        <div className="form-field">
          <label>Phone *</label>
          <input type="tel" name="phone" onChange={handleChange} required />
        </div>

        <div className="form-field">
          <label>Email *</label>
          <input type="email" name="email" onChange={handleChange} required />
        </div>
      </div>

      {/* Address */}
      <div className="form-row">
        <div className="form-field">
          <label>Street Address *</label>
          <input
            type="text"
            name="address"
            onChange={handleChange}
            requiredrequired
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label>Apartment / Suite</label>
          <input type="text" name="apartment" onChange={handleChange} />
        </div>
      </div>

      {/* Location */}
      <div className="form-row">
        <div className="form-field">
          <label>City</label>
          <input type="text" name="city" onChange={handleChange} />
        </div>

        <div className="form-field">
          <label>State / Province</label>
          <input type="text" name="state" onChange={handleChange} />
        </div>

        <div className="form-field">
          <label>ZIP / Postal Code</label>
          <input type="text" name="zip" onChange={handleChange} />
        </div>

        <div className="form-field">
          <label>Country</label>
          <select name="country" onChange={handleChange}>
            <option>India</option>
            <option>USA</option>
          </select>
        </div>
      </div>

      {/* Personal */}
      <div className="form-row">
        <div className="form-field">
          <label>Gender</label>
          <select name="gender" onChange={handleChange}>
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        <div className="form-field">
          <label>Status</label>
          <select name="status" onChange={handleChange}>
            <option value="">Select</option>
            <option>Single</option>
            <option>Married</option>
          </select>
        </div>

        <div className="form-field">
          <label>Date of Birth</label>
          <input type="date" name="dob" onChange={handleChange} />
        </div>
      </div>

      {/* Employment */}
      <div className="form-row">
        <div className="form-field checkbox-field">
          <label>
            <input type="checkbox" name="employed" onChange={handleChange} />{" "}
            Are you employed?
          </label>
        </div>

        <div className="form-field">
          <label>Organization</label>
          <input type="text" name="organization" onChange={handleChange} />
        </div>
      </div>

      {/* Course */}
      <div className="form-row">
        <div className="form-field">
          <label>Course</label>
          <select name="course" onChange={handleChange}>
            <option value="">Select Course</option>
            <option>Masters in Digital Marketing</option>
            <option>Advanced Diploma in Digital Marketing</option>
            <option>Diploma in Digital Marketing</option>
            <option>Pay Per Click Course</option>
            <option>Social Media Optimization Course</option>
            <option>Search Engine Optimization Course</option>
            <option>Google Analytics Course (GA4)</option>
            <option>WordPress Development Course</option>
          </select>
        </div>

        <div className="form-field">
          <label>Branch</label>
          <select name="branch" onChange={handleChange}>
            <option value="">Select Branch</option>
            <option>Andheri</option>
            <option>Borivali</option>
          </select>
        </div>
      </div>

      {/* Emergency */}
      <div className="section-header">Emergency Contact</div>

      <div className="form-row">
        <div className="form-field">
          <label>Name</label>
          <input type="text" name="emergencyName" onChange={handleChange} />
        </div>

        <div className="form-field">
          <label>Phone</label>
          <input type="tel" name="emergencyPhone" onChange={handleChange} />
        </div>
      </div>
      {/* Documents */}
      <div className="section-header blue">Documents</div>

      <div className="form-row">
        <div className="form-field">
          <label>Aadhaar Card (Front) *</label>
          <input
            type="file"
            name="aadhaarFront"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            required
          />
        </div>

        <div className="form-field">
          <label>Aadhaar Card (Back) *</label>
          <input
            type="file"
            name="aadhaarBack"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            required
          />
        </div>

        <div className="form-field">
          <label>Photo *</label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </div>
      </div>

      {/* Declaration */}
      <div className="form-row">
        <div className="form-field checkbox-field">
          <label>
            <input
              type="checkbox"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
              required
            />
            I hereby declare that the information provided is true to the best
            of my knowledge. I agree to the terms and conditions.
          </label>
        </div>
      </div>

      <div className="form-footer">
        <button type="submit" className="btn-submit">
          Submit
        </button>
      </div>
    </form>
  );
};

export default AdmissionForm;
