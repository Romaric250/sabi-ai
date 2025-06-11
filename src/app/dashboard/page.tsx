'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { Brain, Sparkles, Trophy, Star, Zap, MessageCircle, Upload, ArrowLeft } from 'lucide-react';
import { SimpleCandyCrushRoadmap } from '@/components/SimpleCandyCrushRoadmap';
import { MagicalLoader } from '@/components/MagicalLoader';
import { StageModal } from '@/components/StageModal';
import { ChatInterface } from '@/components/ChatInterface';
import { UploadInterface } from '@/components/UploadInterface';
import Link from 'next/link';

interface RoadmapStage {
  id: string;
  title: string;
  description: string;
  lessons: string[];
  materials: string[];
  quiz: {
    question: string;
    options: string[];
    correct: number;
  }[];
  isUnlocked: boolean;
  isCompleted: boolean;
  position: { x: number; y: number };
  color: string;
  icon: any;
}

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const prompt = searchParams.get('prompt') || 'Trigonometry';

  const [isGenerating, setIsGenerating] = useState(true);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [roadmapStages, setRoadmapStages] = useState<RoadmapStage[]>([]);
  const [selectedStage, setSelectedStage] = useState<RoadmapStage | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [showUpload, setShowUpload] = useState(false);



  // Mock roadmap data for trigonometry
  const mockTrigonometryRoadmap: RoadmapStage[] = [
    {
      id: '1',
      title: 'Basic Angles',
      description: 'Understanding degrees, radians, and angle measurement',
      lessons: ['What are angles?', 'Degrees vs Radians', 'Unit Circle Introduction'],
      materials: ['Interactive Angle Visualizer', 'Degree-Radian Converter', 'Practice Worksheets'],
      quiz: [
        {
          question: 'How many degrees are in a full circle?',
          options: ['180°', '270°', '360°', '90°'],
          correct: 2
        },
        {
          question: 'What is π radians in degrees?',
          options: ['90°', '180°', '270°', '360°'],
          correct: 1
        }
      ],
      isUnlocked: true,
      isCompleted: false,
      position: { x: 2, y: 0 },
      color: 'from-green-400 to-emerald-500',
      icon: Zap
    },
    {
      id: '2',
      title: 'Sine Function',
      description: 'Master the sine function and its properties',
      lessons: ['Definition of Sine', 'Sine Wave Properties', 'Sine in Right Triangles'],
      materials: ['Sine Wave Simulator', 'Triangle Calculator', 'Graphing Tool'],
      quiz: [
        {
          question: 'What is sin(90°)?',
          options: ['0', '1', '-1', '0.5'],
          correct: 1
        }
      ],
      isUnlocked: false,
      isCompleted: false,
      position: { x: 1, y: 1 },
      color: 'from-blue-400 to-cyan-500',
      icon: Brain
    },
    {
      id: '3',
      title: 'Cosine Function',
      description: 'Explore cosine and its relationship to sine',
      lessons: ['Definition of Cosine', 'Cosine Wave Properties', 'Cosine in Right Triangles'],
      materials: ['Cosine Wave Simulator', 'Comparison Tool', 'Practice Problems'],
      quiz: [
        {
          question: 'What is cos(0°)?',
          options: ['0', '1', '-1', '0.5'],
          correct: 1
        }
      ],
      isUnlocked: false,
      isCompleted: false,
      position: { x: 3, y: 1 },
      color: 'from-purple-400 to-pink-500',
      icon: Sparkles
    },
    {
      id: '4',
      title: 'Tangent Function',
      description: 'Understanding tangent and its applications',
      lessons: ['Definition of Tangent', 'Tangent Properties', 'Tangent in Problem Solving'],
      materials: ['Tangent Visualizer', 'Slope Calculator', 'Real-world Examples'],
      quiz: [
        {
          question: 'What is tan(45°)?',
          options: ['0', '1', '-1', '√3'],
          correct: 1
        }
      ],
      isUnlocked: false,
      isCompleted: false,
      position: { x: 2, y: 2 },
      color: 'from-orange-400 to-red-500',
      icon: Star
    },
    {
      id: '5',
      title: 'Trig Identities',
      description: 'Master fundamental trigonometric identities',
      lessons: ['Pythagorean Identity', 'Sum and Difference Formulas', 'Double Angle Formulas'],
      materials: ['Identity Proof Tool', 'Formula Reference', 'Practice Generator'],
      quiz: [
        {
          question: 'What is sin²θ + cos²θ equal to?',
          options: ['0', '1', 'tan²θ', '2'],
          correct: 1
        }
      ],
      isUnlocked: false,
      isCompleted: false,
      position: { x: 1, y: 3 },
      color: 'from-indigo-400 to-purple-500',
      icon: Trophy
    },
    {
      id: '6',
      title: 'Applications',
      description: 'Real-world applications of trigonometry',
      lessons: ['Physics Applications', 'Engineering Uses', 'Navigation and GPS'],
      materials: ['Simulation Tools', 'Case Studies', 'Project Ideas'],
      quiz: [
        {
          question: 'Trigonometry is used in which field?',
          options: ['Physics', 'Engineering', 'Navigation', 'All of the above'],
          correct: 3
        }
      ],
      isUnlocked: false,
      isCompleted: false,
      position: { x: 3, y: 3 },
      color: 'from-yellow-400 to-orange-500',
      icon: Brain
    }
  ];

  useEffect(() => {
    // Real AI roadmap generation
    const generateRoadmap = async () => {
      setIsGenerating(true);
      setGenerationProgress(0);

      try {
        // Simulate progress during AI generation
        const progressInterval = setInterval(() => {
          setGenerationProgress(prev => {
            if (prev >= 90) return prev;
            return prev + Math.random() * 10;
          });
        }, 200);

        console.log('Generating roadmap for:', prompt);

        // Call the real AI API
        const response = await fetch('/api/generate-roadmap', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('AI Response:', data);

        clearInterval(progressInterval);
        setGenerationProgress(100);

        if (data.success && data.roadmap) {
          // Transform AI roadmap to match our interface
          const transformedRoadmap = data.roadmap.map((stage: any, index: number) => ({
            ...stage,
            isUnlocked: index === 0, // Only first stage is unlocked
            isCompleted: false,
            icon: [Zap, Brain, Sparkles, Star, Trophy, Brain][index] || Brain
          }));

          setTimeout(() => {
            setRoadmapStages(transformedRoadmap);
            setIsGenerating(false);
          }, 1000);
        } else {
          throw new Error('Failed to generate roadmap');
        }

      } catch (error) {
        console.error('Error generating roadmap:', error);

        // Fallback to mock data on error
        setTimeout(() => {
          setRoadmapStages(mockTrigonometryRoadmap);
          setIsGenerating(false);
        }, 1000);
      }
    };

    generateRoadmap();
  }, [prompt]);

  const handleStageClick = (stageId: string) => {
    const stage = roadmapStages.find(s => s.id === stageId);
    if (stage && stage.isUnlocked) {
      setSelectedStage(stage);
    }
  };

  const handleStageComplete = (stageId: string) => {
    setRoadmapStages(prev => prev.map(stage => {
      if (stage.id === stageId) {
        return { ...stage, isCompleted: true };
      }
      // Unlock next stage
      if (stage.id === String(parseInt(stageId) + 1)) {
        return { ...stage, isUnlocked: true };
      }
      return stage;
    }));
    setSelectedStage(null);

    // Show success message
    console.log(`Stage ${stageId} completed! Next stage unlocked.`);
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <h1 className="text-5xl sm:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Creating Your
            </h1>
            <h2 className="text-6xl sm:text-8xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              {prompt} Journey
            </h2>
          </motion.div>

          <motion.div
            className="relative w-48 h-48 mx-auto mb-16"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-2xl opacity-60" />
            <motion.div
              className="absolute inset-4 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full overflow-hidden"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-full h-full rounded-full flex items-center justify-center">
                <Brain className="w-16 h-16 text-white" />
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-12 max-w-2xl mx-auto"
          >
            <div className="relative w-full h-6 bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-slate-700/50">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full relative"
                initial={{ width: 0 }}
                animate={{ width: `${generationProgress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
                  animate={{ x: ['-100%', '300%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
            </div>
            <div className="text-center mt-4">
              <span className="text-4xl font-bold text-white">{generationProgress}%</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="inline-flex items-center gap-6 px-8 py-6 rounded-2xl backdrop-blur-sm border border-white/10 bg-gradient-to-r from-purple-500/20 to-blue-500/20">
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ rotate: { duration: 3, repeat: Infinity, ease: "linear" }, scale: { duration: 1, repeat: Infinity } }}
                className="text-purple-400"
              >
                <Sparkles size={32} />
              </motion.div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-white mb-2">
                  🧠 AI is crafting your personalized roadmap...
                </h3>
                <p className="text-gray-300 text-lg">
                  Creating the perfect learning journey just for you
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Magical background effects */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
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
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-20 p-6"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              Back
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {prompt} Mastery Path
              </h1>
              <p className="text-gray-400 mt-1">Your personalized learning journey</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowUpload(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:scale-105 transition-transform"
            >
              <Upload size={20} />
              Upload Materials
            </button>
            <button
              onClick={() => setShowChat(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:scale-105 transition-transform"
            >
              <MessageCircle size={20} />
              AI Tutor Chat
            </button>
          </div>
        </div>
      </motion.div>

      {/* Candy Crush Style Roadmap */}
      <div className="relative z-10 px-6 pb-6">
        <SimpleCandyCrushRoadmap stages={roadmapStages} onStageClick={handleStageClick} />
      </div>

      {/* Stage Modal */}
      <AnimatePresence>
        {selectedStage && (
          <StageModal
            stage={selectedStage}
            onClose={() => setSelectedStage(null)}
            onComplete={handleStageComplete}
          />
        )}
      </AnimatePresence>

      {/* Chat Interface */}
      <AnimatePresence>
        {showChat && (
          <ChatInterface
            onClose={() => setShowChat(false)}
            context={prompt}
          />
        )}
      </AnimatePresence>

      {/* Upload Interface */}
      <AnimatePresence>
        {showUpload && (
          <UploadInterface
            onClose={() => setShowUpload(false)}
            onUpload={(files) => {
              // Handle file upload
              console.log('Files uploaded:', files);
              setShowUpload(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
