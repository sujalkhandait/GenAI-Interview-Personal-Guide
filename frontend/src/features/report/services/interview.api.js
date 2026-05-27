import axios from "axios";

// ============================
// AXIOS INSTANCE
// ============================

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// ============================
// REQUEST INTERCEPTOR
// Automatically attach JWT token
// ============================

api.interceptors.request.use(

    (config) => {

        const token = localStorage.getItem("token");

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);

// ============================
// GENERATE INTERVIEW REPORT
// ============================

export async function generateInterviewReport({
    jobDescription,
    selfDescription,
    resumeFile
}) {

    try {

        const formData = new FormData();

        formData.append(
            "jobDescription",
            jobDescription
        );

        formData.append(
            "selfDescription",
            selfDescription
        );

        formData.append(
            "resume",
            resumeFile
        );

        const response = await api.post(

            "/api/reports",

            formData,

            {
                headers: {
                    "Content-Type":
                        "multipart/form-data"
                }
            }
        );

        return response.data;

    } catch (error) {

        console.error(
            "Error generating interview report:",
            error
        );

        throw error;
    }
}

// ============================
// GET SINGLE REPORT
// ============================

export async function getReportById(reportId) {

    try {

        const response = await api.get(
            `/api/reports/${reportId}`
        );

        return response.data;

    } catch (error) {

        console.error(
            "Error fetching report:",
            error
        );

        throw error;
    }
}

// ============================
// GET ALL REPORTS
// ============================

export async function getAllReports() {

    try {

        const response = await api.get(
            "/api/reports"
        );

        return response.data;

    } catch (error) {

        console.error(
            "Error fetching reports:",
            error
        );

        throw error;
    }
}

// ============================
// GENERATE RESUME PDF
// ============================

export async function generateResumePdf(
    reportId
) {

    try {

        const response = await api.post(

            `/api/reports/resume/pdf/${reportId}`,

            null,

            {
                responseType: "blob"
            }
        );

        return response.data;

    } catch (error) {

        console.error(
            "Error generating resume PDF:",
            error
        );

        throw error;
    }
}