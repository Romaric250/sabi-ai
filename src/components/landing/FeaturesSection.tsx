"use client";

import { motion } from "framer-motion";
import { 
  Brain, 
  Target, 
  Zap, 
  BookOpen, 
  Users, 
  BarChart3,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { HolographicCard, HolographicButton } from "./HolographicCard";
import { ParallaxText } from "./ParallaxText";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Intelligence",
    description: "Advanced machine learning algorithms create personalized learning paths that adapt to your unique learning style and pace.",
    gradient: "from-white/20 to-white/5"
  },
  {
    icon: Target,
    title: "Goal-Oriented Learning",
    description: "Set specific learning objectives and watch as our AI breaks down complex topics into achievable milestones.",
    gradient: "from-white/15 to-white/5"
  },
  {
    icon: Zap,
    title: "Interactive Engagement",
    description: "Engage with dynamic quizzes, interactive materials, and real-time progress tracking to stay motivated.",
    gradient: "from-white/20 to-white/5"
  },
  {
    icon: BookOpen,
    title: "Comprehensive Resources",
    description: "Access curated study materials, practice exercises, and expert-curated content for every learning objective.",
    gradient: "from-white/15 to-white/5"
  },
  {
    icon: Users,
    title: "Community Learning",
    description: "Connect with fellow learners, share progress, and participate in collaborative learning experiences.",
    gradient: "from-white/20 to-white/5"
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    description: "Track your learning journey with detailed analytics, performance insights, and adaptive recommendations.",
    gradient: "from-white/15 to-white/5"
  }
];

export function FeaturesSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background with animated elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black" />
      
      {/* Floating geometric shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 border border-white/10 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-24 h-24 border border-white/10 rotate-45"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [45, 225, 405],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-white/5 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header with parallax effect */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <ParallaxText
            text="Revolutionary Features"
            className="text-5xl md:text-7xl font-bold text-white mb-6"
            scale={true}
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Experience the future of learning with cutting-edge AI technology and 
            immersive interactive features designed to maximize your educational potential.
          </motion.p>
        </motion.div>

        {/* Features grid with holographic cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <HolographicCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              gradient={feature.gradient}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Interactive CTA section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <div className="relative max-w-4xl mx-auto">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-3xl blur-2xl opacity-50" />
            
            <div className="relative bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/20">
              <motion.div
                initial={{ scale: 0.9 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mb-8"
              >
                <Sparkles className="w-16 h-16 text-white mx-auto mb-6" />
                <h3 className="text-3xl font-bold text-white mb-4">
                  Ready to Transform Your Learning?
                </h3>
                <p className="text-gray-300 text-lg mb-8">
                  Join thousands of learners who have already discovered the power of AI-driven education.
                </p>
              </motion.div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <HolographicButton
                  onClick={() => window.location.href = '/auth/sign-up'}
                  className="text-white"
                  icon={ArrowRight}
                >
                  Start Your Journey
                </HolographicButton>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 text-white/80 hover:text-white transition-colors duration-300"
                >
                  Watch Demo
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Floating stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
        >
          {[
            { number: "10K+", label: "Active Learners" },
            { number: "500+", label: "Learning Paths" },
            { number: "95%", label: "Success Rate" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="text-center group"
            >
              <div className="relative">
                <motion.div
                  className="text-4xl md:text-5xl font-bold text-white mb-2"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 