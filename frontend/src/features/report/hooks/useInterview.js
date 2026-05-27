import {
  getAllInterviewReports,
  generateInterviewReport,
  getInterviewReportById,
  generateResumePdf,
} from "../services/interview.api.js";

import { useContext, useEffect } from "react";
import { InterviewContext } from "../interview.context.js";
import { useParams } from "react-router-dom";

export const useInterview = () => {
  const context = useContext(InterviewContext);
  const { interviewId } = useParams();

  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }

  const { loading, setLoading, report, setReport, reports, setReports } =
    context;

  // =========================
  // GENERATE REPORT
  // =========================
  const generateReport = async ({
    jobDescription,
    selfDescription,
    resumeFile,
  }) => {
    setLoading(true);

    try {
      const response = await generateInterviewReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });

      // backend response:
      // { message, report }

      setReport(response.report);

      return response.report;
    } catch (error) {
      console.error("Generate Report Error:", error);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GET REPORT BY ID
  // =========================
  const getReportById = async (reportId) => {
    setLoading(true);

    try {
      const response = await getInterviewReportById(reportId);

      // backend response:
      // { message, report }

      setReport(response.report);

      return response.report;
    } catch (error) {
      console.error("Fetch Report Error:", error);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GET ALL REPORTS
  // =========================
  const getReports = async () => {
    setLoading(true);

    try {
      const response = await getAllInterviewReports();

      // backend response:
      // { message, reports }

      setReports(response.reports);

      return response.reports;
    } catch (error) {
      console.error("Fetch Reports Error:", error);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DOWNLOAD RESUME PDF
  // =========================
  const getResumePdf = async (reportId) => {
    setLoading(true);

    try {
      const response = await generateResumePdf({
        reportId,
      });

      const url = window.URL.createObjectURL(
        new Blob([response], {
          type: "application/pdf",
        }),
      );

      const link = document.createElement("a");

      link.href = url;

      link.setAttribute("download", `resume_${reportId}.pdf`);

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Resume PDF Error:", error);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // AUTO FETCH
  // =========================
  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    } else {
      getReports();
    }
  }, [interviewId]);

  return {
    loading,
    report,
    reports,
    generateReport,
    getReportById,
    getReports,
    getResumePdf,
  };
};
