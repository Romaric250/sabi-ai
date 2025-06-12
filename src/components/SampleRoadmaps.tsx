"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Users, BookOpen, ArrowRight, Star } from "lucide-react";
import { useTempSession } from "@/lib/temp-auth-client";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface SampleRoadmapsProps {
  onSelectRoadmap: (roadmapId: string) => void;
}

interface SampleRoadmap {
  id: string;
  title: string;
  description: string;
  stages: number;
  duration: string;
  difficulty: string;
  color: string;
  icon: string;
  topics: string[];
  learners: string;
}

export function SampleRoadmaps({ onSelectRoadmap }: SampleRoadmapsProps) {
  const [sampleRoadmaps, setSampleRoadmaps] = useState<SampleRoadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const { data } = useTempSession();
  const isAuthenticated = !!data?.user;

  const fetchSampleRoadmaps = async () => {
    try {
      const response = await fetch("/api/sample-roadmaps");
      if (response.ok) {
        const roadmaps = await response.json();
        setSampleRoadmaps(roadmaps);
      } else {
        console.error("API failed with status:", response.status);
        setSampleRoadmaps(staticSampleRoadmaps);
      }
    } catch (error) {
      console.error("Error fetching sample roadmaps:", error);
      setSampleRoadmaps(staticSampleRoadmaps);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSampleRoadmaps();
  }, [fetchSampleRoadmaps]);

  // Static fallback data
  const staticSampleRoadmaps: SampleRoadmap[] = [
    {
      id: "static-1",
      title: "Algebra Fundamentals",
      description:
        "Master algebraic concepts from basic equations to advanced functions",
      stages: 6,
      duration: "8-10 weeks",
      difficulty: "Beginner",
      color: "from-blue-400 to-cyan-500",
      icon: "📐",
      topics: ["Linear Equations", "Quadratic Functions", "Polynomials"],
      learners: "24.8k",
    },
    {
      id: "static-2",
      title: "Biology: Cell Structure & Function",
      description:
        "Explore the fundamental unit of life and cellular processes",
      stages: 7,
      duration: "6-8 weeks",
      difficulty: "Intermediate",
      color: "from-green-400 to-emerald-500",
      icon: "🧬",
      topics: ["Cell Theory", "Organelles", "Cell Membrane"],
      learners: "18.5k",
    },
    {
      id: "static-3",
      title: "World History: Ancient Civilizations",
      description: "Journey through the rise and fall of ancient empires",
      stages: 8,
      duration: "10-12 weeks",
      difficulty: "Intermediate",
      color: "from-amber-400 to-orange-500",
      icon: "🏛️",
      topics: ["Mesopotamia", "Ancient Egypt", "Greek Empire"],
      learners: "16.2k",
    },
  ];

  const handleRoadmapClick = async (roadmapId: string) => {
    const roadmap = sampleRoadmaps.find((r) => r.id === roadmapId);
    if (!roadmap) return;

    if (!isAuthenticated) {
      // If not authenticated, just redirect to generate that roadmap
      onSelectRoadmap(roadmap.title);
      return;
    }

    // For authenticated users, check if it's a sample ID
    if (roadmapId.startsWith("static-") || roadmapId.startsWith("sample-")) {
      // For sample roadmaps, just generate with the title
      onSelectRoadmap(roadmap.title);
      return;
    }

    try {
      // For database roadmaps, create user roadmap relationship
      const response = await fetch("/api/user-roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roadmapId }),
      });

      if (response.ok) {
        // Redirect to dashboard with the roadmap
        window.location.href = `/dashboard?roadmapId=${roadmapId}`;
      } else {
        // Fallback to generating with title
        onSelectRoadmap(roadmap.title);
      }
    } catch (error) {
      console.error("Error creating user roadmap:", error);
      // Fallback to generating with title
      onSelectRoadmap(roadmap.title);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "text-green-500 bg-green-100";
      case "Intermediate":
        return "text-yellow-600 bg-yellow-100";
      case "Advanced":
        return "text-red-500 bg-red-100";
      default:
        return "text-gray-500 bg-gray-100";
    }
  };

  if (loading) {
    return (
      <section className="py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-200 rounded-2xl h-96"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 ">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Popular Learning Paths
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of learners on these expertly crafted roadmaps
            designed to take you from beginner to expert
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleRoadmaps.map((roadmap, index) => (
            <Card key={roadmap.id} className="">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {roadmap.title}
                </h3>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {roadmap.description}
                </p>

                <div className="flex items-center gap-6 mb-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} />
                    <span>{roadmap.stages} stages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{roadmap.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    <span>{roadmap.learners}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {roadmap.topics.slice(0, 3).map((topic, topicIndex) => (
                      <span
                        key={topicIndex}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                      >
                        {topic}
                      </span>
                    ))}
                    {roadmap.topics.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
                        +{roadmap.topics.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  onClick={() => handleRoadmapClick(roadmap.id)}
                  className="w-full"
                >
                  {isAuthenticated ? "Continue Learning" : "Start Learning"}
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 mb-6">
            &quot;Can&apos;t find what you&apos;re looking for? Create a custom
            roadmap for any topic!&quot;
          </p>
          <div className="flex items-center justify-center gap-2 text-yellow-500">
            <Star size={20} fill="currentColor" />
            <span className="font-semibold">
              AI-powered personalized learning paths
            </span>
            <Star size={20} fill="currentColor" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
