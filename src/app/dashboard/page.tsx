"use client";

import { Suspense } from "react";
import { BookOpen, Sparkles, Target, TrendingUp, Clock, CheckCircle } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center py-12">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-black/5 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-black" />
            <span className="text-sm font-medium text-black">Welcome back!</span>
          </div>
          
          <h1 className="text-4xl font-bold text-black mb-4">
            Ready to continue learning?
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Pick up where you left off or start a new learning journey with AI-powered roadmaps.
          </p>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Personalized paths</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Track progress</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Complete goals</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 hover:bg-white/80 hover:shadow-md transition-all duration-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Roadmaps</p>
              <p className="text-2xl font-bold text-black">3</p>
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 hover:bg-white/80 hover:shadow-md transition-all duration-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Stages</p>
              <p className="text-2xl font-bold text-black">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 hover:bg-white/80 hover:shadow-md transition-all duration-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Study Time</p>
              <p className="text-2xl font-bold text-black">8.5h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-black">Recent Activity</h2>
          <button className="text-sm font-medium text-black hover:text-gray-700 transition-colors">
            View all
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-gray-50/50 rounded-lg">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-black">
                Completed "React Fundamentals" stage
              </p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-gray-50/50 rounded-lg">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-black">
                Started new roadmap: "Python for Data Science"
              </p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-gray-50/50 rounded-lg">
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-black">
                Achieved 75% progress in "Full-Stack Development"
              </p>
              <p className="text-xs text-gray-500">3 days ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-black/5 border border-black/10 rounded-xl p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-xl font-semibold text-black mb-2">
            Ready to start learning?
          </h3>
          
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Create your first AI-powered learning roadmap and begin your journey to mastery.
          </p>
          
          <div className="flex items-center justify-center space-x-4">
            <button className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200">
              Create New Roadmap
            </button>
            
            <button className="px-6 py-3 bg-white/80 text-black rounded-lg font-medium hover:bg-white border border-gray-200 transition-all duration-200">
              Explore Templates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
