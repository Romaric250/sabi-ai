"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface ParallaxTextProps {
  text: string;
  className?: string;
  speed?: number;
  direction?: "up" | "down";
  scale?: boolean;
}

export function ParallaxText({ 
  text, 
  className = "", 
  speed = 0.5, 
  direction = "up",
  scale = false 
}: ParallaxTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], direction === "up" ? [100, -100] : [-100, 100]);
  const scaleTransform = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.8]);
  const scaleValue = scale ? scaleTransform : 1;
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ 
        y: y,
        scale: scaleValue,
        opacity: opacity
      }}
      className={`${className}`}
    >
      {text}
    </motion.div>
  );
}

export function FloatingText() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, -360]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1]);

  return (
    <motion.div
      ref={ref}
      style={{
        rotateX,
        rotateY,
        scale,
        transformStyle: "preserve-3d",
      }}
      className="text-8xl md:text-9xl font-black text-white/5 select-none"
    >
      SABI
    </motion.div>
  );
}

export function GlitchText({ text, className = "" }: { text: string; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <span className="text-white">{text}</span>
      <span className="absolute inset-0 text-white animate-pulse" style={{ 
        clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)",
        transform: "translate(-2px, 0)"
      }}>
        {text}
      </span>
      <span className="absolute inset-0 text-white animate-pulse" style={{ 
        clipPath: "polygon(0 55%, 100% 55%, 100% 100%, 0 100%)",
        transform: "translate(2px, 0)"
      }}>
        {text}
      </span>
    </div>
  );
} 