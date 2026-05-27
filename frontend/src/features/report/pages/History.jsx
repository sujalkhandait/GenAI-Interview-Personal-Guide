import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../style/history.scss";

// SERVICE
import { getAllReports } from "../services/interview.api.js";

const History = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // =========================
  // FETCH ALL REPORTS
  // =========================
  useEffect(() => {
    async function fetchReports() {
      try {
        setLoading(true);
        const response = await getAllReports();
        setReports(response.reports || []);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, []);

  // =========================
  // FILTER & SORT REPORTS
  // =========================
  const filteredReports = reports
    .filter((report) =>
      report.title.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === "score") {
        return b.matchScore - a.matchScore;
      }
      return 0;
    });

  // =========================
  // HANDLE REPORT VIEW
  // =========================
  const handleViewReport = (reportId) => {
    navigate(`/interview/${reportId}`);
  };

  // =========================
  // FORMAT DATE
  // =========================
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // =========================
  // GET SCORE COLOR
  // =========================
  const getScoreColor = (score) => {
    if (score >= 80) return "#22c55e";
    if (score >= 60) return "#4d7c0f";
    return "#a7f3d0";
  };

  // =========================
  // GET SCORE LABEL
  // =========================
  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Work";
  };

  // =========================
  // LOADING STATE
  // =========================
  if (loading) {
    return (
      <main className="history-container">
        <div className="loading-state">
          <div className="loader"></div>
          <p>Loading your interview history...</p>
        </div>
      </main>
    );
  }

  // =========================
  // EMPTY STATE
  // =========================
  if (reports.length === 0) {
    return (
      <main className="history-container">
        <div className="history-header">
          <div className="header-content">
            <h1>Interview History</h1>
            <p>Track your interview preparation progress</p>
          </div>
          <button className="back-home-btn" onClick={() => navigate("/")}>
            ← Start Your First Interview
          </button>
        </div>

        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h2>No Interview History Yet</h2>
          <p>
            Start preparing for interviews by creating your first interview
            report
          </p>
          <button className="create-btn" onClick={() => navigate("/")}>
            Create Your First Report
          </button>
        </div>
      </main>
    );
  }

  // =========================
  // JSX
  // =========================
  return (
    <main className="history-container">
      {/* HEADER */}
      <div className="history-header">
        <div className="header-content">
          <h1>Interview History</h1>
          <p>Track your interview preparation progress</p>
        </div>
        <button className="back-home-btn" onClick={() => navigate("/")}>
          ← Create New Interview
        </button>
      </div>

      {/* CONTROLS */}
      <div className="history-controls">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search interview reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="sort-box">
          <label htmlFor="sort-select">Sort by:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="score">Highest Score</option>
          </select>
        </div>
      </div>

      {/* RESULTS COUNT */}
      <div className="results-count">
        Showing {filteredReports.length} interview
        {filteredReports.length !== 1 ? "s" : ""}
      </div>

      {/* REPORTS GRID */}
      <div className="reports-grid">
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <div key={report._id} className="report-card">
              {/* CARD HEADER */}
              <div className="card-header">
                <div className="title-section">
                  <h3>{report.title || "Untitled Report"}</h3>
                  <span className="job-company">
                    {report.jobRole || "Job Role"}
                  </span>
                </div>
                <div
                  className="score-badge"
                  style={{
                    backgroundColor: `${getScoreColor(report.matchScore)}22`,
                    borderColor: getScoreColor(report.matchScore),
                  }}
                >
                  <span
                    className="score-value"
                    style={{ color: getScoreColor(report.matchScore) }}
                  >
                    {report.matchScore}%
                  </span>
                  <span className="score-label">
                    {getScoreLabel(report.matchScore)}
                  </span>
                </div>
              </div>

              {/* CARD CONTENT */}
              <div className="card-content">
                <div className="stat">
                  <span className="stat-icon">📚</span>
                  <div className="stat-info">
                    <span className="stat-label">Technical Questions</span>
                    <span className="stat-value">
                      {report.technicalQuestions?.length || 0}
                    </span>
                  </div>
                </div>

                <div className="stat">
                  <span className="stat-icon">💡</span>
                  <div className="stat-info">
                    <span className="stat-label">Behavioral Questions</span>
                    <span className="stat-value">
                      {report.behavioralQuestions?.length || 0}
                    </span>
                  </div>
                </div>

                <div className="stat">
                  <span className="stat-icon">⚠️</span>
                  <div className="stat-info">
                    <span className="stat-label">Skill Gaps</span>
                    <span className="stat-value">
                      {report.skillGaps?.length || 0}
                    </span>
                  </div>
                </div>

                <div className="stat">
                  <span className="stat-icon">🗓️</span>
                  <div className="stat-info">
                    <span className="stat-label">Prep Days</span>
                    <span className="stat-value">
                      {report.preparationPlan?.length || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* CARD FOOTER */}
              <div className="card-footer">
                <div className="date-info">
                  <span className="date-label">Created:</span>
                  <span className="date-value">
                    {formatDate(report.createdAt)}
                  </span>
                </div>
                <button
                  className="view-btn"
                  onClick={() => handleViewReport(report._id)}
                >
                  View Report →
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No interviews match your search</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default History;
