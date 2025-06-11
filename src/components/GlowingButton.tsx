'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlowingButtonProps {
  children: ReactNode;
  onClick: () => void;
  className?: string;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function GlowingButton({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary',
  disabled = false 
}: GlowingButtonProps) {
  const baseClasses = "relative overflow-hidden transition-all duration-300 transform";
  const variantClasses = {
    primary: "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25",
    secondary: "border border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 blur-xl"
        whileHover={{ opacity: disabled ? 0 : 0.7 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%]"
        animate={{ translateX: ['100%', '200%'] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
          ease: "easeInOut"
        }}
      />
      
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}
