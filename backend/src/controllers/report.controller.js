const pdfParse = require("pdf-parse");
const Report = require("../models/report.model");
const {
  generateReport: generateAIReport,
  generateResumePdf,
} = require("../services/ai.service");


console.log(pdfParse);
console.log(typeof pdfParse);
/**
 * @description Controller to generate AI interview report
 */
async function generateReport(req, res) {
  try {
    // Check resume file
    if (!req.file) {
      return res.status(400).json({
        message: "Resume PDF file is required",
      });
    }

    // Parse PDF
    const pdfData = await pdfParse(req.file.buffer);
    const resumeContent = pdfData.text;

    // Get request body data
    const { jobDescription, selfDescription } = req.body;

    // Validate fields
    if (!jobDescription || !selfDescription) {
      return res.status(400).json({
        message: "Job description and self description are required",
      });
    }

    // Generate AI report
    const reportData = await generateAIReport(
      jobDescription,
      resumeContent,
      selfDescription,
    );

    // Save report in DB
    const savedReport = await Report.create({
      user: req.user.id,
      jobDescription,
      resumeText: resumeContent,
      selfDescription,
      ...reportData,
    });

    return res.status(201).json({
      message: "Report generated successfully",
      report: savedReport,
    });
  } catch (error) {
    console.error("AI Report Generation Error:", error);

    return res.status(500).json({
      message: error.message || "Something went wrong while generating report",
    });
  }
}

/**
 * @description Get report by ID
 */
async function getReportById(req, res) {
  try {
    const { reportId } = req.params;

    const report = await Report.findOne({
      _id: reportId,
      user: req.user.id,
    });

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    return res.status(200).json({
      message: "Report fetched successfully",
      report,
    });
  } catch (error) {
    console.error("Fetch Report Error:", error);

    return res.status(500).json({
      message: error.message || "Something went wrong",
    });
  }
}

/**
 * @description Get all reports of logged in user
 */
async function getAllReports(req, res) {
  try {
    const reports = await Report.find({
      user: req.user.id,
    })
      .sort({ createdAt: -1 })
      .select("-resumeText -selfDescription -jobDescription -__v");

    return res.status(200).json({
      message: "Reports fetched successfully",
      reports,
    });
  } catch (error) {
    console.error("Fetch All Reports Error:", error);

    return res.status(500).json({
      message: error.message || "Something went wrong",
    });
  }
}

/**
 * @description Generate optimized resume PDF
 */
async function generateResumePdfController(req, res) {
  try {
    const { reportId } = req.params;

    const report = await Report.findOne({
      _id: reportId,
      user: req.user.id,
    });

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    const { resumeText, jobDescription, selfDescription } = report;

    // Generate PDF buffer from AI service
    const pdfBuffer = await generateResumePdf({
      resume: resumeText,
      jobDescription,
      selfDescription,
    });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=resume_${reportId}.pdf`,
    });

    return res.send(pdfBuffer);
  } catch (error) {
    console.error("Resume PDF Generation Error:", error);

    return res.status(500).json({
      message: error.message || "Something went wrong",
    });
  }
}

module.exports = {
  generateReport,
  getReportById,
  getAllReports,
  generateResumePdfController,
};
