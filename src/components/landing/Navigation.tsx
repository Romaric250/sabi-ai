"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, Sparkles } from "lucide-react";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "bg-black/80 backdrop-blur-xl border-b border-white/10" 
          : "bg-transparent"
      }`}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 opacity-0 hover:opacity-100 transition-opacity duration-500" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center group">
            <div className="relative">
              {/* Animated logo container */}
              <div className="relative w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden group-hover:bg-white/20 transition-all duration-300">
                {/* Rotating inner element */}
                <div className="absolute inset-2 border border-white/30 rounded-lg group-hover:rotate-180 transition-transform duration-700" />
                
                {/* Sparkle effect */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              {/* Floating particles around logo */}
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    left: `${50 + (i - 1) * 20}%`,
                    top: `${50 + (i - 1) * 20}%`,
                    animation: `pulse ${2 + i}s ease-in-out infinite`,
                  }}
                />
              ))}
            </div>
            
            <span className="ml-3 text-2xl font-bold text-white group-hover:text-gray-200 transition-colors duration-300">
              Sabi AI
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {[
              { name: "About", href: "#About" },
              { name: "Docs", href: "#docs" },
            ].map((item, i) => (
              <a
                key={item.name}
                href={item.href}
                className="group relative px-4 py-2 text-white/80 hover:text-white transition-colors duration-300 font-medium"
                style={{
                  transform: `translateY(${Math.sin(mousePosition.y * 0.01 + i) * 2}px)`,
                }}
              >
                <span className="relative z-10">{item.name}</span>
                
                {/* Animated underline */}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300" />
                
                {/* Hover glow */}
                <div className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
            ))}
            
            {/* CTA Button */}
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="group relative px-6 py-3 bg-white text-black font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10">Dashboard</span>
              
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Border glow */}
              <div className="absolute inset-0 border border-white/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="group relative p-2 text-white hover:text-gray-200 transition-colors duration-300"
            >
              <div className="relative w-6 h-6">
                {isOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
                
                {/* Animated background */}
                <div className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-white/10 bg-black/90 backdrop-blur-xl">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {[
                { name: "Features", href: "#features" },
                { name: "Technology", href: "#tech" },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="group block px-3 py-2 text-white/80 hover:text-white transition-colors duration-300 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="relative z-10">{item.name}</span>
                  <div className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
              ))}
              
              <button className="group relative w-full mt-4 px-3 py-2 bg-white text-black font-semibold rounded-lg overflow-hidden transition-all duration-300">
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); opacity: 0.3; }
          50% { transform: translateY(-10px); opacity: 1; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
      `}</style>
    </nav>
  );
} 