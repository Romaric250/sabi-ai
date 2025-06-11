'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, FileText, Video, Image, ExternalLink, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { StudyMaterial } from '@/types/roadmap';

interface StudyMaterialCardProps {
  material: StudyMaterial | string;
  index: number;
}

export function StudyMaterialCard({ material, index }: StudyMaterialCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Handle both old string format and new StudyMaterial object format
  const isRichMaterial = typeof material === 'object';
  const materialTitle = isRichMaterial ? material.title : material;
  const materialType = isRichMaterial ? material.type : getMaterialType(material);

  // Determine material type and generate content for legacy string materials
  function getMaterialType(materialName: string) {
    const lower = materialName.toLowerCase();
    if (lower.includes('video') || lower.includes('youtube') || lower.includes('tutorial')) {
      return 'video';
    } else if (lower.includes('image') || lower.includes('diagram') || lower.includes('chart')) {
      return 'image';
    } else {
      return 'text';
    }
  }

  const getMaterialData = () => {
    if (isRichMaterial) {
      // Use rich material data
      const richMaterial = material as StudyMaterial;
      switch (richMaterial.type) {
        case 'video':
          return {
            icon: Video,
            color: 'from-red-500 to-pink-500',
            iconColor: 'text-red-400',
            bgColor: 'bg-red-500/20',
            content: {
              description: richMaterial.description || `Video tutorial: ${richMaterial.title}`,
              url: richMaterial.url || `https://youtube.com/watch?v=${Math.random().toString(36).substring(7)}`,
              duration: richMaterial.duration || '15 minutes',
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
              description: richMaterial.description || `Visual guide: ${richMaterial.title}`,
              imageUrl: richMaterial.imageUrl || `https://picsum.photos/400/300?random=${index}`,
              resolution: '1920x1080',
              format: 'PNG/SVG'
            }
          };
        case 'text':
        default:
          return {
            icon: FileText,
            color: 'from-blue-500 to-indigo-500',
            iconColor: 'text-blue-400',
            bgColor: 'bg-blue-500/20',
            content: {
              text: richMaterial.content || `Detailed study material about ${richMaterial.title}. This comprehensive guide covers all the essential concepts and provides practical examples to help you understand the topic thoroughly.`,
              pages: Math.floor(Math.random() * 10 + 5),
              readTime: richMaterial.readTime || '10 minutes',
              format: 'PDF/Text'
            }
          };
      }
    } else {
      // Generate content for legacy string materials
      return generateMaterialContent(material as string, materialType);
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

  const materialData = getMaterialData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <motion.div
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 bg-gradient-to-r ${materialData.color} rounded-full flex items-center justify-center`}>
            <materialData.icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">{materialTitle}</h4>
            <p className="text-gray-600 text-sm">{materialData.content.description}</p>
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
            className="border-t border-gray-200"
          >
            <div className="p-4 space-y-4">
              {materialType === 'video' && (
                <div className="space-y-3">
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                    <div className="text-center">
                      <Video className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 text-sm">Video Preview</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Duration: {materialData.content.duration}</span>
                    <span className="text-gray-600">Quality: {materialData.content.quality}</span>
                  </div>
                  <a
                    href={materialData.content.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <ExternalLink size={16} />
                    Watch Video
                  </a>
                </div>
              )}

              {materialType === 'image' && (
                <div className="space-y-3">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={materialData.content.imageUrl}
                      alt={materialTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Resolution: {materialData.content.resolution}</span>
                    <span className="text-gray-600">Format: {materialData.content.format}</span>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                    <Download size={16} />
                    Download Image
                  </button>
                </div>
              )}

              {materialType === 'text' && (
                <div className="space-y-3">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-64 overflow-y-auto">
                    <div className="prose prose-gray prose-sm max-w-none">
                      {isRichMaterial && (material as StudyMaterial).content ? (
                        <ReactMarkdown className="text-gray-700 text-sm leading-relaxed">
                          {(material as StudyMaterial).content!}
                        </ReactMarkdown>
                      ) : (
                        <div className="whitespace-pre-line text-gray-700 text-sm leading-relaxed">
                          {materialData.content.text}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Pages: {materialData.content.pages}</span>
                    <span className="text-gray-600">Read time: {materialData.content.readTime}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                      <FileText size={16} />
                      Read Full Text
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      <Download size={16} />
                      Download PDF
                    </button>
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
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
