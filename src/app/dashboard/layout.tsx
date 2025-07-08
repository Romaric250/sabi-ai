import DashboardSidebar from "@/components/dashboard/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SessionProvider } from "@/components/session";
import React from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getSessionCookie } from "better-auth/cookies";
import { Bell, User } from "lucide-react";
import Link from "next/link";

const SIDEBAR_WIDTH = 320; // px
const TOPBAR_HEIGHT = 64; // px (approx 4rem)

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
        {/* Top Bar */}
        <div className="fixed top-0 left-0 w-full z-40" style={{ height: TOPBAR_HEIGHT }}>
          <div className="backdrop-blur-xl bg-white/60 border-b border-white/20 shadow-lg flex items-center justify-between px-8" style={{ height: TOPBAR_HEIGHT }}>
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-black tracking-tight">
                <span className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center font-bold text-lg">S</span>
                Sabi AI
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-full hover:bg-black/10 transition">
                <Bell size={20} />
                {/* Notification dot */}
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </button>
              <div className="w-9 h-9 rounded-full bg-black/10 flex items-center justify-center">
                <User size={20} className="text-black/70" />
              </div>
            </div>
          </div>
        </div>
        {/* Main Layout: Sidebar + Content */}
        <div className="w-full flex" style={{ minHeight: `100vh` }}>
          {/* Sidebar (fixed, below navbar) */}
          <div
            className="hidden md:block"
            style={{
              width: SIDEBAR_WIDTH,
              position: "fixed",
              top: TOPBAR_HEIGHT,
              left: 0,
              height: `calc(100vh - ${TOPBAR_HEIGHT}px)`,
              zIndex: 30,
              paddingTop: TOPBAR_HEIGHT, // Ensure sidebar content is not hidden under navbar
              boxSizing: "border-box",
            }}
          >
            <DashboardSidebar />
          </div>
          {/* Main Content */}
          <main
            className="flex-1 relative"
            style={{
              marginLeft: SIDEBAR_WIDTH,
              paddingTop: TOPBAR_HEIGHT,
              minHeight: `calc(100vh - ${TOPBAR_HEIGHT}px)`,
              width: `calc(100vw - ${SIDEBAR_WIDTH}px)`,
              background: "#fff",
            }}
          >
            {children}
          </main>
        </div>
        {/* Mobile Sidebar Overlay (optional, for mobile) */}
        <div className="md:hidden">
          <DashboardSidebar />
        </div>
      </SessionProvider>
    </SidebarProvider>
  );
};

export default DashboardLayout;
