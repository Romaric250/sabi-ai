import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    console.log('POST request received');

    const body = await request.json();
    console.log('Request body:', body);

    const prompt  = "teach me trigonometry";

    if (!prompt) {
      console.log('No prompt provided');
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    console.log('Prompt received:', prompt);

    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.log('No Gemini API key found');
      return NextResponse.json(
        {
          error: 'Gemini API key not configured',
          fallback: true,
          message: 'Using fallback response - API key missing'
        },
        { status: 200 }
      );
    }

    console.log('Gemini API key found, proceeding with AI request');

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Simple test prompt
    const testPrompt = `
You are an educational AI assistant. 

User wants to learn: "${prompt}"

Respond with a simple JSON object containing:
1. A brief description of what they want to learn
2. 3 key topics they should focus on
3. An estimated difficulty level (1-10)

Format your response as valid JSON only, no other text:

{
  "subject": "subject name",
  "description": "brief description",
  "keyTopics": ["topic1", "topic2", "topic3"],
  "difficulty": 5,
  "estimatedTime": "2-4 weeks"
}
`;

    console.log('Sending request to Gemini AI...');

    const result = await model.generateContent(testPrompt);
    const response = result.response;
    const text = response.text();
    
    console.log('Raw Gemini response:', text);

    try {
      // Clean the response by removing markdown code blocks
      let cleanedText = text.trim();

      // Remove ```json and ``` markers
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      console.log('Cleaned text:', cleanedText);

      // Try to parse the cleaned JSON response
      const parsedResponse = JSON.parse(cleanedText);

      return NextResponse.json({
        success: true,
        data: parsedResponse,
        rawResponse: text,
        cleanedResponse: cleanedText,
        source: 'gemini-ai'
      });

    } catch (parseError:any) {
      console.error('Failed to parse Gemini response as JSON:', parseError);

      return NextResponse.json({
        success: false,
        error: 'Failed to parse AI response',
        rawResponse: text,
        parseError: parseError.message,
        source: 'gemini-ai'
      });
    }

  } catch (error:any) {
    console.error('Gemini AI error:', error);
    
    // Return fallback response
    return NextResponse.json({
      success: false,
      error: error.message,
      fallback: {
        subject: "Trigonometry",
        description: `Learning tringonometry involves understanding core concepts and practical applications.`,
        keyTopics: ["Fundamentals", "Core Concepts", "Applications"],
        difficulty: 5,
        estimatedTime: "2-4 weeks"
      },
      source: 'fallback'
    });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'AI Test API is running',
    endpoint: '/api/test-ai',
    method: 'POST',
    expectedBody: {
      prompt: 'What you want to learn'
    },
    example: {
      prompt: 'Trigonometry'
    }
  });
}
