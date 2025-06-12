"use client";

import Link from "next/link";
import { SidebarContent, SidebarTrigger, useSidebar } from "../ui/sidebar";

const DashboardSidebar = () => {
  return (
    <div className="fixed top-0 left-0 h-screen z-50 flex">
      <div className="relative">
        <SidebarContent className="bg-white">
          <div className="p-4"></div>
        </SidebarContent>
        <div className="fixed left-4 top-4">
          <SidebarTrigger className="shadow-none bg-white text-black hover:bg-white/90" />
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
