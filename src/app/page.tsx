'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroSection } from '@/components/HeroSection';
import { FeatureShowcase } from '@/components/FeatureShowcase';
import { InteractiveDemo } from '@/components/InteractiveDemo';
import { StatsSection } from '@/components/StatsSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { CTASection } from '@/components/CTASection';
import { FloatingElements } from '@/components/FloatingElements';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      <FloatingElements />

      <AnimatePresence>
        {isLoaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <HeroSection />
            <FeatureShowcase />
            <InteractiveDemo />
            <StatsSection />
            <TestimonialsSection />
            <CTASection />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
