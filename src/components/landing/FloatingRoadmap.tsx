"use client";

import { motion } from "framer-motion";
import { Brain, BookOpen, Target, Zap, Star, TrendingUp } from "lucide-react";

const stages = [
  { icon: Brain, title: "Foundation", color: "from-green-400 to-emerald-500" },
  { icon: BookOpen, title: "Core Concepts", color: "from-blue-400 to-cyan-500" },
  { icon: Target, title: "Advanced", color: "from-purple-400 to-pink-500" },
  { icon: Zap, title: "Mastery", color: "from-orange-400 to-red-500" },
  { icon: Star, title: "Expert", color: "from-indigo-400 to-purple-500" },
  { icon: TrendingUp, title: "Innovation", color: "from-yellow-400 to-orange-500" },
];

export function FloatingRoadmap() {
  return (
    <div className="relative w-full h-96 flex items-center justify-center">
      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path
          d="M 20% 50% Q 30% 30% 40% 50% Q 50% 70% 60% 50% Q 70% 30% 80% 50%"
          stroke="url(#pathGradient)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="5,5"
          className="animate-pulse"
        />
      </svg>

      {/* Floating stages */}
      {stages.map((stage, index) => {
        const Icon = stage.icon;
        const delay = index * 0.2;
        const xOffset = (index - 2.5) * 15; // Spread stages horizontally
        const yOffset = Math.sin(index * 0.5) * 20; // Slight vertical variation

        return (
          <motion.div
            key={stage.title}
            initial={{ opacity: 0, scale: 0, y: 50 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              x: xOffset,
              y: yOffset
            }}
            transition={{ 
              delay, 
              duration: 0.8, 
              type: "spring",
              stiffness: 100 
            }}
            whileHover={{ 
              scale: 1.1, 
              y: -10,
              transition: { duration: 0.2 }
            }}
            className={`absolute bg-gradient-to-br ${stage.color} p-4 rounded-2xl shadow-2xl backdrop-blur-sm border border-white/20`}
            style={{ zIndex: 2 }}
          >
            <Icon className="w-8 h-8 text-white" />
            <div className="mt-2 text-xs text-white font-medium text-center">
              {stage.title}
            </div>
          </motion.div>
        );
      })}

      {/* Progress indicator */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 border border-white/20"
        style={{ zIndex: 3 }}
      >
        <div className="flex items-center gap-2 text-white text-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>AI Learning Path</span>
        </div>
      </motion.div>
    </div>
  );
} 