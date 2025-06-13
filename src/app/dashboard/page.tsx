"use client";

import { FinalQuizModal } from "@/components/FinalQuizModal";
import { StageSheet } from "@/components/StageSheet";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  Brain,
  Loader,
  Loader2,
  Sparkles,
  Star,
  Trophy,
  Zap,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import Stages from "@/components/stages";
import { authClient } from "@/lib/auth-client";
import { FinalQuiz, RoadmapStage, RoadmapData } from "@/types/roadmap";
import { transformRoadmap } from "@/lib/transform";

// API functions
async function generateRoadmap(prompt: string): Promise<RoadmapData> {
  const response = await fetch("/api/roadmap/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

const DashboardPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();
  const prompt = searchParams.get("prompt");

  const [selectedStage, setSelectedStage] = useState<RoadmapStage | null>(null);
  const [showFinalQuiz, setShowFinalQuiz] = useState(false);
  const [finalQuiz, setFinalQuiz] = useState<FinalQuiz | null>(null);
  const [roadmapStages, setRoadmapStages] = useState<RoadmapStage[]>([]);

  const {
    mutate: generateRoadmapMutation,
    isPending: isGenerating,
    error: generationError,
  } = useMutation({
    mutationFn: (prompt: string) => generateRoadmap(prompt),
    onSuccess: (data: RoadmapData) => {
      const transformedRoadmap = transformRoadmap(data);
      setRoadmapStages(transformedRoadmap.roadmap as RoadmapStage[]);
    },
    onError: (error: any) => {
      console.error("Error generating roadmap:", error);
      setRoadmapStages(mockTrigonometryRoadmap);
      setFinalQuiz(mockFinalQuiz);
    },
  });

  useEffect(() => {
    if (prompt) {
      generateRoadmapMutation(prompt);
    }
  }, [prompt, generateRoadmapMutation]);

  const mockFinalQuiz: FinalQuiz = {
    title: "Final Assessment: Trigonometry Mastery",
    description: "Comprehensive test covering all trigonometry concepts",
    questions: [
      {
        question: "What is the value of sin(30°)?",
        options: ["1/2", "√3/2", "√2/2", "1"],
        correct: 0,
        explanation:
          "sin(30°) = 1/2. This is a fundamental trigonometric value.",
        stage: "Sine Function",
      },
      {
        question:
          "Which identity represents the Pythagorean theorem in trigonometry?",
        options: [
          "sin²θ + cos²θ = 1",
          "tan²θ + 1 = sec²θ",
          "sin(2θ) = 2sin(θ)cos(θ)",
          "cos(θ) = sin(90° - θ)",
        ],
        correct: 0,
        explanation:
          "sin²θ + cos²θ = 1 is the fundamental Pythagorean identity.",
        stage: "Trig Identities",
      },
      {
        question: "In which field is trigonometry NOT commonly used?",
        options: ["Navigation", "Engineering", "Cooking", "Physics"],
        correct: 2,
        explanation:
          "While trigonometry has many applications, it's not commonly used in cooking.",
        stage: "Applications",
      },
      {
        question: "What is tan(45°)?",
        options: ["0", "1", "√3", "undefined"],
        correct: 1,
        explanation: "tan(45°) = 1, as sin(45°) = cos(45°) = √2/2.",
        stage: "Tangent Function",
      },
      {
        question: "How many radians are in a full circle?",
        options: ["π", "2π", "π/2", "4π"],
        correct: 1,
        explanation: "A full circle contains 2π radians, equivalent to 360°.",
        stage: "Basic Angles",
      },
    ],
    passingScore: 80,
    timeLimit: 15,
  };

  const mockTrigonometryRoadmap: RoadmapStage[] = [
    {
      id: "1",
      title: "Basic Angles",
      description: "Understanding degrees, radians, and angle measurement",
      lessons: [
        "What are angles?",
        "Degrees vs Radians",
        "Unit Circle Introduction",
      ],
      materials: [
        "Interactive Angle Visualizer",
        "Degree-Radian Converter",
        "Practice Worksheets",
      ],
      quiz: [
        {
          question: "How many degrees are in a full circle?",
          options: ["180°", "270°", "360°", "90°"],
          correct: 2,
        },
        {
          question: "What is π radians in degrees?",
          options: ["90°", "180°", "270°", "360°"],
          correct: 1,
        },
      ],
      isUnlocked: true,
      isCompleted: false,
      position: { x: 2, y: 0 },
      color: "from-green-400 to-emerald-500",
      icon: Zap,
    },
    {
      id: "2",
      title: "Sine Function",
      description: "Master the sine function and its properties",
      lessons: [
        "Definition of Sine",
        "Sine Wave Properties",
        "Sine in Right Triangles",
      ],
      materials: [
        "Sine Wave Simulator",
        "Triangle Calculator",
        "Graphing Tool",
      ],
      quiz: [
        {
          question: "What is sin(90°)?",
          options: ["0", "1", "-1", "0.5"],
          correct: 1,
        },
      ],
      isUnlocked: false,
      isCompleted: false,
      position: { x: 1, y: 1 },
      color: "from-blue-400 to-cyan-500",
      icon: Brain,
    },
    {
      id: "3",
      title: "Cosine Function",
      description: "Explore cosine and its relationship to sine",
      lessons: [
        "Definition of Cosine",
        "Cosine Wave Properties",
        "Cosine in Right Triangles",
      ],
      materials: [
        "Cosine Wave Simulator",
        "Comparison Tool",
        "Practice Problems",
      ],
      quiz: [
        {
          question: "What is cos(0°)?",
          options: ["0", "1", "-1", "0.5"],
          correct: 1,
        },
      ],
      isUnlocked: false,
      isCompleted: false,
      position: { x: 3, y: 1 },
      color: "from-purple-400 to-pink-500",
      icon: Sparkles,
    },
    {
      id: "4",
      title: "Tangent Function",
      description: "Understanding tangent and its applications",
      lessons: [
        "Definition of Tangent",
        "Tangent Properties",
        "Tangent in Problem Solving",
      ],
      materials: [
        "Tangent Visualizer",
        "Slope Calculator",
        "Real-world Examples",
      ],
      quiz: [
        {
          question: "What is tan(45°)?",
          options: ["0", "1", "-1", "√3"],
          correct: 1,
        },
      ],
      isUnlocked: false,
      isCompleted: false,
      position: { x: 2, y: 2 },
      color: "from-orange-400 to-red-500",
      icon: Star,
    },
    {
      id: "5",
      title: "Trig Identities",
      description: "Master fundamental trigonometric identities",
      lessons: [
        "Pythagorean Identity",
        "Sum and Difference Formulas",
        "Double Angle Formulas",
      ],
      materials: [
        "Identity Proof Tool",
        "Formula Reference",
        "Practice Generator",
      ],
      quiz: [
        {
          question: "What is sin²θ + cos²θ equal to?",
          options: ["0", "1", "tan²θ", "2"],
          correct: 1,
        },
      ],
      isUnlocked: false,
      isCompleted: false,
      position: { x: 1, y: 3 },
      color: "from-indigo-400 to-purple-500",
      icon: Trophy,
    },
    {
      id: "6",
      title: "Applications",
      description: "Real-world applications of trigonometry",
      lessons: [
        "Physics Applications",
        "Engineering Uses",
        "Navigation and GPS",
      ],
      materials: ["Simulation Tools", "Case Studies", "Project Ideas"],
      quiz: [
        {
          question: "Trigonometry is used in which field?",
          options: ["Physics", "Engineering", "Navigation", "All of the above"],
          correct: 3,
        },
      ],
      isUnlocked: false,
      isCompleted: false,
      position: { x: 3, y: 3 },
      color: "from-yellow-400 to-orange-500",
      icon: Brain,
    },
  ];

  const handleStageClick = (stage: RoadmapStage) => {
    if (stage.isUnlocked) {
      setSelectedStage(stage);
    }
  };

  const handleFinalQuizClick = () => {
    const allCompleted = roadmapStages.every((stage) => stage.isCompleted);
    if (allCompleted) {
      setFinalQuiz(mockFinalQuiz);
      setShowFinalQuiz(true);
    } else {
      alert("Complete all stages before taking the final quiz!");
    }
  };

  const handleStageComplete = (stageId: string) => {
    setRoadmapStages((prev) =>
      prev.map((stage) => {
        if (stage.id === stageId) {
          return { ...stage, isCompleted: true };
        }

        if (stage.id === String(parseInt(stageId) + 1)) {
          return { ...stage, isUnlocked: true };
        }
        return stage;
      })
    );
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
      <div className="min-h-screen py-20">
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <motion.div className="mx-auto w-full flex items-center justify-center gap-2">
            <Loader className="size-10 animate-spin text-primary" />
            <span className="text-xl font-bold">Cooking Your Journey</span>
          </motion.div>
        </div>
      </div>
    );
  }

  if (generationError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">
            Error Generating Roadmap
          </h2>
          <p className="text-gray-400">
            {generationError instanceof Error
              ? generationError.message
              : "An unexpected error occurred"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden">
      <div className="relative z-10 w-full h-screen">
        <Stages stages={roadmapStages} onStageClick={handleStageClick} />
      </div>

      {selectedStage && (
        <StageSheet
          stage={selectedStage}
          isOpen={!!selectedStage}
          onClose={() => setSelectedStage(null)}
          onComplete={handleStageComplete}
        />
      )}

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
};

const Dashboard = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardPage />
    </Suspense>
  );
};

export default Dashboard;
