"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface Node {
  id: string;
  x: number;
  y: number;
  connections: string[];
  pulse: number;
}

export function NeuralNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize nodes
    const nodes: Node[] = [];
    const nodeCount = 15;
    
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        id: `node-${i}`,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        connections: [],
        pulse: Math.random() * Math.PI * 2,
      });
    }

    // Create connections
    nodes.forEach((node, i) => {
      const connectionCount = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < connectionCount; j++) {
        const targetIndex = (i + j + 1) % nodes.length;
        if (!node.connections.includes(nodes[targetIndex].id)) {
          node.connections.push(nodes[targetIndex].id);
        }
      }
    });

    nodesRef.current = nodes;

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update node pulses
      nodes.forEach(node => {
        node.pulse += 0.02;
      });

      // Draw connections
      nodes.forEach(node => {
        node.connections.forEach(connectionId => {
          const targetNode = nodes.find(n => n.id === connectionId);
          if (targetNode) {
            const distance = Math.sqrt(
              Math.pow(node.x - targetNode.x, 2) + Math.pow(node.y - targetNode.y, 2)
            );
            
            if (distance < 200) {
              const opacity = (200 - distance) / 200 * 0.3;
              ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(targetNode.x, targetNode.y);
              ctx.stroke();
            }
          }
        });
      });

      // Draw nodes
      nodes.forEach(node => {
        const pulseSize = Math.sin(node.pulse) * 3 + 8;
        const opacity = (Math.sin(node.pulse) + 1) / 2 * 0.8 + 0.2;

        // Glow effect
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, pulseSize * 3
        );
        gradient.addColorStop(0, `rgba(139, 92, 246, ${opacity})`);
        gradient.addColorStop(1, "rgba(139, 92, 246, 0)");
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseSize * 3, 0, Math.PI * 2);
        ctx.fill();

        // Core node
        ctx.fillStyle = `rgba(139, 92, 246, ${opacity + 0.2})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: "transparent" }}
    />
  );
} 