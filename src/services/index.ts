import type {
  Skill,
  ResumeClaim,
  Project,
  Question,
  Flashcard,
  LearningResource,
  LearningTopic,
  ProgressSnapshot,
  ProgressStats,
  AnswerEvaluation,
  JobMatchResult,
} from '@/types';
import * as seed from '@/data/seed';
import { uploadResume as apiUploadResume, getAnalysis as apiGetAnalysis } from './api';

const USE_MOCK = (import.meta.env.VITE_USE_MOCK_DATA === 'true');
const API_BASE_CONFIGURED = !!import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_CONFIGURED && !USE_MOCK) {
  console.warn('VITE_API_BASE_URL is not set and VITE_USE_MOCK_DATA is not true. The app will not show mocked data and requests to backend will fail.');
}

export const resumeService = {
  async getProfile() {
    if (!API_BASE_CONFIGURED) {
      if (USE_MOCK) return seed.resumeProfile;
      throw new Error('Backend not configured (VITE_API_BASE_URL). Set VITE_USE_MOCK_DATA=true to run with mock data.');
    }
    // TODO: implement real profile endpoint
    return seed.resumeProfile;
  },
  async uploadResume(file: File, userId: string, onProgress?: (p: number) => void) {
    if (!API_BASE_CONFIGURED) {
      if (USE_MOCK) throw new Error('Mock upload not implemented');
      throw new Error('Backend not configured (VITE_API_BASE_URL)');
    }
    return apiUploadResume(file, userId, onProgress);
  },
  async getAnalysis(resumeId: string) {
    if (!API_BASE_CONFIGURED) {
      if (USE_MOCK) return { analysis: null };
      throw new Error('Backend not configured (VITE_API_BASE_URL)');
    }
    return apiGetAnalysis(resumeId);
  },
  async getProjects(): Promise<Project[]> {
    if (!API_BASE_CONFIGURED) {
      if (USE_MOCK) return seed.seedProjects;
      throw new Error('Backend not configured (VITE_API_BASE_URL)');
    }
    // placeholder until real endpoint
    return seed.seedProjects;
  },
  async getClaims(): Promise<ResumeClaim[]> {
    if (!API_BASE_CONFIGURED) {
      if (USE_MOCK) return seed.seedClaims;
      throw new Error('Backend not configured (VITE_API_BASE_URL)');
    }
    return seed.seedClaims;
  },
  async getTechnologies(): Promise<string[]> {
    if (!API_BASE_CONFIGURED) {
      if (USE_MOCK) return seed.seedSkills.map((s) => s.name);
      throw new Error('Backend not configured (VITE_API_BASE_URL)');
    }
    return seed.seedSkills.map((s) => s.name);
  },
};

export const skillService = {
  async getSkills(): Promise<Skill[]> {
    if (!API_BASE_CONFIGURED && !USE_MOCK) throw new Error('Backend not configured');
    return seed.seedSkills;
  },
  async getSkill(id: string): Promise<Skill | undefined> {
    return seed.seedSkills.find((s) => s.id === id);
  },
  async getRoots(): Promise<Skill[]> {
    return seed.seedSkills.filter((s) => s.parentId === null);
  },
  async getChildren(parentId: string): Promise<Skill[]> {
    return seed.seedSkills.filter((s) => s.parentId === parentId);
  },
};

export const questionService = {
  async getQuestions(): Promise<Question[]> {
    return seed.seedQuestions;
  },
  async getQuestionsForSkill(skillId: string): Promise<Question[]> {
    return seed.seedQuestions.filter((q) => q.relatedSkillIds.includes(skillId));
  },
  async getQuestionsForClaim(claimId: string): Promise<Question[]> {
    return seed.seedQuestions.filter((q) => q.relatedClaimId === claimId);
  },
};

export const flashcardService = {
  async getFlashcards(): Promise<Flashcard[]> {
    return seed.seedFlashcards;
  },
  async getFlashcardsForSkill(skillId: string): Promise<Flashcard[]> {
    return seed.seedFlashcards.filter((f) => f.skillId === skillId);
  },
};

export const resourceService = {
  async getResources(): Promise<LearningResource[]> {
    return seed.seedResources;
  },
  async getResourcesForSkill(skillId: string): Promise<LearningResource[]> {
    return seed.seedResources.filter((r) => r.skillId === skillId);
  },
};

export const learningService = {
  async getTopics(): Promise<LearningTopic[]> {
    return seed.seedLearningTopics;
  },
};

export const assessmentService = {
  async evaluate(_answer: string, _questionId: string): Promise<AnswerEvaluation> {
    // Mock: in production this would call an AI evaluation endpoint.
    return seed.seedEvaluation;
  },
};

export const progressService = {
  async getHistory(): Promise<ProgressSnapshot[]> {
    return seed.seedProgress;
  },
  async getStats(): Promise<ProgressStats> {
    return seed.seedStats;
  },
};

export const jobMatchService = {
  async analyze(_jobDescription: string): Promise<JobMatchResult> {
    // Mock analysis. Real version would parse the JD and compare to skills.
    return {
      score: 78,
      matched: ['Java', 'Spring Boot', 'AWS', 'REST APIs', 'Docker'],
      partial: ['System Design', 'Kubernetes'],
      missing: ['Kafka'],
      preparationPlan: [
        'Kafka fundamentals: topics, partitions, consumer groups',
        'System design: scalability and capacity planning',
        'Kubernetes basics: pods, services, deployments',
      ],
    };
  },
};
