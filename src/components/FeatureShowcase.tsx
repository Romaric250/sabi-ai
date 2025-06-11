'use client';

import { motion } from 'framer-motion';
import { Brain, Zap, Target, Users, Trophy, Rocket, CheckCircle, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const features = [
  {
    icon: Brain,
    title: "AI-Powered Generation",
    description: "Transform any learning goal into a structured roadmap instantly using advanced AI",
    color: "from-purple-500 to-pink-500",
    details: [
      "Natural language processing",
      "Personalized learning paths",
      "Adaptive difficulty levels",
      "Real-time optimization"
    ]
  },
  {
    icon: Target,
    title: "Interactive Roadmaps",
    description: "Visual, step-by-step journeys that make complex topics digestible",
    color: "from-blue-500 to-cyan-500",
    details: [
      "Drag & drop interface",
      "Progress tracking",
      "Milestone celebrations",
      "Visual learning paths"
    ]
  },
  {
    icon: Zap,
    title: "Smart Quizzes",
    description: "Unlock the next stage only after mastering the current one",
    color: "from-green-500 to-emerald-500",
    details: [
      "Adaptive questioning",
      "Instant feedback",
      "Knowledge validation",
      "Spaced repetition"
    ]
  },
  {
    icon: Users,
    title: "Community Learning",
    description: "Connect with learners on similar journeys and share progress",
    color: "from-orange-500 to-red-500",
    details: [
      "Study groups",
      "Peer mentoring",
      "Progress sharing",
      "Collaborative learning"
    ]
  },
  {
    icon: Trophy,
    title: "Achievement System",
    description: "Gamified learning with badges, streaks, and leaderboards",
    color: "from-yellow-500 to-orange-500",
    details: [
      "Skill badges",
      "Learning streaks",
      "Global leaderboards",
      "Achievement unlocks"
    ]
  },
  {
    icon: Rocket,
    title: "Career Acceleration",
    description: "Industry-aligned paths that prepare you for real-world success",
    color: "from-indigo-500 to-purple-500",
    details: [
      "Industry standards",
      "Job market insights",
      "Skill gap analysis",
      "Career roadmaps"
    ]
  }
];

export function FeatureShowcase() {
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-6">
            Revolutionary Features
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the future of learning with cutting-edge AI technology and innovative design
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              onHoverStart={() => setActiveFeature(index)}
              className="group cursor-pointer"
            >
              <div className="relative p-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 h-full">
                {/* Glow effect */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}
                />
                
                {/* Icon */}
                <motion.div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} p-4 mb-6 group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: 5 }}
                >
                  <feature.icon className="w-full h-full text-white" />
                </motion.div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                {/* Details */}
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ 
                    height: activeFeature === index ? 'auto' : 0,
                    opacity: activeFeature === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <ul className="space-y-2">
                    {feature.details.map((detail, detailIndex) => (
                      <motion.li
                        key={detailIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ 
                          opacity: activeFeature === index ? 1 : 0,
                          x: activeFeature === index ? 0 : -20
                        }}
                        transition={{ duration: 0.3, delay: detailIndex * 0.1 }}
                        className="flex items-center gap-2 text-sm text-gray-300"
                      >
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        {detail}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                {/* Arrow */}
                <motion.div
                  className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ x: 5 }}
                >
                  <ArrowRight className="w-5 h-5 text-purple-400" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl border border-purple-500/30 backdrop-blur-sm">
            <span className="text-lg text-white font-medium">Ready to experience the future?</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold flex items-center gap-2"
            >
              Get Started <ArrowRight size={16} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
