'use client';

import { motion } from 'framer-motion';
import { Lock, CheckCircle, Play, Star, Sparkles, Trophy } from 'lucide-react';
import { RoadmapStage } from '@/types/roadmap';

interface CandyCrushPathwayProps {
  stages: RoadmapStage[];
  onStageClick: (stage: RoadmapStage) => void;
  onFinalQuizClick?: () => void;
}

export function CandyCrushPathway({ stages, onStageClick, onFinalQuizClick }: CandyCrushPathwayProps) {
  const stageSize = 120;
  const spacing = 160;

  // Create the winding path coordinates
  const pathCoordinates = [
    { x: 2, y: 0 }, // Stage 1 - Start at center bottom
    { x: 1, y: 1 }, // Stage 2 - Move left and up
    { x: 3, y: 1 }, // Stage 3 - Move right
    { x: 2, y: 2 }, // Stage 4 - Move center up
    { x: 1, y: 3 }, // Stage 5 - Move left up
    { x: 3, y: 3 }, // Stage 6 - Move right up (final stage)
  ];

  // Create SVG path for the winding road
  const createPath = () => {
    const pathData = pathCoordinates.map((coord, index) => {
      const x = coord.x * spacing + stageSize / 2;
      const y = coord.y * spacing + stageSize / 2;
      return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    }).join(' ');
    return pathData;
  };

  // Calculate container dimensions
  const maxX = Math.max(...pathCoordinates.map(p => p.x));
  const maxY = Math.max(...pathCoordinates.map(p => p.y));
  const containerWidth = (maxX + 1) * spacing + stageSize;
  const containerHeight = (maxY + 1) * spacing + stageSize + 200; // Extra space for final quiz

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-200 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-pink-200 rounded-full blur-2xl"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-purple-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-blue-200 rounded-full blur-2xl"></div>
      </div>

      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-indigo-300 rounded-full opacity-40"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">

        {/* Main pathway container */}
        <div 
          className="relative"
          style={{ 
            width: containerWidth, 
            height: containerHeight 
          }}
        >
          {/* SVG Road Path */}
          <svg
            className="absolute inset-0 w-full h-full"
            style={{ zIndex: 1 }}
          >
            <defs>
              <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
              <linearGradient id="completedRoadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#059669" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
            </defs>

            {/* Base road path */}
            <path
              d={createPath()}
              stroke="#e5e7eb"
              strokeWidth="24"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-sm"
            />

            {/* Progress road path - changes color based on completion */}
            <path
              d={createPath()}
              stroke={stages.filter(s => s.isCompleted).length > 0 ? "url(#completedRoadGradient)" : "url(#roadGradient)"}
              strokeWidth="20"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-lg"
              strokeDasharray={`${stages.filter(s => s.isCompleted).length * 160} 1000`}
              strokeDashoffset="0"
            />
          </svg>

          {/* Stage nodes */}
          {stages.map((stage, index) => {
            const position = pathCoordinates[index] || { x: 0, y: 0 };
            const isUnlocked = stage.isUnlocked ?? (index === 0 || (index > 0 && stages[index - 1]?.isCompleted));
            const isCompleted = stage.isCompleted ?? false;

            return (
              <motion.div
                key={stage.id}
                className="absolute"
                style={{
                  left: position.x * spacing,
                  top: position.y * spacing,
                  width: stageSize,
                  height: stageSize,
                  zIndex: 10,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.2, type: "spring", stiffness: 200 }}
              >
                <motion.div
                  className={`relative w-full h-full rounded-full cursor-pointer ${
                    isUnlocked ? 'hover:scale-110' : 'cursor-not-allowed'
                  }`}
                  whileHover={isUnlocked ? { 
                    scale: 1.1,
                    y: -10,
                  } : {}}
                  onClick={() => isUnlocked && onStageClick(stage)}
                >
                  {/* Glow effect for unlocked stages */}
                  {isUnlocked && (
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${stage.color} rounded-full blur-xl opacity-60`}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.4, 0.8, 0.4],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}

                  {/* Stage circle */}
                  <div className={`
                    relative w-full h-full rounded-full border-4 flex flex-col items-center justify-center
                    ${isCompleted 
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500 border-green-300 shadow-green-500/50' 
                      : isUnlocked 
                        ? `bg-gradient-to-r ${stage.color} border-white shadow-lg` 
                        : 'bg-gray-600 border-gray-500 shadow-gray-500/50'
                    }
                    shadow-2xl
                  `}>
                    {/* Stage icon */}
                    <div className="text-white mb-1">
                      {isCompleted ? (
                        <CheckCircle size={32} />
                      ) : isUnlocked ? (
                        <Play size={32} />
                      ) : (
                        <Lock size={32} />
                      )}
                    </div>

                    {/* Stage number */}
                    <div className="text-white font-bold text-lg">
                      {stage.id}
                    </div>
                  </div>

                  {/* Stage title */}
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center">
                    <div className="bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/20">
                      <h3 className="font-bold text-white text-sm whitespace-nowrap">{stage.title}</h3>
                    </div>
                  </div>

                  {/* Completion stars */}
                  {isCompleted && (
                    <div className="absolute -top-4 -right-4">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                      >
                        <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            );
          })}

          {/* Final Quiz at the end */}
          <motion.div
            className="absolute"
            style={{
              left: (maxX * spacing) + spacing / 2 - 80,
              top: (maxY + 1) * spacing + 50,
              zIndex: 10,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: stages.length * 0.2 + 0.5, type: "spring", stiffness: 200 }}
          >
            <motion.div
              className="relative w-40 h-40 rounded-full cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 border-4 border-white shadow-2xl flex flex-col items-center justify-center"
              whileHover={{ 
                scale: 1.1,
                y: -10,
              }}
              onClick={onFinalQuizClick}
            >
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-60"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <Trophy className="text-white mb-2" size={40} />
              <div className="text-white font-bold text-lg">FINAL</div>
              <div className="text-white font-bold text-lg">QUIZ</div>

              {/* Title */}
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
                <div className="bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                  <h3 className="font-bold text-white text-sm whitespace-nowrap">Final Assessment</h3>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
