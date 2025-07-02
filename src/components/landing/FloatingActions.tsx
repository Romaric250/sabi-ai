"use client";

import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { 
  Sparkles, 
  Zap, 
  Brain, 
  Target, 
  BookOpen, 
  Users, 
  Volume2, 
  VolumeX,
  Play,
  Pause,
  Settings,
  HelpCircle
} from "lucide-react";

interface FloatingAction {
  id: string;
  icon: any;
  label: string;
  action: () => void;
  color?: string;
  delay?: number;
}

export function FloatingActions() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springMouseX = useSpring(mouseX, { stiffness: 500, damping: 100 });
  const springMouseY = useSpring(mouseY, { stiffness: 500, damping: 100 });

  const actions: FloatingAction[] = [
    {
      id: "ai-assist",
      icon: Brain,
      label: "AI Assistant",
      action: () => console.log("AI Assistant activated"),
      color: "from-purple-500/20 to-purple-600/20",
      delay: 0.1
    },
    {
      id: "quick-start",
      icon: Zap,
      label: "Quick Start",
      action: () => console.log("Quick Start activated"),
      color: "from-yellow-500/20 to-orange-500/20",
      delay: 0.2
    },
    {
      id: "learning-path",
      icon: Target,
      label: "Learning Path",
      action: () => console.log("Learning Path activated"),
      color: "from-blue-500/20 to-cyan-500/20",
      delay: 0.3
    },
    {
      id: "resources",
      icon: BookOpen,
      label: "Resources",
      action: () => console.log("Resources activated"),
      color: "from-green-500/20 to-emerald-500/20",
      delay: 0.4
    },
    {
      id: "community",
      icon: Users,
      label: "Community",
      action: () => console.log("Community activated"),
      color: "from-pink-500/20 to-rose-500/20",
      delay: 0.5
    }
  ];

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleActionClick = (action: FloatingAction) => {
    setActiveAction(action.id);
    action.action();
    
    // Reset active action after animation
    setTimeout(() => setActiveAction(null), 2000);
  };

  return (
    <div 
      ref={containerRef}
      className="fixed bottom-8 left-8 z-50"
      onMouseMove={handleMouseMove}
    >
      {/* Main floating action button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="relative group w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl rounded-2xl border border-white/30 flex items-center justify-center overflow-hidden"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          rotate: isExpanded ? 45 : 0,
          scale: isExpanded ? 1.1 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Quantum particles inside main button */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${20 + i * 12}%`,
              top: `${20 + i * 12}%`,
            }}
            animate={{
              y: [0, -12, 0],
              opacity: [0.3, 1, 0.3],
              scale: [0.3, 1, 0.3],
              rotate: [0, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
        
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Sparkles className="w-8 h-8 text-white" />
        </motion.div>
        
        {/* Quantum glow effect */}
        <motion.div
          className="absolute inset-0 bg-white/20 rounded-2xl"
          animate={{
            opacity: [0, 0.6, 0],
            scale: [0.8, 1.3, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Magnetic cursor follower */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"
          style={{
            x: springMouseX,
            y: springMouseY,
            translateX: "-50%",
            translateY: "-50%",
          }}
        />
      </motion.button>

      {/* Floating action items */}
      <AnimatePresence>
        {isExpanded && (
          <div className="absolute bottom-20 left-0 space-y-4">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.id}
                  initial={{ 
                    x: -50, 
                    y: 20, 
                    opacity: 0, 
                    scale: 0,
                    rotate: -180
                  }}
                  animate={{ 
                    x: 0, 
                    y: 0, 
                    opacity: 1, 
                    scale: 1,
                    rotate: 0
                  }}
                  exit={{ 
                    x: -50, 
                    y: 20, 
                    opacity: 0, 
                    scale: 0,
                    rotate: -180
                  }}
                  transition={{
                    delay: action.delay,
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                  className="relative group"
                >
                  <motion.button
                    onClick={() => handleActionClick(action)}
                    className={`relative w-14 h-14 bg-gradient-to-br ${action.color} backdrop-blur-xl rounded-xl border border-white/20 flex items-center justify-center overflow-hidden`}
                    whileHover={{ 
                      scale: 1.15,
                      rotate: 360,
                      transition: { duration: 0.3 }
                    }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {/* Quantum particles */}
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                          left: `${25 + i * 15}%`,
                          top: `${25 + i * 15}%`,
                        }}
                        animate={{
                          y: [0, -10, 0],
                          opacity: [0.3, 1, 0.3],
                          scale: [0.3, 1, 0.3],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                    
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </motion.div>
                    
                    {/* Action label */}
                    <motion.div
                      className="absolute right-full mr-3 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-white text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ x: 10 }}
                      whileHover={{ x: 0 }}
                    >
                      {action.label}
                    </motion.div>
                  </motion.button>
                  
                  {/* Success animation */}
                  <AnimatePresence>
                    {activeAction === action.id && (
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        {/* Particle burst */}
                        {[...Array(12)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-2 h-2 bg-white rounded-full"
                            initial={{
                              x: 0,
                              y: 0,
                              opacity: 1,
                              scale: 0,
                            }}
                            animate={{
                              x: Math.cos((i * 30) * Math.PI / 180) * 80,
                              y: Math.sin((i * 30) * Math.PI / 180) * 80,
                              opacity: [1, 0],
                              scale: [0, 1, 0],
                            }}
                            transition={{
                              duration: 1,
                              delay: i * 0.05,
                              ease: "easeOut",
                            }}
                          />
                        ))}
                        
                        {/* Success checkmark */}
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.2, type: "spring" }}
                        >
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <motion.div
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ delay: 0.3, duration: 0.5 }}
                              className="w-4 h-4 text-white"
                            >
                              ✓
                            </motion.div>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AudioControls() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <motion.button
        onClick={() => setIsPlaying(!isPlaying)}
        className="relative group w-14 h-14 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl rounded-2xl border border-white/30 flex items-center justify-center overflow-hidden"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {/* Quantum particles */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${25 + i * 15}%`,
              top: `${25 + i * 15}%`,
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.3, 1, 0.3],
              scale: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
        
        <motion.div
          animate={{
            rotate: isPlaying ? [0, 360] : 0,
            scale: isPlaying ? [1, 1.2, 1] : 1,
          }}
          transition={{
            duration: isPlaying ? 2 : 0.3,
            repeat: isPlaying ? Infinity : 0,
            ease: "linear",
          }}
        >
          {isPlaying ? (
            <Volume2 className="w-6 h-6 text-white" />
          ) : (
            <VolumeX className="w-6 h-6 text-white" />
          )}
        </motion.div>
        
        {/* Audio visualization */}
        {isPlaying && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex items-end gap-1 h-6">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-white rounded-full"
                animate={{
                  height: [4, 16, 4],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
        )}
      </motion.button>
    </div>
  );
} 