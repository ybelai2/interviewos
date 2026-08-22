// Core domain model for InterviewOS.
// These interfaces describe the shape of data that flows through the app.
// Mock services implement against them; real APIs can be swapped in later.

export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type QuestionCategory =
  | 'definition'
  | 'application'
  | 'tradeoffs'
  | 'troubleshooting'
  | 'system-design'
  | 'resume-defense'
  | 'behavioral'
  | 'follow-up';

export type ClaimStatus = 'mastered' | 'developing' | 'weak' | 'needs-practice';
export type RiskLevel = 'low' | 'medium' | 'high';

export type ResourceType =
  | 'documentation'
  | 'video'
  | 'article'
  | 'tutorial'
  | 'course'
  | 'book';

export type InterviewMode =
  | 'technical'
  | 'resume-defense'
  | 'system-design'
  | 'behavioral'
  | 'rapid-fire';

// ---------------------------------------------------------------------------
// User & Auth
// ---------------------------------------------------------------------------

export interface User {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'pro';
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Resume
// ---------------------------------------------------------------------------

export interface Resume {
  id: string;
  userId: string;
  fileName: string;
  uploadedAt: string;
  rawText: string;
  status: 'uploaded' | 'analyzing' | 'analyzed';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  highlights: string[];
}

export interface ResumeClaim {
  id: string;
  text: string;
  category: string;
  risk: RiskLevel;
  status: ClaimStatus;
  reason: string;
  resumeExcerpt: string;
  relatedSkillIds: string[];
  potentialQuestions: string[];
}

// ---------------------------------------------------------------------------
// Skills & Knowledge Map
// ---------------------------------------------------------------------------

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  mastery: number; // 0-100
  targetMastery: number;
  parentId: string | null;
  relatedConcepts: string[];
  weakAreas: string[];
  resumeExcerpt?: string;
}

export type SkillCategory =
  | 'language'
  | 'framework'
  | 'cloud'
  | 'database'
  | 'devops'
  | 'frontend'
  | 'concept'
  | 'tooling'
  | 'ai';

// ---------------------------------------------------------------------------
// Questions & Flashcards
// ---------------------------------------------------------------------------

export interface Question {
  id: string;
  prompt: string;
  difficulty: Difficulty;
  category: QuestionCategory;
  relatedSkillIds: string[];
  relatedClaimId?: string;
  suggestedPoints: string[];
  followUpId?: string;
}

export interface Flashcard {
  id: string;
  skillId: string;
  front: string;
  back: string;
  deck: string;
}

// ---------------------------------------------------------------------------
// Learning
// ---------------------------------------------------------------------------

export interface LearningResource {
  id: string;
  skillId: string;
  title: string;
  source: string;
  type: ResourceType;
  difficulty: Difficulty;
  duration: string;
  description: string;
  url: string;
}

export interface LearningTopic {
  id: string;
  skillId: string;
  priority: number;
  currentMastery: number;
  targetMastery: number;
  estimatedTime: string;
  reason: string;
}

// ---------------------------------------------------------------------------
// Assessment & Interview
// ---------------------------------------------------------------------------

export interface AnswerEvaluation {
  technicalAccuracy: number;
  depth: number;
  specificity: number;
  communication: number;
  didWell: string[];
  missed: string[];
  followUpPrompt?: string;
}

export interface InterviewSession {
  id: string;
  mode: InterviewMode;
  startedAt: string;
  totalQuestions: number;
  currentIndex: number;
  score: number;
  completed: boolean;
}

// ---------------------------------------------------------------------------
// Progress
// ---------------------------------------------------------------------------

export interface ProgressSnapshot {
  date: string;
  readiness: number;
  technical: number;
  resumeDefense: number;
  coding: number;
  systemDesign: number;
  communication: number;
}

export interface ProgressStats {
  questionsAnswered: number;
  flashcardsReviewed: number;
  studyTimeMinutes: number;
  claimsMastered: number;
  mockInterviewsCompleted: number;
  weakAreasImproved: number;
}

// ---------------------------------------------------------------------------
// Job Match
// ---------------------------------------------------------------------------

export interface JobMatchResult {
  score: number;
  matched: string[];
  partial: string[];
  missing: string[];
  preparationPlan: string[];
}
