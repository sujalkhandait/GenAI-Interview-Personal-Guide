import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../auth.form.scss";
import { useAuth } from "../hooks/useAuth.js";

const Login = () => {
  const navigate = useNavigate();
  const { loading, login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password should be at least 6 characters";
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
      await login(formData.email, formData.password);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      setError(
        error?.response?.data?.message || "Login failed. Please try again.",
      );
    }
  };

  return (
    <main className="auth-main">
      <div className="auth-container">
        <div className="form-wrapper">
          {/* Header */}
          <div className="form-header">
            <h1>Welcome Back</h1>
            <p>Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
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
                  placeholder="Enter your password"
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
                  Signing in...
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <span className="button-icon">→</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider">
            <span>New to Interview Prep?</span>
          </div>

          {/* Register Link */}
          <p className="auth-footer">
            Don't have an account?
            <Link to="/register" className="auth-link">
              Create one now
            </Link>
          </p>
        </div>

        {/* Side Info */}
        <div className="auth-info">
          <div className="info-card">
            <div className="info-icon">🚀</div>
            <h3>Get Started</h3>
            <p>Create your account in seconds</p>
          </div>
          <div className="info-card">
            <div className="info-icon">✨</div>
            <h3>AI-Powered</h3>
            <p>Get personalized interview prep</p>
          </div>
          <div className="info-card">
            <div className="info-icon">🎯</div>
            <h3>Succeed</h3>
            <p>Land your dream job with confidence</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
