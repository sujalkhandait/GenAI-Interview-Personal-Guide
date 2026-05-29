import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../../style/home.scss";
import "../../../style/interview.scss";

// AUTH HOOK
import { useAuth } from "../../auth/hooks/useAuth.js";

// IMPORT SERVICE
import { generateInterviewReport } from "../services/interview.api.js";

const Home = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    jobDescription: "",
    resume: null,
    selfDescription: "",
  });

  const { logout } = useAuth();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");

  // =========================
  // VALIDATION
  // =========================
  const validateForm = () => {
    const newErrors = {};

    if (!formData.jobDescription.trim()) {
      newErrors.jobDescription = "Job description is required";
    } else if (formData.jobDescription.trim().length < 20) {
      newErrors.jobDescription =
        "Job description should be at least 20 characters";
    }

    // Resume OR self description required
    if (!formData.resume && !formData.selfDescription.trim()) {
      newErrors.resume = "Resume or self description is required";

      newErrors.selfDescription = "Resume or self description is required";
    }

    // Self description optional
    if (
      formData.selfDescription.trim() &&
      formData.selfDescription.trim().length < 20
    ) {
      newErrors.selfDescription =
        "Self description should be at least 20 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =========================
  // INPUT CHANGE
  // =========================
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // =========================
  // FILE CHANGE
  // =========================
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // PDF validation
    if (file.type !== "application/pdf") {
      setErrors((prev) => ({
        ...prev,
        resume: "Only PDF files are accepted",
      }));

      return;
    }

    // File size validation
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        resume: "File size should not exceed 5MB",
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      resume: file,
    }));

    setUploadedFileName(file.name);

    setErrors((prev) => ({
      ...prev,
      resume: "",
    }));
  };

  // =========================
  // GENERATE REPORT
  // =========================
  const handleGenerateReport = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await generateInterviewReport({
        jobDescription: formData.jobDescription,
        selfDescription: formData.selfDescription,
        resumeFile: formData.resume,
      });

      // BACKEND RETURNS:
      // { message, report }

      navigate(`/interview/${response.report._id}`);
    } catch (error) {
      console.error("Error generating report:", error);

      alert(error?.response?.data?.message || "Failed to generate report");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setLogoutLoading(true);

    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      alert(
        error?.response?.data?.message || "Logout failed. Please try again.",
      );
    } finally {
      setLogoutLoading(false);
    }
  };

  // =========================
  // HELPERS
  // =========================
  const getCharCount = (text) => text.length;

  const isFormValid =
    formData.jobDescription.trim().length >= 20 &&
    (formData.resume || formData.selfDescription.trim().length >= 20);

  return (
    <main className="home">
      {/* HEADER WITH HISTORY BUTTON */}

      {/* LEFT SECTION */}
      <div className="left">
        <div className="section-header">
          <h2>Job Description</h2>
          <span className="badge-label">Required</span>
        </div>

        {/* <p className="section-description">
          Paste the job description you're applying for. This helps us generate
          relevant interview questions.
        </p> */}

        <div className="form-group">
          <textarea
            name="jobDescription"
            placeholder="Paste the complete job description here... Include responsibilities, requirements, and key skills."
            value={formData.jobDescription}
            onChange={handleInputChange}
            className={errors.jobDescription ? "error" : ""}
          ></textarea>

          <div className="char-count">
            {getCharCount(formData.jobDescription)}/5000
          </div>

          {errors.jobDescription && (
            <span className="error-message">{errors.jobDescription}</span>
          )}
        </div>

        <button
          className={`generate-btn ${isLoading ? "loading" : ""} ${
            isFormValid ? "" : "disabled"
          }`}
          onClick={handleGenerateReport}
          disabled={isLoading || !isFormValid}
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Generating Report...
            </>
          ) : (
            <>
              <span className="btn-icon">✨</span>
              Generate Interview Report
            </>
          )}
        </button>

        <div>
          <Link to="/history" className="generate-btn">
            📋 View History
          </Link>
        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
          disabled={logoutLoading}
          type="button"
        >
          {logoutLoading ? "Logging out..." : "Log Out"}
        </button>
      </div>

      {/* RIGHT SECTION */}
      <div className="right">
        {/* RESUME */}
        <div className="upload-section">
          <div className="section-header">
            <h2>Resume Upload</h2>
            <span className="badge-label">PDF Only</span>
          </div>

          {/* <p className="section-description">
            Upload your resume in PDF format. Max file size: 5MB.
          </p> */}

          <div className="input-group">
            <label htmlFor="resume" className="file-upload-label">
              <div className="upload-area">
                <div className="upload-icon">📄</div>

                <div className="upload-text">
                  <p className="upload-title">
                    {uploadedFileName ? "✓ File Selected" : "Choose PDF File"}
                  </p>

                  <p className="upload-subtitle">
                    {uploadedFileName ? uploadedFileName : "or drag and drop"}
                  </p>
                </div>
              </div>

              <input
                type="file"
                id="resume"
                name="resume"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden-input"
              />
            </label>

            {errors.resume && (
              <span className="error-message">{errors.resume}</span>
            )}
          </div>
        </div>

        {/* SELF DESCRIPTION */}
        <div className="description-section">
          <div className="section-header">
            <h2>Self Description</h2>
            <span className="badge-label">Required</span>
          </div>

          {/* <p className="section-description">
            Tell us about yourself — your experience, skills, and career goals.
          </p> */}

          <div className="form-group">
            <textarea
              name="selfDescription"
              placeholder="Share your professional background, key achievements, skills, and what you're looking for in your next role..."
              value={formData.selfDescription}
              onChange={handleInputChange}
              className={errors.selfDescription ? "error" : ""}
            ></textarea>

            <div className="char-count">
              {getCharCount(formData.selfDescription)}/3000
            </div>

            {errors.selfDescription && (
              <span className="error-message">{errors.selfDescription}</span>
            )}
          </div>
        </div>

        {/* INFO BOX */}
        <div className="info-box">
          <div className="info-icon">ℹ️</div>

          <div>
            <h4>Pro Tips</h4>

            <ul>
              <li>Be specific with job requirements</li>

              <li>Highlight your unique experiences</li>

              <li>Keep descriptions clear and concise</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
