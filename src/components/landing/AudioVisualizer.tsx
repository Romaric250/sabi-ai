"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export function AudioVisualizer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioData, setAudioData] = useState<number[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const controls = useAnimation();

  useEffect(() => {
    if (isPlaying) {
      startAudioVisualization();
    } else {
      stopAudioVisualization();
    }

    return () => {
      stopAudioVisualization();
    };
  }, [isPlaying]);

  const startAudioVisualization = async () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      // Create oscillator for demo visualization
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(analyser);
      analyser.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      
      oscillator.start();
      
      const updateVisualization = () => {
        if (!isPlaying) return;
        
        analyser.getByteFrequencyData(dataArray);
        const normalizedData = Array.from(dataArray).map(value => value / 255);
        setAudioData(normalizedData);
        
        // Animate background based on audio intensity
        const averageIntensity = normalizedData.reduce((a, b) => a + b, 0) / normalizedData.length;
        controls.start({
          scale: 1 + averageIntensity * 0.1,
          rotate: averageIntensity * 360,
          transition: { duration: 0.1 }
        });
        
        animationRef.current = requestAnimationFrame(updateVisualization);
      };
      
      updateVisualization();
    } catch (error) {
      console.log("Audio visualization not supported");
      // Fallback to simulated data
      simulateAudioData();
    }
  };

  const simulateAudioData = () => {
    const updateSimulation = () => {
      if (!isPlaying) return;
      
      const simulatedData = Array.from({ length: 64 }, () => Math.random() * 0.8 + 0.2);
      setAudioData(simulatedData);
      
      const averageIntensity = simulatedData.reduce((a, b) => a + b, 0) / simulatedData.length;
      controls.start({
        scale: 1 + averageIntensity * 0.1,
        rotate: averageIntensity * 360,
        transition: { duration: 0.1 }
      });
      
      animationRef.current = requestAnimationFrame(updateSimulation);
    };
    
    updateSimulation();
  };

  const stopAudioVisualization = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setAudioData([]);
    controls.start({ scale: 1, rotate: 0 });
  };

  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed top-8 left-8 z-50">
      <motion.button
        onClick={toggleAudio}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={controls}
        className="relative group p-4 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300"
      >
        {isPlaying ? (
          <Volume2 className="w-6 h-6 text-white" />
        ) : (
          <VolumeX className="w-6 h-6 text-white" />
        )}
        
        {/* Audio visualization bars */}
        {isPlaying && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex items-end gap-1 h-8">
            {audioData.slice(0, 8).map((intensity, i) => (
              <motion.div
                key={i}
                className="w-1 bg-white rounded-full"
                animate={{
                  height: intensity * 20,
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 0.3,
                  repeat: Infinity,
                  delay: i * 0.05,
                }}
              />
            ))}
          </div>
        )}
        
        {/* Ripple effect */}
        {isPlaying && (
          <div className="absolute inset-0 rounded-full border border-white/30 animate-ping" />
        )}
      </motion.button>
      
      {/* Floating particles based on audio */}
      {isPlaying && (
        <div className="absolute inset-0 pointer-events-none">
          {audioData.slice(0, 12).map((intensity, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -50 - intensity * 100],
                x: [0, (Math.random() - 0.5) * 100],
                opacity: [1, 0],
                scale: [0, intensity * 2],
              }}
              transition={{
                duration: 2 + intensity * 2,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function AmbientSoundscape() {
  const [isActive, setIsActive] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleAmbient = () => {
    if (audioRef.current) {
      if (isActive) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsActive(!isActive);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <motion.button
        onClick={toggleAmbient}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`relative p-4 rounded-full border transition-all duration-300 ${
          isActive 
            ? "bg-white/20 border-white/40" 
            : "bg-white/10 border-white/20 hover:bg-white/15"
        }`}
      >
        <div className="w-6 h-6 text-white">
          {isActive ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              🎵
            </motion.div>
          ) : (
            "🎵"
          )}
        </div>
        
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-full border border-white/30"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </motion.button>
      
      <audio ref={audioRef} loop>
        <source src="/ambient-learning.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
} 