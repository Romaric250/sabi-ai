'use client';

import { motion } from 'framer-motion';
import { Lock, CheckCircle, Play, Star, Sparkles } from 'lucide-react';

interface RoadmapStage {
  id: string;
  title: string;
  description: string;
  lessons: string[];
  materials: string[];
  quiz: any[];
  isUnlocked: boolean;
  isCompleted: boolean;
  position: { x: number; y: number };
  color: string;
  icon: any;
}

interface CandyCrushRoadmapProps {
  stages: RoadmapStage[];
  onStageClick: (stage: RoadmapStage) => void;
}

export function CandyCrushRoadmap({ stages, onStageClick }: CandyCrushRoadmapProps) {
  const gridSize = 5; // 5x5 grid
  const stageSize = 120; // Size of each stage circle
  const spacing = 160; // Spacing between stages

  // Create connecting paths between stages
  const getConnectionPath = (from: RoadmapStage, to: RoadmapStage) => {
    const fromX = from.position.x * spacing + stageSize / 2;
    const fromY = from.position.y * spacing + stageSize / 2;
    const toX = to.position.x * spacing + stageSize / 2;
    const toY = to.position.y * spacing + stageSize / 2;

    // Create a curved path
    const midX = (fromX + toX) / 2;
    const midY = (fromY + toY) / 2 - 30; // Curve upward

    return `M ${fromX} ${fromY} Q ${midX} ${midY} ${toX} ${toY}`;
  };

  // Get connections between stages
  const connections = stages.slice(0, -1).map((stage, index) => ({
    from: stage,
    to: stages[index + 1],
    isActive: stage.isCompleted && stages[index + 1].isUnlocked
  }));

  return (
    <div className="relative w-full h-full min-h-[600px] overflow-auto">
      <div className="relative" style={{ 
        width: gridSize * spacing + stageSize,
        height: gridSize * spacing + stageSize,
        margin: '0 auto'
      }}>
        {/* Connection paths */}
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{ 
            width: gridSize * spacing + stageSize,
            height: gridSize * spacing + stageSize
          }}
        >
          {connections.map((connection, index) => (
            <motion.path
              key={index}
              d={getConnectionPath(connection.from, connection.to)}
              stroke={connection.isActive ? '#8b5cf6' : '#374151'}
              strokeWidth="4"
              fill="none"
              strokeDasharray={connection.isActive ? "0" : "10,5"}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: connection.isActive ? 1 : 0.3 }}
              transition={{ duration: 1, delay: index * 0.2 }}
            />
          ))}
        </svg>

        {/* Stage nodes */}
        {stages.map((stage, index) => (
          <motion.div
            key={stage.id}
            className="absolute cursor-pointer"
            style={{
              left: stage.position.x * spacing,
              top: stage.position.y * spacing,
              width: stageSize,
              height: stageSize,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.6, 
              delay: index * 0.2,
              type: "spring",
              stiffness: 200
            }}
            whileHover={stage.isUnlocked ? { 
              scale: 1.1,
              y: -10,
            } : {}}
            onClick={() => stage.isUnlocked && onStageClick(stage)}
          >
            {/* Stage circle */}
            <div className="relative w-full h-full">
              {/* Glow effect for unlocked stages */}
              {stage.isUnlocked && (
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

              {/* Main stage circle */}
              <motion.div
                className={`relative w-full h-full rounded-full border-4 flex items-center justify-center ${
                  stage.isCompleted
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 border-green-300 shadow-lg shadow-green-500/25'
                    : stage.isUnlocked
                    ? `bg-gradient-to-r ${stage.color} border-white/30 shadow-lg`
                    : 'bg-slate-700/50 border-slate-600 backdrop-blur-sm'
                }`}
                whileHover={stage.isUnlocked ? {
                  boxShadow: "0 0 30px rgba(139, 92, 246, 0.6)",
                } : {}}
              >
                {/* Stage icon */}
                <div className="relative z-10">
                  {stage.isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <CheckCircle className="w-12 h-12 text-white" />
                    </motion.div>
                  ) : stage.isUnlocked ? (
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <stage.icon className="w-10 h-10 text-white" />
                    </motion.div>
                  ) : (
                    <Lock className="w-8 h-8 text-gray-500" />
                  )}
                </div>

                {/* Sparkle effects for completed stages */}
                {stage.isCompleted && (
                  <div className="absolute inset-0">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute text-yellow-400"
                        style={{
                          left: `${20 + Math.cos((i * Math.PI) / 4) * 60}px`,
                          top: `${20 + Math.sin((i * Math.PI) / 4) * 60}px`,
                        }}
                        animate={{
                          scale: [0, 1, 0],
                          rotate: [0, 180, 360],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      >
                        <Sparkles size={12} />
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Pulse effect for current stage */}
                {stage.isUnlocked && !stage.isCompleted && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-white/50"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.8, 0, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}
              </motion.div>

              {/* Stage number */}
              <motion.div
                className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.2 + 0.3 }}
              >
                {stage.id}
              </motion.div>

              {/* Stage title */}
              <motion.div
                className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 + 0.5 }}
              >
                <h3 className={`font-bold text-sm mb-1 ${
                  stage.isUnlocked ? 'text-white' : 'text-gray-500'
                }`}>
                  {stage.title}
                </h3>
                <p className={`text-xs ${
                  stage.isUnlocked ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {stage.description.slice(0, 30)}...
                </p>
              </motion.div>

              {/* Progress indicator */}
              {stage.isUnlocked && (
                <motion.div
                  className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.2 + 0.7 }}
                >
                  <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          stage.isCompleted
                            ? 'bg-green-400'
                            : i === 0
                            ? 'bg-blue-400'
                            : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
