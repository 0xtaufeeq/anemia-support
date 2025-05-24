import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const MODEL_NAME = "gemini-1.5-flash-latest";
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables.");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

const generationConfig = {
  temperature: 0.6,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

export async function POST(req: NextRequest) {
  try {
    const { reportText } = await req.json();

    if (!reportText || typeof reportText !== 'string' || reportText.trim().length === 0) {
      return NextResponse.json({ error: "No report text provided or text is empty." }, { status: 400 });
    }

    const prompt = `Analyze the following blood report text and provide insights related to anemia. 
    If numerical values are present for common anemia indicators (like Hemoglobin, RBC count, Hematocrit, MCV, MCH, MCHC, RDW), 
    please highlight them and indicate if they are within typical reference ranges (assume standard adult ranges if not specified). 
    Provide a summary of potential anemia-related concerns based *only* on the provided text. 
    Do not provide medical advice or diagnosis. Strictly adhere to the information present in the report extract.
    Report Text:
    --- 
    ${reportText.substring(0, 32000)} 
    --- 
    Please provide the analysis in a clear, concise, and easy-to-understand format. Structure your response with clear headings for each section (e.g., ## Key Findings, ## Potential Concerns).`;

    const chat = model.startChat({
      generationConfig,
      safetySettings,
    });

    const result = await chat.sendMessage(prompt);
    const response = result.response;
    const insights = response.text();

    return NextResponse.json({ insights });

  } catch (error) {
    console.error("Error in /api/analyze-report:", error);
    let errorMessage = "An unknown error occurred while analyzing the report.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }  else if (typeof error === 'string') {
      errorMessage = error;
    }
    return NextResponse.json({ error: "Failed to analyze report", details: errorMessage }, { status: 500 });
  }
} 