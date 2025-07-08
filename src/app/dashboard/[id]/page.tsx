"use client";

import { useState, useEffect } from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { User, BookOpen, Target, CheckCircle } from "lucide-react";
import RoadmapFlow from "@/components/RoadmapFlow";
import { StageModal } from "@/components/StageModal";
import { RoadmapStage } from "@/types/roadmap";

export default function DashboardRoadmapPage({ params }: { params: { id: string } }) {
  const [selectedStage, setSelectedStage] = useState<RoadmapStage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roadmap, setRoadmap] = useState<any>(null);
  const [transformedStages, setTransformedStages] = useState<RoadmapStage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch roadmap data
  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const response = await fetch(`/api/roadmap/${params.id}`);
        if (response.ok) {
          const roadmapData = await response.json();
          setRoadmap(roadmapData);
          
          // Parse the roadmap content to get stages
          const roadmapContent = roadmapData.content as any;
          
          // Handle different possible data structures
          let stages: any[] = [];
          if (Array.isArray(roadmapContent)) {
            stages = roadmapContent;
          } else if (roadmapContent && typeof roadmapContent === 'object') {
            const keys = Object.keys(roadmapContent);
            if (keys.every(key => !isNaN(Number(key)))) {
              stages = Object.values(roadmapContent);
            } else if (roadmapContent?.roadmap && Array.isArray(roadmapContent.roadmap)) {
              stages = roadmapContent.roadmap;
            } else if (roadmapContent?.stages && Array.isArray(roadmapContent.stages)) {
              stages = roadmapContent.stages;
            }
          }
          
          // Transform stages to include proper position data and unlock status
          const transformed = stages.map((stage: any, index: number) => ({
            ...stage,
            isUnlocked: index === 0 || stage.isUnlocked || false,
            isCompleted: stage.isCompleted || false,
            position: stage.position || { x: index * 2, y: index },
          }));
          
          setTransformedStages(transformed);
        }
      } catch (error) {
        console.error("Error fetching roadmap:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoadmap();
  }, [params.id]);

  const handleStageClick = (stage: RoadmapStage) => {
    setSelectedStage(stage);
    setIsModalOpen(true);
  };

  const handleStageComplete = (stageId: string) => {
    setTransformedStages(prev => 
      prev.map(stage => {
        if (stage.id === stageId) {
          return { ...stage, isCompleted: true };
        }
        // Unlock next stage
        if (stage.id === String(parseInt(stageId) + 1)) {
          return { ...stage, isUnlocked: true };
        }
        return stage;
      })
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!roadmap) {
    return notFound();
  }

  // Calculate progress based on completed stages
  const completedStages = transformedStages.filter((stage: any) => stage.isCompleted).length;
  const progress = transformedStages.length > 0 ? Math.round((completedStages / transformedStages.length) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-black to-gray-700 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-black">{roadmap.prompt}</h1>
            <p className="text-gray-600">Your personalized learning journey</p>
          </div>
        </div>
        
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-black to-gray-700 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{completedStages} of {transformedStages.length} stages completed</span>
            <span>{transformedStages.length - completedStages} remaining</span>
          </div>
        </div>
      </div>

      {/* ReactFlow Roadmap */}
      <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-black mb-2">Learning Path</h2>
          <p className="text-sm text-gray-600">
            Click on unlocked stages to start learning. Use the controls to zoom and navigate.
          </p>
        </div>
        
        <RoadmapFlow 
          stages={transformedStages}
          onStageClick={handleStageClick}
        />
      </div>

      {/* Stage Modal */}
      <StageModal
        stage={selectedStage}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStage(null);
        }}
        onComplete={handleStageComplete}
      />

      {/* Empty State */}
      {transformedStages.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-black mb-2">No stages available</h3>
          <p className="text-gray-500">This roadmap doesn't have any stages yet.</p>
        </div>
      )}
    </div>
  );
}
