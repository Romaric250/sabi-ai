"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star, Sparkles } from "lucide-react";
import { HolographicCard } from "./HolographicCard";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Data Scientist",
    company: "TechCorp",
    content: "Sabi AI transformed how I approach learning. The personalized roadmaps are incredibly accurate and the interactive features keep me engaged. I've learned more in 3 months than I did in a year with traditional methods.",
    rating: 5,
    avatar: "SC",
    gradient: "from-white/20 to-white/5"
  },
  {
    name: "Marcus Rodriguez",
    role: "Software Engineer",
    company: "InnovateLab",
    content: "The AI-powered recommendations are spot-on. It's like having a personal tutor who knows exactly what I need to learn next. The progress tracking keeps me motivated and accountable.",
    rating: 5,
    avatar: "MR",
    gradient: "from-white/15 to-white/5"
  },
  {
    name: "Dr. Emily Watson",
    role: "Research Director",
    company: "Quantum Research",
    content: "As someone who's always learning new technologies, Sabi AI has been a game-changer. The adaptive learning paths and comprehensive resources have accelerated my research significantly.",
    rating: 5,
    avatar: "EW",
    gradient: "from-white/20 to-white/5"
  },
  {
    name: "Alex Thompson",
    role: "Product Manager",
    company: "FutureTech",
    content: "The community features and collaborative learning aspects are fantastic. I've connected with like-minded learners and the shared progress tracking creates healthy competition.",
    rating: 5,
    avatar: "AT",
    gradient: "from-white/15 to-white/5"
  },
  {
    name: "Priya Patel",
    role: "UX Designer",
    company: "Design Studio",
    content: "The visual learning paths and interactive elements make complex topics accessible. The AI really understands my learning style and adapts the content perfectly.",
    rating: 5,
    avatar: "PP",
    gradient: "from-white/20 to-white/5"
  },
  {
    name: "David Kim",
    role: "Startup Founder",
    company: "NextGen Ventures",
    content: "Sabi AI helped me quickly master new skills for my startup. The personalized approach saved me countless hours and the results speak for themselves.",
    rating: 5,
    avatar: "DK",
    gradient: "from-white/15 to-white/5"
  }
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section ref={containerRef} className="relative py-24 overflow-hidden">
      {/* Background with animated elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black" />
      
      {/* Floating testimonial cards background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 border border-white/5 rounded-2xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          style={{ y, opacity }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 mb-6"
          >
            <Sparkles className="w-5 h-5 text-white" />
            <span className="text-white font-medium">What Our Learners Say</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Trusted by
            <br />
            <span className="text-gray-300">Thousands</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join a community of learners who have transformed their educational journey with AI-powered personalized learning
          </p>
        </motion.div>

        {/* Main testimonial display */}
        <div className="relative max-w-4xl mx-auto mb-16">
          {/* Navigation arrows */}
          <motion.button
            onClick={prevTestimonial}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </motion.button>

          <motion.button
            onClick={nextTestimonial}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </motion.button>

          {/* Current testimonial */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <HolographicCard
              title={testimonials[currentIndex].name}
              description={testimonials[currentIndex].content}
              icon={Quote}
              gradient={testimonials[currentIndex].gradient}
              delay={0}
            />
            
            {/* Additional testimonial info */}
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center gap-1 mb-4">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  </motion.div>
                ))}
              </div>
              
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center text-white font-semibold">
                  {testimonials[currentIndex].avatar}
                </div>
                <div className="text-left">
                  <div className="text-white font-semibold">
                    {testimonials[currentIndex].name}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {testimonials[currentIndex].role} at {testimonials[currentIndex].company}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Testimonial indicators */}
        <div className="flex justify-center gap-3 mb-16">
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentIndex(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? "bg-white scale-125" 
                  : "bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center"
        >
          {[
            { number: "50K+", label: "Active Learners" },
            { number: "95%", label: "Success Rate" },
            { number: "4.9/5", label: "User Rating" },
            { number: "200+", label: "Learning Paths" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.05 }}
              className="group"
            >
              <motion.div
                className="text-3xl md:text-4xl font-bold text-white mb-2"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
              >
                {stat.number}
              </motion.div>
              <div className="text-gray-400 group-hover:text-gray-300 transition-colors">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 