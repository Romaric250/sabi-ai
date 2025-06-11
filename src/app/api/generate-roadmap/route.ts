import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { findSimilarRoadmap, storeRoadmap } from '@/lib/vector-db';
import { auth } from '@/lib/auth';

interface RoadmapStage {
  id: string;
  title: string;
  description: string;
  lessons: string[];
  materials: string[];
  quiz: {
    question: string;
    options: string[];
    correct: number;
  }[];
  position: { x: number; y: number };
  color: string;
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function generateRoadmapWithAI(prompt: string): Promise<RoadmapStage[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const aiPrompt = `
You are an expert educational AI that creates comprehensive learning roadmaps with rich content and resources.

IMPORTANT: You must respond with ONLY valid JSON. No explanations, no markdown, no additional text.

For the learning goal: "${prompt}"

Create a roadmap with exactly this JSON structure:

{
  "stages": [
    {
      "id": "1",
      "title": "Stage Title (max 3 words)",
      "description": "Brief explanation of what this stage covers",
      "lessons": ["Lesson 1", "Lesson 2", "Lesson 3"],
      "materials": [
        {
          "title": "Introduction to Topic",
          "type": "text",
          "content": "# Introduction to [Topic]\n\n## Overview\nDetailed explanation with examples, definitions, and practical applications.\n\n## Key Concepts\n- **Concept 1**: Definition and explanation\n- **Concept 2**: Definition and explanation\n- **Concept 3**: Definition and explanation\n\n## Step-by-Step Guide\n1. First step with detailed explanation\n2. Second step with examples\n3. Third step with practice exercises\n\n## Real-World Applications\nExplain how this topic applies in real scenarios with specific examples.\n\n## Summary\nKey takeaways and what students should remember.",
          "readTime": "10 min"
        },
        {
          "title": "Video Tutorial",
          "type": "video",
          "url": "https://www.youtube.com/watch?v=kfF40MiS7zA",
          "duration": "15 min",
          "description": "Comprehensive video covering the fundamentals"
        },
        {
          "title": "Visual Guide",
          "type": "image",
          "imageUrl": "https://picsum.photos/800/600?random=1",
          "description": "Diagram or infographic explaining key concepts"
        }
      ],
      "quiz": [
        {
          "question": "Question text?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correct": 0,
          "explanation": "Detailed explanation of why this answer is correct"
        }
      ],
      "position": { "x": 2, "y": 0 },
      "color": "from-green-400 to-emerald-500"
    }
  ],
  "finalQuiz": {
    "title": "Final Assessment: ${prompt}",
    "description": "Comprehensive test covering all stages",
    "questions": [
      {
        "question": "Comprehensive question covering multiple stages",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correct": 0,
        "explanation": "Detailed explanation",
        "stage": "Multiple stages"
      }
    ],
    "passingScore": 80,
    "timeLimit": 30
  }
}

Requirements:
1. Create exactly 6 stages that build upon each other
2. Each stage should have 3 lessons, rich materials with actual content, and 2 quiz questions with explanations
3. Position stages in a path: stage 1 at (2,0), stage 2 at (1,1), stage 3 at (3,1), stage 4 at (2,2), stage 5 at (1,3), stage 6 at (3,3)
4. Use these colors in order: "from-green-400 to-emerald-500", "from-blue-400 to-cyan-500", "from-purple-400 to-pink-500", "from-orange-400 to-red-500", "from-indigo-400 to-purple-500", "from-yellow-400 to-orange-500"
5. Include actual educational content in text materials (200+ words each)
6. Suggest real YouTube video URLs when possible
7. Use random image URLs from picsum.photos with different random numbers
8. Create a final quiz with 10 comprehensive questions
9. Ensure logical progression from beginner to advanced concepts

Return ONLY the JSON object, nothing else.
`;

    const result = await model.generateContent(aiPrompt);
    const response = await result.response;
    const text = response.text();

    try {
      // Clean the response by removing markdown code blocks
      let cleanedText = text.trim();

      // Remove ```json and ``` markers
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      console.log('Cleaned roadmap response:', cleanedText);

      const roadmapData = JSON.parse(cleanedText);

      // Return the stages array from the new structure
      return roadmapData.stages || roadmapData;
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('Raw text:', text);
      return getMockRoadmap(prompt);
    }
  } catch (error) {
    console.error('Gemini AI error:', error);
    return getMockRoadmap(prompt);
  }
}

// Fallback mock roadmap generation
function getMockRoadmap(prompt: string): RoadmapStage[] {
  const roadmaps: { [key: string]: RoadmapStage[] } = {
    'trigonometry': [
      {
        id: '1',
        title: 'Basic Angles',
        description: 'Understanding degrees, radians, and angle measurement',
        lessons: ['What are angles?', 'Degrees vs Radians', 'Unit Circle Introduction'],
        materials: ['Interactive Angle Visualizer', 'Degree-Radian Converter', 'Practice Worksheets'],
        quiz: [
          {
            question: 'How many degrees are in a full circle?',
            options: ['180°', '270°', '360°', '90°'],
            correct: 2
          },
          {
            question: 'What is π radians in degrees?',
            options: ['90°', '180°', '270°', '360°'],
            correct: 1
          }
        ],
        position: { x: 2, y: 0 },
        color: 'from-green-400 to-emerald-500'
      },
      {
        id: '2',
        title: 'Sine Function',
        description: 'Master the sine function and its properties',
        lessons: ['Definition of Sine', 'Sine Wave Properties', 'Sine in Right Triangles'],
        materials: ['Sine Wave Simulator', 'Triangle Calculator', 'Graphing Tool'],
        quiz: [
          {
            question: 'What is sin(90°)?',
            options: ['0', '1', '-1', '0.5'],
            correct: 1
          },
          {
            question: 'What is the range of the sine function?',
            options: ['[0, 1]', '[-1, 1]', '[0, ∞]', '(-∞, ∞)'],
            correct: 1
          }
        ],
        position: { x: 1, y: 1 },
        color: 'from-blue-400 to-cyan-500'
      },
      {
        id: '3',
        title: 'Cosine Function',
        description: 'Explore cosine and its relationship to sine',
        lessons: ['Definition of Cosine', 'Cosine Wave Properties', 'Cosine in Right Triangles'],
        materials: ['Cosine Wave Simulator', 'Comparison Tool', 'Practice Problems'],
        quiz: [
          {
            question: 'What is cos(0°)?',
            options: ['0', '1', '-1', '0.5'],
            correct: 1
          },
          {
            question: 'How is cosine related to sine?',
            options: ['cos(x) = sin(x)', 'cos(x) = sin(90° - x)', 'cos(x) = -sin(x)', 'No relation'],
            correct: 1
          }
        ],
        position: { x: 3, y: 1 },
        color: 'from-purple-400 to-pink-500'
      },
      {
        id: '4',
        title: 'Tangent Function',
        description: 'Understanding tangent and its applications',
        lessons: ['Definition of Tangent', 'Tangent Properties', 'Tangent in Problem Solving'],
        materials: ['Tangent Visualizer', 'Slope Calculator', 'Real-world Examples'],
        quiz: [
          {
            question: 'What is tan(45°)?',
            options: ['0', '1', '-1', '√3'],
            correct: 1
          },
          {
            question: 'What is tan(x) equal to?',
            options: ['sin(x)/cos(x)', 'cos(x)/sin(x)', 'sin(x) + cos(x)', 'sin(x) - cos(x)'],
            correct: 0
          }
        ],
        position: { x: 2, y: 2 },
        color: 'from-orange-400 to-red-500'
      },
      {
        id: '5',
        title: 'Trig Identities',
        description: 'Master fundamental trigonometric identities',
        lessons: ['Pythagorean Identity', 'Sum and Difference Formulas', 'Double Angle Formulas'],
        materials: ['Identity Proof Tool', 'Formula Reference', 'Practice Generator'],
        quiz: [
          {
            question: 'What is sin²θ + cos²θ equal to?',
            options: ['0', '1', 'tan²θ', '2'],
            correct: 1
          },
          {
            question: 'What is sin(2θ) equal to?',
            options: ['2sin(θ)', '2cos(θ)', '2sin(θ)cos(θ)', 'sin²(θ)'],
            correct: 2
          }
        ],
        position: { x: 1, y: 3 },
        color: 'from-indigo-400 to-purple-500'
      },
      {
        id: '6',
        title: 'Applications',
        description: 'Real-world applications of trigonometry',
        lessons: ['Physics Applications', 'Engineering Uses', 'Navigation and GPS'],
        materials: ['Simulation Tools', 'Case Studies', 'Project Ideas'],
        quiz: [
          {
            question: 'Trigonometry is used in which field?',
            options: ['Physics', 'Engineering', 'Navigation', 'All of the above'],
            correct: 3
          },
          {
            question: 'What does SOH-CAH-TOA help remember?',
            options: ['Angle names', 'Trig ratios', 'Unit circle', 'Identities'],
            correct: 1
          }
        ],
        position: { x: 3, y: 3 },
        color: 'from-yellow-400 to-orange-500'
      }
    ]
  };

  // Simple keyword matching for fallback
  const lowerPrompt = prompt.toLowerCase();
  if (lowerPrompt.includes('trigonometry') || lowerPrompt.includes('trig') || lowerPrompt.includes('sine') || lowerPrompt.includes('cosine')) {
    return roadmaps['trigonometry'];
  }

  // Default to trigonometry
  return roadmaps['trigonometry'];
}

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Check if we have a similar roadmap in the vector database
    console.log('Searching for similar roadmap for prompt:', prompt);
    const existingRoadmap = await findSimilarRoadmap(prompt);

    if (existingRoadmap) {
      console.log('Found existing roadmap, returning cached result');
      return NextResponse.json({
        roadmap: existingRoadmap.content,
        cached: true,
        message: 'Retrieved from cache'
      });
    }

    // Generate roadmap using Gemini AI
    console.log('Generating new roadmap with AI for prompt:', prompt);
    const roadmap = await generateRoadmapWithAI(prompt);

    // Store the new roadmap in the vector database for future use
    try {
      await storeRoadmap(prompt, roadmap);
      console.log('Successfully stored roadmap in vector database');
    } catch (storeError) {
      console.error('Failed to store roadmap in vector database:', storeError);
      // Continue anyway, don't fail the request
    }

    return NextResponse.json({
      success: true,
      roadmap,
      prompt,
      cached: false,
      message: 'Generated new roadmap'
    });
    
  } catch (error) {
    console.error('Error generating roadmap:', error);
    return NextResponse.json(
      { error: 'Failed to generate roadmap' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Roadmap generation API is running',
    endpoints: {
      POST: '/api/generate-roadmap - Generate a new roadmap from a prompt'
    }
  });
}
