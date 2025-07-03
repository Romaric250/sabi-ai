"use client";

import { useSession } from "@/components/session";
import { SidebarContent, SidebarTrigger } from "../ui/sidebar";
import { roadMapApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Roadmap } from "@prisma/client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Plus, Mic, Send, SlidersHorizontal } from "lucide-react";

interface DashboardSidebarProps {}

const DashboardSidebar = ({}: DashboardSidebarProps) => {
  const { user } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: roadmaps, isLoading, error, refetch } = useQuery({
    queryKey: ["roadmaps", user.id],
    queryFn: () => roadMapApi.getUserRoadmaps(user.id),
    enabled: !!user.id,
  });

  const handleCreateRoadmap = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const response = await fetch("/api/roadmap/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });
      if (response.ok) {
        setShowModal(false);
        setPrompt("");
        refetch();
      } else {
        alert("Failed to generate roadmap");
      }
    } catch (e) {
      alert("Failed to generate roadmap");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 h-screen z-50 flex">
      <div className="relative h-full">
        <SidebarContent className="bg-white h-full">
          <div className="p-4 h-full flex flex-col">
            {/* Top bar with plus icon */}
            <div className="flex items-center justify-between mb-6">
              <span className="font-bold text-lg text-black">Your Roadmaps</span>
              <button
                className="w-9 h-9 flex items-center justify-center rounded-full bg-black text-white hover:bg-gray-900 transition"
                onClick={() => setShowModal(true)}
                aria-label="Create new roadmap"
              >
                <Plus size={20} />
              </button>
            </div>
            {isLoading ? (
              <div className="text-center text-sm text-gray-500 h-full flex items-center justify-center">
                Loading...
              </div>
            ) : (
              <RoadmapList roadmaps={roadmaps} />
            )}
          </div>
        </SidebarContent>
        <div className="fixed left-4 top-4">
          <SidebarTrigger className="shadow-none bg-white text-black hover:bg-white/90" />
        </div>
      </div>
      {/* Modal for creating new roadmap */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-8 relative flex flex-col">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-black"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <div className="flex flex-col items-center w-full">
              <textarea
                className="w-full text-lg border-none outline-none resize-none bg-transparent placeholder-gray-400 mb-6 min-h-[60px]"
                placeholder="Ask anything"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                rows={2}
                autoFocus
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleCreateRoadmap();
                  }
                }}
              />
              <div className="flex items-center w-full gap-2 mt-2">
                <button className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200">
                  <SlidersHorizontal size={16} /> Tools
                </button>
                <div className="flex-1" />
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 mr-2">
                  <Mic size={18} />
                </button>
                <button
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white hover:bg-gray-900 disabled:opacity-50"
                  onClick={handleCreateRoadmap}
                  disabled={isGenerating || !prompt.trim()}
                  aria-label="Send"
                >
                  {isGenerating ? (
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" /></svg>
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const RoadmapList = ({ roadmaps }: { roadmaps: Roadmap[] }) => {
  const pathname = usePathname();

  if (!roadmaps || roadmaps.length === 0) {
    return (
      <div className="mt-20 text-center text-sm text-gray-500">
        No roadmaps found. Generate your first roadmap!
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2 mt-4">
      {roadmaps.map((roadmap) => (
        <li key={roadmap.id}>
          <Link
            href={`/dashboard/${roadmap.id}`}
            className={cn(
              "hover:bg-gray-100 p-2 rounded-md cursor-pointer text-sm truncate block",
              pathname === `/dashboard/${roadmap.id}` && "bg-gray-100"
            )}
          >
            {roadmap.prompt}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default DashboardSidebar;
