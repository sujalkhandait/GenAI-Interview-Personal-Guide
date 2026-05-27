const { GoogleGenAI, Type } = require("@google/genai");
const { z } = require("zod");
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

// =====================
// INITIALIZE GEMINI AI
// =====================
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

// =====================
// ZOD SCHEMAS
// =====================

const interviewSchema = z.object({
  technicalQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
      difficulty: z.enum(["easy", "medium", "hard"]),
    }),
  ),

  behavioralQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
      difficulty: z.enum(["easy", "medium", "hard"]),
    }),
  ),

  skillGaps: z.array(
    z.object({
      skill: z.string(),
      severity: z.enum(["low", "medium", "high"]),
      type: z.string(),
    }),
  ),

  preparationPlan: z.array(
    z.object({
      day: z.number().min(1),
      focus: z.string(),
      tasks: z.array(z.string()),
    }),
  ),

  matchScore: z.number().min(0).max(100),

  title: z.string(),
});

const resumePdfSchema = z.object({
  html: z.string(),
});

// =====================
// GEMINI RESPONSE SCHEMAS
// =====================

const interviewResponseSchema = {
  type: Type.OBJECT,

  properties: {
    technicalQuestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: {
            type: Type.STRING,
          },

          intention: {
            type: Type.STRING,
          },

          answer: {
            type: Type.STRING,
          },

          difficulty: {
            type: Type.STRING,
            enum: ["easy", "medium", "hard"],
          },
        },

        required: ["question", "intention", "answer", "difficulty"],
      },
    },

    behavioralQuestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: {
            type: Type.STRING,
          },

          intention: {
            type: Type.STRING,
          },

          answer: {
            type: Type.STRING,
          },

          difficulty: {
            type: Type.STRING,
            enum: ["easy", "medium", "hard"],
          },
        },

        required: ["question", "intention", "answer", "difficulty"],
      },
    },

    skillGaps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          skill: {
            type: Type.STRING,
          },

          severity: {
            type: Type.STRING,
            enum: ["low", "medium", "high"],
          },

          type: {
            type: Type.STRING,
          },
        },

        required: ["skill", "severity", "type"],
      },
    },

    preparationPlan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: {
            type: Type.NUMBER,
          },

          focus: {
            type: Type.STRING,
          },

          tasks: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
          },
        },

        required: ["day", "focus", "tasks"],
      },
    },

    matchScore: {
      type: Type.NUMBER,
    },

    title: {
      type: Type.STRING,
    },
  },

  required: [
    "technicalQuestions",
    "behavioralQuestions",
    "skillGaps",
    "preparationPlan",
    "matchScore",
    "title",
  ],
};

const resumeResponseSchema = {
  type: Type.OBJECT,

  properties: {
    html: {
      type: Type.STRING,
    },
  },

  required: ["html"],
};

// =====================
// GENERATE AI REPORT
// =====================

async function generateReport(jobDescription, resumeText, selfDescription) {
  const prompt = `
You are an expert AI interview preparation assistant.

Analyze the following:

1. Resume
2. Job description
3. Self description

Generate:
- Technical interview questions
- Behavioral interview questions
- Skill gaps
- Preparation roadmap
- Match score
- Report title

IMPORTANT:
- Return ONLY valid JSON
- Do NOT wrap JSON in markdown
- Do NOT omit any fields
- Follow the schema exactly

Resume:
${resumeText}

Job Description:
${jobDescription}

Self Description:
${selfDescription}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",

      contents: prompt,

      config: {
        responseMimeType: "application/json",
        responseSchema: interviewResponseSchema,
      },
    });

    const text =
      typeof response.text === "function" ? response.text() : response.text;

    console.log("RAW AI RESPONSE:");
    console.log(text);

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    console.log("PARSED RESPONSE:");
    console.log(parsed);

    const validatedData = interviewSchema.parse(parsed);

    return validatedData;
  } catch (error) {
    console.error("AI generation failed:", error);

    throw new Error(error?.message || "Failed to generate interview report");
  }
}

// =====================
// GENERATE PDF FROM HTML
// =====================

async function generatePdfFromHtml(htmlContent) {
  let browser;

  try {
    const isProduction = process.env.NODE_ENV === "production";

    let launchOptions = {
      headless: true,
    };

    // ======================
    // PRODUCTION (Railway/Render)
    // ======================
    if (isProduction) {
      launchOptions = {
        args: chromium.args,

        defaultViewport: chromium.defaultViewport,

        executablePath: await chromium.executablePath(),

        headless: chromium.headless,
      };
    }

    // ======================
    // LOCAL DEVELOPMENT
    // ======================
    else {
      launchOptions = {
        headless: true,

        executablePath:
          "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",

        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
        ],
      };
    }

    browser = await puppeteer.launch(launchOptions);

    const page = await browser.newPage();

    await page.setViewport({
      width: 1200,
      height: 800,
    });

    await page.setContent(htmlContent, {
      waitUntil: "networkidle0",
      timeout: 0,
    });

    const pdfBuffer = await page.pdf({
      format: "A4",

      printBackground: true,

      preferCSSPageSize: true,

      margin: {
        top: "20mm",
        bottom: "20mm",
        left: "15mm",
        right: "15mm",
      },
    });

    return pdfBuffer;
  } catch (error) {
    console.error("PDF generation error:", error);

    throw new Error(`Failed to generate PDF: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// =====================
// GENERATE RESUME PDF
// =====================

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const prompt = `
Generate a professional ATS-friendly resume.

Candidate Resume:
${resume}

Self Description:
${selfDescription}

Target Job Description:
${jobDescription}

IMPORTANT:
- Return ONLY valid JSON
- JSON must contain one field named "html"
- HTML should be professional
- ATS friendly
- Modern but simple
- 1-2 pages
- No fake experience
- Highlight strengths relevant to job
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",

      contents: prompt,

      config: {
        responseMimeType: "application/json",
        responseSchema: resumeResponseSchema,
      },
    });

    const text =
      typeof response.text === "function" ? response.text() : response.text;

    console.log("RAW RESUME RESPONSE:");
    console.log(text);

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    const validated = resumePdfSchema.parse(parsed);

    const pdfBuffer = await generatePdfFromHtml(validated.html);

    return pdfBuffer;
  } catch (error) {
    console.error("Resume PDF generation failed:", error);

    throw new Error(error?.message || "Failed to generate resume PDF");
  }
}

// =====================
// EXPORTS
// =====================

module.exports = {
  ai,
  generateReport,
  generateResumePdf,
};
