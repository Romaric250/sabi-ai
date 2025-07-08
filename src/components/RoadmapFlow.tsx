"use client";

import { useCallback, useMemo } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  NodeTypes,
} from "reactflow";
import "reactflow/dist/style.css";
import { RoadmapStage } from "@/types/roadmap";
import { CheckCircle, Lock, Play, Target } from "lucide-react";

interface RoadmapFlowProps {
  stages: RoadmapStage[];
  onStageClick?: (stage: RoadmapStage) => void;
}

// Custom node component for roadmap stages
const RoadmapNode = ({ data }: { data: any }) => {
  const { stage, isCompleted, isUnlocked } = data;

  return (
    <div className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
      isCompleted 
        ? 'bg-green-50 border-green-300 shadow-lg' 
        : isUnlocked 
        ? 'bg-white border-gray-300 hover:border-gray-400 hover:shadow-lg cursor-pointer' 
        : 'bg-gray-50 border-gray-200'
    }`}>
      {/* Stage number */}
      <div className={`absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
        isCompleted 
          ? 'bg-green-500 text-white' 
          : isUnlocked 
          ? 'bg-black text-white' 
          : 'bg-gray-300 text-gray-600'
      }`}>
        {isCompleted ? (
          <CheckCircle className="w-4 h-4" />
        ) : (
          stage.id
        )}
      </div>

      {/* Stage content */}
      <div className="pt-2">
        <h3 className="font-semibold text-black mb-2 text-sm">
          {stage.title}
        </h3>
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {stage.description}
        </p>
        
        {/* Stage info */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1 text-gray-500">
            <Target className="w-3 h-3" />
            <span>{stage.lessons?.length || 0} lessons</span>
          </div>
          
          {isCompleted ? (
            <span className="text-green-600 font-medium">Completed</span>
          ) : isUnlocked ? (
            <div className="flex items-center space-x-1 text-black">
              <Play className="w-3 h-3" />
              <span>Start</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 text-gray-400">
              <Lock className="w-3 h-3" />
              <span>Locked</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const nodeTypes: NodeTypes = {
  roadmapNode: RoadmapNode,
};

export default function RoadmapFlow({ stages, onStageClick }: RoadmapFlowProps) {
  // Convert stages to ReactFlow nodes
  const initialNodes: Node[] = useMemo(() => {
    return stages.map((stage, index) => ({
      id: stage.id,
      type: "roadmapNode",
      position: { x: stage.position.x * 200, y: stage.position.y * 150 },
      data: {
        stage,
        isCompleted: stage.isCompleted || false,
        isUnlocked: stage.isUnlocked || index === 0,
      },
      draggable: false,
    }));
  }, [stages]);

  // Create edges between stages
  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];
    
    for (let i = 0; i < stages.length - 1; i++) {
      const currentStage = stages[i];
      const nextStage = stages[i + 1];
      
      edges.push({
        id: `edge-${currentStage.id}-${nextStage.id}`,
        source: currentStage.id,
        target: nextStage.id,
        type: "smoothstep",
        style: {
          stroke: currentStage.isCompleted ? "#10b981" : "#d1d5db",
          strokeWidth: 2,
        },
        animated: currentStage.isCompleted,
      });
    }
    
    return edges;
  }, [stages]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      const stage = node.data.stage;
      const isUnlocked = node.data.isUnlocked;
      
      if (isUnlocked && onStageClick) {
        onStageClick(stage);
      }
    },
    [onStageClick]
  );

  return (
    <div className="w-full h-[600px] bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        className="bg-transparent"
      >
        <Background color="#e5e7eb" gap={20} />
        <Controls 
          showZoom={true}
          showFitView={true}
          showInteractive={false}
          className="bg-white border border-gray-200 rounded-lg shadow-sm"
        />
      </ReactFlow>
    </div>
  );
} 