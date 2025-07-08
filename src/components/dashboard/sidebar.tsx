"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/components/session";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
  User
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

  useEffect(() => {
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
      setRoadmaps(data);
      setFilteredRoadmaps(data);
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
    
    // Handle different possible data structures
    let stages: any[] = [];
    const content = roadmap.content as any;
    
    if (Array.isArray(content)) {
      stages = content;
    } else if (content && typeof content === 'object') {
      // Check if it's an object with numeric keys (array-like object)
      const keys = Object.keys(content);
      if (keys.every(key => !isNaN(Number(key)))) {
        // Convert object with numeric keys to array
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

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full">
        <div className="p-6 h-full flex flex-col">
          {/* Header with Logo and User */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-semibold text-black">Sabi AI</span>
            </div>
            
            {/* User Info */}
            <div className="flex items-center space-x-3 p-3 bg-black/5 rounded-lg">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-black truncate">{session?.user?.email}</p>
                <p className="text-xs text-gray-600">Learning</p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search roadmaps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Create New Roadmap Button */}
          <div className="mb-6">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button 
                  className="w-full bg-black hover:bg-gray-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Roadmap
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
                        className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
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
          </div>

          {/* Roadmaps List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-20 bg-gray-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : filteredRoadmaps.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-black mb-2">
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
                      onClick={() => router.push(`/dashboard/${roadmap.id}`)}
                      className="group cursor-pointer p-4 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl hover:bg-white/80 hover:border-gray-300/50 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-black truncate group-hover:text-gray-700 transition-colors">
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
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Target className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-600">Progress</span>
                          <span className="text-xs text-gray-500">{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-black h-1.5 rounded-full transition-all duration-300"
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
          <div className="mt-6 pt-6 border-t border-gray-200/50">
            <div className="space-y-2">
              <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-black hover:bg-gray-100/50 rounded-lg transition-all duration-200">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">Analytics</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-black hover:bg-gray-100/50 rounded-lg transition-all duration-200">
                <Settings className="w-4 h-4" />
                <span className="text-sm font-medium">Settings</span>
              </button>
            </div>
          </div>
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
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">S</span>
                  </div>
                  <span className="text-xl font-semibold text-black">Sabi AI</span>
    </div>
                
                {/* User Info */}
                <div className="flex items-center space-x-3 p-3 bg-black/5 rounded-lg">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black truncate">{session?.user?.email}</p>
                    <p className="text-xs text-gray-600">Learning</p>
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search roadmaps..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Create New Roadmap Button */}
              <div className="mb-6">
                <Button 
                  onClick={() => setIsSheetOpen(true)}
                  className="w-full bg-black hover:bg-gray-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Roadmap
                </Button>
              </div>

              {/* Roadmaps List (same as desktop) */}
              <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-gray-200 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredRoadmaps.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-black mb-2">
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
                            // Close mobile sidebar
                          }}
                          className="group cursor-pointer p-4 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl hover:bg-white/80 hover:border-gray-300/50 hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-black truncate group-hover:text-gray-700 transition-colors">
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
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <Target className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-gray-600">Progress</span>
                              <span className="text-xs text-gray-500">{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-black h-1.5 rounded-full transition-all duration-300"
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
              <div className="mt-6 pt-6 border-t border-gray-200/50">
                <div className="space-y-2">
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-black hover:bg-gray-100/50 rounded-lg transition-all duration-200">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">Analytics</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-black hover:bg-gray-100/50 rounded-lg transition-all duration-200">
                    <Settings className="w-4 h-4" />
                    <span className="text-sm font-medium">Settings</span>
                  </button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
