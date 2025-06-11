'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, FileText, Video, Image, ExternalLink, Download } from 'lucide-react';

interface StudyMaterialCardProps {
  material: string;
  index: number;
}

export function StudyMaterialCard({ material, index }: StudyMaterialCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Determine material type and generate content
  const getMaterialType = (materialName: string) => {
    const lower = materialName.toLowerCase();
    if (lower.includes('video') || lower.includes('youtube') || lower.includes('tutorial')) {
      return 'video';
    } else if (lower.includes('image') || lower.includes('diagram') || lower.includes('chart')) {
      return 'image';
    } else {
      return 'text';
    }
  };

  const generateMaterialContent = (materialName: string, type: string) => {
    switch (type) {
      case 'video':
        return {
          icon: Video,
          color: 'from-red-500 to-pink-500',
          iconColor: 'text-red-400',
          bgColor: 'bg-red-500/20',
          content: {
            description: `Comprehensive video tutorial covering ${materialName.toLowerCase()}`,
            url: `https://youtube.com/watch?v=${Math.random().toString(36).substring(7)}`,
            duration: `${Math.floor(Math.random() * 30 + 10)} minutes`,
            quality: 'HD 1080p'
          }
        };
      case 'image':
        return {
          icon: Image,
          color: 'from-green-500 to-emerald-500',
          iconColor: 'text-green-400',
          bgColor: 'bg-green-500/20',
          content: {
            description: `Visual diagrams and charts for ${materialName.toLowerCase()}`,
            imageUrl: `https://picsum.photos/400/300?random=${index}`,
            resolution: '1920x1080',
            format: 'PNG/SVG'
          }
        };
      default:
        return {
          icon: FileText,
          color: 'from-blue-500 to-cyan-500',
          iconColor: 'text-blue-400',
          bgColor: 'bg-blue-500/20',
          content: {
            description: `Detailed text content and explanations for ${materialName.toLowerCase()}`,
            text: `This comprehensive guide covers all aspects of ${materialName.toLowerCase()}. You'll learn the fundamental concepts, practical applications, and advanced techniques. The material includes step-by-step explanations, examples, and exercises to reinforce your understanding.

Key topics covered:
• Core principles and foundations
• Practical examples and case studies  
• Common challenges and solutions
• Best practices and tips
• Further reading recommendations

This resource is designed to provide you with a thorough understanding of the subject matter and prepare you for the next stage of your learning journey.`,
            pages: Math.floor(Math.random() * 20 + 5),
            readTime: `${Math.floor(Math.random() * 15 + 5)} min read`
          }
        };
    }
  };

  const materialType = getMaterialType(material);
  const materialData = generateMaterialContent(material, materialType);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-slate-700/30 rounded-xl border border-slate-600/30 overflow-hidden"
    >
      {/* Header */}
      <motion.div
        className="p-4 cursor-pointer hover:bg-slate-700/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 bg-gradient-to-r ${materialData.color} rounded-full flex items-center justify-center`}>
            <materialData.icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-white">{material}</h4>
            <p className="text-gray-400 text-sm">{materialData.content.description}</p>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-gray-400"
          >
            <ChevronDown size={20} />
          </motion.div>
        </div>
      </motion.div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-slate-600/30"
          >
            <div className="p-4 space-y-4">
              {materialType === 'video' && (
                <div className="space-y-3">
                  <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center border border-slate-600/30">
                    <div className="text-center">
                      <Video className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">Video Preview</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Duration: {materialData.content.duration}</span>
                    <span className="text-gray-300">Quality: {materialData.content.quality}</span>
                  </div>
                  <a
                    href={materialData.content.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    <ExternalLink size={16} />
                    Watch Video
                  </a>
                </div>
              )}

              {materialType === 'image' && (
                <div className="space-y-3">
                  <div className="aspect-video bg-slate-800 rounded-lg overflow-hidden border border-slate-600/30">
                    <img
                      src={materialData.content.imageUrl}
                      alt={material}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Resolution: {materialData.content.resolution}</span>
                    <span className="text-gray-300">Format: {materialData.content.format}</span>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors">
                    <Download size={16} />
                    Download Image
                  </button>
                </div>
              )}

              {materialType === 'text' && (
                <div className="space-y-3">
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600/30 max-h-64 overflow-y-auto">
                    <div className="prose prose-invert prose-sm max-w-none">
                      <div className="whitespace-pre-line text-gray-300 text-sm leading-relaxed">
                        {materialData.content.text}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Pages: {materialData.content.pages}</span>
                    <span className="text-gray-300">Read time: {materialData.content.readTime}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors">
                      <FileText size={16} />
                      Read Full Text
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-600/50 text-gray-300 rounded-lg hover:bg-slate-600/70 transition-colors">
                      <Download size={16} />
                      Download PDF
                    </button>
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="pt-3 border-t border-slate-600/30">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Material Type: {materialType.charAt(0).toUpperCase() + materialType.slice(1)}</span>
                  <span>Updated: Just now</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
