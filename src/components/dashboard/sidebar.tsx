"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/components/session";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Settings, 
  Menu,
  X,
  Sparkles,
  Clock,
  CheckCircle,
  Search,
  User,
  Home,
  BarChart3,
  Bell,
  HelpCircle,
  Star,
  Zap,
  Award,
  Brain
} from "lucide-react";
import { roadMapApi } from "@/lib/api";

interface Roadmap {
  id: string;
  prompt: string;
  createdAt: string;
  content: any;
}

export default function DashboardSidebar() {
  const { session } = useSession();
  const router = useRouter();
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [filteredRoadmaps, setFilteredRoadmaps] = useState<Roadmap[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newRoadmapPrompt, setNewRoadmapPrompt] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredRoadmap, setHoveredRoadmap] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchRoadmaps();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredRoadmaps(roadmaps);
    } else {
      const filtered = roadmaps.filter(roadmap =>
        roadmap.prompt.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRoadmaps(filtered);
    }
  }, [searchQuery, roadmaps]);

  const fetchRoadmaps = async () => {
    try {
      const data = await roadMapApi.getUserRoadmaps(session?.user?.id || "");
      // Sort by creation date (newest first) and limit to recent 5
      const sortedData = data
        .sort((a: Roadmap, b: Roadmap) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
      setRoadmaps(sortedData);
      setFilteredRoadmaps(sortedData);
    } catch (error) {
      console.error("Error fetching roadmaps:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewRoadmap = async () => {
    if (!newRoadmapPrompt.trim()) return;

    setIsCreating(true);
    try {
      const response = await fetch("/api/roadmap/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: newRoadmapPrompt,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setNewRoadmapPrompt("");
        setIsSheetOpen(false);
        await fetchRoadmaps();
        router.push(`/dashboard/${data.roadmap.id}`);
      }
    } catch (error) {
      console.error("Error creating roadmap:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const getProgressPercentage = (roadmap: Roadmap) => {
    if (!roadmap.content) return 0;
    
    let stages: any[] = [];
    const content = roadmap.content as any;
    
    if (Array.isArray(content)) {
      stages = content;
    } else if (content && typeof content === 'object') {
      const keys = Object.keys(content);
      if (keys.every(key => !isNaN(Number(key)))) {
        stages = Object.values(content);
      } else if (content?.roadmap && Array.isArray(content.roadmap)) {
        stages = content.roadmap;
      } else if (content?.stages && Array.isArray(content.stages)) {
        stages = content.stages;
      }
    }
    
    if (stages.length === 0) return 0;
    
    const completedStages = stages.filter((stage: any) => stage.isCompleted).length;
    return Math.round((completedStages / stages.length) * 100);
  };

  const navigationItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: BarChart3, label: "Analytics", href: "/analytics" },
    { icon: Bell, label: "Notifications", href: "/notifications" },
    { icon: HelpCircle, label: "Help & Support", href: "/help" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  if (!mounted) return null;

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full">
        <div className="p-6 h-full flex flex-col">
          {/* Enhanced Header with Logo and User */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center space-x-3 mb-6"
            >
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-xl relative group cursor-pointer">
                <span className="text-white font-bold text-sm">S</span>
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-black/30 rounded-xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
              </div>
              <span className="text-lg font-bold text-black">Sabi AI</span>
            </motion.div>
            
            {/* Enhanced User Info */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="group relative overflow-hidden bg-gray-50/80 border border-gray-200/60 rounded-2xl p-3 hover:shadow-xl transition-all duration-500 cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 relative cursor-pointer">
                  <User className="w-4 h-4 text-white" />
                  {/* Pulse ring */}
                  <div className="absolute inset-0 rounded-xl bg-black/30 animate-ping" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-black truncate">{session?.user?.email}</p>
                  <p className="text-xs text-gray-600 flex items-center">
                    <div className="w-1.5 h-1.5 bg-black rounded-full mr-2 animate-pulse" />
                    Active Learner
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Enhanced Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-8"
          >
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-black transition-colors duration-300" />
              <input
                type="text"
                placeholder="Search roadmaps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/50 focus:border-black/60 transition-all duration-300 placeholder:text-gray-400 shadow-sm text-sm"
              />
              {/* Search glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-black/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-xl" />
            </div>
          </motion.div>

          {/* Enhanced Create New Roadmap Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-8"
          >
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button 
                  className="w-full bg-black hover:bg-gray-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 h-10 text-sm font-semibold rounded-xl relative overflow-hidden group cursor-pointer"
                >
                  {/* Button glow effect */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl" />
                  <div className="relative z-10 flex items-center">
                    <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                    New Roadmap
                  </div>
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[540px]">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-black">Create New Roadmap</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsSheetOpen(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        What would you like to learn?
                      </label>
                      <textarea
                        value={newRoadmapPrompt}
                        onChange={(e) => setNewRoadmapPrompt(e.target.value)}
                        placeholder="e.g., Learn React from scratch, Master Python for data science, Become a full-stack developer..."
                        className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none transition-all duration-200"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-black" />
                        <span className="text-sm text-gray-500">AI-powered learning path</span>
                      </div>
                      
                      <Button
                        onClick={createNewRoadmap}
                        disabled={!newRoadmapPrompt.trim() || isCreating}
                        className="bg-black hover:bg-gray-800 text-white"
                      >
                        {isCreating ? "Creating..." : "Create Roadmap"}
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </motion.div>

          {/* Enhanced Roadmaps List */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex-1 overflow-y-auto space-y-3"
          >
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="animate-pulse"
                  >
                    <div className="h-28 bg-gray-200/60 rounded-2xl" />
                  </motion.div>
                ))}
              </div>
            ) : filteredRoadmaps.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">
                  {searchQuery ? "No roadmaps found" : "No roadmaps yet"}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {searchQuery ? "Try adjusting your search terms" : "Create your first roadmap to start your learning journey"}
                </p>
                {!searchQuery && (
                  <Button
                    onClick={() => setIsSheetOpen(true)}
                    className="bg-black hover:bg-gray-800 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Roadmap
                  </Button>
                )}
              </motion.div>
            ) : (
              <AnimatePresence>
                {filteredRoadmaps.map((roadmap, index) => {
                  const progress = getProgressPercentage(roadmap);
                  return (
                    <motion.div
                      key={roadmap.id}
                      initial={{ opacity: 0, x: -20, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      onMouseEnter={() => setHoveredRoadmap(roadmap.id)}
                      onMouseLeave={() => setHoveredRoadmap(null)}
                      onClick={() => router.push(`/dashboard/${roadmap.id}`)}
                      className={`group cursor-pointer p-3 bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-xl hover:bg-white/95 hover:border-gray-300/60 hover:shadow-xl transition-all duration-500 transform ${
                        hoveredRoadmap === roadmap.id ? 'scale-105 -translate-y-1' : 'scale-100 translate-y-0'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-black truncate group-hover:text-gray-700 transition-colors duration-300">
                            {roadmap.prompt}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {formatDate(roadmap.createdAt)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {progress === 100 ? (
                            <div className="w-6 h-6 bg-black/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 cursor-pointer">
                              <CheckCircle className="w-4 h-4 text-black" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 cursor-pointer">
                              <Target className="w-4 h-4 text-gray-500" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Enhanced Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-600">Progress</span>
                          <span className="text-xs font-semibold text-gray-700">{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200/60 rounded-full h-2 overflow-hidden">
                          <motion.div
                            className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                              progress === 100 
                                ? 'bg-black' 
                                : 'bg-black'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </motion.div>

          {/* Enhanced Bottom Navigation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mt-8 pt-6 border-t border-gray-200/60"
          >
            <div className="space-y-2">
              {navigationItems.map((item, index) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                  onClick={() => router.push(item.href)}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-black hover:bg-gray-100/60 rounded-xl transition-all duration-300 group cursor-pointer"
                >
                  <div className="w-6 h-6 bg-black/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm cursor-pointer">
                    <item.icon className="w-3 h-3 text-black" />
                  </div>
                  <span className="text-xs font-medium">{item.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <div className="p-6 h-full flex flex-col">
              {/* Mobile Header */}
              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">S</span>
                  </div>
                  <span className="text-2xl font-bold text-black">Sabi AI</span>
                </div>
                
                {/* User Info */}
                <div className="group relative overflow-hidden bg-gray-50/80 border border-gray-200/60 rounded-2xl p-4 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-black truncate">{session?.user?.email}</p>
                      <p className="text-xs text-gray-600 flex items-center">
                        <div className="w-2 h-2 bg-black rounded-full mr-2 animate-pulse" />
                        Active Learner
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-black transition-colors duration-200" />
                  <input
                    type="text"
                    placeholder="Search roadmaps..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/50 focus:border-black/60 transition-all duration-300 placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Create New Roadmap Button */}
              <div className="mb-6">
                <Button 
                  onClick={() => setIsSheetOpen(true)}
                  className="w-full bg-black hover:bg-gray-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 h-14 text-base font-semibold rounded-2xl"
                >
                  <Plus className="w-6 h-6 mr-3" />
                  New Roadmap
                </Button>
              </div>

              {/* Roadmaps List (same as desktop) */}
              <div className="flex-1 overflow-y-auto space-y-3">
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-28 bg-gray-200/60 rounded-2xl" />
                      </div>
                    ))}
                  </div>
                ) : filteredRoadmaps.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-black mb-2">
                      {searchQuery ? "No roadmaps found" : "No roadmaps yet"}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {searchQuery ? "Try adjusting your search terms" : "Create your first roadmap to start your learning journey"}
                    </p>
                    {!searchQuery && (
                      <Button
                        onClick={() => setIsSheetOpen(true)}
                        className="bg-black hover:bg-gray-800 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Roadmap
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredRoadmaps.map((roadmap) => {
                      const progress = getProgressPercentage(roadmap);
                      return (
                        <div
                          key={roadmap.id}
                          onClick={() => {
                            router.push(`/dashboard/${roadmap.id}`);
                          }}
                          className="group cursor-pointer p-5 bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-2xl hover:bg-white/95 hover:border-gray-300/60 hover:shadow-xl transition-all duration-300"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-black truncate group-hover:text-gray-700 transition-colors duration-200">
                                {roadmap.prompt}
                              </h3>
                              <div className="flex items-center space-x-2 mt-2">
                                <Clock className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-500">
                                  {formatDate(roadmap.createdAt)}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              {progress === 100 ? (
                                <div className="w-8 h-8 bg-black/20 rounded-full flex items-center justify-center">
                                  <CheckCircle className="w-5 h-5 text-black" />
                                </div>
                              ) : (
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                  <Target className="w-5 h-5 text-gray-500" />
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-gray-600">Progress</span>
                              <span className="text-xs font-semibold text-gray-700">{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200/60 rounded-full h-2.5 overflow-hidden">
                              <div
                                className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${
                                  progress === 100 
                                    ? 'bg-black' 
                                    : 'bg-black'
                                }`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Bottom Navigation */}
              <div className="mt-8 pt-6 border-t border-gray-200/60">
                <div className="space-y-2">
                  {navigationItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => router.push(item.href)}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-black hover:bg-gray-100/60 rounded-2xl transition-all duration-300 group"
                    >
                      <div className="w-8 h-8 bg-black/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                        <item.icon className="w-4 h-4 text-black" />
                      </div>
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
