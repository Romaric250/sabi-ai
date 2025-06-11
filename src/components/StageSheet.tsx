'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Book, FileText, CheckCircle, ArrowRight, MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { StudyMaterialCard } from './StudyMaterialCard';
import { RoadmapStage } from '@/types/roadmap';

interface StageSheetProps {
  stage: RoadmapStage;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (stageId: string) => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export function StageSheet({ stage, isOpen, onClose, onComplete }: StageSheetProps) {
  const [currentTab, setCurrentTab] = useState<'lessons' | 'materials' | 'quiz' | 'chat'>('lessons');
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizResults, setQuizResults] = useState<boolean[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Resize state
  const [sheetWidth, setSheetWidth] = useState(() => {
    // Get saved width from localStorage or default to 800
    if (typeof window !== 'undefined') {
      const savedWidth = localStorage.getItem('stageSheetWidth');
      if (savedWidth) {
        const width = parseInt(savedWidth, 10);
        // Validate the saved width is within reasonable bounds
        const minWidth = 400;
        const maxWidth = window.innerWidth * 0.9;
        return Math.max(minWidth, Math.min(maxWidth, width));
      }
    }
    return 800;
  });
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);

  // Chat state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hi! I'm your AI tutor for ${stage.title}. I'm here to help you understand the concepts and answer any questions you have about this stage. What would you like to know?`,
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const resetQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setQuizResults([]);
    setShowResults(false);
  };

  // Chat functionality
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/stage-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          context: `Learning ${stage.title}`,
          stageId: stage.id,
          stageTitle: stage.title,
          stageDescription: stage.description,
          lessons: stage.lessons
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment, or check the study materials for this stage.",
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Resize functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  // Save width to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('stageSheetWidth', sheetWidth.toString());
    }
  }, [sheetWidth]);

  // Handle window resize to ensure sheet width stays within bounds
  useEffect(() => {
    const handleWindowResize = () => {
      const maxWidth = window.innerWidth * 0.9;
      const minWidth = 400;

      if (sheetWidth > maxWidth) {
        setSheetWidth(maxWidth);
      } else if (sheetWidth < minWidth) {
        setSheetWidth(minWidth);
      }
    };

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [sheetWidth]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = window.innerWidth - e.clientX;
      const minWidth = 400;
      const maxWidth = window.innerWidth * 0.9;

      const constrainedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
      setSheetWidth(constrainedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    if (isResizing) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (!isResizing) {
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };
  }, [isResizing]);

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
          side="right"
          className="bg-white border-l border-gray-200 p-0 overflow-hidden"
          style={{ width: `${sheetWidth}px` }}
        >
          {/* Resize Handle */}
          <div
            ref={resizeRef}
            onMouseDown={handleMouseDown}
            className={`absolute left-0 top-0 w-2 h-full hover:bg-blue-500 cursor-col-resize z-10 transition-all duration-200 ${
              isResizing ? 'bg-blue-500 w-3' : 'bg-gray-300'
            }`}
            style={{ left: '-3px' }}
            title="Drag to resize"
          >
            {/* Visual indicator dots */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-1">
              <div className="w-0.5 h-0.5 bg-white rounded-full opacity-70"></div>
              <div className="w-0.5 h-0.5 bg-white rounded-full opacity-70"></div>
              <div className="w-0.5 h-0.5 bg-white rounded-full opacity-70"></div>
            </div>
          </div>

          <div className="h-full flex flex-col relative">
            {/* Header */}
            <div className={`p-6 bg-gradient-to-r ${stage.color} text-white relative`}>
              <SheetHeader>
                <SheetTitle className="text-2xl font-bold text-white flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6" />
                  </div>
                  {stage.title}
                </SheetTitle>
                <SheetDescription className="text-white/90 text-lg mt-2">
                  {stage.description}
                </SheetDescription>
              </SheetHeader>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200">
              {[
                { id: 'lessons', label: 'Lessons', icon: Book },
                { id: 'materials', label: 'Materials', icon: FileText },
                { id: 'quiz', label: 'Quiz', icon: CheckCircle },
                { id: 'chat', label: 'AI Chat', icon: MessageCircle }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setCurrentTab(id as 'lessons' | 'materials' | 'quiz' | 'chat')}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 font-medium transition-colors whitespace-pre ${
                    currentTab === id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                {currentTab === 'lessons' && (
                  <motion.div
                    key="lessons"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Learning Objectives</h3>
                    {stage.lessons.map((lesson, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{lesson}</h4>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
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
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Study Materials</h3>
                    {stage.materials.map((material, index) => (
                      <StudyMaterialCard key={index} material={material} index={index} />
                    ))}
                  </motion.div>
                )}

                {currentTab === 'chat' && (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="h-[500px] flex flex-col"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-4">AI Tutor Chat</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Ask questions about <strong>{stage.title}</strong> and get instant help from your AI tutor.
                    </p>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <AnimatePresence>
                        {messages.map((message) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            {message.sender === 'ai' && (
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <Bot className="w-4 h-4 text-white" />
                              </div>
                            )}

                            <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-1' : ''}`}>
                              <div className={`p-3 rounded-2xl ${
                                message.sender === 'user'
                                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                                  : 'bg-white text-gray-900 border border-gray-200 shadow-sm'
                              }`}>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                              </div>
                              <p className="text-xs text-gray-500 mt-1 px-3">
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>

                            {message.sender === 'user' && (
                              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {isLoading && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex gap-3 justify-start"
                        >
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                          <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-sm">
                            <div className="flex items-center gap-2">
                              <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                              <span className="text-gray-700 text-sm">AI is thinking...</span>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="flex gap-3">
                      <textarea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={`Ask about ${stage.title}...`}
                        className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        rows={2}
                        disabled={isLoading}
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!inputMessage.trim() || isLoading}
                        className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    <div className="mt-2 text-xs text-gray-500 text-center">
                      Press Enter to send • Shift+Enter for new line
                    </div>
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
                          <h3 className="text-xl font-bold text-gray-900">
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
                                    : 'bg-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                          <h4 className="text-lg font-semibold text-gray-900 mb-6">
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
                                    ? 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                                    : selectedAnswer === index
                                    ? index === stage.quiz[currentQuizIndex].correct
                                      ? 'border-green-500 bg-green-50 text-green-700'
                                      : 'border-red-500 bg-red-50 text-red-700'
                                    : index === stage.quiz[currentQuizIndex].correct
                                    ? 'border-green-500 bg-green-50 text-green-700'
                                    : 'border-gray-200 text-gray-500'
                                }`}
                                whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
                                whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                              >
                                {option}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center space-y-6">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                          <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h3>
                          <p className="text-gray-600">
                            You got {quizResults.filter(Boolean).length} out of {stage.quiz.length} questions correct.
                          </p>
                        </div>
                        <div className="flex gap-4 justify-center">
                          <button
                            onClick={resetQuiz}
                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                          >
                            Retake Quiz
                          </button>
                          <button
                            onClick={handleComplete}
                            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                          >
                            Complete Stage
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-center">
              <div className="text-sm text-gray-500">
                Stage {stage.id} • {stage.lessons.length} lessons • {stage.quiz.length} questions
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>


    </>
  );
}
