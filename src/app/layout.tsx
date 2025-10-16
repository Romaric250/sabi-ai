import Provider from "@/components/provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sabi AI - Learn Anything with AI-Powered Roadmaps",
  description: "Master any skill with personalized AI-generated learning roadmaps. From coding to design, Sabi AI creates structured, adaptive learning paths tailored to your goals.",
  keywords: ["AI learning", "personalized education", "learning roadmaps", "skill development", "online courses", "AI tutoring"],
  authors: [{ name: "Sabi AI Team" }],
  creator: "Sabi AI",
  publisher: "Sabi AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://sabi-ai.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Sabi AI - Learn Anything with AI-Powered Roadmaps",
    description: "Master any skill with personalized AI-generated learning roadmaps. From coding to design, Sabi AI creates structured, adaptive learning paths tailored to your goals.",
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://sabi-ai.vercel.app',
    siteName: "Sabi AI",
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Sabi AI - AI-Powered Learning Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Sabi AI - Learn Anything with AI-Powered Roadmaps",
    description: "Master any skill with personalized AI-generated learning roadmaps. From coding to design, Sabi AI creates structured, adaptive learning paths tailored to your goals.",
    images: ['/og-image.svg'],
    creator: '@sabiai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} antialiased`}
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
