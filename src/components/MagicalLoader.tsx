'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Zap, Star, Target, Code } from 'lucide-react';

interface MagicalLoaderProps {
  prompt: string;
  progress: number;
}

export function MagicalLoader({ prompt, progress }: MagicalLoaderProps) {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    }
  }, []);

  const loadingSteps = [
    { text: "Analyzing your learning goal...", icon: Brain, color: "text-purple-400" },
    { text: "Consulting AI knowledge base...", icon: Sparkles, color: "text-blue-400" },
    { text: "Crafting personalized stages...", icon: Zap, color: "text-green-400" },
    { text: "Generating interactive content...", icon: Star, color: "text-yellow-400" },
    { text: "Optimizing difficulty curve...", icon: Target, color: "text-red-400" },
    { text: "Finalizing your roadmap...", icon: Code, color: "text-cyan-400" }
  ];

  const currentStep = Math.floor((progress / 100) * loadingSteps.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-400/30 rounded-full"
            initial={{
              x: Math.random() * dimensions.width,
              y: Math.random() * dimensions.height,
              scale: 0,
            }}
            animate={{
              x: Math.random() * dimensions.width,
              y: Math.random() * dimensions.height,
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Central loading interface */}
      <div className="relative z-10 max-w-2xl mx-auto text-center px-6">
        {/* Main title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-4">
            Creating Your
          </h1>
          <h2 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            {prompt} Journey
          </h2>
        </motion.div>

        {/* Magical orb */}
        <motion.div
          className="relative w-32 h-32 mx-auto mb-12"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-xl opacity-60" />
          <motion.div
            className="absolute inset-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-r from-white/20 to-transparent flex items-center justify-center">
              <Brain className="w-12 h-12 text-white" />
            </div>
          </motion.div>
          
          {/* Orbiting elements */}
          {loadingSteps.slice(0, 4).map((step, index) => (
            <motion.div
              key={index}
              className={`absolute w-8 h-8 ${step.color} opacity-80`}
              style={{
                top: '50%',
                left: '50%',
                transformOrigin: '0 0',
              }}
              animate={{
                rotate: 360,
                x: Math.cos((index * Math.PI) / 2) * 80,
                y: Math.sin((index * Math.PI) / 2) * 80,
              }}
              transition={{
                duration: 4 + index,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <step.icon size={32} />
            </motion.div>
          ))}
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <div className="relative w-full h-4 bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-slate-700/50">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full relative"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                animate={{ x: ['-100%', '200%'] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </div>
          <div className="text-center mt-3">
            <span className="text-2xl font-bold text-white">{progress}%</span>
          </div>
        </motion.div>

        {/* Current step indicator */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          {currentStep < loadingSteps.length && (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className={loadingSteps[currentStep].color}
              >
                <loadingSteps[currentStep].icon size={24} />
              </motion.div>
              <span className="text-lg text-gray-300">
                {loadingSteps[currentStep].text}
              </span>
            </>
          )}
        </motion.div>

        {/* Loading steps preview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {loadingSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0.3, scale: 0.9 }}
              animate={{
                opacity: index <= currentStep ? 1 : 0.3,
                scale: index === currentStep ? 1.1 : index < currentStep ? 1 : 0.9,
              }}
              className={`p-4 rounded-xl border transition-all duration-300 ${
                index <= currentStep
                  ? 'bg-slate-800/50 border-purple-500/50 backdrop-blur-sm'
                  : 'bg-slate-900/30 border-slate-700/30'
              }`}
            >
              <div className={`w-8 h-8 mx-auto mb-2 ${step.color}`}>
                <step.icon size={32} />
              </div>
              <p className="text-xs text-gray-400 text-center">
                {step.text.split(' ').slice(0, 2).join(' ')}...
              </p>
              {index <= currentStep && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2 h-2 bg-green-400 rounded-full mx-auto mt-2"
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Magical sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-yellow-400"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                rotate: [0, 180, 360],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2 + Math.random(),
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              <Sparkles size={16} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
