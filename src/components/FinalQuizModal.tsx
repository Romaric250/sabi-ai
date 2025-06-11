'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Clock, CheckCircle, XCircle, Star } from 'lucide-react';
import { FinalQuiz } from '@/types/roadmap';

interface FinalQuizModalProps {
  finalQuiz: FinalQuiz;
  onClose: () => void;
  onComplete: (score: number, passed: boolean) => void;
}

export function FinalQuizModal({ finalQuiz, onClose, onComplete }: FinalQuizModalProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(finalQuiz.timeLimit * 60); // Convert minutes to seconds
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  // Timer effect
  useEffect(() => {
    if (!quizStarted || showResults) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setShowResults(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, showResults]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < finalQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateResults = () => {
    const correctAnswers = selectedAnswers.filter((answer, index) => 
      answer === finalQuiz.questions[index]?.correct
    ).length;
    const totalQuestions = finalQuiz.questions.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = score >= finalQuiz.passingScore;
    return { correctAnswers, totalQuestions, score, passed };
  };

  const handleComplete = () => {
    const { score, passed } = calculateResults();
    onComplete(score, passed);
  };

  const currentQuestion = finalQuiz.questions[currentQuestionIndex];
  const { correctAnswers, totalQuestions, score, passed } = showResults ? calculateResults() : { correctAnswers: 0, totalQuestions: 0, score: 0, passed: false };

  if (!quizStarted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-slate-800 rounded-2xl border border-slate-600/50 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4">{finalQuiz.title}</h2>
            <p className="text-gray-300 text-lg mb-8">{finalQuiz.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/30">
                <div className="text-2xl font-bold text-blue-400">{finalQuiz.questions.length}</div>
                <div className="text-gray-300">Questions</div>
              </div>
              <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/30">
                <div className="text-2xl font-bold text-green-400">{finalQuiz.passingScore}%</div>
                <div className="text-gray-300">Passing Score</div>
              </div>
              <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/30">
                <div className="text-2xl font-bold text-orange-400">{finalQuiz.timeLimit}</div>
                <div className="text-gray-300">Minutes</div>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setQuizStarted(true)}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all font-semibold"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  if (showResults) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-slate-800 rounded-2xl border border-slate-600/50 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
              passed ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-pink-500'
            }`}>
              {passed ? <Trophy className="w-10 h-10 text-white" /> : <XCircle className="w-10 h-10 text-white" />}
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4">
              {passed ? 'Congratulations!' : 'Keep Learning!'}
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              {passed 
                ? 'You have successfully completed the final assessment!' 
                : 'You can retake the quiz after reviewing the materials.'
              }
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/30">
                <div className="text-2xl font-bold text-blue-400">{score}%</div>
                <div className="text-gray-300">Your Score</div>
              </div>
              <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/30">
                <div className="text-2xl font-bold text-green-400">{correctAnswers}/{totalQuestions}</div>
                <div className="text-gray-300">Correct Answers</div>
              </div>
              <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/30">
                <div className="text-2xl font-bold text-orange-400">{finalQuiz.passingScore}%</div>
                <div className="text-gray-300">Required</div>
              </div>
            </div>
            
            {passed && (
              <div className="flex justify-center mb-6">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.2 }}
                  >
                    <Star className="w-8 h-8 text-yellow-400 fill-yellow-400 mx-1" />
                  </motion.div>
                ))}
              </div>
            )}
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-500 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleComplete}
                className={`px-8 py-3 text-white rounded-xl font-semibold transition-all ${
                  passed 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' 
                    : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
                }`}
              >
                {passed ? 'Complete Course' : 'Review Materials'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-800 rounded-2xl border border-slate-600/50 p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">{finalQuiz.title}</h2>
            <p className="text-gray-400">Question {currentQuestionIndex + 1} of {finalQuiz.questions.length}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-orange-400">
              <Clock size={20} />
              <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-700 rounded-full h-2 mb-8">
          <motion.div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestionIndex + 1) / finalQuiz.questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Question */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-6">{currentQuestion.question}</h3>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 text-left rounded-xl border transition-all ${
                  selectedAnswers[currentQuestionIndex] === index
                    ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                    : 'border-slate-600/50 hover:border-purple-500/50 hover:bg-purple-500/10 text-gray-300'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswers[currentQuestionIndex] === index
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-500'
                  }`}>
                    {selectedAnswers[currentQuestionIndex] === index && (
                      <CheckCircle size={16} className="text-white" />
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="text-gray-400 text-sm">
            Stage: {currentQuestion.stage}
          </div>
          
          <button
            onClick={handleNext}
            disabled={selectedAnswers[currentQuestionIndex] === undefined}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestionIndex === finalQuiz.questions.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
