import React from "react";
import { ReactFlow, Background, MarkerType, Edge, Node } from "@xyflow/react";
import { RoadmapStage } from "@/types/roadmap";
import "@xyflow/react/dist/style.css";

interface StagesProps {
  stages?: RoadmapStage[];
  onStageClick?: (stage: RoadmapStage) => void;
}

type NodeData = {
  [key: string]: unknown;
  label: string;
  stage: RoadmapStage;
};

export default function Stages({ stages = [], onStageClick }: StagesProps) {
  const nodes = stages.map((stage) => ({
    id: stage.id,
    type: "default",
    position: {
      x: (stage.position?.x || 0) * 200,
      y: (stage.position?.y || 0) * 200,
    },
    data: {
      label: stage.title,
      stage: stage,
    } as NodeData,
    style: {
      //   background: stage.isUnlocked ? "red" : "blue",
      color: stage.isUnlocked ? "black" : "#555",
      border: "none",
      borderRadius: "8px",
      padding: "10px",
      width: 180,
      //   opacity: stage.isUnlocked ? 1 : 0.5,
      cursor: stage.isUnlocked ? "pointer" : "not-allowed",
    },
  }));

  const edges = stages.reduce<Edge[]>((acc, stage, index) => {
    if (index === stages.length - 1) return acc;
    const nextStage = stages[index + 1];

    acc.push({
      id: `${stage.id}->${nextStage.id}`,
      source: stage.id,
      target: nextStage.id,
      type: "default",
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
      style: {
        strokeWidth: 1,
        stroke: stage.isUnlocked ? "#777" : "#999",
      },
      animated: stage.isUnlocked,
    });

    return acc;
  }, []);

  const handleNodeClick = (event: React.MouseEvent, node: Node) => {
    const nodeData = node.data as NodeData;
    if (onStageClick && nodeData.stage) {
      onStageClick(nodeData.stage);
    }
  };

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={handleNodeClick}
        fitView
        className="bg-gray-100!"
      >
        <Background color="#333" gap={20} size={1} />
      </ReactFlow>
    </div>
  );
}
