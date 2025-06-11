'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroSection } from '@/components/HeroSection';
import { FeatureShowcase } from '@/components/FeatureShowcase';
import { SampleRoadmaps } from '@/components/SampleRoadmaps';
import { InteractiveDemo } from '@/components/InteractiveDemo';
import { StatsSection } from '@/components/StatsSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { CTASection } from '@/components/CTASection';
import { FloatingElements } from '@/components/FloatingElements';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSelectRoadmap = (roadmapIdOrTitle: string) => {
    // Check if it's a roadmap ID (starts with 'c' from cuid) or a title
    if (roadmapIdOrTitle.length > 10 && roadmapIdOrTitle.startsWith('c')) {
      // It's a roadmap ID, redirect to dashboard with roadmapId
      router.push(`/dashboard?roadmapId=${roadmapIdOrTitle}`);
    } else {
      // It's a title, redirect to dashboard with prompt
      router.push(`/dashboard?prompt=${encodeURIComponent(roadmapIdOrTitle)}`);
    }
  };

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
            <SampleRoadmaps onSelectRoadmap={handleSelectRoadmap} />
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
