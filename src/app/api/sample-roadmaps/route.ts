import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Return static sample roadmaps for now (database-independent)
    const sampleRoadmaps = [
      {
        id: "sample-1",
        title: "Algebra Fundamentals",
        description: "Master algebraic concepts from basic equations to advanced functions",
        stages: 6,
        duration: "8-10 weeks",
        difficulty: "Beginner",
        color: "from-blue-400 to-cyan-500",
        icon: "📐",
        topics: ["Linear Equations", "Quadratic Functions", "Polynomials"],
        learners: "24.8k"
      },
      {
        id: "sample-2",
        title: "Biology: Cell Structure & Function",
        description: "Explore the fundamental unit of life and cellular processes",
        stages: 7,
        duration: "6-8 weeks",
        difficulty: "Intermediate",
        color: "from-green-400 to-emerald-500",
        icon: "🧬",
        topics: ["Cell Theory", "Organelles", "Cell Membrane"],
        learners: "18.5k"
      },
      {
        id: "sample-3",
        title: "World History: Ancient Civilizations",
        description: "Journey through the rise and fall of ancient empires",
        stages: 8,
        duration: "10-12 weeks",
        difficulty: "Intermediate",
        color: "from-amber-400 to-orange-500",
        icon: "🏛️",
        topics: ["Mesopotamia", "Ancient Egypt", "Greek Empire"],
        learners: "16.2k"
      }
    ];

    return NextResponse.json(sampleRoadmaps);
  } catch (error) {
    console.error('Error fetching sample roadmaps:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sample roadmaps' },
      { status: 500 }
    );
  }
}


