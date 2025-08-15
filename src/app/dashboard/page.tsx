"use client";

import { Suspense, useState, useEffect } from "react";
import { BookOpen, Sparkles, Target, TrendingUp, Clock, CheckCircle, Plus, ArrowRight, Zap, Users, Award, Calendar, Star, Brain, Rocket, Trophy } from "lucide-react";
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

  if (!mounted) return null;

  return (
    <div className="space-y-10 animate-in fade-in-up duration-1000">
      {/* Enhanced Welcome Section */}
      <div className="text-center py-20 relative">
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
            <Sparkles className="w-5 h-5 text-black" />
            <span className="text-sm font-semibold text-black">Welcome back, Learner!</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-6xl font-bold text-black mb-8 leading-tight"
          >
            Ready to continue learning?
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto"
          >
            Pick up where you left off or start a new learning journey with AI-powered roadmaps designed just for you.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex items-center justify-center space-x-8 text-sm text-gray-500"
          >
            <div className="flex items-center space-x-2 group">
              <Target className="w-4 h-4 text-black group-hover:scale-110 transition-transform duration-300" />
              <span>Personalized paths</span>
            </div>
            <div className="flex items-center space-x-2 group">
              <TrendingUp className="w-4 h-4 text-black group-hover:scale-110 transition-transform duration-300" />
              <span>Track progress</span>
            </div>
            <div className="flex items-center space-x-2 group">
              <CheckCircle className="w-4 h-4 text-black group-hover:scale-110 transition-transform duration-300" />
              <span>Complete goals</span>
            </div>
          </motion.div>
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

      {/* Enhanced Recent Activity */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="bg-white/90 backdrop-blur-xl border border-gray-200/60 rounded-3xl p-8 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-black mb-2">Recent Activity</h2>
            <p className="text-gray-600">Your learning journey progress</p>
          </div>
          <Button variant="outline" className="group hover:bg-gray-50 transition-all duration-300 hover:shadow-lg border-black/20 text-black hover:border-black/40">
            View all
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
        
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group flex items-center space-x-4 p-4 bg-gray-50/50 rounded-2xl hover:bg-gray-100/70 hover:shadow-lg transition-all duration-300 transform hover:-translate-x-1 hover:scale-[1.02]"
            >
              <div className={`w-12 h-12 ${activity.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                <activity.icon className={`w-6 h-6 ${activity.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-1">
                  <p className="text-sm font-semibold text-black group-hover:text-gray-700 transition-colors duration-200">
                    {activity.title}
                  </p>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${activity.bgColor} ${activity.color}`}>
                    {activity.badge}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{activity.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Enhanced Getting Started Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
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
            transition={{ duration: 0.6, delay: 1, type: "spring" }}
            className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500"
          >
            <Sparkles className="w-12 h-12 text-white" />
          </motion.div>
          
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-4xl font-bold mb-6"
          >
            Ready to start learning?
          </motion.h3>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="text-gray-200 mb-10 max-w-3xl mx-auto text-lg leading-relaxed"
          >
            Create your first AI-powered learning roadmap and begin your journey to mastery. 
            Our intelligent system will guide you through personalized learning paths.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
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

      {/* Enhanced Quick Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
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
            icon: Calendar,
            title: "Schedule Sessions",
            description: "Plan your learning sessions and track progress",
            bgColor: "bg-black/10"
          },
          {
            icon: Trophy,
            title: "Earn Certificates",
            description: "Get recognized for your achievements",
            bgColor: "bg-black/10"
          }
        ].map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
            className="bg-white/90 backdrop-blur-xl border border-gray-200/60 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 group cursor-pointer transform hover:-translate-y-2 hover:scale-[1.02]"
          >
            <div className={`w-16 h-16 ${action.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
              <action.icon className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-xl font-bold text-black mb-3">{action.title}</h3>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">{action.description}</p>
            <Button variant="ghost" className="text-black hover:text-gray-700 p-0 h-auto font-medium group-hover:translate-x-1 transition-transform duration-300">
              Learn more <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
