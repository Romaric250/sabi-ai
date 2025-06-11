import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const { message, context, stageId, stageTitle } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        response: "I'm here to help! However, the AI service is currently unavailable. Please try again later or contact support.",
        fallback: true
      });
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create context-aware prompt
    const contextPrompt = `
You are an expert AI tutor helping a student learn. You are knowledgeable, encouraging, and provide clear explanations.

CONTEXT:
- Student is learning: ${context || 'General topic'}
- Current stage: ${stageTitle || 'Unknown stage'}
- Stage ID: ${stageId || 'N/A'}

INSTRUCTIONS:
1. Stay focused on the current learning context
2. Provide clear, educational responses
3. Be encouraging and supportive
4. If the question is off-topic, gently redirect to the learning material
5. Use examples and analogies when helpful
6. Keep responses concise but comprehensive
7. Always maintain a helpful, patient tone

STUDENT QUESTION: "${message}"

Provide a helpful, educational response that addresses their question while staying within the learning context.
`;

    console.log('Sending chat request to Gemini AI...');
    
    const result = await model.generateContent(contextPrompt);
    const response = result.response;
    const text = response.text();
    
    console.log('AI Chat Response:', text);

    return NextResponse.json({
      response: text.trim(),
      context: {
        topic: context,
        stage: stageTitle,
        stageId: stageId
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Provide helpful fallback response
    const fallbackResponses = [
      "That's a great question! While I can't access the AI service right now, I'd recommend reviewing the study materials for this stage and trying the practice exercises.",
      "I'm here to help with your learning journey! Unfortunately, there's a temporary issue with the AI service. Please check the lesson content and materials for guidance.",
      "Excellent question! While the AI tutor is temporarily unavailable, you can find detailed explanations in the study materials section of this stage.",
    ];
    
    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    
    return NextResponse.json({
      response: randomResponse,
      fallback: true,
      error: 'AI service temporarily unavailable'
    });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'AI Chat API is running',
    endpoint: '/api/chat',
    method: 'POST',
    expectedBody: {
      message: 'Your question or message',
      context: 'Learning topic (optional)',
      stageId: 'Current stage ID (optional)',
      stageTitle: 'Current stage title (optional)'
    },
    example: {
      message: 'Can you explain sine and cosine?',
      context: 'Trigonometry',
      stageId: '2',
      stageTitle: 'Sine Function'
    }
  });
}
