import DashboardSidebar from "@/components/dashboard/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SessionProvider } from "@/components/session";
import React from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }
  return (
    <SidebarProvider>
      <SessionProvider value={{ session, user: session.user }}>
        <div className="bg-white">
          <DashboardSidebar />
          {children}
        </div>
      </SessionProvider>
    </SidebarProvider>
  );
};

export default DashboardLayout;
