'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ArrowLeft, Brain, CheckCircle, Lock, Play, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface RoadmapNode {
  id: string;
  label: string;
  description: string;
  quiz: string[];
  children: string[];
}

function CustomNode({ data }: { data: any }) {
  const [showQuiz, setShowQuiz] = useState(false);
  
  const getStatusIcon = () => {
    switch (data.status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'current':
        return <Play className="w-6 h-6 text-blue-400" />;
      case 'locked':
        return <Lock className="w-6 h-6 text-gray-500" />;
      default:
        return null;
    }
  };

  const getNodeStyle = () => {
    switch (data.status) {
      case 'completed':
        return 'bg-green-500/20 border-green-500/50 shadow-green-500/25';
      case 'current':
        return 'bg-blue-500/20 border-blue-500/50 shadow-blue-500/25 animate-pulse';
      case 'locked':
        return 'bg-gray-500/20 border-gray-500/50';
      default:
        return 'bg-purple-500/20 border-purple-500/50';
    }
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`px-6 py-4 rounded-xl border-2 backdrop-blur-sm min-w-[200px] cursor-pointer shadow-lg ${getNodeStyle()}`}
      onClick={() => data.status !== 'locked' && setShowQuiz(!showQuiz)}
      whileHover={{ scale: data.status !== 'locked' ? 1.05 : 1 }}
    >
      <div className="flex items-center gap-3 mb-2">
        <Brain className="w-5 h-5 text-purple-400" />
        {getStatusIcon()}
      </div>
      
      <h3 className="font-bold text-white text-sm mb-1">{data.label}</h3>
      <p className="text-xs text-gray-300 leading-relaxed">{data.description}</p>
      
      {showQuiz && data.status !== 'locked' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 pt-3 border-t border-gray-600"
        >
          <div className="text-xs text-gray-400 mb-2">Quick Quiz:</div>
          {data.quiz.map((question: string, index: number) => (
            <div key={index} className="text-xs text-gray-300 mb-1">
              • {question}
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

const nodeTypes = {
  custom: CustomNode,
};

export default function RoadmapPage() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const generateRoadmap = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Convert roadmap data to ReactFlow nodes and edges
        const newNodes: Node[] = data.roadmap.map((item: RoadmapNode, index: number) => ({
          id: item.id,
          type: 'custom',
          position: { 
            x: (index % 3) * 250 + 100, 
            y: Math.floor(index / 3) * 200 + 50 
          },
          data: {
            label: item.label,
            description: item.description,
            quiz: item.quiz,
            status: index === 0 ? 'completed' : index === 1 ? 'current' : 'locked'
          },
        }));
        
        const newEdges: Edge[] = [];
        data.roadmap.forEach((item: RoadmapNode) => {
          item.children.forEach((childId: string) => {
            newEdges.push({
              id: `e${item.id}-${childId}`,
              source: item.id,
              target: childId,
              animated: true,
              style: { stroke: '#8b5cf6' }
            });
          });
        });
        
        setNodes(newNodes);
        setEdges(newEdges);
      }
    } catch (error) {
      console.error('Error generating roadmap:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="relative z-20 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link 
            href="/"
            className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>
          
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            AI Roadmap Generator
          </h1>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Input section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur opacity-75"></div>
                <div className="relative bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
                  <div className="flex items-center gap-4">
                    <input
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="I want to learn..."
                      className="flex-1 text-lg text-white placeholder-gray-400 bg-transparent border-none outline-none"
                      onKeyPress={(e) => e.key === 'Enter' && generateRoadmap()}
                    />
                    <button
                      onClick={generateRoadmap}
                      disabled={isGenerating || !prompt.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold flex items-center gap-2 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Sparkles size={20} />
                          </motion.div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Brain size={20} />
                          Generate
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Roadmap display */}
          {nodes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-3xl blur-xl" />
              <div className="relative bg-slate-900/80 backdrop-blur-sm rounded-3xl border border-slate-700/50 p-8 h-[600px]">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  nodeTypes={nodeTypes}
                  fitView
                  className="bg-transparent"
                >
                  <Controls className="bg-slate-800 border-slate-600" />
                  <Background 
                    variant={BackgroundVariant.Dots} 
                    gap={20} 
                    size={1} 
                    color="#374151"
                  />
                </ReactFlow>
              </div>
            </motion.div>
          )}

          {/* Empty state */}
          {nodes.length === 0 && !isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <Brain className="w-16 h-16 text-purple-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">
                Ready to Start Learning?
              </h2>
              <p className="text-gray-400 max-w-md mx-auto">
                Enter what you want to learn above and our AI will generate a personalized roadmap just for you.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
