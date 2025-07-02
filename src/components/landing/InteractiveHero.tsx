"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Sparkles, ArrowRight, Play, Brain, Zap, Volume2 } from "lucide-react";
import { Button } from "../ui/button";
import { GlitchText, FloatingText } from "./ParallaxText";

export function InteractiveHero() {
  const [currentExample, setCurrentExample] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-300, 300], [15, -15]);
  const rotateY = useTransform(mouseX, [-300, 300], [-15, 15]);
  
  const springRotateX = useSpring(rotateX, { stiffness: 100, damping: 10 });
  const springRotateY = useSpring(rotateY, { stiffness: 100, damping: 10 });

  const examples = [
    "I want to learn Quantum Physics",
    "Teach me Advanced Calculus",
    "How do I master Machine Learning?",
    "Show me Organic Chemistry",
    "I want to understand Neural Networks",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExample((prev) => (prev + 1) % examples.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [examples.length]);

  useEffect(() => {
    setIsTyping(true);
    setDisplayText("");
    
    const typeText = async () => {
      const text = examples[currentExample];
      for (let i = 0; i <= text.length; i++) {
        setDisplayText(text.slice(0, i));
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      setIsTyping(false);
    };
    
    typeText();
  }, [currentExample]);

  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(event.clientX - centerX);
    mouseY.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
      
      {/* Floating 3D Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <FloatingText />
      </div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Sound Wave Visualization */}
      <div className="absolute top-8 right-8 z-20">
        <button
          onClick={toggleAudio}
          className="relative group p-4 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300"
        >
          <Volume2 className="w-6 h-6 text-white" />
          {isPlaying && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex items-end gap-1 h-8">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-white rounded-full"
                  animate={{
                    height: [4, 20, 4],
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
        </button>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Main heading with glitch effect */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
            <GlitchText text="Learn" className="text-white" />
            <br />
            <span className="text-gray-300">Anything</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
            AI-powered learning roadmaps that adapt to your goals and pace
          </p>
        </motion.div>

        {/* Interactive input card with enhanced 3D */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transformStyle: "preserve-3d",
            transform: `perspective(1000px) rotateX(${springRotateX}deg) rotateY(${springRotateY}deg)`,
          }}
          className="relative max-w-2xl mx-auto mb-12 group"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-white/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="text-left mb-4">
              <label className="text-white/80 text-sm font-medium mb-2 block">
                What do you want to learn?
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type your learning goal..."
                  className="w-full bg-white/5 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                  value={displayText}
                  onChange={(e) => setDisplayText(e.target.value)}
                />
                {isTyping && (
                  <motion.div
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-2 h-6 bg-white rounded-full"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-white/60 text-sm">
                Examples: {examples[currentExample]}
              </div>
              <Button 
                size="lg"
                className="bg-white text-black hover:bg-gray-200 px-8 py-3 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 group-hover:shadow-2xl group-hover:shadow-white/20"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Roadmap
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Feature highlights with magnetic hover */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          {[
            {
              icon: Brain,
              title: "AI-Powered",
              description: "Personalized learning paths generated by advanced AI",
            },
            {
              icon: Zap,
              title: "Interactive",
              description: "Engage with quizzes, materials, and progress tracking",
            },
            {
              icon: Play,
              title: "Start Now",
              description: "Begin your learning journey in seconds",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              whileHover={{ 
                y: -10,
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center group cursor-pointer"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <feature.icon className="w-12 h-12 text-white mx-auto mb-4" />
              </motion.div>
              <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-gray-200 transition-colors">{feature.title}</h3>
              <p className="text-gray-300 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} loop>
        <source src="/ambient-learning.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
} 