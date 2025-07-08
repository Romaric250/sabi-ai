"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lock, 
  Trophy,
  Star,
  Sparkles,
  Crown
} from "lucide-react";
import { RoadmapStage } from "@/types/roadmap";

interface CandyCrushRoadmapProps {
  stages: RoadmapStage[];
  onStageClick?: (stage: RoadmapStage) => void;
}

// Helper: get points along an S-curve SVG path
function getSPathPoints(numPoints: number, width: number, height: number) {
  // S-curve: y = a * sin(bx + c) + d
  const points = [];
  const a = height / 3;
  const b = 2 * Math.PI / (numPoints - 1);
  const d = height / 2;
  for (let i = 0; i < numPoints; i++) {
    const x = (width / (numPoints - 1)) * i;
    const y = a * Math.sin(b * i) + d;
    points.push({ x, y });
  }
  return points;
}

const STAGE_RADIUS = 32;
const SVG_WIDTH = 700;
const SVG_HEIGHT = 260;

const CandyStage = ({
  stage,
  index,
  pos,
  isUnlocked,
  isCompleted,
  onClick,
}: {
  stage: RoadmapStage;
  index: number;
  pos: { x: number; y: number };
  isUnlocked: boolean;
  isCompleted: boolean;
  onClick: () => void;
}) => {
  return (
    <g
      style={{ cursor: isUnlocked ? "pointer" : "not-allowed" }}
      onClick={isUnlocked ? onClick : undefined}
    >
      {/* Glow for current stage */}
      {isUnlocked && !isCompleted && (
        <circle
          cx={pos.x}
          cy={pos.y}
          r={STAGE_RADIUS + 10}
          fill="url(#glow)"
          opacity={0.5}
        />
      )}
      {/* Stage circle */}
      <motion.circle
        cx={pos.x}
        cy={pos.y}
        r={STAGE_RADIUS}
        fill={
          isCompleted
            ? "url(#completed)"
            : isUnlocked
            ? "url(#unlocked)"
            : "#e5e7eb"
        }
        stroke={isUnlocked ? "#a21caf" : "#d1d5db"}
        strokeWidth={4}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.08 }}
      />
      {/* Stage number */}
      <text
        x={pos.x}
        y={pos.y + 8}
        textAnchor="middle"
        fontSize="1.5rem"
        fontWeight="bold"
        fill={isUnlocked ? "#fff" : "#a3a3a3"}
        style={{ pointerEvents: "none" }}
      >
        {index + 1}
      </text>
      {/* Crown for current, trophy for completed, lock for locked */}
      {isCompleted ? (
        <Trophy x={pos.x - 14} y={pos.y - 38} width={28} height={28} color="#fbbf24" />
      ) : isUnlocked ? (
        <Crown x={pos.x - 14} y={pos.y - 38} width={28} height={28} color="#fbbf24" />
      ) : (
        <Lock x={pos.x - 14} y={pos.y - 38} width={28} height={28} color="#a3a3a3" />
      )}
      {/* Sparkles for completed */}
      {isCompleted && (
        <Sparkles x={pos.x + 18} y={pos.y - 38} width={20} height={20} color="#fde68a" />
      )}
      {/* Stage title on hover */}
      <title>{stage.title}</title>
    </g>
  );
};

export default function CandyCrushRoadmap({ stages, onStageClick }: CandyCrushRoadmapProps) {
  const [completedStages, setCompletedStages] = useState(0);

  useEffect(() => {
    setCompletedStages(stages.filter((s) => s.isCompleted).length);
  }, [stages]);

  // S-curve points for each stage
  const points = getSPathPoints(stages.length, SVG_WIDTH - 60, SVG_HEIGHT - 40).map((pt) => ({
    x: pt.x + 30,
    y: pt.y + 20,
  }));

  // SVG path string
  const pathD = points.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = arr[i - 1];
    const mx = (prev.x + pt.x) / 2;
    const my = (prev.y + pt.y) / 2;
    return acc + ` Q ${mx} ${my}, ${pt.x} ${pt.y}`;
  }, "");

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Playful background */}
      <div className="absolute inset-0 -z-10">
        <svg width="100%" height="100%" viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}>
          <defs>
            <linearGradient id="unlocked" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#a21caf" />
              <stop offset="100%" stopColor="#f472b6" />
            </linearGradient>
            <linearGradient id="completed" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e42" />
            </linearGradient>
            <radialGradient id="glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f472b6" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#a21caf" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Soft background shapes */}
          <ellipse cx={SVG_WIDTH/2} cy={SVG_HEIGHT/2} rx={SVG_WIDTH/2.2} ry={SVG_HEIGHT/2.5} fill="#f3e8ff" />
          <ellipse cx={SVG_WIDTH/3} cy={SVG_HEIGHT/1.5} rx={80} ry={30} fill="#fef9c3" />
          <ellipse cx={SVG_WIDTH/1.3} cy={SVG_HEIGHT/2.2} rx={60} ry={22} fill="#bbf7d0" />
        </svg>
      </div>
      {/* Area banner */}
      <div className="mb-2">
        <span className="inline-block bg-yellow-100 text-yellow-700 font-bold px-6 py-2 rounded-full shadow text-lg tracking-wide border border-yellow-300">
          Lemonade Lake
        </span>
      </div>
      {/* SVG Path and Stages */}
      <svg
        width={SVG_WIDTH}
        height={SVG_HEIGHT}
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        className="block mx-auto"
      >
        {/* Striped path */}
        <path
          d={pathD}
          stroke="#fbbf24"
          strokeWidth={14}
          fill="none"
          strokeDasharray="16,10"
          opacity={0.7}
        />
        {/* White path overlay for highlight */}
        <path
          d={pathD}
          stroke="#fff"
          strokeWidth={6}
          fill="none"
          strokeDasharray="8,8"
          opacity={0.7}
        />
        {/* Stage nodes */}
        {stages.map((stage, i) => (
          <CandyStage
            key={stage.id}
            stage={stage}
            index={i}
            pos={points[i]}
            isUnlocked={stage.isUnlocked || i === 0}
            isCompleted={stage.isCompleted}
            onClick={() => onStageClick && onStageClick(stage)}
          />
        ))}
      </svg>
      {/* Progress bar */}
      <div className="w-full max-w-md mx-auto mt-6">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-500">{completedStages}/{stages.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(completedStages / stages.length) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
          />
        </div>
      </div>
      {/* Level completion celebration */}
      <AnimatePresence>
        {completedStages === stages.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-8 text-center shadow-2xl"
            >
              <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-black mb-2">🎉 Congratulations! 🎉</h3>
              <p className="text-gray-600 mb-4">You've completed all stages!</p>
              <div className="flex items-center justify-center space-x-2">
                <Star className="w-6 h-6 text-yellow-500" />
                <span className="text-lg font-semibold text-black">{stages.length} stages mastered</span>
                <Star className="w-6 h-6 text-yellow-500" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
