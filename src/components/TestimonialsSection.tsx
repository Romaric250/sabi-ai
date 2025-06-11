'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Alex Chen",
    role: "Software Engineer at Google",
    avatar: "AC",
    content: "The AI-powered roadmaps are incredibly detailed and personalized. I went from zero to landing my dream job at Google in just 8 months following the Full-Stack Development path.",
    rating: 5,
    skills: ["React", "Node.js", "System Design"],
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    id: 2,
    name: "Maria Rodriguez",
    role: "Data Scientist at Netflix",
    avatar: "MR",
    content: "The interactive quizzes and visual learning approach made complex machine learning concepts so much easier to understand. The progress tracking kept me motivated throughout.",
    rating: 5,
    skills: ["Python", "Machine Learning", "Statistics"],
    gradient: "from-purple-500 to-pink-500"
  },
  {
    id: 3,
    name: "David Kim",
    role: "DevOps Engineer at Amazon",
    avatar: "DK",
    content: "What sets this platform apart is how it adapts to your learning style. The AI noticed I was struggling with Kubernetes and automatically provided additional resources and practice.",
    rating: 5,
    skills: ["AWS", "Kubernetes", "Docker"],
    gradient: "from-green-500 to-emerald-500"
  },
  {
    id: 4,
    name: "Sarah Thompson",
    role: "UX Designer at Airbnb",
    avatar: "ST",
    content: "The gamification elements and achievement system made learning addictive in the best way. I completed my entire UX/UI roadmap 3 weeks ahead of schedule!",
    rating: 5,
    skills: ["Figma", "User Research", "Prototyping"],
    gradient: "from-orange-500 to-red-500"
  },
  {
    id: 5,
    name: "James Wilson",
    role: "Mobile Developer at Spotify",
    avatar: "JW",
    content: "The community features are amazing. Being able to connect with other learners on similar paths and share progress created an incredible support network.",
    rating: 5,
    skills: ["React Native", "iOS", "Android"],
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    id: 6,
    name: "Emily Davis",
    role: "Blockchain Developer at Coinbase",
    avatar: "ED",
    content: "The platform's ability to generate roadmaps for emerging technologies like blockchain and Web3 is unmatched. It's always up-to-date with industry trends.",
    rating: 5,
    skills: ["Solidity", "Web3", "Smart Contracts"],
    gradient: "from-yellow-500 to-orange-500"
  }
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 10,
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
            Success Stories
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Real learners, real results. See how our AI-powered platform has transformed careers worldwide.
          </p>
        </motion.div>

        {/* Main testimonial display */}
        <div className="relative max-w-4xl mx-auto mb-16">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-700/50 p-8 md:p-12">
              {/* Quote icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute -top-6 left-8"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${testimonials[currentIndex].gradient} rounded-full flex items-center justify-center`}>
                  <Quote className="w-6 h-6 text-white" />
                </div>
              </motion.div>

              {/* Content */}
              <div className="pt-6">
                {/* Stars */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex gap-1 mb-6"
                >
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </motion.div>

                {/* Testimonial text */}
                <motion.blockquote
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl md:text-2xl text-gray-200 leading-relaxed mb-8 italic"
                >
                  "{testimonials[currentIndex].content}"
                </motion.blockquote>

                {/* Author info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-4 mb-6"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${testimonials[currentIndex].gradient} rounded-full flex items-center justify-center`}>
                    <span className="text-white font-bold text-lg">
                      {testimonials[currentIndex].avatar}
                    </span>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-lg">
                      {testimonials[currentIndex].name}
                    </div>
                    <div className="text-gray-400">
                      {testimonials[currentIndex].role}
                    </div>
                  </div>
                </motion.div>

                {/* Skills */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap gap-2"
                >
                  {testimonials[currentIndex].skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-slate-700/50 text-gray-300 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Navigation buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-slate-800/80 backdrop-blur-sm border border-slate-600 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:border-purple-500/50 transition-all duration-300"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-slate-800/80 backdrop-blur-sm border border-slate-600 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:border-purple-500/50 transition-all duration-300"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Testimonial indicators */}
        <div className="flex justify-center gap-3 mb-16">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-purple-500 scale-125'
                  : 'bg-slate-600 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>

        {/* All testimonials grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/30 p-6 hover:border-purple-500/30 transition-all duration-300 cursor-pointer"
              onClick={() => goToTestimonial(index)}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 bg-gradient-to-r ${testimonial.gradient} rounded-full flex items-center justify-center`}>
                  <span className="text-white font-bold text-sm">
                    {testimonial.avatar}
                  </span>
                </div>
                <div>
                  <div className="text-white font-medium text-sm">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {testimonial.role.split(' at ')[0]}
                  </div>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                "{testimonial.content}"
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
