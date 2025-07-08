"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { 
  Lock, 
  Trophy,
  Star,
  Sparkles,
  Crown
} from "lucide-react";
import { RoadmapStage } from "@/types/roadmap";
import React from "react";

interface CandyCrushRoadmapProps {
  stages: RoadmapStage[];
  onStageClick?: (stage: RoadmapStage) => void;
}

// Helper: get points for an organic, winding 'candy river' path
function getOrganicPathPoints(numPoints: number, width: number, height: number) {
  // Use a combination of sine, cosine, and random offsets for organic feel
  const points = [];
  const a = height / 2.5;
  const b = 2 * Math.PI / (numPoints - 1);
  const d = height / 2;
  for (let i = 0; i < numPoints; i++) {
    const x = (width / (numPoints - 1)) * i;
    // Add playful bends and random vertical offset
    const y = a * Math.sin(b * i) + d + Math.cos(b * i * 1.5) * 30 + (i % 2 === 0 ? 18 : -18);
    points.push({ x, y });
  }
  return points;
}

// Helper: get SVG path for a variable-width river
function getOrganicRiverPath(points: { x: number; y: number }[], width: number) {
  // Create a path for the top edge and a mirrored path for the bottom edge
  const riverWidth = 80;
  let top = '', bottom = '';
  for (let i = 0; i < points.length; i++) {
    const angle = i === 0 ? 0 : Math.atan2(points[i].y - points[i-1].y, points[i].x - points[i-1].x);
    const dx = Math.sin(angle) * riverWidth;
    const dy = -Math.cos(angle) * riverWidth;
    const tx = points[i].x + dx;
    const ty = points[i].y + dy;
    const bx = points[i].x - dx;
    const by = points[i].y - dy;
    if (i === 0) {
      top = `M ${tx} ${ty}`;
      bottom = `L ${bx} ${by}`;
    } else {
      top += ` Q ${(tx + points[i-1].x + Math.sin(angle) * riverWidth) / 2} ${(ty + points[i-1].y + -Math.cos(angle) * riverWidth) / 2}, ${tx} ${ty}`;
      bottom = `Q ${(bx + points[i-1].x - Math.sin(angle) * riverWidth) / 2} ${(by + points[i-1].y + Math.cos(angle) * riverWidth) / 2}, ${bx} ${by} ` + bottom;
    }
  }
  return `${top} ${bottom} Z`;
}

const STAGE_RADIUS = 54; // Bigger balls
const SVG_WIDTH = 2200;
const SVG_HEIGHT = 500;

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
      {/* Glossy, glowing effect for current stage */}
      {isUnlocked && !isCompleted && (
        <motion.circle
          cx={pos.x}
          cy={pos.y}
          r={STAGE_RADIUS + 22}
          fill="url(#stage-glow)"
          opacity={0.7}
          animate={{ opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: 'loop' }}
        />
      )}
      {/* Main stage ball with glossy effect */}
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
        stroke={isUnlocked ? "#111" : "#bbb"}
        strokeWidth={6}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.08 }}
        filter={isUnlocked ? "url(#candyShadow)" : ""}
      />
      {/* Glossy highlight */}
      <ellipse
        cx={pos.x - STAGE_RADIUS / 3}
        cy={pos.y - STAGE_RADIUS / 3}
        rx={STAGE_RADIUS / 2.2}
        ry={STAGE_RADIUS / 4}
        fill="#fff"
        opacity={isUnlocked ? 0.18 : 0.08}
      />
      {/* Stage number */}
      <text
        x={pos.x}
        y={pos.y + 16}
        textAnchor="middle"
        fontSize="2.6rem"
        fontWeight="bold"
        fill={isUnlocked ? "#fff" : "#888"}
        style={{ pointerEvents: "none", textShadow: "0 2px 8px #0002" }}
      >
        {index + 1}
      </text>
      {/* Crown for current, trophy for completed, lock for locked */}
      {isCompleted ? (
        <Trophy x={pos.x - 22} y={pos.y - 68} width={44} height={44} color="#111" />
      ) : isUnlocked ? (
        <Crown x={pos.x - 22} y={pos.y - 68} width={44} height={44} color="#111" />
      ) : (
        <Lock x={pos.x - 22} y={pos.y - 68} width={44} height={44} color="#bbb" />
      )}
      {/* Sparkles for completed */}
      {isCompleted && (
        <Sparkles x={pos.x + 32} y={pos.y - 68} width={32} height={32} color="#bbb" />
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

  // Organic, winding path points for each stage
  const points = getOrganicPathPoints(stages.length, SVG_WIDTH - 60, SVG_HEIGHT - 40).map((pt) => ({
    x: pt.x + 30,
    y: pt.y + 20,
  }));

  // Organic river path
  const riverPath = getOrganicRiverPath(points, SVG_WIDTH);

  // SVG path string for stage connectors (centerline)
  const pathD = points.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = arr[i - 1];
    const mx = (prev.x + pt.x) / 2;
    const my = (prev.y + pt.y) / 2;
    return acc + ` Q ${mx} ${my}, ${pt.x} ${pt.y}`;
  }, "");

  // Animate path progress
  const progressLength = (completedStages / stages.length) * 1.0;

  return (
    <div className="relative w-full h-[70vh] min-h-[400px] flex flex-col items-center overflow-hidden">
      {/* Area banner (can be animated later) */}
      <div className="mb-2 z-10">
        <span className="inline-block bg-white text-black font-bold px-8 py-3 rounded-full shadow text-2xl tracking-wide border border-black/10 animate-bounce">
          Lemonade Lake
        </span>
      </div>
      {/* Zoom/Pan Wrapper */}
      <div className="w-full h-full flex-1">
        <TransformWrapper
          minScale={0.4}
          maxScale={2.5}
          initialScale={0.7}
          wheel={{ step: 0.1 }}
          doubleClick={{ disabled: true }}
          panning={{ velocityDisabled: true, disabled: false, lockAxisX: false, lockAxisY: false }}
        >
          <TransformComponent>
            <svg
              width={SVG_WIDTH}
              height={SVG_HEIGHT}
              viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
              className="block mx-auto"
              style={{ background: "none" }}
            >
              <defs>
                <linearGradient id="unlocked" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#222" />
                  <stop offset="100%" stopColor="#fff" />
                </linearGradient>
                <linearGradient id="completed" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fff" />
                  <stop offset="100%" stopColor="#bbb" />
                </linearGradient>
                <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fff" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#222" stopOpacity="0" />
                </radialGradient>
                {/* Monochrome candy-cane stripe pattern */}
                <pattern id="candyStripe" patternUnits="userSpaceOnUse" width="16" height="16" patternTransform="rotate(30)">
                  <rect x="0" y="0" width="8" height="16" fill="#fff" />
                  <rect x="8" y="0" width="8" height="16" fill="#222" />
                </pattern>
                {/* Path shadow filter */}
                <filter id="pathShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#222" flood-opacity="0.18" />
                </filter>
                {/* Stage node shadow */}
                <filter id="candyShadow" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#222" flood-opacity="0.12" />
                </filter>
                {/* Stage glow */}
                <radialGradient id="stage-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fff" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#222" stopOpacity="0" />
                </radialGradient>
              </defs>
              {/* Creative animated monochrome background elements (clouds, sparkles, etc. can be added here) */}
              <ellipse cx={SVG_WIDTH/2} cy={SVG_HEIGHT/2} rx={SVG_WIDTH/2.2} ry={SVG_HEIGHT/2.5} fill="#f5f5f5" />
              <ellipse cx={SVG_WIDTH/3} cy={SVG_HEIGHT/1.5} rx={120} ry={50} fill="#e5e5e5" />
              <ellipse cx={SVG_WIDTH/1.3} cy={SVG_HEIGHT/2.2} rx={90} ry={36} fill="#d1d1d1" />
              {/* Organic, variable-width candy river */}
              <path
                d={riverPath}
                fill="#fff"
                opacity={0.95}
                filter="url(#pathShadow)"
              />
              {/* Path shadow (centerline) */}
              <path
                d={pathD}
                stroke="#222"
                strokeWidth={10}
                fill="none"
                opacity={0.13}
                filter="url(#pathShadow)"
              />
              {/* Monochrome candy-cane striped path (centerline) */}
              <path
                d={pathD}
                stroke="url(#candyStripe)"
                strokeWidth={8}
                fill="none"
                opacity={0.95}
              />
              {/* Animated glowing path overlay for progress (centerline) */}
              <motion.path
                d={pathD}
                stroke="#fff"
                strokeWidth={5}
                fill="none"
                strokeDasharray="12,12"
                opacity={0.9}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: progressLength }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                style={{ filter: "drop-shadow(0px 0px 12px #222)" }}
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
          </TransformComponent>
        </TransformWrapper>
      </div>
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
            className="h-full bg-gradient-to-r from-black to-gray-400 rounded-full"
          />
        </div>
      </div>
      {/* Level completion celebration */}
      <AnimatePresence initial={false}>
        <div>
          {completedStages === stages.length ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl p-8 text-center shadow-2xl"
              >
                <Crown className="w-16 h-16 text-black mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-black mb-2">🎉 Congratulations! 🎉</h3>
                <p className="text-gray-600 mb-4">You've completed all stages!</p>
                <div className="flex items-center justify-center space-x-2">
                  <Star className="w-6 h-6 text-black" />
                  <span className="text-lg font-semibold text-black">{stages.length} stages mastered</span>
                  <Star className="w-6 h-6 text-black" />
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </div>
      </AnimatePresence>
    </div>
  );
}
