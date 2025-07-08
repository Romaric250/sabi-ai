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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
          {/* Main Layout: Sidebar + Content */}
          <div className="flex">
            {/* Sidebar */}
            <div className="w-80 bg-white/50 backdrop-blur-xl border-r border-slate-200/50 min-h-screen">
              <DashboardSidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
              <div className="max-w-6xl mx-auto">
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
