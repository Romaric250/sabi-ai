import { LandingPageClient } from "@/components/landing/landing-page-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sabi AI - Learn Anything with AI-Powered Roadmaps",
  description: "Master any skill with personalized AI-generated learning roadmaps. From coding to design, Sabi AI creates structured, adaptive learning paths tailored to your goals.",
  openGraph: {
    title: "Sabi AI - Learn Anything with AI-Powered Roadmaps",
    description: "Master any skill with personalized AI-generated learning roadmaps. From coding to design, Sabi AI creates structured, adaptive learning paths tailored to your goals.",
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Sabi AI - AI-Powered Learning Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Sabi AI - Learn Anything with AI-Powered Roadmaps",
    description: "Master any skill with personalized AI-generated learning roadmaps. From coding to design, Sabi AI creates structured, adaptive learning paths tailored to your goals.",
    images: ['/og-image.svg'],
  },
};

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