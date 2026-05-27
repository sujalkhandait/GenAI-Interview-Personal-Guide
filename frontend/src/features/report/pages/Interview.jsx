import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "../../../style/interview.scss";

// SERVICE
import { getReportById, generateResumePdf } from "../services/interview.api.js";

const Interview = () => {
  const { interviewId } = useParams();

  const [activeSection, setActiveSection] = useState("technical");

  const [selectedItem, setSelectedItem] = useState(null);

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  // =========================
  // FETCH REPORT
  // =========================
  useEffect(() => {
    async function fetchReport() {
      try {
        setLoading(true);

        const response = await getReportById(interviewId);

        setData(response.report);
      } catch (error) {
        console.error("Failed to fetch report:", error);
      } finally {
        setLoading(false);
      }
    }

    if (interviewId) {
      fetchReport();
    }
  }, [interviewId]);

  // =========================
  // DOWNLOAD PDF
  // =========================
  const handleDownloadPdf = async () => {
    setPdfLoading(true);

    try {
      const pdfBlob = await generateResumePdf(interviewId);

      const url = window.URL.createObjectURL(new Blob([pdfBlob]));

      const link = document.createElement("a");

      link.href = url;

      link.setAttribute("download", "optimized_resume.pdf");

      document.body.appendChild(link);

      link.click();

      link.remove();
    } catch (error) {
      console.error("PDF download failed:", error);

      alert("Failed to download PDF");
    } finally {
      setPdfLoading(false);
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading || !data) {
    return (
      <main className="loading-screen">
        <h1>Loading your interview plan...</h1>
      </main>
    );
  }

  // =========================
  // HELPERS
  // =========================
  const getContent = () => {
    if (activeSection === "technical") {
      return data.technicalQuestions;
    }

    if (activeSection === "behavioral") {
      return data.behavioralQuestions;
    }

    if (activeSection === "roadmap") {
      return data.preparationPlan;
    }

    return [];
  };

  const getSelectedContent = () => {
    const content = getContent();

    if (selectedItem !== null && content[selectedItem]) {
      return content[selectedItem];
    }

    return content?.length > 0 ? content[0] : null;
  };

  const getSeverityColor = (severity) => {
    if (severity === "high") return "#16a34a";

    if (severity === "medium") return "#4ade80";

    return "#86efac";
  };

  // =========================
  // JSX
  // =========================
  return (
    <main className="interview">
      {/* LEFT SIDEBAR */}
      <aside className="interview-sidebar">
        <h2 className="sidebar-title">Interview Prep</h2>

        <nav className="sidebar-nav">
          <button
            className={`nav-link ${
              activeSection === "technical" ? "active" : ""
            }`}
            onClick={() => {
              setActiveSection("technical");
              setSelectedItem(null);
            }}
          >
            <span className="nav-icon">📚</span>
            Technical Questions
          </button>

          <button
            className={`nav-link ${
              activeSection === "behavioral" ? "active" : ""
            }`}
            onClick={() => {
              setActiveSection("behavioral");
              setSelectedItem(null);
            }}
          >
            <span className="nav-icon">💡</span>
            Behavioral Questions
          </button>

          <button
            className={`nav-link ${
              activeSection === "roadmap" ? "active" : ""
            }`}
            onClick={() => {
              setActiveSection("roadmap");
              setSelectedItem(null);
            }}
          >
            <span className="nav-icon">🗺️</span>
            Road Map
          </button>
        </nav>

        <button
          onClick={handleDownloadPdf}
          className="download-btn"
          disabled={pdfLoading}
          type="button"
        >
          {pdfLoading ? (
            <>
              <span className="pdf-loader" aria-hidden="true"></span>
              Preparing PDF...
            </>
          ) : (
            "Download Resume PDF"
          )}
        </button>

        <div className="sidebar-footer">
          <Link to="/history" className="back-button">
            📋 View History
          </Link>
          <Link to="/" className="back-button">
            ← Back to Home
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <section className="interview-main">
        {activeSection === "roadmap" ? (
          <div className="roadmap-content">
            <h1>
              {data.preparationPlan.length}
              -Day Preparation Plan
            </h1>

            <div className="roadmap-list">
              {data.preparationPlan.map((item, index) => (
                <div key={index} className="roadmap-item">
                  <div className="day-number">Day {item.day}</div>

                  <div className="day-focus">{item.focus}</div>

                  {item.tasks?.length > 0 && (
                    <ul className="roadmap-tasks">
                      {item.tasks.map((task, i) => (
                        <li key={i}>{task}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="question-header">
              <h1>
                {activeSection === "technical"
                  ? "Technical Questions"
                  : "Behavioral Questions"}
              </h1>

              <span className="question-count">
                {getContent().length} questions
              </span>
            </div>

            {/* ACCORDION QUESTIONS */}
            <div className="accordion-container">
              {getContent().map((item, index) => (
                <div
                  key={index}
                  className={`accordion-item ${
                    selectedItem === index ? "active" : ""
                  }`}
                >
                  {/* TOP */}
                  <div
                    className="accordion-header"
                    onClick={() =>
                      setSelectedItem(selectedItem === index ? null : index)
                    }
                  >
                    <div className="accordion-left">
                      <div className="question-number">Q{index + 1}</div>

                      <div className="question-text">{item.question}</div>
                    </div>

                    <div className="accordion-right">
                      {item.difficulty && (
                        <span className={`difficulty ${item.difficulty}`}>
                          {item.difficulty}
                        </span>
                      )}

                      <span className="accordion-icon">
                        {selectedItem === index ? "−" : "+"}
                      </span>
                    </div>
                  </div>

                  {/* BODY */}
                  {selectedItem === index && (
                    <div className="accordion-body">
                      {item.intention && (
                        <>
                          <div className="detail-header">
                            <h2>Interviewer Intention</h2>
                          </div>

                          <p className="detail-answer">{item.intention}</p>
                        </>
                      )}

                      <div
                        className="detail-header"
                        style={{ marginTop: "2rem" }}
                      >
                        <h2>Suggested Answer</h2>
                      </div>

                      <p className="detail-answer">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* RIGHT SIDEBAR */}
      {/* RIGHT SIDEBAR */}
      <aside className="interview-skills">
        {/* MATCH SCORE TOP */}
        <div className="match-score">
          <div className="score-top">
            <h3>Match Score</h3>

            <span className="score-status">
              {data.matchScore >= 80
                ? "Excellent"
                : data.matchScore >= 60
                  ? "Good"
                  : "Needs Improvement"}
            </span>
          </div>

          <div className="score-circle">{data.matchScore}%</div>
        </div>

        <h2 className="skills-title">Skill Gaps</h2>

        <div className="skills-container">
          {data.skillGaps.map((gap, index) => (
            <div key={index} className="skill-card">
              <div className="skill-header">
                <h3 className="skill-name">{gap.skill}</h3>

                <div
                  className="severity-dot"
                  style={{
                    backgroundColor: getSeverityColor(gap.severity),
                  }}
                  title={gap.severity}
                ></div>
              </div>

              <div className="skill-severity">{gap.severity}</div>
            </div>
          ))}
        </div>
      </aside>
    </main>
  );
};

export default Interview;
