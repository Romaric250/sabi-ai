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
  LogIn,
  User,
  Settings,
  Brain,
  Rocket
} from "lucide-react";
import { Session } from "@/lib/auth";

interface Roadmap {
  id: string;
  prompt: string;
  createdAt: string;
  updatedAt: string;
  stages: any[];
}

interface LandingPageClientProps {
  session: Session | null;
}

export function LandingPageClient({ session }: LandingPageClientProps) {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(!!session);
  const [user, setUser] = useState<any>(session?.user || null);
  const [userRoadmaps, setUserRoadmaps] = useState<Roadmap[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
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

  // Fetch user roadmaps when signed in
  useEffect(() => {
    if (isSignedIn) {
      fetchUserRoadmaps();
    }
  }, [isSignedIn]);

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
    
    if (!prompt.trim()) return;

    if (!isSignedIn) {
      // Redirect to login if not authenticated
      router.push('/auth/sign-in');
      return;
    }

    try {
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
      setShowUserMenu(false);
      router.push('/');
      router.refresh();
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
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-black">Sabi AI</span>
          </motion.div>

          {/* Navigation Links */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:flex items-center space-x-8"
          >
            <a href="#features" className="text-gray-600 hover:text-black transition-colors">Features</a>
            <a href="#roadmaps" className="text-gray-600 hover:text-black transition-colors">Roadmaps</a>
            <a href="#community" className="text-gray-600 hover:text-black transition-colors">Community</a>
            <a href="#pricing" className="text-gray-600 hover:text-black transition-colors">Pricing</a>
          </motion.div>

          {/* Auth Buttons */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center space-x-4"
          >
            {isSignedIn ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-black hover:bg-black/5"
                >
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user?.name?.[0] || user?.email?.[0] || 'U'}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </Button>

                {/* User Menu Dropdown */}
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-black">{user?.name || user?.email}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => router.push('/dashboard')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <User className="w-4 h-4" />
                      <span>Dashboard</span>
                    </button>
                    <button
                      onClick={() => router.push('/settings')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={handleSignIn}
                  className="text-black hover:bg-black/5"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
                <Button
                  onClick={() => router.push('/auth/sign-up')}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  Get Started
                </Button>
              </>
            )}
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-black mb-6 leading-tight">
              Learn Anything with
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> AI</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Create personalized learning roadmaps powered by AI. Get structured, interactive lessons tailored to your goals.
            </p>

            {/* Search Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              onSubmit={handleSubmit}
              className="max-w-2xl mx-auto mb-8"
            >
              <div className="relative">
                <Input
                  type="text"
                  placeholder="What do you want to learn? (e.g., JavaScript, Machine Learning, Spanish)"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-14 text-lg pl-6 pr-32 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/50 focus:border-black/60 transition-all duration-300"
                />
                <Button
                  type="submit"
                  className="absolute right-2 top-2 h-10 px-6 bg-black hover:bg-gray-800 text-white rounded-xl"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate
                </Button>
              </div>
            </motion.form>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex items-center justify-center space-x-8 text-sm text-gray-500"
            >
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>50K+ Learners</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>1000+ Roadmaps</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4" />
                <span>95% Success Rate</span>
              </div>
            </motion.div>
          </motion.div>

          {/* User's Workspace Section - Only show when signed in */}
          {isSignedIn && (
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
                      {user?.name || user?.email}&apos;s Sabi AI&apos;s Workspace
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
                  {userRoadmaps.length > 0 ? (
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
                              {/* Progress Bar */}
                              <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-gray-600">Progress</span>
                                  <span className="text-sm font-semibold text-black">{progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                              </div>
                              
                              {/* Stats */}
                              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{formatDate(roadmap.updatedAt)}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Target className="w-4 h-4" />
                                  <span>{roadmap.stages?.length || 0} stages</span>
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
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-black/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-8 h-8 text-black" />
                      </div>
                      <h3 className="text-lg font-semibold text-black mb-2">No roadmaps yet</h3>
                      <p className="text-gray-600 mb-4">Create your first learning roadmap to get started</p>
                      <Button 
                        onClick={() => setPrompt("JavaScript fundamentals")}
                        className="bg-black hover:bg-gray-800 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create First Roadmap
                      </Button>
                    </div>
                  )}
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
                  <Button variant="ghost" className="text-black hover:text-gray-700">
                    View All
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {publicRoadmaps.map((roadmap, index) => (
                    <motion.div
                      key={roadmap.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 1.6 + index * 0.1 }}
                      className="group cursor-pointer bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      {/* Thumbnail */}
                      <div className={`h-32 ${roadmap.thumbnail} rounded-t-2xl relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-black/10" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center text-white">
                            <h3 className="text-lg font-semibold mb-2">{roadmap.title}</h3>
                            <p className="text-sm opacity-90">{roadmap.category}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-gray-600 text-xs font-semibold">
                                {roadmap.creator[0]}
                              </span>
                            </div>
                            <span className="text-sm text-gray-600">{roadmap.creator}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-yellow-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm font-semibold">4.8</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{roadmap.remixes.toLocaleString()} remixes</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>View</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          {/* Features Section */}
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: isSignedIn ? 1.6 : 1.2 }}
            className="relative z-10 px-6 py-16"
          >
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-black mb-4">Why Choose Sabi AI?</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Experience the future of personalized learning with AI-powered roadmaps
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: <Brain className="w-8 h-8" />,
                    title: "AI-Powered Learning",
                    description: "Get personalized roadmaps tailored to your learning style and goals"
                  },
                  {
                    icon: <Target className="w-8 h-8" />,
                    title: "Structured Progress",
                    description: "Track your learning journey with clear milestones and achievements"
                  },
                  {
                    icon: <Users className="w-8 h-8" />,
                    title: "Community Driven",
                    description: "Learn from the community and share your own learning paths"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.8 + index * 0.1 }}
                    className="text-center p-8 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl hover:shadow-xl transition-all duration-300"
                  >
                    <div className="w-16 h-16 bg-black/10 rounded-full flex items-center justify-center mx-auto mb-6 text-black">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-black mb-4">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: isSignedIn ? 1.8 : 1.4 }}
            className="relative z-10 px-6 py-16"
          >
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
                <h2 className="text-4xl font-bold mb-6">Ready to Start Learning?</h2>
                <p className="text-xl mb-8 opacity-90">
                  Join thousands of learners who are already mastering new skills with AI
                </p>
                {!isSignedIn ? (
                  <div className="flex items-center justify-center space-x-4">
                    <Button
                      onClick={() => router.push('/auth/sign-up')}
                      className="bg-white text-black hover:bg-gray-100 px-8 py-4 text-lg"
                    >
                      <Rocket className="w-5 h-5 mr-2" />
                      Get Started Free
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleSignIn}
                      className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg"
                    >
                      <LogIn className="w-5 h-5 mr-2" />
                      Sign In
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => setPrompt("JavaScript fundamentals")}
                    className="bg-white text-black hover:bg-gray-100 px-8 py-4 text-lg"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Your First Roadmap
                  </Button>
                )}
              </div>
            </div>
          </motion.section>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12">
        <div className="max-w-7xl mx-auto">
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
