"use client";

import { authClient } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { Brain, LogOut, Play, Target, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GlowingButton } from "./GlowingButton";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
{
  /* <nav className="relative z-20 flex items-center justify-between py-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">LearnPath</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-4"
        >
          {data?.user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <User className="w-4 h-4 text-white" />
                <span className="text-white text-sm">
                  {data.user.name || data.user.email}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm rounded-full border border-red-500/30 text-red-300 hover:text-red-200 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full border border-white/20 text-white hover:text-white transition-colors"
            >
              Sign In
            </button>
          )}
        </motion.div>
      </nav> */
}

export function HeroSection() {
  const router = useRouter();
  const [currentExample, setCurrentExample] = useState(0);
  const { data, isPending } = authClient.useSession();

  const [inputValue, setInputValue] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const examples = [
    "I want to learn Trigonometry",
    "Teach me Advanced Calculus",
    "How do I master Linear Algebra?",
    "I want to learn Quantum Physics",
    "Show me Organic Chemistry fundamentals",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExample((prev) => (prev + 1) % examples.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [examples.length]);

  const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const prompt = inputValue;
    router.push(`/dashboard?prompt=${encodeURIComponent(prompt)}`);
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/auth/sign-in");
  };

  return (
    <section className="relative min-h-screen flex flex-col px-4 sm:px-6 lg:px-8 text">
      {/* <ParticleField /> */}

      {/* Navigation */}
      <nav className="z-20 flex items-center justify-between py-6 fixed top-0 left-0 right-0 px-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-3"
        >
          <span className="text-2xl font-bold text-primary">sabi</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-4"
        >
          {data?.user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-primary backdrop-blur-sm rounded-full border border-white/20">
                <User className="w-4 h-4 text-white" />
                <span className="text-white text-sm">
                  {data.user.name || data.user.email}
                </span>
              </div>
              <Button onClick={handleSignOut} variant="destructive">
                <LogOut className="size-4" />
                <span className="text-sm">Sign Out</span>
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full border border-white/20 text-white hover:text-white transition-colors"
            >
              Sign In
            </button>
          )}
        </motion.div>
      </nav>

      {/* Main content container */}
      <div className="flex-1 flex items-center justify-center">
        {/* Content will go here */}

        {/* Animated background elements */}
        {/* <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div> */}

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          {/* Floating icons */}
          {/* <motion.div
            className="absolute -top-20 -left-20 text-purple-400"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Brain size={40} />
          </motion.div>

          <motion.div
            className="absolute -top-10 -right-20 text-blue-400"
            animate={{
              y: [0, -15, 0],
              rotate: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sparkles size={35} />
          </motion.div>

          <motion.div
            className="absolute top-40 -left-32 text-green-400"
            animate={{
              y: [0, -25, 0],
              rotate: [0, 15, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Zap size={30} />
          </motion.div> */}

          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Main headline */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.7 }}
                className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight font-lora"
              >
                What can i help you understand?
              </motion.h1>

              {/* <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.9 }}
                className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
              >
                Transform any learning goal into an interactive, step-by-step
                journey.
                <br />
                <span className="text-purple-300">
                  AI-powered roadmaps that adapt to you.
                </span>
              </motion.p> */}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.1 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <div className="relative">
                  <form
                    onSubmit={handleGenerate}
                    className="flex flex-col gap-2"
                  >
                    <Textarea
                      placeholder="Enter your prompt"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleGenerate(
                            e as unknown as React.FormEvent<HTMLFormElement>
                          );
                        }
                      }}
                      className="h-20 resize-none"
                    />
                    <Button className="sr-only" type="submit">
                      Generate
                    </Button>
                  </form>
                </div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            {/* <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <GlowingButton
                onClick={handleGenerate}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-lg flex items-center gap-3 hover:scale-105 transition-all duration-300 shadow-2xl shadow-purple-500/25"
              >
                <Play size={24} />
                Start Learning Now
              </GlowingButton>

              <button className="px-8 py-4 border border-purple-500/50 text-purple-300 rounded-xl font-semibold text-lg hover:bg-purple-500/10 transition-all duration-300 flex items-center gap-3">
                <Target size={24} />
                See Demo
              </button>
            </motion.div> */}

            {/* Stats */}
            {/* <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="grid grid-cols-3 gap-8 max-w-md mx-auto pt-8"
            >
              <div className="text-center">
                <div className="text-3xl font-bold ">10K+</div>
                <div className="text-sm text-gray-400">Roadmaps Created</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">95%</div>
                <div className="text-sm text-gray-400">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold ">24/7</div>
                <div className="text-sm text-gray-400">AI Support</div>
              </div>
            </motion.div> */}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
