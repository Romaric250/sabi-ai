import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  const { message, stageId, stageTitle, stageDescription, lessons, context } =
    await request.json();

  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  // Check if API key exists
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({
      response:
        "I'm here to help with your learning! However, the AI service is currently unavailable. Please try again later.",
      fallback: true,
    });
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Create a highly specific context prompt for the stage
  const stageContextPrompt = `
You are an expert AI tutor specializing in "${stageTitle}" (Stage ${stageId}).

STAGE CONTEXT:
- Stage Title: ${stageTitle}
- Stage Description: ${stageDescription}
- Learning Objectives: ${lessons ? lessons.join(", ") : "Not specified"}
- Overall Subject: ${context || "General learning"}

STRICT INSTRUCTIONS:
1. ONLY discuss topics related to "${stageTitle}" and its learning objectives
2. If the student asks about other stages or unrelated topics, politely redirect them back to this stage
3. Provide clear, educational explanations with examples
4. Be encouraging and supportive
5. Use analogies and real-world examples when helpful
6. Break down complex concepts into simple steps
7. Always stay within the scope of this specific stage
8. If asked about future stages, say "Let's focus on mastering ${stageTitle} first!"

STUDENT QUESTION: "${message}"

Provide a helpful, educational response that addresses their question while staying strictly within the "${stageTitle}" learning context. If the question is off-topic, gently redirect them back to the current stage material.
`;

  console.log("Sending stage-specific chat request to Gemini AI...");

  const result = await model.generateContent(stageContextPrompt);
  const response = result.response;
  const text = response.text();

  console.log("AI Stage Chat Response:", text);

  return NextResponse.json({
    response: text.trim(),
    stageContext: {
      stageId,
      stageTitle,
      stageDescription,
      lessons,
    },
    timestamp: new Date().toISOString(),
  });
}

export async function GET() {
  return NextResponse.json({
    message: "Stage-specific AI Chat API is running",
    endpoint: "/api/stage-chat",
    method: "POST",
    expectedBody: {
      message: "Student question or message",
      stageId: "Current stage ID",
      stageTitle: "Current stage title",
      stageDescription: "Stage description",
      lessons: ["Array of learning objectives"],
      context: "Overall learning topic",
    },
    example: {
      message: "Can you explain the unit circle?",
      stageId: "1",
      stageTitle: "Basic Angles",
      stageDescription: "Understanding degrees, radians, and angle measurement",
      lessons: [
        "What are angles?",
        "Degrees vs Radians",
        "Unit Circle Introduction",
      ],
      context: "Trigonometry",
    },
  });
}
