export interface StudyMaterial {
  title: string;
  type: "text" | "video" | "image";
  content?: string;
  url?: string;
  imageUrl?: string;
  description?: string;
  readTime?: string;
  duration?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

export interface RoadmapStage {
  id: string;
  title: string;
  description: string;
  lessons: string[];
  materials: StudyMaterial[] | string[]; // Support both old and new formats
  quiz: QuizQuestion[];
  isUnlocked?: boolean;
  isCompleted?: boolean;
  position: { x: number; y: number };
  color: string;
  icon?: any;
}

export interface FinalQuiz {
  title: string;
  description: string;
  questions: (QuizQuestion & { stage: string })[];
  passingScore: number;
  timeLimit: number;
}

export interface RoadmapData {
  roadmap: RoadmapStage[];
  cached?: boolean;
  similarity?: number;
  originalPrompt?: string;
  message?: string;
}
