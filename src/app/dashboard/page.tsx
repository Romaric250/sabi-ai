"use client";

import { Suspense, useState, useEffect } from "react";
import { BookOpen, Sparkles, Target, TrendingUp, Clock, CheckCircle, Plus, ArrowRight, Zap, Users, Award, Calendar, Star, Brain, Rocket, Trophy, Search, Filter, Eye, Edit3, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface Roadmap {
  id: string;
  prompt?: string;
  title?: string;
  description?: string;
  difficulty?: string;
  stages?: any[] | number;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRoadmaps, setUserRoadmaps] = useState<Roadmap[]>([]);
  const [communityRoadmaps, setCommunityRoadmaps] = useState<Roadmap[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
    fetchRoadmaps();
  }, []);

  const fetchRoadmaps = async () => {
    try {
      console.log('Fetching roadmaps...');
      
      // Fetch user's roadmaps
      const userResponse = await fetch('/api/user-roadmap');
      console.log('User roadmaps response:', userResponse.status);
      if (userResponse.ok) {
        const roadmaps = await userResponse.json();
        console.log('User roadmaps data:', roadmaps);
        // Get 3 random roadmaps
        const shuffled = roadmaps.sort(() => 0.5 - Math.random());
        setUserRoadmaps(shuffled.slice(0, 3));
        console.log('Set user roadmaps:', shuffled.slice(0, 3));
      } else {
        console.error('Failed to fetch user roadmaps:', userResponse.status);
        setUserRoadmaps([]);
      }

      // Fetch community roadmaps (excluding current user's)
      const communityResponse = await fetch('/api/sample-roadmaps');
      console.log('Community roadmaps response:', communityResponse.status);
      if (communityResponse.ok) {
        const roadmaps = await communityResponse.json();
        console.log('Community roadmaps data:', roadmaps);
        // Get 4 random roadmaps
        const shuffled = roadmaps.sort(() => 0.5 - Math.random());
        setCommunityRoadmaps(shuffled.slice(0, 4));
        console.log('Set community roadmaps:', shuffled.slice(0, 4));
      } else {
        console.error('Failed to fetch community roadmaps:', communityResponse.status);
        setCommunityRoadmaps([]);
      }
    } catch (error) {
      console.error('Error fetching roadmaps:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStats = () => {
    const totalRoadmaps = userRoadmaps.length;
    const completedRoadmaps = userRoadmaps.filter(roadmap => {
      if (!roadmap.stages || typeof roadmap.stages === 'number') return false;
      return roadmap.stages.every((stage: any) => stage.isCompleted);
    }).length;
    
    return [
      {
        id: "active",
        title: "Active Roadmaps",
        value: totalRoadmaps.toString(),
        change: totalRoadmaps > 0 ? "Keep learning!" : "Start your journey",
        icon: BookOpen,
        bgColor: "bg-black/10",
        textColor: "text-black"
      },
      {
        id: "completed",
        title: "Completed Stages",
        value: completedRoadmaps.toString(),
        change: completedRoadmaps > 0 ? "Great progress!" : "Complete your first",
        icon: CheckCircle,
        bgColor: "bg-black/10",
        textColor: "text-black"
      },
      {
        id: "time",
        title: "Study Time",
        value: `${Math.floor(Math.random() * 20) + 5}h`,
        change: "+2h this week",
        icon: Clock,
        bgColor: "bg-black/10",
        textColor: "text-black"
      },
      {
        id: "streak",
        title: "Learning Streak",
        value: `${Math.floor(Math.random() * 10) + 1} days`,
        change: "Keep it up!",
        icon: Zap,
        bgColor: "bg-black/10",
        textColor: "text-black"
      }
    ];
  };

  const filteredUserRoadmaps = userRoadmaps.filter(roadmap =>
    (roadmap.prompt || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCommunityRoadmaps = communityRoadmaps.filter(roadmap =>
    (roadmap.prompt || roadmap.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = getStats();

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

  const getProgressPercentage = (roadmap: Roadmap) => {
    if (!roadmap.stages || typeof roadmap.stages === 'number') return 0;
    const completedStages = roadmap.stages.filter((stage: any) => stage.isCompleted).length;
    return Math.round((completedStages / roadmap.stages.length) * 100);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in-up duration-1000">
        {/* Loading Welcome Section */}
        <div className="text-center py-16 relative">
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="inline-flex items-center space-x-2 bg-gray-200/60 px-6 py-3 rounded-full mb-8 animate-pulse">
              <div className="w-5 h-5 bg-gray-300 rounded-full" />
              <div className="h-4 bg-gray-300 rounded w-32" />
            </div>
            
            <div className="h-12 bg-gray-200/60 rounded-lg mb-6 animate-pulse" />
            <div className="h-6 bg-gray-200/60 rounded-lg mb-10 max-w-3xl mx-auto animate-pulse" />
          </div>
        </div>

        {/* Loading Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-white/90 backdrop-blur-xl border border-gray-200/60 rounded-3xl p-6 animate-pulse"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-200/60 rounded-2xl" />
                <div className="h-6 bg-gray-200/60 rounded-full w-20" />
              </div>
              <div className="h-4 bg-gray-200/60 rounded mb-1 w-24" />
              <div className="h-8 bg-gray-200/60 rounded w-16" />
            </div>
          ))}
        </div>

        {/* Loading Workspace Section */}
        <div className="bg-white/90 backdrop-blur-xl border border-gray-200/60 rounded-3xl p-8 shadow-2xl">
          <div className="h-8 bg-gray-200/60 rounded-lg mb-8 w-64 animate-pulse" />
          
          {/* Loading Search and Filters */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4 flex-1">
              <div className="h-12 bg-gray-200/60 rounded-2xl w-80 animate-pulse" />
              <div className="flex items-center space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-8 bg-gray-200/60 rounded-full w-24 animate-pulse" />
                ))}
              </div>
            </div>
            <div className="h-8 bg-gray-200/60 rounded w-16 animate-pulse" />
          </div>

          {/* Loading Roadmaps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl animate-pulse"
              >
                <div className="h-32 bg-gray-200/60 rounded-t-2xl" />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-5 bg-gray-200/60 rounded w-3/4" />
                    <div className="w-8 h-8 bg-gray-200/60 rounded-full" />
                  </div>
                  <div className="h-2 bg-gray-200/60 rounded-full mb-2" />
                  <div className="h-4 bg-gray-200/60 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Loading Community Section */}
        <div className="bg-white/90 backdrop-blur-xl border border-gray-200/60 rounded-3xl p-8 shadow-2xl">
          <div className="h-8 bg-gray-200/60 rounded-lg mb-8 w-64 animate-pulse" />
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="h-8 bg-gray-200/60 rounded-full w-20 animate-pulse" />
              <div className="flex items-center space-x-2">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="h-8 bg-gray-200/60 rounded-full w-16 animate-pulse" />
                ))}
              </div>
            </div>
            <div className="h-8 bg-gray-200/60 rounded w-16 animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl animate-pulse"
              >
                <div className="h-32 bg-gray-200/60 rounded-t-2xl" />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-3 bg-gray-200/60 rounded w-16" />
                    <div className="h-3 bg-gray-200/60 rounded w-12" />
                  </div>
                  <div className="h-5 bg-gray-200/60 rounded mb-2 w-3/4" />
                  <div className="h-3 bg-gray-200/60 rounded mb-3 w-1/2" />
                  <div className="h-8 bg-gray-200/60 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Loading CTA Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-gray-200 to-gray-300 rounded-3xl p-12 text-center animate-pulse">
          <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-8" />
          <div className="h-10 bg-gray-300 rounded-lg mb-6 w-96 mx-auto" />
          <div className="h-6 bg-gray-300 rounded-lg mb-10 max-w-3xl mx-auto" />
          <div className="flex items-center justify-center space-x-6">
            <div className="h-12 bg-gray-300 rounded-2xl w-48" />
            <div className="h-12 bg-gray-300 rounded-2xl w-48" />
          </div>
        </div>
      </div>
    );
  }

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
          <h2 className="text-2xl font-bold text-black">Romaric&apos;s Sabi AI&apos;s Workspace</h2>
        </div>
        
        {/* Search and Filters */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search roadmaps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
          {filteredUserRoadmaps.length > 0 ? (
            filteredUserRoadmaps.map((roadmap, index) => {
              const progress = getProgressPercentage(roadmap);
              const status = progress === 100 ? 'Completed' : progress > 0 ? 'In Progress' : 'Not Started';
              
              return (
                <motion.div
                  key={roadmap.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                  className="group cursor-pointer bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  onClick={() => window.location.href = `/dashboard/${roadmap.id}`}
                >
                  {/* Thumbnail */}
                  <div className="h-32 bg-gradient-to-br from-blue-500 to-green-500 rounded-t-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <h3 className="text-lg font-semibold mb-2">{roadmap.prompt}</h3>
                        <p className="text-sm opacity-90">{status}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-gray-600">{status}</span>
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
                        <span className="text-xs font-semibold text-black">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200/60 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className="h-2 bg-black rounded-full transition-all duration-1000 ease-out"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">R</span>
                        </div>
                        <span className="text-sm text-gray-600">{(roadmap.prompt || '').toLowerCase().replace(/\s+/g, '-')}</span>
                      </div>
                      <span className="text-xs text-gray-500">Edited {formatDate(roadmap.createdAt)}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="w-16 h-16 bg-black/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">No roadmaps found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery ? 'Try adjusting your search terms' : 'No roadmaps available'}
              </p>
            </div>
          )}
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
          {filteredCommunityRoadmaps.map((roadmap, index) => (
            <motion.div
              key={roadmap.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
              className="group cursor-pointer bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Thumbnail */}
              <div className="h-32 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-t-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h3 className="text-lg font-semibold mb-2">{roadmap.prompt || roadmap.title}</h3>
                    <p className="text-sm opacity-90">Community</p>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600">{roadmap.difficulty || 'Learning Path'}</span>
                  <span className="text-xs text-gray-500">{typeof roadmap.stages === 'number' ? roadmap.stages : roadmap.stages?.length || 0} Stages</span>
                </div>
                
                <h3 className="font-semibold text-black mb-2">{roadmap.prompt || roadmap.title}</h3>
                <p className="text-xs text-gray-600 mb-3">{roadmap.description || 'Community Roadmap'}</p>
                
                <Button variant="outline" size="sm" className="w-full border-gray-200/60 text-black hover:bg-black/5">
                  View Roadmap <ArrowRight className="w-3 h-3 ml-2" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

    </div>
  );
}
