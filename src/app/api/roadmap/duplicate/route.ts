import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createHash } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { roadmapId } = await request.json();

    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Find the original roadmap
    const originalRoadmap = await prisma.roadmap.findUnique({
      where: { id: roadmapId },
    });

    if (!originalRoadmap) {
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
    }

    // Don't allow users to duplicate their own roadmaps
    if (originalRoadmap.userId === userId) {
      return NextResponse.json({ error: "Cannot duplicate your own roadmap" }, { status: 400 });
    }

    // Parse the original roadmap content to get stages
    let stages = [];
    try {
      stages = typeof originalRoadmap.content === 'string' 
        ? JSON.parse(originalRoadmap.content) 
        : originalRoadmap.content;
    } catch (error) {
      console.error("Error parsing roadmap content:", error);
      return NextResponse.json({ error: "Invalid roadmap content" }, { status: 400 });
    }

    // Generate a unique prompt hash for the duplicated roadmap
    const duplicatedPrompt = `${originalRoadmap.prompt} (Copy)`;
    const promptHash = createHash('sha256').update(duplicatedPrompt).digest('hex');

    // Create a new roadmap for the user based on the original
    const newRoadmap = await prisma.roadmap.create({
      data: {
        prompt: duplicatedPrompt,
        promptHash: promptHash,
        content: originalRoadmap.content as any,
        userId: userId,
      },
    });

    // Create a user roadmap entry
    const userRoadmap = await prisma.userRoadmap.create({
      data: {
        userId: userId,
        roadmapId: newRoadmap.id,
        currentStage: 1,
        completedStages: [],
        progress: {
          startedAt: new Date().toISOString(),
          totalStages: Array.isArray(stages) ? stages.length : 0,
          completedStages: [],
          percentage: 0,
        },
      },
    });

    return NextResponse.json({
      success: true,
      roadmap: {
        ...newRoadmap,
        id: newRoadmap.id,
      },
      roadmapId: newRoadmap.id,
    });
  } catch (error) {
    console.error("Error duplicating roadmap:", error);
    return NextResponse.json(
      { error: "Failed to duplicate roadmap" },
      { status: 500 }
    );
  }
}
