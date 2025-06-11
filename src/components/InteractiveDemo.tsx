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
import { Play, CheckCircle, Lock, Brain, Code, Database, Globe } from 'lucide-react';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    position: { x: 250, y: 0 },
    data: { 
      label: 'HTML Fundamentals',
      description: 'Learn the building blocks of web pages',
      status: 'completed',
      icon: Globe,
      quiz: ['What does HTML stand for?', 'What is a semantic element?']
    },
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 100, y: 150 },
    data: { 
      label: 'CSS Styling',
      description: 'Master visual design and layouts',
      status: 'completed',
      icon: Code,
      quiz: ['What is the box model?', 'How does flexbox work?']
    },
  },
  {
    id: '3',
    type: 'custom',
    position: { x: 400, y: 150 },
    data: { 
      label: 'JavaScript Basics',
      description: 'Add interactivity to your websites',
      status: 'current',
      icon: Brain,
      quiz: ['What is a variable?', 'How do functions work?']
    },
  },
  {
    id: '4',
    type: 'custom',
    position: { x: 250, y: 300 },
    data: { 
      label: 'React Framework',
      description: 'Build dynamic user interfaces',
      status: 'locked',
      icon: Code,
      quiz: ['What is a component?', 'How does state work?']
    },
  },
  {
    id: '5',
    type: 'custom',
    position: { x: 100, y: 450 },
    data: { 
      label: 'State Management',
      description: 'Handle complex application state',
      status: 'locked',
      icon: Database,
      quiz: ['What is Redux?', 'When to use Context API?']
    },
  },
  {
    id: '6',
    type: 'custom',
    position: { x: 400, y: 450 },
    data: { 
      label: 'Advanced Patterns',
      description: 'Master professional development',
      status: 'locked',
      icon: Brain,
      quiz: ['What are hooks?', 'How to optimize performance?']
    },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#8b5cf6' } },
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#8b5cf6' } },
  { id: 'e2-4', source: '2', target: '4', animated: false, style: { stroke: '#64748b' } },
  { id: 'e3-4', source: '3', target: '4', animated: false, style: { stroke: '#64748b' } },
  { id: 'e4-5', source: '4', target: '5', animated: false, style: { stroke: '#64748b' } },
  { id: 'e4-6', source: '4', target: '6', animated: false, style: { stroke: '#64748b' } },
];

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
        <data.icon className="w-5 h-5 text-purple-400" />
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

export function InteractiveDemo() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedPrompt, setSelectedPrompt] = useState("Frontend Development");

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const prompts = [
    "Frontend Development",
    "Machine Learning",
    "DevOps Engineering",
    "Data Science",
    "Mobile Development"
  ];

  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-6">
            See It In Action
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Watch how AI transforms your learning goals into interactive roadmaps
          </p>
          
          {/* Prompt selector */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {prompts.map((prompt) => (
              <motion.button
                key={prompt}
                onClick={() => setSelectedPrompt(prompt)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedPrompt === prompt
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {prompt}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Interactive roadmap */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-3xl blur-xl" />
          <div className="relative bg-slate-900/80 backdrop-blur-sm rounded-3xl border border-slate-700/50 p-8 h-[600px]">
            <div className="h-full w-full">
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
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-6 px-8 py-4 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-300">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <Play className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-gray-300">Current</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-300">Locked</span>
            </div>
          </div>
          <p className="text-gray-400 mt-4">Click on nodes to see quiz questions • Drag to explore • Zoom to focus</p>
        </motion.div>
      </div>
    </section>
  );
}
