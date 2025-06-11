'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Brain, Sparkles, Zap, Target, ArrowRight, Play, Star } from 'lucide-react';
import { TypewriterText } from './TypewriterText';
import { GlowingButton } from './GlowingButton';
import { ParticleField } from './ParticleField';

export function HeroSection() {
  const router = useRouter();
  const [currentExample, setCurrentExample] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const examples = [
    "I want to learn Trigonometry",
    "Teach me Advanced Calculus",
    "How do I master Linear Algebra?",
    "I want to learn Quantum Physics",
    "Show me Organic Chemistry fundamentals"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExample((prev) => (prev + 1) % examples.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleGenerate = () => {
    const prompt = inputValue.trim() || examples[currentExample];
    router.push(`/dashboard?prompt=${encodeURIComponent(prompt)}`);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      <ParticleField />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto text-center">
        {/* Floating icons */}
        <motion.div
          className="absolute -top-20 -left-20 text-purple-400"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Brain size={40} />
        </motion.div>
        
        <motion.div
          className="absolute -top-10 -right-20 text-blue-400"
          animate={{
            y: [0, -15, 0],
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Sparkles size={35} />
        </motion.div>

        <motion.div
          className="absolute top-40 -left-32 text-green-400"
          animate={{
            y: [0, -25, 0],
            rotate: [0, 15, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Zap size={30} />
        </motion.div>

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full border border-purple-500/30 backdrop-blur-sm"
          >
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-white">Revolutionary AI-Powered Learning</span>
          </motion.div>

          {/* Main headline */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="text-5xl sm:text-6xl lg:text-8xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight"
            >
              Learn Anything with
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Visual Roadmaps
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Transform any learning goal into an interactive, step-by-step journey. 
              <br />
              <span className="text-purple-300">AI-powered roadmaps that adapt to you.</span>
            </motion.p>
          </div>

          {/* Interactive demo input */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur opacity-75"></div>
              <div className="relative bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                      placeholder={examples[currentExample]}
                      className="text-lg text-white placeholder-gray-400 bg-transparent border-none outline-none w-full"
                    />
                  </div>
                  <GlowingButton
                    onClick={handleGenerate}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold flex items-center gap-2 hover:scale-105 transition-transform"
                  >
                    Generate <ArrowRight size={20} />
                  </GlowingButton>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <GlowingButton
              onClick={handleGenerate}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-lg flex items-center gap-3 hover:scale-105 transition-all duration-300 shadow-2xl shadow-purple-500/25"
            >
              <Play size={24} />
              Start Learning Now
            </GlowingButton>
            
            <button className="px-8 py-4 border border-purple-500/50 text-purple-300 rounded-xl font-semibold text-lg hover:bg-purple-500/10 transition-all duration-300 flex items-center gap-3">
              <Target size={24} />
              See Demo
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="grid grid-cols-3 gap-8 max-w-md mx-auto pt-8"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-white">10K+</div>
              <div className="text-sm text-gray-400">Roadmaps Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">95%</div>
              <div className="text-sm text-gray-400">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">24/7</div>
              <div className="text-sm text-gray-400">AI Support</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
