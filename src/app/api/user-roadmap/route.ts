import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TempAuth } from '@/lib/temp-auth';

export async function POST(request: NextRequest) {
  try {
    const { roadmapId } = await request.json();
    
    // Get user from session
    const token = request.cookies.get('session-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const sessionData = await TempAuth.getSession(token);
    if (!sessionData) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const userId = sessionData.user.id;

    // Check if user roadmap already exists
    let userRoadmap = await prisma.userRoadmap.findUnique({
      where: {
        userId_roadmapId: {
          userId,
          roadmapId
        }
      },
      include: {
        roadmap: true
      }
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
            totalStages: 0
          }
        },
        include: {
          roadmap: true
        }
      });
    }

    return NextResponse.json({
      userRoadmap,
      roadmap: userRoadmap.roadmap
    });
  } catch (error) {
    console.error('Error creating/getting user roadmap:', error);
    return NextResponse.json(
      { error: 'Failed to process user roadmap' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get user from session
    const token = request.cookies.get('session-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const sessionData = await TempAuth.getSession(token);
    if (!sessionData) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const userId = sessionData.user.id;

    // Get all user roadmaps
    const userRoadmaps = await prisma.userRoadmap.findMany({
      where: { userId },
      include: {
        roadmap: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return NextResponse.json(userRoadmaps);
  } catch (error) {
    console.error('Error fetching user roadmaps:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user roadmaps' },
      { status: 500 }
    );
  }
}
