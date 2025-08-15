"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Lock, Play, Star, Zap } from "lucide-react"

interface Stage {
  id: number
  title: string
  description: string
  completed: boolean
  locked: boolean
  stars: number
  x: number
  y: number
  pattern: string
  icon: string
  difficulty: "easy" | "medium" | "hard" | "expert"
}

interface ViewState {
  scale: number
  translateX: number
  translateY: number
}

export default function CandyCrushRoadmap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [viewState, setViewState] = useState<ViewState>({
    scale: 1,
    translateX: 0,
    translateY: 0,
  })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null)

  const [stages, setStages] = useState<Stage[]>([
    {
      id: 1,
      title: "Foundation",
      description: "Begin your learning journey",
      completed: true,
      locked: false,
      stars: 3,
      x: 5,
      y: 50,
      pattern: "dots",
      icon: "●",
      difficulty: "easy",
    },
    {
      id: 2,
      title: "Basics",
      description: "Learn the fundamentals",
      completed: true,
      locked: false,
      stars: 2,
      x: 15,
      y: 30,
      pattern: "lines",
      icon: "■",
      difficulty: "easy",
    },
    {
      id: 3,
      title: "Progress",
      description: "Accelerate your skills",
      completed: false,
      locked: false,
      stars: 0,
      x: 25,
      y: 70,
      pattern: "grid",
      icon: "◆",
      difficulty: "medium",
    },
    {
      id: 4,
      title: "Complexity",
      description: "Complex concepts ahead",
      completed: false,
      locked: true,
      stars: 0,
      x: 35,
      y: 40,
      pattern: "waves",
      icon: "▲",
      difficulty: "medium",
    },
    {
      id: 5,
      title: "Advanced",
      description: "Explore advanced topics",
      completed: false,
      locked: true,
      stars: 0,
      x: 45,
      y: 60,
      pattern: "zigzag",
      icon: "◉",
      difficulty: "hard",
    },
    {
      id: 6,
      title: "Mastery",
      description: "Master the challenges",
      completed: false,
      locked: true,
      stars: 0,
      x: 55,
      y: 25,
      pattern: "cross",
      icon: "★",
      difficulty: "hard",
    },
    {
      id: 7,
      title: "Excellence",
      description: "Ultimate mastery",
      completed: false,
      locked: true,
      stars: 0,
      x: 65,
      y: 45,
      pattern: "diamond",
      icon: "♦",
      difficulty: "expert",
    },
    {
      id: 8,
      title: "Victory",
      description: "Congratulations!",
      completed: false,
      locked: true,
      stars: 0,
      x: 75,
      y: 35,
      pattern: "crown",
      icon: "♔",
      difficulty: "expert",
    },
  ])

  // Zoom functionality
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    setViewState((prev) => ({
      ...prev,
      scale: Math.max(0.5, Math.min(3, prev.scale + delta)),
    }))
  }, [])

  // Pan functionality
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === containerRef.current) {
        setIsDragging(true)
        setDragStart({ x: e.clientX - viewState.translateX, y: e.clientY - viewState.translateY })
      }
    },
    [viewState],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        setViewState((prev) => ({
          ...prev,
          translateX: e.clientX - dragStart.x,
          translateY: e.clientY - dragStart.y,
        }))
      }
    },
    [isDragging, dragStart],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false })
      return () => container.removeEventListener("wheel", handleWheel)
    }
  }, [handleWheel])

  const handleStageClick = (stage: Stage) => {
    if (!stage.locked) {
      setSelectedStage(stage)
    }
  }

  const completeStage = (stageId: number, stars: number) => {
    setStages((prevStages) => {
      const newStages = prevStages.map((stage) => {
        if (stage.id === stageId) {
          return { ...stage, completed: true, stars }
        }
        return stage
      })

      const nextStage = newStages.find((stage) => stage.id === stageId + 1)
      if (nextStage) {
        nextStage.locked = false
      }

      return newStages
    }) 
    setSelectedStage(null)
  }

  const getPathData = () => {
    if (stages.length === 0) return ""

    let pathData = `M ${stages[0].x} ${stages[0].y}`

    for (let i = 1; i < stages.length; i++) {
      const prev = stages[i - 1]
      const curr = stages[i]

      const controlX1 = prev.x + (curr.x - prev.x) * 0.3
      const controlY1 = prev.y + (i % 2 === 0 ? -15 : 15)
      const controlX2 = prev.x + (curr.x - prev.x) * 0.7
      const controlY2 = curr.y + (i % 2 === 0 ? 15 : -15)

      pathData += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${curr.x} ${curr.y}`
    }

    return pathData
  }

  const getDifficultyOpacity = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "opacity-60"
      case "medium":
        return "opacity-70"
      case "hard":
        return "opacity-80"
      case "expert":
        return "opacity-90"
      default:
        return "opacity-50"
    }
  }

  const getPatternBackground = (pattern: string, isActive: boolean) => {
    const baseClass = isActive ? "bg-black" : "bg-gray-300"
    switch (pattern) {
      case "dots":
        return `${baseClass} bg-[radial-gradient(circle_at_50%_50%,white_1px,transparent_1px)] bg-[length:8px_8px]`
      case "lines":
        return `${baseClass} bg-[linear-gradient(45deg,white_1px,transparent_1px,transparent_7px,white_1px)] bg-[length:8px_8px]`
      case "grid":
        return `${baseClass} bg-[linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] bg-[length:8px_8px]`
      case "waves":
        return `${baseClass} bg-[radial-gradient(ellipse_at_center,white_1px,transparent_1px)] bg-[length:12px_6px]`
      case "zigzag":
        return `${baseClass} bg-[linear-gradient(135deg,white_2px,transparent_2px,transparent_6px,white_2px)] bg-[length:8px_8px]`
      case "cross":
        return `${baseClass} bg-[linear-gradient(white_2px,transparent_2px,transparent_6px,white_2px),linear-gradient(90deg,white_2px,transparent_2px,transparent_6px,white_2px)] bg-[length:8px_8px]`
      case "diamond":
        return `${baseClass} bg-[conic-gradient(from_45deg,white_25%,transparent_25%,transparent_75%,white_75%)] bg-[length:8px_8px]`
      case "crown":
        return `${baseClass} bg-[radial-gradient(circle_at_25%_25%,white_2px,transparent_2px),radial-gradient(circle_at_75%_75%,white_2px,transparent_2px)] bg-[length:8px_8px]`
      default:
        return baseClass
    }
  }

  return (
    <div className="h-screen overflow-hidden bg-white relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,#f8f8f8_25%,transparent_25%,transparent_75%,#f8f8f8_75%)] bg-[length:20px_20px] opacity-30" />

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Shapes */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-5"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            <span className="text-xl text-black">{["●", "■", "▲", "◆"][Math.floor(Math.random() * 4)]}</span>
          </motion.div>
        ))}

        {/* Geometric Patterns */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-12 h-12 border border-black opacity-3"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 30}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          />
        ))}
      </div>

      {/* Controls */}
      <motion.div 
        className="absolute top-4 left-4 z-50 flex gap-2"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Badge className="bg-black text-white">Zoom: {Math.round(viewState.scale * 100)}%</Badge>
        <Badge className="bg-white text-black border border-black">Use mouse wheel to zoom, drag to pan</Badge>
      </motion.div>

      {/* Progress */}
      <motion.div 
        className="absolute top-4 right-4 z-50 flex gap-2"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Badge className="bg-black text-white">
          <Star className="w-4 h-4 mr-1 fill-current" />
          {stages.reduce((sum, stage) => sum + stage.stars, 0)} Stars
        </Badge>
        <Badge className="bg-white text-black border border-black">
          {stages.filter((s) => s.completed).length}/{stages.length} Complete
        </Badge>
      </motion.div>

      {/* Main Track Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <motion.div
          className="relative w-[200%] h-full transition-transform duration-100"
          style={{
            transform: `scale(${viewState.scale}) translate(${viewState.translateX}px, ${viewState.translateY}px)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* SVG Path */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="dashPattern" patternUnits="userSpaceOnUse" width="8" height="4">
                <rect width="4" height="4" fill="black" />
                <rect x="4" width="4" height="4" fill="white" />
              </pattern>
              <filter id="shadow">
                <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="black" floodOpacity="0.3" />
              </filter>
            </defs>
            <motion.path
              d={getPathData()}
              stroke="black"
              strokeWidth="2"
              fill="none"
              strokeDasharray="8,4"
              filter="url(#shadow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </svg>

          {/* Stage Nodes */}
          <AnimatePresence>
            {stages.map((stage, index) => (
              <motion.div
                key={stage.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ left: `${stage.x}%`, top: `${stage.y}%` }}
                onClick={() => handleStageClick(stage)}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 200
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Shadow Effect */}
                <motion.div 
                  className="absolute inset-0 rounded-full bg-black opacity-20 blur-xl w-20 h-20 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
                  animate={{
                    opacity: [0.2, 0.3, 0.2],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                />

                {/* Main Stage Circle */}
                <motion.div
                  className={`relative w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg shadow-2xl transition-all duration-300 group-hover:scale-105 border-4 ${
                    stage.completed
                      ? "bg-black text-white border-black shadow-black/50"
                      : stage.locked
                        ? "bg-gray-300 text-gray-500 border-gray-400 shadow-gray-500/50 cursor-not-allowed"
                        : "bg-white text-black border-black shadow-black/50"
                  } ${getPatternBackground(stage.pattern, stage.completed || !stage.locked)}`}
                  animate={stage.completed ? {
                    boxShadow: [
                      "0 10px 25px rgba(0,0,0,0.3)",
                      "0 15px 35px rgba(0,0,0,0.5)",
                      "0 10px 25px rgba(0,0,0,0.3)"
                    ]
                  } : {}}
                  transition={stage.completed ? {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  } : {}}
                >
                  {stage.completed ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.5, type: "spring" }}
                    >
                      <CheckCircle className="w-8 h-8" />
                    </motion.div>
                  ) : stage.locked ? (
                    <Lock className="w-6 h-6" />
                  ) : (
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    >
                      <Play className="w-6 h-6" />
                    </motion.div>
                  )}

                  {/* Icon */}
                  <motion.div
                    className={`absolute -top-8 text-2xl ${stage.completed ? "text-black" : stage.locked ? "text-gray-400" : "text-black"}`}
                    animate={!stage.locked ? {
                      y: [0, -5, 0],
                    } : {}}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.2,
                    }}
                  >
                    {stage.icon}
                  </motion.div>

                  {/* Stage Number */}
                  <motion.div 
                    className="absolute -top-2 -right-2 w-6 h-6 bg-white text-black rounded-full flex items-center justify-center text-xs font-bold border-2 border-black"
                    animate={stage.completed ? {
                      scale: [1, 1.2, 1],
                      rotate: [0, 360],
                    } : {}}
                    transition={stage.completed ? {
                      duration: 1,
                      repeat: Infinity,
                      ease: "easeInOut"
                    } : {}}
                  >
                    {stage.id}
                  </motion.div>

                  {/* Difficulty Badge */}
                  <motion.div
                    className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded-full text-xs font-bold bg-white text-black border border-black ${getDifficultyOpacity(stage.difficulty)}`}
                    animate={!stage.locked ? {
                      scale: [1, 1.05, 1],
                    } : {}}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.1,
                    }}
                  >
                    {stage.difficulty.toUpperCase()}
                  </motion.div>

                  {/* Stars */}
                  {stage.completed && stage.stars > 0 && (
                    <motion.div 
                      className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex gap-1"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.1 }}
                        >
                          <Star
                            className={`w-4 h-4 ${i < stage.stars ? "text-black fill-current" : "text-gray-400"}`}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>

                {/* Stage Title */}
                <motion.div 
                  className="absolute top-24 left-1/2 transform -translate-x-1/2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ y: 10, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                >
                  <div className="bg-white backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border-2 border-black">
                    <p className="text-sm font-bold text-black">{stage.title}</p>
                    <p className="text-xs text-gray-600">{stage.description}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Stage Modal */}
      <AnimatePresence>
        {selectedStage && (
          <motion.div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ duration: 0.3, type: "spring" }}
            >
              <Card className="w-full max-w-md border-2 border-black">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <motion.div 
                      className="text-6xl mb-4 text-black"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {selectedStage.icon}
                    </motion.div>
                    <motion.div
                      className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-2xl border-4 border-black ${
                        selectedStage.completed ? "bg-black text-white" : "bg-white text-black"
                      } ${getPatternBackground(selectedStage.pattern, selectedStage.completed)}`}
                      animate={selectedStage.completed ? {
                        boxShadow: [
                          "0 10px 25px rgba(0,0,0,0.3)",
                          "0 15px 35px rgba(0,0,0,0.5)",
                          "0 10px 25px rgba(0,0,0,0.3)"
                        ]
                      } : {}}
                      transition={selectedStage.completed ? {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      } : {}}
                    >
                      {selectedStage.completed ? <CheckCircle className="w-10 h-10" /> : <Play className="w-8 h-8" />}
                    </motion.div>
                    <h3 className="text-2xl font-bold text-black">{selectedStage.title}</h3>
                    <p className="text-gray-600 mt-2">{selectedStage.description}</p>
                    <Badge
                      className={`mt-2 bg-white text-black border border-black ${getDifficultyOpacity(selectedStage.difficulty)}`}
                    >
                      {selectedStage.difficulty.toUpperCase()}
                    </Badge>
                  </div>

                  {selectedStage.completed ? (
                    <div className="text-center">
                      <div className="flex justify-center gap-1 mb-4">
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.1 }}
                          >
                            <Star
                              className={`w-8 h-8 ${i < selectedStage.stars ? "text-black fill-current" : "text-gray-300"}`}
                            />
                          </motion.div>
                        ))}
                      </div>
                      <Badge className="bg-black text-white text-lg px-4 py-2">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Completed!
                      </Badge>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 text-lg"
                          onClick={() => completeStage(selectedStage.id, Math.floor(Math.random() * 3) + 1)}
                        >
                          <Zap className="w-5 h-5 mr-2" />
                          Start Learning!
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant="outline"
                          className="w-full border-2 border-black hover:bg-gray-50 bg-white text-black"
                          onClick={() => setSelectedStage(null)}
                        >
                          Maybe Later
                        </Button>
                      </motion.div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
