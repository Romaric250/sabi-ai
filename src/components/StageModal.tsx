'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Book, FileText, CheckCircle, ArrowRight, MessageCircle } from 'lucide-react';
import { StudyMaterialCard } from './StudyMaterialCard';
import { StageChatInterface } from './StageChatInterface';

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

interface StageModalProps {
  stage: RoadmapStage;
  onClose: () => void;
  onComplete: (stageId: string) => void;
}

export function StageModal({ stage, onClose, onComplete }: StageModalProps) {
  const [currentTab, setCurrentTab] = useState<'lessons' | 'materials' | 'quiz'>('lessons');
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizResults, setQuizResults] = useState<boolean[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showChat, setShowChat] = useState(false);

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
    }
  };

  const tabs = [
    { id: 'lessons', label: 'Lessons', icon: Book },
    { id: 'materials', label: 'Materials', icon: FileText },
    { id: 'quiz', label: 'Quiz', icon: CheckCircle },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-slate-800/90 backdrop-blur-sm rounded-3xl border border-slate-700/50 w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-6 bg-gradient-to-r ${stage.color} relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <stage.icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{stage.title}</h2>
              <p className="text-white/80">{stage.description}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-700/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id as any)}
              className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 font-medium transition-colors ${
                currentTab === tab.id
                  ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/10'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            {currentTab === 'lessons' && (
              <motion.div
                key="lessons"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-bold text-white mb-4">Learning Objectives</h3>
                {stage.lessons.map((lesson, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-slate-700/30 rounded-xl border border-slate-600/30 hover:border-purple-500/30 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                        <Play className="w-4 h-4 text-purple-400" />
                      </div>
                      <span className="text-white font-medium">{lesson}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {currentTab === 'materials' && (
              <motion.div
                key="materials"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-bold text-white mb-4">Study Materials</h3>
                {stage.materials.map((material, index) => (
                  <StudyMaterialCard key={index} material={material} index={index} />
                ))}
              </motion.div>
            )}

            {currentTab === 'quiz' && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {!showResults ? (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">
                        Question {currentQuizIndex + 1} of {stage.quiz.length}
                      </h3>
                      <div className="flex gap-2">
                        {stage.quiz.map((_, index) => (
                          <div
                            key={index}
                            className={`w-3 h-3 rounded-full ${
                              index < currentQuizIndex
                                ? 'bg-green-400'
                                : index === currentQuizIndex
                                ? 'bg-blue-400'
                                : 'bg-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="p-6 bg-slate-700/30 rounded-xl border border-slate-600/30">
                      <h4 className="text-lg font-medium text-white mb-6">
                        {stage.quiz[currentQuizIndex].question}
                      </h4>
                      
                      <div className="space-y-3">
                        {stage.quiz[currentQuizIndex].options.map((option, index) => (
                          <motion.button
                            key={index}
                            onClick={() => handleQuizAnswer(index)}
                            disabled={selectedAnswer !== null}
                            className={`w-full p-4 text-left rounded-xl border transition-all ${
                              selectedAnswer === null
                                ? 'border-slate-600/50 hover:border-purple-500/50 hover:bg-purple-500/10'
                                : selectedAnswer === index
                                ? index === stage.quiz[currentQuizIndex].correct
                                  ? 'border-green-500 bg-green-500/20 text-green-300'
                                  : 'border-red-500 bg-red-500/20 text-red-300'
                                : index === stage.quiz[currentQuizIndex].correct
                                ? 'border-green-500 bg-green-500/20 text-green-300'
                                : 'border-slate-600/30 text-gray-400'
                            }`}
                            whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
                            whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                selectedAnswer === index
                                  ? index === stage.quiz[currentQuizIndex].correct
                                    ? 'border-green-500 bg-green-500'
                                    : 'border-red-500 bg-red-500'
                                  : 'border-gray-500'
                              }`}>
                                {selectedAnswer === index && (
                                  <CheckCircle className="w-4 h-4 text-white" />
                                )}
                              </div>
                              <span className="font-medium">{option}</span>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-6"
                  >
                    <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">Quiz Complete!</h3>
                      <p className="text-gray-300">
                        You scored {quizResults.filter(Boolean).length} out of {stage.quiz.length}
                      </p>
                    </div>

                    <button
                      onClick={handleComplete}
                      className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:scale-105 transition-transform"
                    >
                      Complete Stage
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700/50 flex items-center justify-between">
          <button
            onClick={() => setShowChat(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-300 rounded-xl hover:bg-purple-500/30 transition-colors"
          >
            <MessageCircle size={16} />
            Ask AI Tutor
          </button>

          <div className="text-sm text-gray-400">
            Stage {stage.id} • {stage.lessons.length} lessons • {stage.quiz.length} questions
          </div>
        </div>
      </motion.div>

      {/* Stage Chat Interface */}
      {showChat && (
        <StageChatInterface
          onClose={() => setShowChat(false)}
          context={`Learning ${stage.title}`}
          stageId={stage.id}
          stageTitle={stage.title}
        />
      )}
    </motion.div>
  );
}
