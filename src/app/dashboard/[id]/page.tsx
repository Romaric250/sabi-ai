import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { User, BookOpen, Target, CheckCircle } from "lucide-react";

export default async function DashboardRoadmapPage({ params }: { params: { id: string } }) {
  const roadmap = await prisma.roadmap.findUnique({
    where: { id: params.id },
  });
  
  if (!roadmap) return notFound();

  // Parse the roadmap content to get stages
  const roadmapData = roadmap.content as any;
  const stages = roadmapData?.roadmap || [];
  
  // Calculate progress based on completed stages
  const completedStages = stages.filter((stage: any) => stage.isCompleted).length;
  const progress = stages.length > 0 ? Math.round((completedStages / stages.length) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-black to-gray-700 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{roadmap.prompt}</h1>
            <p className="text-slate-600">Your personalized learning journey</p>
          </div>
        </div>
        
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Progress</span>
            <span className="text-sm text-slate-500">{progress}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-black to-gray-700 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{completedStages} of {stages.length} stages completed</span>
            <span>{stages.length - completedStages} remaining</span>
          </div>
        </div>
      </div>

      {/* Stages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stages.map((stage: any, index: number) => (
          <div
            key={stage.id}
            className={`bg-white/60 backdrop-blur-sm border rounded-xl p-6 transition-all duration-200 ${
              stage.isCompleted 
                ? 'border-green-200/50 bg-green-50/30' 
                : stage.isUnlocked 
                ? 'border-slate-200/50 hover:border-slate-300/50 hover:shadow-md' 
                : 'border-slate-100/50 bg-slate-50/30'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  stage.isCompleted 
                    ? 'bg-green-500' 
                    : stage.isUnlocked 
                    ? 'bg-black' 
                    : 'bg-slate-300'
                }`}>
                  {stage.isCompleted ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : (
                    <span className="text-white font-medium text-sm">{index + 1}</span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{stage.title}</h3>
                  <p className="text-xs text-slate-500">{stage.lessons?.length || 0} lessons</p>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-slate-600 mb-4 line-clamp-2">
              {stage.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <Target className="w-3 h-3" />
                <span>Stage {index + 1}</span>
              </div>
              
              {stage.isCompleted ? (
                <span className="text-xs font-medium text-green-600">Completed</span>
              ) : stage.isUnlocked ? (
                <button className="text-xs font-medium text-black hover:text-gray-700 transition-colors">
                  Start →
                </button>
              ) : (
                <span className="text-xs text-slate-400">Locked</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {stages.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No stages available</h3>
          <p className="text-slate-500">This roadmap doesn't have any stages yet.</p>
        </div>
      )}
    </div>
  );
}
