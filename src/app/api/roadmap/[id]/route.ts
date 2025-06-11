import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const roadmapId = params.id;

    const roadmap = await prisma.roadmap.findUnique({
      where: { id: roadmapId },
      include: {
        userRoadmaps: {
          select: {
            userId: true,
            progress: true,
            currentStage: true,
            completedStages: true,
            isCompleted: true
          }
        }
      }
    });

    if (!roadmap) {
      return NextResponse.json(
        { error: 'Roadmap not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(roadmap);
  } catch (error) {
    console.error('Error fetching roadmap:', error);
    return NextResponse.json(
      { error: 'Failed to fetch roadmap' },
      { status: 500 }
    );
  }
}
