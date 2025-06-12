"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Users, BookOpen, Trophy, Zap, Target, Brain } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: 50000,
    suffix: "+",
    label: "Active Learners",
    description: "Students worldwide using our platform",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: BookOpen,
    value: 10000,
    suffix: "+",
    label: "Roadmaps Created",
    description: "AI-generated learning paths",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Trophy,
    value: 95,
    suffix: "%",
    label: "Success Rate",
    description: "Students completing their goals",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Zap,
    value: 24,
    suffix: "/7",
    label: "AI Support",
    description: "Always available assistance",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Target,
    value: 89,
    suffix: "%",
    label: "Goal Achievement",
    description: "Learners reaching milestones",
    color: "from-red-500 to-pink-500",
  },
  {
    icon: Brain,
    value: 1000,
    suffix: "+",
    label: "Skills Covered",
    description: "Different topics available",
    color: "from-indigo-500 to-purple-500",
  },
];

function CountUpAnimation({
  value,
  duration = 2000,
}: {
  value: number;
  duration?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      setCount(Math.floor(progress * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
}

export function StatsSection() {
  const [inView, setInView] = useState(false);

  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
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
            Trusted by Thousands
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join a global community of learners achieving their goals with
            AI-powered education
          </p>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          onViewportEnter={() => setInView(true)}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative p-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 h-full">
                {/* Glow effect */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}
                />

                {/* Icon */}
                <motion.div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-r ${stat.color} p-4 mb-6 group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: 5 }}
                >
                  <stat.icon className="w-full h-full text-white" />
                </motion.div>

                {/* Stats */}
                <div className="mb-4">
                  <div className="text-4xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {inView ? <CountUpAnimation value={stat.value} /> : "0"}
                    <span className="text-purple-400">{stat.suffix}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-200 mb-2">
                    {stat.label}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {stat.description}
                  </p>
                </div>

                {/* Progress bar animation */}
                <motion.div
                  className="h-1 bg-slate-700 rounded-full overflow-hidden"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                >
                  <motion.div
                    className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{
                      duration: 1.5,
                      delay: index * 0.1 + 0.7,
                      ease: "easeOut",
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <div className="max-w-4xl mx-auto">
            <blockquote className="text-2xl text-gray-300 italic mb-6">
              &quot;This platform completely transformed how I approach
              learning. The AI-generated roadmaps are incredibly accurate and
              the interactive quizzes keep me engaged throughout the
              journey.&quot;
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">SJ</span>
              </div>
              <div className="text-left">
                <div className="text-white font-semibold">Sarah Johnson</div>
                <div className="text-gray-400 text-sm">
                  Full-Stack Developer
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
