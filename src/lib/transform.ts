import { RoadmapData, RoadmapStage } from "@/types/roadmap";
import { Brain, Sparkles, Star, Trophy, Zap } from "lucide-react";

export const transformRoadmap = (roadmap: RoadmapData) => {
  console.log(roadmap);

  const stages = roadmap.roadmap;

  const transformedRoadmap = stages.map(
    (stage: RoadmapStage, index: number) => ({
      ...stage,
      isUnlocked: index === 0,
      isCompleted: false,
      icon: [Zap, Brain, Sparkles, Star, Trophy, Brain][index % 6] || Brain,
    })
  );

  return {
    ...roadmap,
    roadmap: transformedRoadmap,
  };
};
