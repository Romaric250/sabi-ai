"use client";

import { useEffect, useState, useRef } from "react";
import { Navigation } from "@/components/landing/Navigation";
import { AuthModal } from "@/components/AuthModal";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Footer from "@/components/landing/Footer";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    // Initialize particles
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.fill();

        // Connect nearby particles
        particles.forEach((otherParticle, otherIndex) => {
          if (index === otherIndex) return;
          
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

        window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authClient.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  // Handle roadmap generation
  const handleGenerateRoadmap = async () => {
    if (!prompt.trim()) return;

    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/roadmap/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Roadmap generation response:', data);
        
        // If we have a roadmap, redirect to dashboard
        if (data.success) {
          if (data.roadmapId) {
            router.push(`/dashboard/${data.roadmapId}`);
          } else {
            router.push('/dashboard');
          }
        } else {
          throw new Error('Failed to generate roadmap');
        }
    } else {
        throw new Error('Failed to generate roadmap');
      }
    } catch (error) {
      console.error('Error generating roadmap:', error);
      alert('Failed to generate roadmap. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setShowAuthModal(false);
    // Retry roadmap generation if there was a prompt
    if (prompt.trim()) {
      handleGenerateRoadmap();
    }
  };

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Interactive Background Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{ zIndex: 1 }}
      />

      {/* Floating Geometric Shapes */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-32 h-32 border border-white/20 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 20}%`,
              transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px) rotate(${scrollY * 0.1}deg)`,
              animation: `float ${3 + i}s ease-in-out infinite`,
            }}
          />
        ))}
        
        {[...Array(4)].map((_, i) => (
          <div
            key={`square-${i}`}
            className="absolute w-24 h-24 border border-white/10 rotate-45"
            style={{
              right: `${15 + i * 20}%`,
              top: `${30 + i * 15}%`,
              transform: `translate(${-mousePosition.x * 0.005}px, ${-mousePosition.y * 0.005}px) rotate(${-scrollY * 0.05}deg)`,
              animation: `float ${4 + i}s ease-in-out infinite reverse`,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative px-6 pt-32 pb-24 sm:px-12 lg:px-16 lg:pt-40 lg:pb-32" style={{ zIndex: 10 }}>
        <div className="mx-auto max-w-7xl">
          <div className="text-center relative">
            {/* Animated Background Text */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5">
              <h1 className="text-9xl font-black tracking-tighter">
                SABI AI
              </h1>
            </div>
            
            {/* Main Hero Content */}
            <div className="relative">
              <div className="inline-block mb-8">
                <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium">
                  🚀 Next-Generation Learning Platform
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
                <span className="block">Master Any Skill</span>
                <span className="block bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
                  with AI Intelligence
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
                Experience the future of learning with our revolutionary AI-powered platform that adapts, 
                evolves, and accelerates your journey to mastery.
              </p>
              
              {/* Interactive Text Area */}
              <div className="relative max-w-2xl mx-auto mb-16">
                <div className="relative">
                  {/* Text area container */}
                  <div className="relative bg-black/50 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="w-full bg-transparent text-white outline-none text-lg resize-none"
                      rows={3}
                      placeholder="Ask me anything..."
                      id="hero-textarea"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleGenerateRoadmap();
                        }
                      }}
                    />
                    
                    {/* Send button */}
                    <button 
                      onClick={handleGenerateRoadmap}
                      disabled={isGenerating || !prompt.trim()}
                      className="absolute bottom-4 right-4 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                        {isGenerating ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="group relative px-8 py-4 bg-white text-black font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
                >
                  <span className="relative z-10">Go to Dashboard</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
                
                {!isAuthenticated && (
                  <button 
                    onClick={() => setShowAuthModal(true)}
                    className="group relative px-8 py-4 border border-white/30 text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:bg-white/10"
                  >
                    <span className="relative z-10">Sign In</span>
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                )}
              </div>
              
              {/* Floating Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {[
                  { number: "10K+", label: "Active Learners" },
                  { number: "50+", label: "Skills Available" },
                  { number: "95%", label: "Success Rate" }
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="group relative p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300"
                    style={{
                      transform: `translateY(${Math.sin(scrollY * 0.01 + i) * 10}px)`,
                    }}
                  >
                    <div className="text-3xl font-bold mb-2">{stat.number}</div>
                    <div className="text-gray-400">{stat.label}</div>
                    <div className="absolute inset-0 border border-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32 relative" style={{ zIndex: 10 }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              Revolutionary Features
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Cutting-edge technology that redefines what's possible in learning
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Neural Adaptation",
                description: "Our AI continuously learns your patterns and adapts the curriculum in real-time",
                icon: "🧠"
              },
              {
                title: "Quantum Learning Paths",
                description: "Experience multiple learning dimensions simultaneously for accelerated mastery",
                icon: "⚡"
              },
              {
                title: "Holographic Interface",
                description: "Immerse yourself in a 3D learning environment that responds to your movements",
                icon: "🌐"
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-500"
                style={{
                  transform: `translateY(${Math.sin(scrollY * 0.01 + i * 2) * 15}px)`,
                }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
                
                {/* Animated border */}
                <div className="absolute inset-0 border border-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-24 sm:py-32 relative" style={{ zIndex: 10 }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              Experience the Future
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              See how our platform transforms learning into an immersive journey
            </p>
          </div>
          
          <div className="relative">
            {/* Interactive Demo Area */}
            <div className="relative h-96 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-2xl font-bold mb-2">Interactive Demo</h3>
                  <p className="text-gray-300">Move your mouse to see the magic</p>
                </div>
              </div>
              
              {/* Floating elements that follow mouse */}
              <div
                className="absolute w-4 h-4 bg-white rounded-full pointer-events-none"
                style={{
                  left: mousePosition.x - 8,
                  top: mousePosition.y - 8,
                  transition: 'all 0.1s ease-out',
                }}
              />
              
              <div
                className="absolute w-2 h-2 bg-white/50 rounded-full pointer-events-none"
                style={{
                  left: mousePosition.x - 4,
                  top: mousePosition.y - 4,
                  transition: 'all 0.2s ease-out',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Technology Showcase */}
      <section className="py-24 sm:py-32 relative" style={{ zIndex: 10 }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              Powered by Next-Gen AI
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Cutting-edge artificial intelligence that revolutionizes how you learn
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Neural Networks", icon: "🧠", description: "Advanced deep learning algorithms" },
              { name: "Quantum Computing", icon: "⚛️", description: "Next-generation processing power" },
              { name: "Machine Learning", icon: "🤖", description: "Adaptive learning patterns" },
              { name: "Natural Language", icon: "💬", description: "Human-like understanding" }
            ].map((tech, i) => (
              <div
                key={i}
                className="group relative p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-500"
                style={{
                  transform: `translateY(${Math.sin(scrollY * 0.01 + i * 1.5) * 20}px)`,
                }}
              >
                <div className="text-5xl mb-4">{tech.icon}</div>
                <h3 className="text-xl font-bold mb-2">{tech.name}</h3>
                <p className="text-gray-300 text-sm">{tech.description}</p>
                
                {/* Animated border */}
                <div className="absolute inset-0 border border-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 sm:py-32 relative" style={{ zIndex: 10 }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              Loved by Innovators
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              See what the future's brightest minds have to say
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "This is the future of education. Sabi AI transformed my learning journey completely.",
                author: "Dr. Sarah Chen",
                role: "AI Researcher",
                rating: 5
              },
              {
                quote: "The neural adaptation is incredible. It's like having a personal AI tutor that knows exactly what I need.",
                author: "Marcus Rodriguez",
                role: "Tech Entrepreneur",
                rating: 5
              },
              {
                quote: "Finally, a platform that understands the science of learning and applies it perfectly.",
                author: "Emma Thompson",
                role: "Neuroscientist",
                rating: 5
              }
            ].map((testimonial, i) => (
              <div
                key={i}
                className="group relative p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-500"
                style={{
                  transform: `translateY(${Math.sin(scrollY * 0.01 + i * 2) * 15}px)`,
                }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <div key={j} className="w-4 h-4 bg-yellow-400 rounded-full" />
                  ))}
                </div>
                
                <p className="text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full mr-4" />
                  <div>
                    <p className="font-semibold text-white">{testimonial.author}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                
                {/* Animated border */}
                <div className="absolute inset-0 border border-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32 relative" style={{ zIndex: 10 }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              Ready to Transform Learning?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12">
              Join the revolution and experience the future of education today
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                          <button 
              onClick={() => router.push('/dashboard')}
              className="group relative px-12 py-6 bg-white text-black font-bold text-lg rounded-xl overflow-hidden transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10">Launch Your Future</span>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            
            {!isAuthenticated && (
              <button 
                onClick={() => setShowAuthModal(true)}
                className="group relative px-12 py-6 border border-white/30 text-white font-bold text-lg rounded-xl overflow-hidden transition-all duration-300 hover:bg-white/10"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            )}
            </div>
          </div>
    </div>
      </section>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Footer */}
      <Footer />
    </main>
  );
}
