import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const MODEL_NAME = "gemini-1.5-flash-latest"; // Updated to a generally available and fast model
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables.");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

// Basic safety settings - adjust as needed
const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

export async function POST(req: NextRequest) {
  try {
    const { message, language } = await req.json();

    if (!message || !language) {
      return NextResponse.json({ error: "Message and language are required" }, { status: 400 });
    }

    // Basic prompt, enhance as needed
    const prompt = `You are an AI assistant specializing in anemia. 
    The user is asking in ${language === "en" ? "English" : language === "hi" ? "Hindi" : "Kannada"}.
    Please respond helpfully and concisely in the user's selected language.
    User's question: "${message}"`;

    const generationConfig = {
      temperature: 0.7,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };

    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [
        // You can add chat history here if needed for more context
      ],
    });

    const result = await chat.sendMessage(prompt);
    const response = result.response;
    const botResponseText = response.text();

    return NextResponse.json({ reply: botResponseText });

  } catch (error) {
    console.error("Error in /api/chat:", error);
    // Type guard for error handling
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: "Failed to get response from AI", details: errorMessage }, { status: 500 });
  }
} 