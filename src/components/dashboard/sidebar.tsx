"use client";

import { useSession } from "@/components/session";
import { SidebarContent, SidebarTrigger } from "../ui/sidebar";
import { roadMapApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Roadmap } from "@prisma/client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {}

const DashboardSidebar = ({}: DashboardSidebarProps) => {
  const { user } = useSession();

  const { data: roadmaps, isLoading } = useQuery({
    queryKey: ["roadmaps", user.id],
    queryFn: () => roadMapApi.getUserRoadmaps(user.id),
    enabled: !!user.id,
  });

  return (
    <div className="fixed top-0 left-0 h-screen z-50 flex">
      <div className="relative h-full">
        <SidebarContent className="bg-white h-full">
          <div className="p-4 h-full">
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
    </div>
  );
};

const RoadmapList = ({ roadmaps }: { roadmaps: Roadmap[] }) => {
  const pathname = usePathname();

  return (
    <ul className="flex flex-col gap-2 mt-20">
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
