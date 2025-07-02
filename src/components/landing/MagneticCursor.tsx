"use client";

import { useEffect, useRef } from "react";

export function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorRef2 = useRef({ x: 0, y: 0 });
  const cursorDotRef2 = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    if (!cursor || !cursorDot) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseEnter = () => {
      cursor.style.opacity = "1";
      cursorDot.style.opacity = "1";
    };

    const handleMouseLeave = () => {
      cursor.style.opacity = "0";
      cursorDot.style.opacity = "0";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Animation loop
    const animate = () => {
      // Smooth cursor following with physics
      const dx = mouseRef.current.x - cursorRef2.current.x;
      const dy = mouseRef.current.y - cursorRef2.current.y;
      
      cursorRef2.current.x += dx * 0.1;
      cursorRef2.current.y += dy * 0.1;
      
      cursor.style.transform = `translate(${cursorRef2.current.x - 20}px, ${cursorRef2.current.y - 20}px)`;

      // Dot follows with delay
      const dotDx = mouseRef.current.x - cursorDotRef2.current.x;
      const dotDy = mouseRef.current.y - cursorDotRef2.current.y;
      
      cursorDotRef2.current.x += dotDx * 0.15;
      cursorDotRef2.current.y += dotDy * 0.15;
      
      cursorDot.style.transform = `translate(${cursorDotRef2.current.x - 4}px, ${cursorDotRef2.current.y - 4}px)`;

      requestAnimationFrame(animate);
    };

    animate();

    // Magnetic effect for interactive elements
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
        cursor.style.transform = `translate(${cursorRef2.current.x - 20}px, ${cursorRef2.current.y - 20}px) scale(1.5)`;
        cursorDot.style.transform = `translate(${cursorDotRef2.current.x - 4}px, ${cursorDotRef2.current.y - 4}px) scale(0.5)`;
      } else {
        cursor.style.transform = `translate(${cursorRef2.current.x - 20}px, ${cursorRef2.current.y - 20}px) scale(1)`;
        cursorDot.style.transform = `translate(${cursorDotRef2.current.x - 4}px, ${cursorDotRef2.current.y - 4}px) scale(1)`;
      }
    };

    document.addEventListener("mouseover", handleElementHover);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseover", handleElementHover);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-10 h-10 border-2 border-white rounded-full pointer-events-none z-[9999] opacity-0 transition-opacity duration-300 mix-blend-difference"
        style={{ transform: "translate(-50%, -50%)" }}
      />
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] opacity-0 transition-opacity duration-300"
        style={{ transform: "translate(-50%, -50%)" }}
      />
    </>
  );
} 