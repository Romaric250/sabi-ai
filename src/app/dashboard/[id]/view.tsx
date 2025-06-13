"use client";

import { RoadmapData, RoadmapStage } from "@/types/roadmap";
import React, { useState } from "react";
import Stages from "@/components/stages";
import { transformRoadmap } from "@/lib/transform";

interface ViewProps {
  roadmap: RoadmapStage[];
}

const View = ({ roadmap }: ViewProps) => {
  const [selectedStage, setSelectedStage] = useState<RoadmapStage | null>(null);

  const transformedRoadmap = transformRoadmap({
    roadmap,
  });

  console.log(transformedRoadmap);

  const handleStageClick = (stage: RoadmapStage) => {
    setSelectedStage(stage);
  };

  const handleStageComplete = (stage: RoadmapStage) => {
    console.log(stage);
  };

  return (
    <div>
      <Stages
        stages={transformedRoadmap.roadmap}
        onStageClick={handleStageClick}
      />
    </div>
  );
};

export default View;
