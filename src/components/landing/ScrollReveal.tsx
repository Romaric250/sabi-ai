"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Sparkles, Zap, Brain, Target } from "lucide-react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  effect?: "fade" | "slide" | "scale" | "rotate" | "particle" | "holographic";
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
}

export function ScrollReveal({ 
  children, 
  className = "", 
  effect = "fade",
  direction = "up",
  delay = 0,
  duration = 0.8
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const getInitialState = () => {
    switch (effect) {
      case "slide":
        switch (direction) {
          case "up": return { y: 100, opacity: 0 };
          case "down": return { y: -100, opacity: 0 };
          case "left": return { x: 100, opacity: 0 };
          case "right": return { x: -100, opacity: 0 };
          default: return { y: 100, opacity: 0 };
        }
      case "scale":
        return { scale: 0.8, opacity: 0 };
      case "rotate":
        return { rotateX: 90, opacity: 0 };
      case "particle":
        return { scale: 0, opacity: 0 };
      case "holographic":
        return { rotateY: 180, opacity: 0 };
      default:
        return { opacity: 0 };
    }
  };

  const getAnimateState = () => {
    switch (effect) {
      case "slide":
        switch (direction) {
          case "up": return { y: 0, opacity: 1 };
          case "down": return { y: 0, opacity: 1 };
          case "left": return { x: 0, opacity: 1 };
          case "right": return { x: 0, opacity: 1 };
          default: return { y: 0, opacity: 1 };
        }
      case "scale":
        return { scale: 1, opacity: 1 };
      case "rotate":
        return { rotateX: 0, opacity: 1 };
      case "particle":
        return { scale: 1, opacity: 1 };
      case "holographic":
        return { rotateY: 0, opacity: 1 };
      default:
        return { opacity: 1 };
    }
  };

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.8]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, -360]);

  const springY = useSpring(y, { stiffness: 100, damping: 30 });
  const springOpacity = useSpring(opacity, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      ref={ref}
      initial={getInitialState()}
      animate={isInView ? getAnimateState() : getInitialState()}
      transition={{ 
        duration, 
        delay,
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
      style={{
        y: effect === "slide" ? springY : undefined,
        opacity: effect === "fade" ? springOpacity : undefined,
        scale: effect === "scale" ? scale : undefined,
        rotateX: effect === "rotate" ? rotateX : undefined,
        rotateY: effect === "holographic" ? rotateY : undefined,
        transformStyle: "preserve-3d",
      }}
      className={`${className} ${effect === "holographic" ? "perspective-1000" : ""}`}
    >
      {children}
      {effect === "particle" && isInView && (
        <ParticleBurst />
      )}
    </motion.div>
  );
}

function ParticleBurst() {
  return (
    <div className="absolute inset-0 pointer-events-none">
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
            x: Math.cos((i * 30) * Math.PI / 180) * 100,
            y: Math.sin((i * 30) * Math.PI / 180) * 100,
            opacity: [1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            delay: i * 0.1,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

export function FloatingIcons() {
  const icons = [Sparkles, Zap, Brain, Target];
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {icons.map((Icon, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{
            left: `${20 + (index * 20)}%`,
            top: `${30 + (index * 15)}%`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4 + index,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.5,
          }}
        >
          <Icon className="w-8 h-8 text-white/20" />
        </motion.div>
      ))}
    </div>
  );
}

export function MagneticText({ 
  text, 
  className = "" 
}: { 
  text: string; 
  className?: string;
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  return (
    <motion.div
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          className="inline-block"
          animate={isHovered ? {
            x: (mousePosition.x - 100) * 0.01,
            y: (mousePosition.y - 50) * 0.01,
            rotateZ: Math.random() * 10 - 5,
          } : {
            x: 0,
            y: 0,
            rotateZ: 0,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: index * 0.01,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.div>
  );
} 