"use client";

import Stages from "@/components/stages";
import { StageSheet } from "@/components/StageSheet";
import { transformRoadmap } from "@/lib/transform";
import { RoadmapStage } from "@/types/roadmap";
import { useState } from "react";

interface ViewProps {
  roadmap: RoadmapStage[];
}

const View = ({ roadmap }: ViewProps) => {
  const transformedRoadmap = transformRoadmap({
    roadmap,
  });
  const [selectedStage, setSelectedStage] = useState<RoadmapStage | null>(null);
  const [roadmapStages, setRoadmapStages] = useState<RoadmapStage[]>(
    transformedRoadmap.roadmap
  );

  const handleSelectStage = (stage: RoadmapStage) => {
    if (stage.isUnlocked) {
      setSelectedStage(stage);
    }
  };

  const handleStageComplete = (stageId: string) => {
    setRoadmapStages((prev) =>
      prev.map((stage) => {
        if (stage.id === stageId) {
          return { ...stage, isCompleted: true };
        }

        if (stage.id === String(parseInt(stageId) + 1)) {
          return { ...stage, isUnlocked: true };
        }
        return stage;
      })
    );
    setSelectedStage(null);
    console.log(`Stage ${stageId} completed! Next stage unlocked.`);
  };

  return (
    <div>
      <Stages stages={roadmapStages} onStageClick={handleSelectStage} />

      {selectedStage && (
        <StageSheet
          stage={selectedStage}
          isOpen={!!selectedStage}
          onClose={() => setSelectedStage(null)}
          onComplete={handleStageComplete}
        />
      )}
    </div>
  );
};

export default View;
