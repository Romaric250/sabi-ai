'use client';

import { motion } from 'framer-motion';
import { Lock, CheckCircle, Play, Star, Sparkles, Brain, Zap, Trophy } from 'lucide-react';

interface RoadmapStage {
  id: string;
  title: string;
  description: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  position: { x: number; y: number };
  color: string;
  icon: any;
}

interface SimpleCandyCrushRoadmapProps {
  stages: RoadmapStage[];
  onStageClick: (stageId: string) => void;
}

export function SimpleCandyCrushRoadmap({ stages, onStageClick }: SimpleCandyCrushRoadmapProps) {


  const stageSize = 120;
  const spacing = 160;

  return (
    <div className="relative w-full h-full min-h-[600px] overflow-auto">
      <div className="relative mx-auto" style={{ 
        width: 5 * spacing + stageSize,
        height: 4 * spacing + stageSize
      }}>
        {/* Connection paths */}
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{ 
            width: 5 * spacing + stageSize,
            height: 4 * spacing + stageSize
          }}
        >
          {/* Dynamic pathway connections */}
          {stages.map((stage, index) => {
            if (index === stages.length - 1) return null; // No path from last stage

            const nextStage = stages[index + 1];
            const fromX = stage.position.x * spacing + stageSize / 2;
            const fromY = stage.position.y * spacing + stageSize / 2;
            const toX = nextStage.position.x * spacing + stageSize / 2;
            const toY = nextStage.position.y * spacing + stageSize / 2;

            // Create curved path
            const midX = (fromX + toX) / 2;
            const midY = (fromY + toY) / 2;
            const controlX = midX + (Math.random() - 0.5) * 100;
            const controlY = midY - 50;

            return (
              <motion.path
                key={`path-${stage.id}-${nextStage.id}`}
                d={`M ${fromX} ${fromY} Q ${controlX} ${controlY} ${toX} ${toY}`}
                stroke="url(#pathGradient)"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="8,4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: stage.isCompleted ? 1 : stage.isUnlocked ? 0.5 : 0,
                  opacity: stage.isUnlocked ? 0.8 : 0.3
                }}
                transition={{ duration: 1.5, delay: index * 0.3 }}
              />
            );
          })}

          {/* Gradient definition for paths */}
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.8" />
            </linearGradient>
          </defs>
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
            onClick={() => stage.isUnlocked && onStageClick(stage.id)}
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
