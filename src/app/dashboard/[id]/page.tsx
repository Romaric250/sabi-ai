import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { StageSheet } from "@/components/StageSheet";
import { FinalQuizModal } from "@/components/FinalQuizModal";
import { Suspense } from "react";
import { Progress } from "@/components/ui/progress";
import { User } from "lucide-react";

export default async function DashboardRoadmapPage({ params }: { params: { id: string } }) {
  const roadmap = await prisma.roadmap.findUnique({
    where: { id: params.id },
  });
  if (!roadmap) return notFound();

  // Fake progress for demo
  const progress = Math.floor(Math.random() * 80) + 10;

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] w-full px-4 py-10">
      <div className="w-full max-w-3xl mx-auto rounded-3xl bg-white/60 backdrop-blur-xl shadow-2xl p-10 relative border border-white/20">
        {/* Personalized greeting */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center">
            <User size={22} className="text-black/70" />
          </div>
          <h2 className="text-2xl font-bold text-black/90 tracking-tight">Welcome back! <span className="animate-bounce inline-block">👋</span></h2>
        </div>
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-black/70">Progress</span>
            <span className="text-xs text-black/50">{progress}%</span>
          </div>
          <div className="w-full h-3 bg-black/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-black via-gray-700 to-white rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
          </div>
        </div>
        {/* Roadmap prompt */}
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-6 tracking-tight leading-tight">
          {roadmap.prompt}
        </h1>
        <hr className="my-6 border-white/30" />
        {/* Roadmap content (stages, etc.) */}
        <div className="mb-8">
          <Suspense fallback={<div>Loading stages...</div>}>
            <StageSheet roadmap={roadmap} />
          </Suspense>
        </div>
        <hr className="my-6 border-white/30" />
        {/* Final Quiz Modal (if any) */}
        <Suspense fallback={<div>Loading quiz...</div>}>
          <FinalQuizModal roadmap={roadmap} />
        </Suspense>
      </div>
    </div>
  );
}
