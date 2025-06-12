import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/dashboard/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="bg-white">
        <DashboardSidebar />
        {children}
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
