"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Book, FileText, CheckCircle, ArrowRight, MessageCircle } from "lucide-react";
import { StudyMaterialCard } from "./StudyMaterialCard";
import { StageChatInterface } from "./StageChatInterface";
import { RoadmapStage } from "@/types/roadmap";

interface StageModalProps {
  stage: RoadmapStage | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (stageId: string) => void;
}

export function StageModal({ stage, isOpen, onClose, onComplete }: StageModalProps) {
  const [currentTab, setCurrentTab] = useState<"lessons" | "materials" | "quiz" | "chat">("lessons");
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizResults, setQuizResults] = useState<boolean[]>([]);
  const [showResults, setShowResults] = useState(false);

  if (!stage) return null;

  const handleQuizAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === stage.quiz[currentQuizIndex].correct;

    setTimeout(() => {
      const newResults = [...quizResults, isCorrect];
      setQuizResults(newResults);

      if (currentQuizIndex < stage.quiz.length - 1) {
        setCurrentQuizIndex(currentQuizIndex + 1);
        setSelectedAnswer(null);
      } else {
        setShowResults(true);
      }
    }, 1500);
  };

  const handleComplete = () => {
    const correctAnswers = quizResults.filter(Boolean).length;
    const passingScore = Math.ceil(stage.quiz.length * 0.7); // 70% to pass

    if (correctAnswers >= passingScore) {
      onComplete(stage.id);
      onClose();
    }
  };

  const resetQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setQuizResults([]);
    setShowResults(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-black">{stage.title}</h2>
                <p className="text-gray-600 mt-1">{stage.description}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              {[
                { id: "lessons", label: "Lessons", icon: Book },
                { id: "materials", label: "Materials", icon: FileText },
                { id: "quiz", label: "Quiz", icon: CheckCircle },
                { id: "chat", label: "Chat", icon: MessageCircle },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-6 py-3 border-b-2 transition-colors ${
                      currentTab === tab.id
                        ? "border-black text-black"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {currentTab === "lessons" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-black mb-4">Lessons</h3>
                  {stage.lessons.map((lesson, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-black">{lesson}</h4>
                      </div>
                      <Play className="w-4 h-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              )}

              {currentTab === "materials" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-black mb-4">Study Materials</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stage.materials.map((material, index) => (
                      <StudyMaterialCard key={index} material={material} />
                    ))}
                  </div>
                </div>
              )}

              {currentTab === "quiz" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-black mb-4">Quiz</h3>
                  {!showResults ? (
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h4 className="font-medium text-black mb-4">
                          Question {currentQuizIndex + 1} of {stage.quiz.length}
                        </h4>
                        <p className="text-gray-700 mb-6">{stage.quiz[currentQuizIndex].question}</p>
                        <div className="space-y-3">
                          {stage.quiz[currentQuizIndex].options.map((option, index) => (
                            <button
                              key={index}
                              onClick={() => handleQuizAnswer(index)}
                              disabled={selectedAnswer !== null}
                              className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                                selectedAnswer === index
                                  ? selectedAnswer === stage.quiz[currentQuizIndex].correct
                                    ? "border-green-500 bg-green-50"
                                    : "border-red-500 bg-red-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                        <h4 className="font-semibold text-green-800 mb-2">Quiz Results</h4>
                        <p className="text-green-700">
                          You got {quizResults.filter(Boolean).length} out of {stage.quiz.length} correct!
                        </p>
                      </div>
                      <div className="flex space-x-4">
                        <button
                          onClick={handleComplete}
                          className="flex-1 bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                        >
                          Complete Stage
                        </button>
                        <button
                          onClick={resetQuiz}
                          className="flex-1 bg-gray-200 text-black py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                        >
                          Retake Quiz
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentTab === "chat" && (
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">AI Tutor</h3>
                  <StageChatInterface stage={stage} />
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
