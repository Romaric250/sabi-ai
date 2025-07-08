"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { RoadmapStage } from "@/types/roadmap";
import CandyCrushRoadmap from "@/components/CandyCrushRoadmap";
import { StageModal } from "@/components/StageModal";

interface RoadmapData {
  id: string;
  title: string;
  content: RoadmapStage[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export default function RoadmapPage() {
  const params = useParams();
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [stages, setStages] = useState<RoadmapStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStage, setSelectedStage] = useState<RoadmapStage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const response = await fetch(`/api/roadmap/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setRoadmap(data);
          
          // Parse and process stages
          let parsedStages: RoadmapStage[] = [];
          
          if (data.content && typeof data.content === 'string') {
            try {
              const content = JSON.parse(data.content);
              parsedStages = Array.isArray(content) ? content : [];
            } catch (e) {
              console.error('Error parsing roadmap content:', e);
              parsedStages = [];
            }
          } else if (data.content && Array.isArray(data.content)) {
            parsedStages = data.content;
          } else if (data.content && typeof data.content === 'object') {
            // Handle object with numeric keys
            const contentObj = data.content as Record<string, any>;
            parsedStages = Object.keys(contentObj)
              .filter(key => !isNaN(Number(key)))
              .sort((a, b) => Number(a) - Number(b))
              .map(key => contentObj[key]);
          }

          // Process stages to add required properties
          const processedStages = parsedStages.map((stage, index) => ({
            ...stage,
            id: stage.id || `stage-${index}`,
            isUnlocked: index === 0 || stage.isUnlocked || false,
            isCompleted: stage.isCompleted || false,
            position: stage.position || { x: index % 3, y: Math.floor(index / 3) },
            color: stage.color || "from-purple-500 to-blue-500",
            icon: stage.icon || "Star"
          }));

          setStages(processedStages);
        }
      } catch (error) {
        console.error('Error fetching roadmap:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchRoadmap();
    }
  }, [params.id]);

  const handleStageClick = (stage: RoadmapStage) => {
    setSelectedStage(stage);
    setIsModalOpen(true);
  };

  const handleStageComplete = (stageId: string) => {
    setStages(prevStages => 
      prevStages.map(stage => 
        stage.id === stageId 
          ? { ...stage, isCompleted: true }
          : stage
      )
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black mb-4">Roadmap Not Found</h2>
          <p className="text-gray-600">The requested roadmap could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">{roadmap.title}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Embark on your learning journey through interactive stages designed to guide you step by step.
          </p>
        </div>

        {/* Candy Crush Roadmap */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <CandyCrushRoadmap 
            stages={stages} 
            onStageClick={handleStageClick}
          />
        </div>

        {/* Stage Modal */}
        {selectedStage && (
          <StageModal
            stage={selectedStage}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedStage(null);
            }}
            onComplete={handleStageComplete}
          />
        )}
      </div>
    </div>
  );
}
