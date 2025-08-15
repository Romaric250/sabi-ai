"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { 
  Heart, 
  Search, 
  Globe, 
  Zap, 
  ChevronDown, 
  ArrowUp,
  Plus,
  Sparkles,
  Target,
  CheckCircle,
  Users,
  Award,
  Star,
  ArrowRight,
  Filter,
  Eye,
  Edit3,
  MoreHorizontal,
  Clock,
  BookOpen,
  LogOut,
  LogIn
} from "lucide-react";

interface Roadmap {
  id: string;
  prompt: string;
  createdAt: string;
  updatedAt: string;
  stages: any[];
}

export default function LandingPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userRoadmaps, setUserRoadmaps] = useState<Roadmap[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [publicRoadmaps, setPublicRoadmaps] = useState([
    {
      id: 1,
      title: "Machine Learning Fundamentals",
      creator: "DataScience Pro",
      remixes: 15420,
      category: "AI & ML",
      thumbnail: "bg-gradient-to-br from-indigo-500 to-purple-500",
      slug: "ml-fundamentals"
    },
    {
      id: 2,
      title: "Web3 Development",
      creator: "Blockchain Dev",
      remixes: 8920,
      category: "Blockchain",
      thumbnail: "bg-gradient-to-br from-green-500 to-blue-500",
      slug: "web3-development"
    },
    {
      id: 3,
      title: "Mobile App Development",
      creator: "App Creator",
      remixes: 12450,
      category: "Mobile",
      thumbnail: "bg-gradient-to-br from-pink-500 to-orange-500",
      slug: "mobile-app-dev"
    },
    {
      id: 4,
      title: "DevOps Engineering",
      creator: "Cloud Expert",
      remixes: 6780,
      category: "DevOps",
      thumbnail: "bg-gradient-to-br from-yellow-500 to-green-500",
      slug: "devops-engineering"
    }
  ]);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();
      
      if (data.user) {
        setIsSignedIn(true);
        setUser(data.user);
        fetchUserRoadmaps();
      } else {
        setIsSignedIn(false);
        setUser(null);
        setUserRoadmaps([]);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsSignedIn(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserRoadmaps = async () => {
    try {
      const response = await fetch('/api/user-roadmap');
      if (response.ok) {
        const data = await response.json();
        setUserRoadmaps(data.roadmaps || []);
      }
    } catch (error) {
      console.error('Error fetching user roadmaps:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSignedIn) {
      // Redirect to login if not authenticated
      router.push('/auth/sign-in');
      return;
    }

    if (!prompt.trim()) return;

    try {
      // Create new roadmap
      const response = await fetch('/api/roadmap/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to the new roadmap
        router.push(`/dashboard/${data.roadmap.id}`);
      } else {
        console.error('Failed to create roadmap');
      }
    } catch (error) {
      console.error('Error creating roadmap:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
      setIsSignedIn(false);
      setUser(null);
      setUserRoadmaps([]);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSignIn = () => {
    router.push('/auth/sign-in');
  };

  const handleViewRoadmap = (roadmapId: string) => {
    router.push(`/dashboard/${roadmapId}`);
  };

  const getProgressPercentage = (stages: any[]) => {
    if (!stages || stages.length === 0) return 0;
    const completedStages = stages.filter(stage => stage.isCompleted).length;
    return Math.round((completedStages / stages.length) * 100);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-black/5 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-black/5 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-black/3 rounded-full blur-2xl animate-float" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-black">Sabi AI</span>
          </motion.div>

          {/* Navigation Links */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hidden md:flex items-center space-x-8"
          >
            <a href="#community" className="text-black hover:text-gray-600 transition-colors duration-200">Community</a>
            <a href="#pricing" className="text-black hover:text-gray-600 transition-colors duration-200">Pricing</a>
            <a href="#enterprise" className="text-black hover:text-gray-600 transition-colors duration-200">Enterprise</a>
            <a href="#learn" className="text-black hover:text-gray-600 transition-colors duration-200">Learn</a>
            <a href="#launched" className="text-black hover:text-gray-600 transition-colors duration-200">Launched</a>
          </motion.div>

          {/* Right Side */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center space-x-4"
          >
            <Button variant="ghost" className="text-black hover:bg-black/5">
              <Award className="w-4 h-4 mr-2" />
              Get free credits
            </Button>
            
            {isSignedIn ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user?.name?.[0] || user?.email?.[0] || 'U'}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-black">
                    {user?.name || user?.email || 'User'}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleSignOut}
                  className="text-black hover:bg-black/5"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button 
                onClick={handleSignIn}
                className="bg-black hover:bg-gray-800 text-white"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
          </motion.div>
        </div>
      </nav>

      {/* Main Hero Section */}
      <main className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-7xl font-bold text-black mb-6 leading-tight">
              Build something
              <div className="inline-flex items-center mx-3">
                <Heart className="w-12 h-12 text-black" />
              </div>
              amazing
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Create learning roadmaps and master new skills by chatting with AI
            </p>
          </motion.div>

          {/* Main Input Form */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-12"
          >
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative">
                <Input
                  type="text"
                  placeholder={isSignedIn ? "Ask Sabi AI to create a learning roadmap for..." : "Sign in to create learning roadmaps..."}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={!isSignedIn}
                  className={`w-full h-16 pl-6 pr-32 text-lg bg-white/90 backdrop-blur-sm border-2 border-gray-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/50 focus:border-black/60 transition-all duration-300 placeholder:text-gray-400 shadow-xl ${
                    !isSignedIn ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                />
                
                {/* Internal Icons */}
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  <div className="w-8 h-8 bg-black/10 rounded-full flex items-center justify-center">
                    <Search className="w-4 h-4 text-black" />
                  </div>
                  <div className="w-8 h-8 bg-black/10 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-black" />
                  </div>
                </div>
              </div>

              {/* Bottom Controls */}
              <div className="flex items-center justify-between mt-4 px-2">
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" size="sm" className="h-8 px-3 text-black hover:bg-black/5" disabled={!isSignedIn}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 px-3 text-black hover:bg-black/5" disabled={!isSignedIn}>
                    <Globe className="w-4 h-4 mr-1" />
                    Public
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 px-3 text-black hover:bg-black/5" disabled={!isSignedIn}>
                    <Zap className="w-4 h-4 mr-1" />
                    AI Powered
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </Button>
                </div>

                {/* Send Button */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={!isSignedIn || !prompt.trim()}
                  className={`w-14 h-14 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${
                    isSignedIn && prompt.trim() 
                      ? 'bg-black hover:bg-gray-800 text-white' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ArrowUp className="w-6 h-6" />
                </Button>
              </div>
            </form>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {[
              {
                icon: Target,
                title: "Personalized Learning",
                description: "AI creates custom roadmaps based on your goals and experience"
              },
              {
                icon: CheckCircle,
                title: "Track Progress",
                description: "Monitor your learning journey with detailed analytics and milestones"
              },
              {
                icon: Users,
                title: "Community Support",
                description: "Learn alongside others and share your achievements"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                className="text-center p-6 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl hover:shadow-lg transition-all duration-300 group cursor-pointer transform hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-black/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Romaric's Sabi AI's Workspace */}
      {isSignedIn && userRoadmaps.length > 0 && (
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="relative z-10 px-6 py-16"
        >
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/90 backdrop-blur-xl border border-gray-200/60 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-black">
                  {user?.name || user?.email}'s Sabi AI's Workspace
                </h2>
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
                {userRoadmaps.map((roadmap, index) => {
                  const progress = getProgressPercentage(roadmap.stages);
                  const status = progress === 100 ? 'Completed' : progress > 0 ? 'In Progress' : 'Not Started';
                  
                  return (
                    <motion.div
                      key={roadmap.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                      className="group cursor-pointer bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                      onClick={() => handleViewRoadmap(roadmap.id)}
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
                            <div
                              className="h-2 bg-black rounded-full transition-all duration-1000 ease-out"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                        
                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-semibold">
                                {user?.name?.[0] || user?.email?.[0] || 'U'}
                              </span>
                            </div>
                            <span className="text-sm text-gray-600">
                              {roadmap.prompt.toLowerCase().replace(/\s+/g, '-').substring(0, 20)}...
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatDate(roadmap.updatedAt)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* From the Community */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: isSignedIn ? 1.4 : 1.0 }}
        className="relative z-10 px-6 py-16"
      >
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/90 backdrop-blur-xl border border-gray-200/60 rounded-3xl p-8 shadow-2xl">
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
              {publicRoadmaps.map((roadmap, index) => (
                <motion.div
                  key={roadmap.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: (isSignedIn ? 1.6 : 1.2) + index * 0.1 }}
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
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: isSignedIn ? 1.8 : 1.4 }}
        className="relative z-10 px-6 py-16 bg-white/50 backdrop-blur-sm"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">Trusted by learners worldwide</h2>
            <p className="text-gray-600">Join thousands of students mastering new skills</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "50K+", label: "Active Learners" },
              { number: "100+", label: "Learning Paths" },
              { number: "95%", label: "Success Rate" },
              { number: "24/7", label: "AI Support" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: (isSignedIn ? 2.0 : 1.6) + index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-black mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: isSignedIn ? 2.2 : 1.8 }}
        className="relative z-10 px-6 py-20"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-black mb-6">
            Ready to start your learning journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create your first AI-powered learning roadmap and begin mastering new skills today.
          </p>
          <div className="flex items-center justify-center space-x-4">
            {isSignedIn ? (
              <Button 
                size="lg" 
                onClick={() => router.push('/dashboard')}
                className="bg-black hover:bg-gray-800 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Go to Dashboard
              </Button>
            ) : (
              <Button 
                size="lg" 
                onClick={handleSignIn}
                className="bg-black hover:bg-gray-800 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Get Started Free
              </Button>
            )}
            <Button variant="outline" size="lg" className="border-2 border-black/20 text-black hover:bg-black/5 px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300">
              View Examples
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-16 bg-gray-50/80 border-t border-gray-200/60">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Logo */}
            <div className="col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-black">Sabi AI</span>
              </div>
              <p className="text-gray-600 text-sm">
                Empowering learners with AI-powered education
              </p>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold text-black mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-black transition-colors duration-200">Blog</a></li>
                <li><a href="#" className="text-gray-600 hover:text-black transition-colors duration-200">Careers</a></li>
                <li><a href="#" className="text-gray-600 hover:text-black transition-colors duration-200">About</a></li>
              </ul>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-semibold text-black mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-black transition-colors duration-200">Features</a></li>
                <li><a href="#" className="text-gray-600 hover:text-black transition-colors duration-200">Pricing</a></li>
                <li><a href="#" className="text-gray-600 hover:text-black transition-colors duration-200">Integrations</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold text-black mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-black transition-colors duration-200">Documentation</a></li>
                <li><a href="#" className="text-gray-600 hover:text-black transition-colors duration-200">Support</a></li>
                <li><a href="#" className="text-gray-600 hover:text-black transition-colors duration-200">Community</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-black mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-black transition-colors duration-200">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-black transition-colors duration-200">Terms of Service</a></li>
                <li><a href="#" className="text-gray-600 hover:text-black transition-colors duration-200">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200/60 mt-12 pt-8 text-center">
            <p className="text-gray-600 text-sm">
              © 2024 Sabi AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
