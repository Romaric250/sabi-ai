import { findSimilarRoadmaps, storeRoadmap } from "@/lib/vector-db";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

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

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function generateRoadmapWithAI(prompt: string): Promise<RoadmapStage[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

    const timestamp = new Date().toISOString();
    const randomSeed = Math.random().toString(36).substring(7);
    const aiPrompt = `
You are an expert educational AI that creates comprehensive learning roadmaps with rich content and resources.

IMPORTANT: You must respond with ONLY valid JSON. No explanations, no markdown, no additional text.

For the learning goal: "${prompt}" (Generated at ${timestamp}, Seed: ${randomSeed})

Create a UNIQUE roadmap specifically tailored to "${prompt}". Do NOT use generic content. Make sure all content is directly related to "${prompt}". This roadmap should be unique and different from any previous roadmaps. Use creative and varied approaches to teaching "${prompt}".

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
          "content": "# Introduction to [Topic]\\n\\n## Overview\\nDetailed explanation with examples, definitions, and practical applications.\\n\\n## Key Concepts\\n- **Concept 1**: Definition and explanation\\n- **Concept 2**: Definition and explanation\\n- **Concept 3**: Definition and explanation\\n\\n## Step-by-Step Guide\\n1. First step with detailed explanation\\n2. Second step with examples\\n3. Third step with practice exercises\\n\\n## Real-World Applications\\nExplain how this topic applies in real scenarios with specific examples.\\n\\n## Summary\\nKey takeaways and what students should remember.",
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
1. Create min 6 and maximum 10 stages that build upon each other, ALL specifically about "${prompt}"
2. Each stage should have 3 lessons, rich materials with actual content, and 5-10 quiz questions with explanations - ALL related to "${prompt}"
3. Position stages in a path: stage 1 at (2,0), stage 2 at (1,1), stage 3 at (3,1), stage 4 at (2,2), stage 5 at (1,3), stage 6 at (3,3)
4. Use these colors in order: "from-green-400 to-emerald-500", "from-blue-400 to-cyan-500", "from-purple-400 to-pink-500", "from-orange-400 to-red-500", "from-indigo-400 to-purple-500", "from-yellow-400 to-orange-500"
5. Include actual educational content in text materials (200+ words each) specifically about "${prompt}"
6. Suggest real YouTube video URLs when possible and they should exist otherwise leave it empty
7. Use random image URLs from picsum.photos with different random numbers with context to the lesson
8. Create a final quiz with 10 comprehensive questions about "${prompt}"
9. Ensure logical progression from beginner to advanced concepts in "${prompt}"
10. CRITICAL: Make sure every title, description, lesson, material, and quiz question is specifically about "${prompt}" and not generic content

Return ONLY the JSON object, nothing else.
`;

    const result = await model.generateContent(aiPrompt);
    const response = await result.response;
    const text = response.text();

    console.log("Raw AI response for prompt:", prompt);
    console.log("Response length:", text.length);
    console.log("First 200 chars:", text.substring(0, 200));

    try {
      // Clean the response by removing markdown code blocks
      let cleanedText = text.trim();

      // Remove ```json and ``` markers
      if (cleanedText.startsWith("```json")) {
        cleanedText = cleanedText
          .replace(/^```json\s*/, "")
          .replace(/\s*```$/, "");
      } else if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.replace(/^```\s*/, "").replace(/\s*```$/, "");
      }

      console.log("Cleaned roadmap response length:", cleanedText.length);
      console.log("First 200 chars of cleaned:", cleanedText.substring(0, 200));

      const roadmapData = JSON.parse(cleanedText);
      console.log("Parsed roadmap data keys:", Object.keys(roadmapData));

      // Return the stages array from the new structure
      const stages = roadmapData.stages || roadmapData;
      console.log("Returning stages count:", stages.length);
      return stages;
    } catch (parseError) {
      console.error("Failed to parse AI response for prompt:", prompt);
      console.error("Parse error:", parseError);
      console.error("Raw text:", text);
      console.log("Falling back to dynamic mock roadmap for:", prompt);
      return getMockRoadmap(prompt);
    }
  } catch (error) {
    console.error("Gemini AI error:", error);
    return getMockRoadmap(prompt);
  }
}

function getMockRoadmap(prompt: string): RoadmapStage[] {
  // Generate a dynamic roadmap based on the prompt
  const colors = [
    "from-green-400 to-emerald-500",
    "from-blue-400 to-cyan-500", 
    "from-purple-400 to-pink-500",
    "from-orange-400 to-red-500",
    "from-indigo-400 to-purple-500",
    "from-yellow-400 to-orange-500"
  ];

  const positions = [
    { x: 2, y: 0 },
    { x: 1, y: 1 },
    { x: 3, y: 1 },
    { x: 2, y: 2 },
    { x: 1, y: 3 },
    { x: 3, y: 3 }
  ];

  // Create 6 stages based on the prompt
  const stages: RoadmapStage[] = [];
  
  for (let i = 0; i < 6; i++) {
    stages.push({
      id: (i + 1).toString(),
      title: `Stage ${i + 1}`,
      description: `Learn about ${prompt} - Stage ${i + 1} content`,
      lessons: [
        `${prompt} Fundamentals`,
        `${prompt} Intermediate Concepts`,
        `${prompt} Advanced Topics`
      ],
      materials: [
        `Introduction to ${prompt}`,
        `${prompt} Practice Exercises`,
        `${prompt} Real-world Examples`
      ],
      quiz: [
        {
          question: `What is the main concept of ${prompt}?`,
          options: ["Option A", "Option B", "Option C", "Option D"],
          correct: 0,
        },
        {
          question: `How does ${prompt} work?`,
          options: ["Method 1", "Method 2", "Method 3", "Method 4"],
          correct: 1,
        }
      ],
      position: positions[i],
      color: colors[i]
    });
  }

  return stages;
}

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Get user session
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("Searching for similar roadmap for prompt:", prompt);
    const similarRoadmaps = await findSimilarRoadmaps(prompt);

    // Temporarily disable caching to ensure unique content generation
    console.log("Caching disabled - always generating new content for:", prompt);

    // Generate roadmap using Gemini AI
    console.log("Generating new roadmap with AI for prompt:", prompt);
    console.log("Timestamp:", new Date().toISOString());
    const roadmap = await generateRoadmapWithAI(prompt);
    console.log("Generated roadmap stages:", roadmap.length, "stages");

    try {
      const roadmapId = await storeRoadmap(prompt, roadmap);
      console.log("Successfully stored roadmap in vector database with ID:", roadmapId);
      
      return NextResponse.json({
        success: true,
        roadmap: {
          ...roadmap,
          id: roadmapId
        },
        roadmapId,
        prompt,
        cached: false,
        message: "Generated new roadmap",
      });
    } catch (storeError) {
      console.error("Failed to store roadmap in vector database:", storeError);

    return NextResponse.json({
      success: true,
      roadmap,
      prompt,
      cached: false,
        message: "Generated new roadmap (not cached)",
    });
    }
  } catch (error) {
    console.error("Error generating roadmap:", error);
    return NextResponse.json(
      { error: "Failed to generate roadmap" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Roadmap generation API is running",
    endpoints: {
      POST: "/api/roadmap/generate - Generate a new roadmap from a prompt",
    },
  });
}
