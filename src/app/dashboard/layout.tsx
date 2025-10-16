import DashboardSidebar from "@/components/dashboard/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SessionProvider } from "@/components/session";
import React from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  return (
    <SidebarProvider>
      <SessionProvider value={{ session, user: session.user }}>
        <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 relative overflow-hidden">
          {/* Subtle background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-black/5 rounded-full blur-3xl animate-pulse-soft" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-black/5 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-black/3 rounded-full blur-2xl animate-float" />
          </div>
          
          {/* Main Layout: Sidebar + Content */}
          <div className="flex relative z-10">
            {/* Enhanced Sidebar - Fixed Position */}
            <div className="fixed left-0 top-0 w-80 h-screen bg-white/90 backdrop-blur-2xl border-r border-gray-200/60 shadow-2xl z-20 overflow-y-auto hidden md:block">
              {/* Subtle sidebar accent */}
              <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-gray-300/50 to-transparent" />
              <DashboardSidebar />
            </div>

            {/* Main Content - Offset for Fixed Sidebar on Desktop */}
            <div className="flex-1 md:ml-80 p-8 relative">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </div>
          </div>
        </div>
      </SessionProvider>
    </SidebarProvider>
  );
};

export default DashboardLayout;
