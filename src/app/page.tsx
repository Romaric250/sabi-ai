import { LandingPageClient } from "@/components/landing/landing-page-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface Roadmap {
  id: string;
  prompt: string;
  createdAt: string;
  updatedAt: string;
  stages: any[];
}

export default async function LandingPage() {
  const headersList = await headers();
  
  try {
    const session = await auth.api.getSession({
      headers: headersList,
    });
    return <LandingPageClient session={session} />;
    } catch (error) {
    console.error("Error getting session:", error);
    return <LandingPageClient session={null} />;
  }
}