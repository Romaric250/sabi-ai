"use client";

import Link from "next/link";
import { SidebarContent, SidebarTrigger, useSidebar } from "../ui/sidebar";

const DashboardSidebar = () => {
  return (
    <div className="fixed top-0 left-0 h-screen z-50 flex">
      <div className="relative">
        <SidebarContent className="bg-white">
          <div className="p-4">
            <div className="flex flex-col gap-2">
              <Link href="/dashboard">
                <h1 className="text-2xl font-bold">Dashboard</h1>
              </Link>
            </div>
          </div>
        </SidebarContent>
        <div className="absolute right-0 top-4 translate-x-1/2">
          <SidebarTrigger className="bg-white shadow-md rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
