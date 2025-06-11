'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { Brain, Sparkles, Trophy, Star, Zap, MessageCircle, Upload, ArrowLeft } from 'lucide-react';
import { CandyCrushPathway } from '@/components/CandyCrushPathway';
import { StageSheet } from '@/components/StageSheet';
import { FinalQuizModal } from '@/components/FinalQuizModal';

import { RoadmapStage, FinalQuiz } from '@/types/roadmap';
import Link from 'next/link';

// Remove local interface since we're importing from types

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const prompt = searchParams.get('prompt') || 'Trigonometry';

  const [isGenerating, setIsGenerating] = useState(true);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [roadmapStages, setRoadmapStages] = useState<RoadmapStage[]>([]);
  const [selectedStage, setSelectedStage] = useState<RoadmapStage | null>(null);
  const [showFinalQuiz, setShowFinalQuiz] = useState(false);
  const [finalQuiz, setFinalQuiz] = useState<FinalQuiz | null>(null);



  // Mock final quiz
  const mockFinalQuiz: FinalQuiz = {
    title: "Final Assessment: Trigonometry Mastery",
    description: "Comprehensive test covering all trigonometry concepts",
    questions: [
      {
        question: "What is the value of sin(30°)?",
        options: ["1/2", "√3/2", "√2/2", "1"],
        correct: 0,
        explanation: "sin(30°) = 1/2. This is a fundamental trigonometric value.",
        stage: "Sine Function"
      },
      {
        question: "Which identity represents the Pythagorean theorem in trigonometry?",
        options: ["sin²θ + cos²θ = 1", "tan²θ + 1 = sec²θ", "sin(2θ) = 2sin(θ)cos(θ)", "cos(θ) = sin(90° - θ)"],
        correct: 0,
        explanation: "sin²θ + cos²θ = 1 is the fundamental Pythagorean identity.",
        stage: "Trig Identities"
      },
      {
        question: "In which field is trigonometry NOT commonly used?",
        options: ["Navigation", "Engineering", "Cooking", "Physics"],
        correct: 2,
        explanation: "While trigonometry has many applications, it's not commonly used in cooking.",
        stage: "Applications"
      },
      {
        question: "What is tan(45°)?",
        options: ["0", "1", "√3", "undefined"],
        correct: 1,
        explanation: "tan(45°) = 1, as sin(45°) = cos(45°) = √2/2.",
        stage: "Tangent Function"
      },
      {
        question: "How many radians are in a full circle?",
        options: ["π", "2π", "π/2", "4π"],
        correct: 1,
        explanation: "A full circle contains 2π radians, equivalent to 360°.",
        stage: "Basic Angles"
      }
    ],
    passingScore: 80,
    timeLimit: 15
  };

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
          // Handle both old array format and new object format
          const stages = Array.isArray(data.roadmap) ? data.roadmap : data.roadmap.stages;
          const finalQuizData = data.roadmap.finalQuiz;

          // Transform AI roadmap to match our interface
          const transformedRoadmap = stages.map((stage: any, index: number) => ({
            ...stage,
            isUnlocked: index === 0, // Only first stage is unlocked
            isCompleted: false,
            icon: [Zap, Brain, Sparkles, Star, Trophy, Brain][index] || Brain
          }));

          setTimeout(() => {
            setRoadmapStages(transformedRoadmap);
            if (finalQuizData) {
              setFinalQuiz(finalQuizData);
            }
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
          setFinalQuiz(mockFinalQuiz);
          setIsGenerating(false);
        }, 1000);
      }
    };

    generateRoadmap();
  }, [prompt]);

  const handleStageClick = (stage: RoadmapStage) => {
    if (stage.isUnlocked) {
      setSelectedStage(stage);
    }
  };

  const handleFinalQuizClick = () => {
    // Check if all stages are completed
    const allCompleted = roadmapStages.every(stage => stage.isCompleted);
    if (allCompleted) {
      setFinalQuiz(mockFinalQuiz);
      setShowFinalQuiz(true);
    } else {
      alert('Complete all stages before taking the final quiz!');
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

  const handleFinalQuizComplete = (score: number, passed: boolean) => {
    setShowFinalQuiz(false);
    if (passed) {
      alert(`Congratulations! You scored ${score}% and completed the course!`);
    } else {
      alert(`You scored ${score}%. Review the materials and try again!`);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Candy Crush Style Roadmap - Full Screen */}
      <div className="relative z-10 w-full h-screen">
        <CandyCrushPathway
          stages={roadmapStages}
          onStageClick={handleStageClick}
          onFinalQuizClick={handleFinalQuizClick}
        />
      </div>

      {/* Stage Sheet */}
      {selectedStage && (
        <StageSheet
          stage={selectedStage}
          isOpen={!!selectedStage}
          onClose={() => setSelectedStage(null)}
          onComplete={handleStageComplete}
        />
      )}

      {/* Final Quiz Modal */}
      <AnimatePresence>
        {showFinalQuiz && finalQuiz && (
          <FinalQuizModal
            finalQuiz={finalQuiz}
            onClose={() => setShowFinalQuiz(false)}
            onComplete={handleFinalQuizComplete}
          />
        )}
      </AnimatePresence>


    </div>
  );
}
