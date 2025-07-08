import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { roadmapId } = await request.json();

    // Get user from session
    const token = request.cookies.get("session-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const sessionData = await auth.api.getSession({
      headers: request.headers,
    });
    if (!sessionData) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const userId = sessionData.user.id;

    // Check if user roadmap already exists
    let userRoadmap = await prisma.userRoadmap.findUnique({
      where: {
        userId_roadmapId: {
          userId,
          roadmapId,
        },
      },
      include: {
        roadmap: true,
      },
    });

    // If doesn't exist, create it
    if (!userRoadmap) {
      userRoadmap = await prisma.userRoadmap.create({
        data: {
          userId,
          roadmapId,
          currentStage: 1,
          completedStages: [],
          progress: {
            startedAt: new Date().toISOString(),
            totalStages: 0,
          },
        },
        include: {
          roadmap: true,
        },
      });
    }

    return NextResponse.json({
      userRoadmap,
      roadmap: userRoadmap.roadmap,
    });
  } catch (error) {
    console.error("Error creating/getting user roadmap:", error);
    return NextResponse.json(
      { error: "Failed to process user roadmap" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionUserId = session.user.id;

    const roadmaps = await prisma.roadmap.findMany({
      where: {
        userId: sessionUserId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(roadmaps);
  } catch (error) {
    console.error("Error fetching roadmaps:", error);
    return NextResponse.json(
      { error: "Failed to fetch roadmaps" },
      { status: 500 }
    );
  }
}
