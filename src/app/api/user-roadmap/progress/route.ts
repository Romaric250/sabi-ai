import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(request: NextRequest) {
  try {
    const { roadmapId, stageId, isCompleted } = await request.json();

    if (!roadmapId || !stageId) {
      return NextResponse.json(
        { error: "roadmapId and stageId are required" },
        { status: 400 }
      );
    }

    // Get user session
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Find or create user roadmap
    let userRoadmap = await prisma.userRoadmap.findUnique({
      where: {
        userId_roadmapId: {
          userId,
          roadmapId,
        },
      },
    });

    if (!userRoadmap) {
      // Create new user roadmap if it doesn't exist
      userRoadmap = await prisma.userRoadmap.create({
        data: {
          userId,
          roadmapId,
          currentStage: 1,
          completedStages: [],
          progress: {
            startedAt: new Date().toISOString(),
            totalStages: 0,
            completedStages: [],
          },
        },
      });
    }

    // Update completed stages
    let completedStages = userRoadmap.completedStages || [];
    
    if (isCompleted) {
      // Add stage to completed stages if not already there
      const stageIndex = parseInt(stageId.replace('stage-', ''));
      if (!completedStages.includes(stageIndex)) {
        completedStages = [...completedStages, stageIndex];
      }
    } else {
      // Remove stage from completed stages
      const stageIndex = parseInt(stageId.replace('stage-', ''));
      completedStages = completedStages.filter(id => id !== stageIndex);
    }
    
    // Sort completed stages to ensure proper order
    completedStages = completedStages.sort((a, b) => a - b);

    // Get roadmap to calculate total stages
    const roadmap = await prisma.roadmap.findUnique({
      where: { id: roadmapId },
    });

    let totalStages = 0;
    if (roadmap && roadmap.content) {
      try {
        const content = typeof roadmap.content === 'string' 
          ? JSON.parse(roadmap.content) 
          : roadmap.content;
        totalStages = Array.isArray(content) ? content.length : 0;
      } catch (error) {
        console.error("Error parsing roadmap content:", error);
      }
    }

    // Calculate progress percentage with better precision
    let progressPercentage = 0;
    if (totalStages > 0) {
      const exactPercentage = (completedStages.length / totalStages) * 100;
      progressPercentage = Math.round(exactPercentage);
      
      // Ensure we don't exceed 100%
      if (progressPercentage > 100) {
        progressPercentage = 100;
      }
    }
    
    console.log('Progress calculation debug:', {
      roadmapId,
      stageId,
      completedStages,
      totalStages,
      progressPercentage,
      completedCount: completedStages.length,
      isCompleted
    });

    // Update user roadmap
    const updatedUserRoadmap = await prisma.userRoadmap.update({
      where: {
        userId_roadmapId: {
          userId,
          roadmapId,
        },
      },
      data: {
        completedStages,
        progress: {
          startedAt: (userRoadmap.progress as any)?.startedAt || new Date().toISOString(),
          totalStages,
          completedStages,
          progressPercentage,
          lastUpdated: new Date().toISOString(),
        },
        isCompleted: progressPercentage === 100,
        completedAt: progressPercentage === 100 ? new Date() : null,
        currentStage: Math.max(...completedStages, 0) + 1,
      },
    });

    return NextResponse.json({
      success: true,
      userRoadmap: updatedUserRoadmap,
      progress: {
        completed: completedStages.length,
        total: totalStages,
        percentage: progressPercentage,
      },
    });
  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roadmapId = searchParams.get('roadmapId');

    if (!roadmapId) {
      return NextResponse.json(
        { error: "roadmapId is required" },
        { status: 400 }
      );
    }

    // Get user session
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user roadmap progress
    const userRoadmap = await prisma.userRoadmap.findUnique({
      where: {
        userId_roadmapId: {
          userId,
          roadmapId,
        },
      },
    });

    if (!userRoadmap) {
      return NextResponse.json({
        progress: {
          completed: 0,
          total: 0,
          percentage: 0,
          completedStages: [],
        },
      });
    }

    return NextResponse.json({
      progress: {
        completed: userRoadmap.completedStages?.length || 0,
        total: (userRoadmap.progress as any)?.totalStages || 0,
        percentage: (userRoadmap.progress as any)?.progressPercentage || 0,      
        completedStages: userRoadmap.completedStages || [],
        isCompleted: userRoadmap.isCompleted,
      },
    });
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}
