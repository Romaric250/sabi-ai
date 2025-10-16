"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { RoadmapStage } from "@/types/roadmap";
import { SimpleCandyCrushRoadmap } from "@/components/SimpleCandyCrushRoadmap";
import { StageModal } from "@/components/StageModal";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BookOpen, Clock, Target, CheckCircle, Sparkles, BarChart3, Users, Star, Brain, Rocket, Trophy, Zap, Award, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

// Interface compatible with SimpleCandyCrushRoadmap
interface CompatibleRoadmapStage {
  id: string;
  title: string;
  description: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  position: { x: number; y: number };
  color: string;
  icon: any;
  lessons: string[];
  materials: any[];
  quiz: any[];
}

interface RoadmapData {
  id: string;
  title: string;
  content: RoadmapStage[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export default function RoadmapPage() {
  const params = useParams();
  const router = useRouter();
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [stages, setStages] = useState<CompatibleRoadmapStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStage, setSelectedStage] = useState<RoadmapStage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isCompletingStage, setIsCompletingStage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const fetchRoadmap = async () => {
      try {
        const response = await fetch(`/api/roadmap/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setRoadmap(data);
          
          // Parse and process stages
          let parsedStages: RoadmapStage[] = [];
          
          if (data.content && typeof data.content === 'string') {
            try {
              const content = JSON.parse(data.content);
              parsedStages = Array.isArray(content) ? content : [];
            } catch (e) {
              console.error('Error parsing roadmap content:', e);
              parsedStages = [];
            }
          } else if (data.content && Array.isArray(data.content)) {
            parsedStages = data.content;
          } else if (data.content && typeof data.content === 'object') {
            // Handle object with numeric keys
            const contentObj = data.content as Record<string, any>;
            parsedStages = Object.keys(contentObj)
              .filter(key => !isNaN(Number(key)))
              .sort((a, b) => Number(a) - Number(b))
              .map(key => contentObj[key]);
          }

          // Process stages to add required properties
          const processedStages: CompatibleRoadmapStage[] = parsedStages.map((stage, index) => ({
            id: stage.id || `stage-${index}`,
            title: stage.title || `Stage ${index + 1}`,
            description: stage.description || `Complete this stage to continue`,
            isUnlocked: index === 0 || stage.isUnlocked || false,
            isCompleted: stage.isCompleted || false,
            position: stage.position || { x: index % 3, y: Math.floor(index / 3) },
            color: stage.color || "from-gray-500 to-black",
            icon: stage.icon || "Star",
            lessons: stage.lessons || [],
            materials: stage.materials || [],
            quiz: stage.quiz || []
          }));

          setStages(processedStages);

          // Fetch existing progress from database
          try {
            const progressResponse = await fetch(`/api/user-roadmap/progress?roadmapId=${params.id}`);
            if (progressResponse.ok) {
              const progressData = await progressResponse.json();
              const completedStages = progressData.progress?.completedStages || [];
              
              console.log('Dashboard progress loading debug:', {
                roadmapId: params.id,
                completedStages,
                totalStages: processedStages.length,
                progressPercentage: progressData.progress?.percentage
              });
              
              // Update stages with actual completion status from database
              setStages(prevStages => 
                prevStages.map((stage, index) => ({
                  ...stage,
                  isCompleted: completedStages.includes(index),
                  isUnlocked: index === 0 || completedStages.includes(index - 1),
                }))
              );
            }
          } catch (progressError) {
            console.error('Error fetching progress:', progressError);
          }
        }
      } catch (error) {
        console.error('Error fetching roadmap:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchRoadmap();
    }
  }, [params.id]);

  const handleStageClick = (stage: RoadmapStage) => {
    setSelectedStage(stage);
    setIsModalOpen(true);
  };

  const handleStageComplete = async (stageId: string) => {
    console.log('handleStageComplete called with stageId:', stageId);
    setIsCompletingStage(stageId);
    
    try {
      // Update local state immediately for better UX
      setStages(prevStages => 
        prevStages.map((stage, index) => {
          if (stage.id === stageId) {
            return { ...stage, isCompleted: true };
          }
          // Unlock next stage if previous stage was completed
          const stageIndex = prevStages.findIndex(s => s.id === stageId);
          if (index === stageIndex + 1) {
            return { ...stage, isUnlocked: true };
          }
          return stage;
        })
      );

      // Update progress in database
      const requestBody = {
        roadmapId: params.id,
        stageId,
        isCompleted: true,
      };
      
      console.log('Sending progress update request:', requestBody);
      
      const response = await fetch('/api/user-roadmap/progress', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        console.error('Failed to update progress in database');
        // Revert local state if database update failed
        setStages(prevStages => 
          prevStages.map((stage, index) => {
            if (stage.id === stageId) {
              return { ...stage, isCompleted: false };
            }
            // Revert next stage unlock
            const stageIndex = prevStages.findIndex(s => s.id === stageId);
            if (index === stageIndex + 1) {
              return { ...stage, isUnlocked: false };
            }
            return stage;
          })
        );
      } else {
        console.log('Progress updated successfully');
        
        // Dispatch custom event to notify sidebar of progress update
        window.dispatchEvent(new CustomEvent('roadmapProgressUpdated', {
          detail: { roadmapId: params.id }
        })      );
    }
  } catch (error) {
    console.error('Error updating progress:', error);
    // Revert local state if there was an error
    setStages(prevStages => 
      prevStages.map((stage, index) => {
        if (stage.id === stageId) {
          return { ...stage, isCompleted: false };
        }
        // Revert next stage unlock
        const stageIndex = prevStages.findIndex(s => s.id === stageId);
        if (index === stageIndex + 1) {
          return { ...stage, isUnlocked: false };
        }
        return stage;
      })
    );
  } finally {
    setIsCompletingStage(null);
  }
};

  const getProgressStats = () => {
    if (stages.length === 0) return { completed: 0, total: 0, percentage: 0 };
    
    const completed = stages.filter(stage => stage.isCompleted).length;
    const total = stages.length;
    const percentage = Math.round((completed / total) * 100);
    
    return { completed, total, percentage };
  };

  const progressStats = getProgressStats();

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-8"
        >
          {/* Enhanced loading animation */}
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-gray-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            {/* Floating particles */}
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-black/30 rounded-full animate-pulse" />
            <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-black/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-3"
          >
            <h3 className="text-xl font-semibold text-gray-700">Loading your roadmap...</h3>
            <p className="text-gray-500">Preparing your learning journey</p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <BookOpen className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-black">Roadmap Not Found</h2>
          <p className="text-gray-600">The requested roadmap could not be loaded.</p>
          <Button onClick={() => window.history.back()} variant="outline" className="group hover:bg-gray-50">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Go Back
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 p-6 relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-black/5 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-black/5 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-black/3 rounded-full blur-2xl animate-float" />
      </div>
      
      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        {/* Enhanced Header */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Button 
              variant="ghost" 
              onClick={() => router.push('/dashboard')}
              className="mb-8 hover:bg-gray-100 transition-all duration-300 hover:shadow-lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              Back to Dashboard
            </Button>
          </motion.div>

          {/* Main Header */}
          <div className="text-center space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="inline-flex items-center space-x-2 bg-black/10 px-6 py-3 rounded-full border border-black/20 backdrop-blur-sm"
            >
              <Sparkles className="w-5 h-5 text-black animate-pulse" />
              <span className="text-sm font-semibold text-black">Learning Roadmap</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-6xl font-bold text-black leading-tight"
            >
              {roadmap.title}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
            >
              Embark on your learning journey through interactive stages designed to guide you step by step toward mastery.
            </motion.p>
          </div>
        </motion.div>

        {/* Enhanced Progress Overview Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {[
            {
              icon: Target,
              title: "Total Stages",
              value: progressStats.total,
              bgColor: "bg-black/10"
            },
            {
              icon: CheckCircle,
              title: "Completed",
              value: progressStats.completed,
              bgColor: "bg-black/10"
            },
            {
              icon: BarChart3,
              title: "Progress",
              value: `${progressStats.percentage}%`,
              bgColor: "bg-black/10"
            },
            {
              icon: Clock,
              title: "Est. Time",
              value: `~${Math.ceil(progressStats.total * 0.5)}h`,
              bgColor: "bg-black/10"
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
              className="bg-white/90 backdrop-blur-xl border border-gray-200/60 rounded-3xl p-6 hover:shadow-xl transition-all duration-500 group cursor-pointer transform hover:-translate-y-2 hover:scale-[1.02]"
            >
              <div className={`w-12 h-12 ${stat.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <stat.icon className="w-6 h-6 text-black" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-black">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Progress Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="bg-white/90 backdrop-blur-xl border border-gray-200/60 rounded-3xl p-8 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-black">Overall Progress</h3>
            <span className="text-lg font-medium text-gray-600">{progressStats.completed} of {progressStats.total} stages</span>
          </div>
          <div className="w-full bg-gray-200/60 rounded-full h-4 overflow-hidden">
            <motion.div
              className="h-4 bg-black rounded-full transition-all duration-1000 ease-out"
              initial={{ width: 0 }}
              animate={{ width: `${progressStats.percentage}%` }}
              transition={{ duration: 1.5, delay: 2 }}
            />
          </div>
        </motion.div>

        {/* Enhanced Candy Crush Roadmap */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2 }}
          className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-gray-200/60 relative overflow-hidden"
        >
          {/* Floating background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <Star className="absolute top-8 right-8 w-6 h-6 text-black/10 animate-float" />
            <Brain className="absolute bottom-8 left-8 w-5 h-5 text-black/10 animate-float" style={{ animationDelay: '1s' }} />
            <Rocket className="absolute top-1/2 right-12 w-4 h-4 text-black/10 animate-bounce-soft" style={{ animationDelay: '0.5s' }} />
          </div>
          
          <div className="text-center mb-10 relative z-10">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.2 }}
              className="text-3xl font-bold text-black mb-3"
            >
              Your Learning Path
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.4 }}
              className="text-gray-600 text-lg"
            >
              Click on any stage to begin learning or review completed content
            </motion.p>
          </div>
          
          <SimpleCandyCrushRoadmap 
            stages={stages} 
            onStageClick={(stageId) => {
              const stage = stages.find(s => s.id === stageId);
              if (stage) handleStageClick(stage);
            }}
          />
        </motion.div>

        {/* Enhanced Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: Users,
              title: "Study Together",
              description: "Join study groups with fellow learners",
              bgColor: "bg-black/10"
            },
            {
              icon: BarChart3,
              title: "View Analytics",
              description: "Track your learning progress and insights",
              bgColor: "bg-black/10"
            },
            {
              icon: Sparkles,
              title: "Get Help",
              description: "AI-powered assistance and support",
              bgColor: "bg-black/10"
            }
          ].map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.8 + index * 0.1 }}
              className="bg-white/90 backdrop-blur-xl border border-gray-200/60 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 group cursor-pointer transform hover:-translate-y-2 hover:scale-[1.02]"
            >
              <div className={`w-16 h-16 ${action.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                <action.icon className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">{action.title}</h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">{action.description}</p>
              <Button variant="ghost" className="text-black hover:text-gray-700 p-0 h-auto font-medium group-hover:translate-x-1 transition-transform duration-300">
                Learn more
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Stage Modal */}
        <AnimatePresence>
          {selectedStage && (
            <StageModal
              stage={selectedStage}
              isOpen={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                setSelectedStage(null);
              }}
              onComplete={handleStageComplete}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
