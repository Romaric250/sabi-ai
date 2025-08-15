"use client";

import { Suspense, useState, useEffect } from "react";
import { BookOpen, Sparkles, Target, TrendingUp, Clock, CheckCircle, Plus, ArrowRight, Zap, Users, Award, Calendar, Star, Brain, Rocket, Trophy, Search, Filter, Eye, Edit3, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = [
    {
      id: "active",
      title: "Active Roadmaps",
      value: "3",
      change: "+1 this week",
      icon: BookOpen,
      bgColor: "bg-black/10",
      textColor: "text-black"
    },
    {
      id: "completed",
      title: "Completed Stages",
      value: "12",
      change: "+3 this week",
      icon: CheckCircle,
      bgColor: "bg-black/10",
      textColor: "text-black"
    },
    {
      id: "time",
      title: "Study Time",
      value: "8.5h",
      change: "+2.3h this week",
      icon: Clock,
      bgColor: "bg-black/10",
      textColor: "text-black"
    },
    {
      id: "streak",
      title: "Learning Streak",
      value: "7 days",
      change: "Personal best!",
      icon: Zap,
      bgColor: "bg-black/10",
      textColor: "text-black"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: "completed",
      title: "Completed 'React Fundamentals' stage",
      description: "Mastered component lifecycle and state management",
      time: "2 hours ago",
      icon: CheckCircle,
      color: "text-black",
      bgColor: "bg-black/10",
      badge: "Completed"
    },
    {
      id: 2,
      type: "started",
      title: "Started new roadmap: 'Python for Data Science'",
      description: "Beginning your journey into data analysis",
      time: "1 day ago",
      icon: BookOpen,
      color: "text-black",
      bgColor: "bg-black/10",
      badge: "New"
    },
    {
      id: 3,
      type: "progress",
      title: "Achieved 75% progress in 'Full-Stack Development'",
      description: "Great progress on backend concepts",
      time: "3 days ago",
      icon: Target,
      color: "text-black",
      bgColor: "bg-black/10",
      badge: "Progress"
    },
    {
      id: 4,
      type: "milestone",
      title: "Unlocked 'Advanced JavaScript' stage",
      description: "Ready to tackle closures and prototypes",
      time: "5 days ago",
      icon: Award,
      color: "text-black",
      bgColor: "bg-black/10",
      badge: "Milestone"
    }
  ];

  const myRoadmaps = [
    {
      id: 1,
      title: "Full-Stack Development",
      description: "Master modern web development from frontend to backend",
      progress: 75,
      lastEdited: "2 days ago",
      thumbnail: "bg-gradient-to-br from-blue-500 to-green-500",
      status: "In Progress"
    },
    {
      id: 2,
      title: "Python for Data Science",
      description: "Learn data analysis, machine learning, and visualization",
      progress: 25,
      lastEdited: "1 week ago",
      thumbnail: "bg-gradient-to-br from-purple-500 to-pink-500",
      status: "Active"
    },
    {
      id: 3,
      title: "React Mastery",
      description: "Advanced React patterns and best practices",
      progress: 90,
      lastEdited: "3 days ago",
      thumbnail: "bg-gradient-to-br from-orange-500 to-red-500",
      status: "Near Completion"
    }
  ];

  const communityRoadmaps = [
    {
      id: 1,
      title: "Machine Learning Fundamentals",
      creator: "DataScience Pro",
      remixes: 15420,
      category: "AI & ML",
      thumbnail: "bg-gradient-to-br from-indigo-500 to-purple-500"
    },
    {
      id: 2,
      title: "Web3 Development",
      creator: "Blockchain Dev",
      remixes: 8920,
      category: "Blockchain",
      thumbnail: "bg-gradient-to-br from-green-500 to-blue-500"
    },
    {
      id: 3,
      title: "Mobile App Development",
      creator: "App Creator",
      remixes: 12450,
      category: "Mobile",
      thumbnail: "bg-gradient-to-br from-pink-500 to-orange-500"
    },
    {
      id: 4,
      title: "DevOps Engineering",
      creator: "Cloud Expert",
      remixes: 6780,
      category: "DevOps",
      thumbnail: "bg-gradient-to-br from-yellow-500 to-green-500"
    }
  ];

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in-up duration-1000">
      {/* Enhanced Welcome Section */}
      <div className="text-center py-16 relative">
        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-4 h-4 bg-black/20 rounded-full animate-bounce-soft" style={{ animationDelay: '0s' }} />
          <div className="absolute top-20 right-20 w-3 h-3 bg-black/20 rounded-full animate-bounce-soft" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-20 left-20 w-2 h-2 bg-black/20 rounded-full animate-bounce-soft" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center space-x-2 bg-black/10 px-6 py-3 rounded-full mb-8 border border-black/20 backdrop-blur-sm"
          >
            <Sparkles className="w-5 h-5 text-black animate-pulse" />
            <span className="text-sm font-semibold text-black">Welcome back, Learner!</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-5xl font-bold text-black mb-6 leading-tight"
          >
            Ready to continue learning?
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto"
          >
            Pick up where you left off or start a new learning journey with AI-powered roadmaps designed just for you.
          </motion.p>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            onMouseEnter={() => setHoveredCard(stat.id)}
            onMouseLeave={() => setHoveredCard(null)}
            className={`group relative overflow-hidden bg-white/90 backdrop-blur-xl border border-gray-200/60 rounded-3xl p-6 hover:bg-white/95 hover:border-gray-300/60 hover:shadow-2xl transition-all duration-500 ease-out transform ${
              hoveredCard === stat.id ? 'scale-105 -translate-y-2' : 'scale-100 translate-y-0'
            }`}
          >
            {/* Subtle background overlay */}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className={`absolute top-2 right-2 w-2 h-2 ${stat.bgColor} rounded-full animate-pulse-soft`} style={{ animationDelay: `${index * 0.2}s` }} />
              <div className={`absolute bottom-2 left-2 w-1 h-1 ${stat.bgColor} rounded-full animate-pulse-soft`} style={{ animationDelay: `${index * 0.4}s` }} />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <div className={`text-xs font-semibold ${stat.textColor} bg-white/90 px-3 py-1.5 rounded-full shadow-sm`}>
                  {stat.change}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-black">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Romaric's Sabi AI's Workspace */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="bg-white/90 backdrop-blur-xl border border-gray-200/60 rounded-3xl p-8 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-black">Romaric's Sabi AI's Workspace</h2>
        </div>
        
        {/* Search and Filters */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search roadmaps..."
                className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/50 focus:border-black/60 transition-all duration-300 placeholder:text-gray-400"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="border-gray-200/60 text-black hover:bg-black/5">
                Last edited <Filter className="w-3 h-3 ml-1" />
              </Button>
              <Button variant="outline" size="sm" className="border-gray-200/60 text-black hover:bg-black/5">
                Newest first <Filter className="w-3 h-3 ml-1" />
              </Button>
              <Button variant="outline" size="sm" className="border-gray-200/60 text-black hover:bg-black/5">
                All creators <Filter className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
          
          <Button variant="ghost" className="text-black hover:text-gray-700">
            View All
          </Button>
        </div>

        {/* My Roadmaps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myRoadmaps.map((roadmap, index) => (
            <motion.div
              key={roadmap.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
              className="group cursor-pointer bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Thumbnail */}
              <div className={`h-32 ${roadmap.thumbnail} rounded-t-2xl relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h3 className="text-lg font-semibold mb-2">{roadmap.title}</h3>
                    <p className="text-sm opacity-90">{roadmap.description}</p>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-600">{roadmap.status}</span>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="w-8 h-8 p-0 hover:bg-black/5">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </Button>
                    <Button variant="ghost" size="sm" className="w-8 h-8 p-0 hover:bg-black/5">
                      <Edit3 className="w-4 h-4 text-gray-600" />
                    </Button>
                    <Button variant="ghost" size="sm" className="w-8 h-8 p-0 hover:bg-black/5">
                      <MoreHorizontal className="w-4 h-4 text-gray-600" />
                    </Button>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-600">Progress</span>
                    <span className="text-xs font-semibold text-black">{roadmap.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200/60 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 bg-black rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${roadmap.progress}%` }}
                    />
                  </div>
                </div>
                
                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">R</span>
                    </div>
                    <span className="text-sm text-gray-600">{roadmap.title.toLowerCase().replace(/\s+/g, '-')}</span>
                  </div>
                  <span className="text-xs text-gray-500">Edited {roadmap.lastEdited}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* From the Community */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="bg-white/90 backdrop-blur-xl border border-gray-200/60 rounded-3xl p-8 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-black">From the Community</h2>
        </div>
        
        {/* Filters and Categories */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="border-gray-200/60 text-black hover:bg-black/5">
              Popular <Filter className="w-3 h-3 ml-1" />
            </Button>
            
            <div className="flex items-center space-x-2">
              {["Discover", "Internal Tools", "Website", "Personal", "Consumer App", "B2B App", "Prototype"].map((category, index) => (
                <Button
                  key={category}
                  variant={index === 0 ? "default" : "ghost"}
                  size="sm"
                  className={index === 0 ? "bg-black text-white" : "text-black hover:bg-black/5"}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          
          <Button variant="ghost" className="text-black hover:text-gray-700">
            View All
          </Button>
        </div>

        {/* Community Roadmaps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {communityRoadmaps.map((roadmap, index) => (
            <motion.div
              key={roadmap.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
              className="group cursor-pointer bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Thumbnail */}
              <div className={`h-32 ${roadmap.thumbnail} rounded-t-2xl relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h3 className="text-lg font-semibold mb-2">{roadmap.title}</h3>
                    <p className="text-sm opacity-90">{roadmap.creator}</p>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600">{roadmap.category}</span>
                  <span className="text-xs text-gray-500">{roadmap.remixes.toLocaleString()} Remixes</span>
                </div>
                
                <h3 className="font-semibold text-black mb-2">{roadmap.title}</h3>
                <p className="text-xs text-gray-600 mb-3">{roadmap.creator}</p>
                
                <Button variant="outline" size="sm" className="w-full border-gray-200/60 text-black hover:bg-black/5">
                  Remix
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Enhanced Getting Started Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.6 }}
        className="relative overflow-hidden bg-gradient-to-r from-black to-gray-800 rounded-3xl p-12 text-white shadow-2xl"
      >
        {/* Enhanced background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20px 20px, rgba(255,255,255,0.1) 2px, transparent 2px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>
        
        {/* Floating icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Brain className="absolute top-8 right-8 w-8 h-8 text-white/20 animate-float" />
          <Rocket className="absolute bottom-8 left-8 w-6 h-6 text-white/20 animate-float" style={{ animationDelay: '1s' }} />
          <Star className="absolute top-1/2 right-12 w-4 h-4 text-white/20 animate-bounce-soft" style={{ animationDelay: '0.5s' }} />
        </div>
        
        <div className="relative z-10 text-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 1.8, type: "spring" }}
            className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500"
          >
            <Sparkles className="w-12 h-12 text-white" />
          </motion.div>
          
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2 }}
            className="text-4xl font-bold mb-6"
          >
            Ready to start learning?
          </motion.h3>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.2 }}
            className="text-gray-200 mb-10 max-w-3xl mx-auto text-lg leading-relaxed"
          >
            Create your first AI-powered learning roadmap and begin your journey to mastery. 
            Our intelligent system will guide you through personalized learning paths.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.4 }}
            className="flex items-center justify-center space-x-6"
          >
            <Button 
              size="lg"
              className="bg-white text-black hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 px-10 py-5 text-lg font-semibold rounded-2xl"
            >
              <Plus className="w-6 h-6 mr-3" />
              Create New Roadmap
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 px-10 py-5 text-lg font-semibold rounded-2xl hover:shadow-xl"
            >
              Explore Templates
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
