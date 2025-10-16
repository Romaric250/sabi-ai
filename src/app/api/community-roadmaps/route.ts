import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    const currentUserId = session?.user?.id;

    // Fetch public roadmaps from other users (excluding current user's roadmaps)
    const communityRoadmaps = await prisma.roadmap.findMany({
      where: {
        // Exclude current user's roadmaps if authenticated
        ...(currentUserId ? { userId: { not: currentUserId } } : {}),
        // Only include roadmaps that have content
        content: { not: null as any },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        userRoadmaps: {
          select: {
            id: true,
            userId: true,
            progress: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20, // Limit to 20 most recent community roadmaps
    });

    // Transform the data to include useful information
    const transformedRoadmaps = communityRoadmaps.map(roadmap => {
      let stages = [];
      let totalStages = 0;
      
      try {
        stages = typeof roadmap.content === 'string' 
          ? JSON.parse(roadmap.content) 
          : roadmap.content;
        totalStages = Array.isArray(stages) ? stages.length : 0;
      } catch (error) {
        console.error("Error parsing roadmap content:", error);
      }

      return {
        id: roadmap.id,
        title: roadmap.prompt,
        description: `Learn ${roadmap.prompt} with ${totalStages} comprehensive stages`,
        difficulty: totalStages > 8 ? 'Advanced' : totalStages > 5 ? 'Intermediate' : 'Beginner',
        stages: totalStages,
        creator: roadmap.user?.name || roadmap.user?.email?.split('@')[0] || 'Anonymous',
        createdAt: roadmap.createdAt,
        updatedAt: roadmap.updatedAt,
        totalLearners: roadmap.userRoadmaps.length,
        // Include the original roadmap data for duplication
        originalRoadmap: {
          id: roadmap.id,
          prompt: roadmap.prompt,
          content: roadmap.content,
          userId: roadmap.userId,
        },
      };
    });

    return NextResponse.json(transformedRoadmaps);
  } catch (error) {
    console.error("Error fetching community roadmaps:", error);
    return NextResponse.json(
      { error: "Failed to fetch community roadmaps" },
      { status: 500 }
    );
  }
}
