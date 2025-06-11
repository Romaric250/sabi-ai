'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Brain, Code, Database, Globe, Zap, Target, Star, Sparkles } from 'lucide-react';

const floatingElements = [
  { icon: Brain, color: 'text-purple-400', size: 32, delay: 0 },
  { icon: Code, color: 'text-blue-400', size: 28, delay: 1 },
  { icon: Database, color: 'text-green-400', size: 30, delay: 2 },
  { icon: Globe, color: 'text-cyan-400', size: 26, delay: 3 },
  { icon: Zap, color: 'text-yellow-400', size: 24, delay: 4 },
  { icon: Target, color: 'text-red-400', size: 28, delay: 5 },
  { icon: Star, color: 'text-pink-400', size: 22, delay: 6 },
  { icon: Sparkles, color: 'text-indigo-400', size: 26, delay: 7 },
];

export function FloatingElements() {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });

      const handleResize = () => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          className={`absolute ${element.color} opacity-20`}
          initial={{
            x: Math.random() * dimensions.width,
            y: Math.random() * dimensions.height,
            rotate: 0,
            scale: 0,
          }}
          animate={{
            x: [
              Math.random() * dimensions.width,
              Math.random() * dimensions.width,
              Math.random() * dimensions.width,
            ],
            y: [
              Math.random() * dimensions.height,
              Math.random() * dimensions.height,
              Math.random() * dimensions.height,
            ],
            rotate: [0, 180, 360],
            scale: [0, 1, 0.8, 1, 0],
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
            delay: element.delay,
          }}
        >
          <element.icon size={element.size} />
        </motion.div>
      ))}

      {/* Additional floating particles */}
      {[...Array(20)].map((_, index) => (
        <motion.div
          key={`particle-${index}`}
          className="absolute w-2 h-2 bg-purple-400/30 rounded-full"
          initial={{
            x: Math.random() * dimensions.width,
            y: Math.random() * dimensions.height,
          }}
          animate={{
            x: [
              Math.random() * dimensions.width,
              Math.random() * dimensions.width,
            ],
            y: [
              Math.random() * dimensions.height,
              Math.random() * dimensions.height,
            ],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
}
