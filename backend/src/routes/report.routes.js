const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const controller = require("../controllers/report.controller");
const upload = require("../middlewares/upload.middleware");

/**
 * @route POST /api/reports/
 * @description Generate new AI interview report
 * @access Private
 */
router.post(
    "/",
    authMiddleware,
    upload.single("resume"),
    controller.generateReport
);

/**
 * @route GET /api/report/:reportId
 * @description Get single report by ID
 * @access Private
 */
router.get(
    "/:reportId",
    authMiddleware,
    controller.getReportById
);

/**
 * @route GET /api/report/
 * @description Get all reports of logged in user
 * @access Private
 */
router.get(
    "/",
    authMiddleware,
    controller.getAllReports
);

/**
 * @route POST /api/report/resume/pdf/:reportId
 * @description Generate optimized resume PDF
 * @access Private
 */
router.post(
    "/resume/pdf/:reportId",
    authMiddleware,
    controller.generateResumePdfController
);

module.exports = router;