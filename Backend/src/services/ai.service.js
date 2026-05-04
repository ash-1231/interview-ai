const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

const interviewReportSchema = z.object({
    matchScore: z.number(),
    technicalQuestions: z.array(z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string()
    })),
    behavioralQuestions: z.array(z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string()
    })),
    skillGaps: z.array(z.object({
        skill: z.string(),
        severity: z.enum(["low", "medium", "high"])
    })),
    preparationPlan: z.array(z.object({
        day: z.number(),
        focus: z.string(),
        tasks: z.array(z.string())
    })),
    title: z.string()
});
async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `
You are an AI that MUST return STRICT JSON.

DO NOT explain anything.
DO NOT return text outside JSON.
DO NOT rename fields.

Return EXACTLY this structure:

{
  "matchScore": number,
  "title": string,
  "technicalQuestions": [
    {
      "question": string,
      "intention": string,
      "answer": string
    }
  ],
  "behavioralQuestions": [
    {
      "question": string,
      "intention": string,
      "answer": string
    }
  ],
  "skillGaps": [
    {
      "skill": string,
      "severity": "low" | "medium" | "high"
    }
  ],
  "preparationPlan": [
    {
      "day": number,
      "focus": string,
      "tasks": [string]
    }
  ]
}

IMPORTANT RULES:
- "question" must ALWAYS be an actual question (not explanation)
- "intention" explains WHY interviewer asks this
- "answer" must be a strong model answer
- DO NOT mix fields
- DO NOT return placeholders like "question", "answer"

Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}
`;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview", // 🔥 more stable
        contents: prompt,
    });

    let data;

    try {
        data = JSON.parse(response.text);
    } catch (err) {
        console.log("INVALID JSON:", response.text);
        throw new Error("AI returned invalid JSON");
    }

    // 🔥 FINAL CLEANING LAYER (MINIMAL, SAFE)
    const cleanQuestions = (arr) => {
        if (!Array.isArray(arr)) return [];

        return arr
            .map((item) => {
                if (!item || typeof item !== "object") return null;

                const question = item.question?.trim();
                const intention = item.intention?.trim();
                const answer = item.answer?.trim();

                // ❌ reject garbage
                if (!question || question.length < 10) return null;

                return {
                    question,
                    intention: intention || "Understand why this is asked",
                    answer: answer || "Provide a structured answer"
                };
            })
            .filter(Boolean)
            .slice(0, 5); // limit
    };

    const cleanPlan = (arr) => {
        if (!Array.isArray(arr)) return [];

        return arr
            .map((item, index) => {
                if (!item || typeof item !== "object") return null;

                return {
                    day: Number(item.day) || index + 1,
                    focus: item.focus || "General Preparation",
                    tasks: Array.isArray(item.tasks) ? item.tasks : ["Practice"]
                };
            })
            .filter(Boolean)
            .sort((a, b) => a.day - b.day)
            .slice(0, 10);
    };

    return {
        matchScore: data.matchScore || 70,
        title: data.title || "Software Engineer",

        technicalQuestions: cleanQuestions(data.technicalQuestions),
        behavioralQuestions: cleanQuestions(data.behavioralQuestions),

        skillGaps: Array.isArray(data.skillGaps)
            ? data.skillGaps.map(s => ({
                skill: s.skill || "Unknown",
                severity: s.severity || "medium"
            }))
            : [],

        preparationPlan: cleanPlan(data.preparationPlan)
    };
}



// ================= PDF PART (unchanged) =================

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
        format: "A4",
        margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    });

    await browser.close();

    return pdfBuffer;
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string()
    });

    const prompt = `Generate resume for a candidate with the following details:
Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

Return JSON:
{
  "html": "<valid HTML string>"
}
`;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    });

    const jsonContent = JSON.parse(response.text);

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

    return pdfBuffer;
}

module.exports = { generateInterviewReport, generateResumePdf };
