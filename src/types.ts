export type Role = 'admin' | 'learner';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: Role;
  createdAt: string;
  phone?: string;
  isBlocked?: boolean;
}

export interface VideoContent {
  id: string;
  title_en: string;
  title_bm: string;
  description_en: string;
  description_bm: string;
  url: string; // URL to the video file (could be local /uploads/...)
  thumbnailUrl: string; // Local upload or placeholder
  duration: string;
  views: number;
  downloads: number;
  createdAt: string;
}

export interface ScamAnalysis {
  scamType_en: string;
  scamType_bm: string;
  originalText: string;
  senderInfo: string;
  breakdown: Array<{
    term: string;
    meaning_en: string;
    meaning_bm: string;
    psychologicalTactic_en: string;
    psychologicalTactic_bm: string;
  }>;
  howItWorks_en: string[];
  howItWorks_bm: string[];
  redFlags_en: string[];
  redFlags_bm: string[];
  recommendations_en: string[];
  recommendations_bm: string[];
  reportingChannels_en: string[];
  reportingChannels_bm: string[];
}

export interface ImageContent {
  id: string;
  title_en: string;
  title_bm: string;
  description_en: string;
  description_bm: string;
  url: string; // URL to image file
  category?: string;
  views: number;
  downloads: number;
  createdAt: string;
  scamAnalysis?: ScamAnalysis;
}

export interface PDFMaterial {
  id: string;
  title_en: string;
  title_bm: string;
  description_en: string;
  description_bm: string;
  url: string; // URL to PDF
  downloads: number;
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  question_en: string;
  question_bm: string;
  options_en: string[];
  options_bm: string[];
  correctAnswerIndex: number;
  explanation_en?: string;
  explanation_bm?: string;
}

export interface Quiz {
  id: string;
  title_en: string;
  title_bm: string;
  description_en: string;
  description_bm: string;
  questions: QuizQuestion[];
  completionsCount?: number;
  createdAt: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  quizId: string;
  quizTitle_en: string;
  quizTitle_bm: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
  isOfflineAttempt?: boolean;
}

export interface Bookmark {
  id: string;
  userId: string;
  itemId: string;
  type: 'video' | 'image' | 'pdf';
  title_en: string;
  title_bm: string;
  bookmarkedAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  email: string;
  action: string;
  details: string;
  ipAddress: string;
  device: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  title_en: string;
  title_bm: string;
  message_en: string;
  message_bm: string;
  type: 'announcement' | 'lesson';
  createdAt: string;
}

export interface FAQItem {
  question_en: string;
  question_bm: string;
  answer_en: string;
  answer_bm: string;
}
