import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import "../auth.form.scss";

const Register = () => {
  const navigate = useNavigate();
  const { loading, register } = useAuth();
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.trim().length < 3) {
      newErrors.username = "Username should be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password should be at least 6 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password should contain uppercase, lowercase, and numbers";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      await register(formData.username, formData.email, formData.password);
      navigate("/");
    } catch (error) {
      console.error("Registration failed:", error);
      setError(
        error?.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    }
  };

  return (
    <main className="auth-main">
      <div className="auth-container">
        <div className="form-wrapper">
          {/* Header */}
          <div className="form-header">
            <h1>Create Account</h1>
            <p>Join us and start your interview preparation journey</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* USERNAME */}
            <div className="input-group">
              <label htmlFor="username">
                Username
                <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Choose your username"
                  value={formData.username}
                  onChange={handleChange}
                  className={errors.username ? "error" : ""}
                />
                <span className="input-icon">👤</span>
              </div>
              {errors.username && (
                <span className="error-message">{errors.username}</span>
              )}
            </div>

            {/* EMAIL */}
            <div className="input-group">
              <label htmlFor="email">
                Email Address
                <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "error" : ""}
                />
                <span className="input-icon">✉️</span>
              </div>
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            {/* PASSWORD */}
            <div className="input-group">
              <label htmlFor="password">
                Password
                <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "error" : ""}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
              <div className="password-strength">
                <p className="strength-label">Password strength:</p>
                <div className="strength-bar">
                  <div
                    className={`strength-indicator ${
                      formData.password.length >= 6 ? "medium" : ""
                    } ${
                      formData.password.length >= 8 &&
                      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)
                        ? "strong"
                        : ""
                    }`}
                  ></div>
                </div>
              </div>
            </div>

            {/* ERROR MESSAGE */}
            {error && <p className="error-alert">{error}</p>}

            {/* SUBMIT BUTTON */}
            <button
              className={`submit-button ${loading ? "loading" : ""}`}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Creating account...
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <span className="button-icon">→</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider">
            <span>Already have an account?</span>
          </div>

          {/* Login Link */}
          <p className="auth-footer">
            Already have an account?
            <Link to="/login" className="auth-link">
              Sign in here
            </Link>
          </p>
        </div>

        {/* Side Info */}
        <div className="auth-info">
          <div className="info-card">
            <div className="info-icon">📚</div>
            <h3>Learn & Practice</h3>
            <p>Master interview questions</p>
          </div>
          <div className="info-card">
            <div className="info-icon">🤖</div>
            <h3>AI Assistant</h3>
            <p>Get personalized guidance</p>
          </div>
          <div className="info-card">
            <div className="info-icon">💼</div>
            <h3>Career Ready</h3>
            <p>Ace your interviews</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Register;
