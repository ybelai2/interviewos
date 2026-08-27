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
import { requestUploadSigned, uploadToSignedUrl, requestAnalyze, getAnalysis as apiGetAnalysis } from './api';

const USE_MOCK = (import.meta.env.VITE_USE_MOCK_DATA === 'true');
const API_BASE_CONFIGURED = !!import.meta.env.VITE_API_BASE_URL;

export const resumeService = {
  async getProfile() {
    if (!API_BASE_CONFIGURED) {
      if (USE_MOCK) return seed.resumeProfile;
      throw new Error('Backend not configured (VITE_API_BASE_URL). Set VITE_USE_MOCK_DATA=true to run with mock data.');
    }
    // TODO: implement real profile endpoint
    return seed.resumeProfile;
  },
  async uploadResume(file: File, token: string, onProgress?: (p: number) => void) {
    if (!API_BASE_CONFIGURED) {
      if (USE_MOCK) throw new Error('Mock upload not implemented');
      throw new Error('Backend not configured (VITE_API_BASE_URL)');
    }

    // 1) request signed upload URL
    const { resumeId, uploadUrl, storagePath } = await requestUploadSigned(token, file.name, file.type, file.size);

    // 2) upload directly to storage
    await uploadToSignedUrl(uploadUrl, file);

    // 3) trigger analysis
    const analysis = await requestAnalyze(token, resumeId, storagePath);
    return analysis;
  },
  async getAnalysis(resumeId: string, token: string) {
    if (!API_BASE_CONFIGURED) {
      if (USE_MOCK) return { analysis: null };
      throw new Error('Backend not configured (VITE_API_BASE_URL)');
    }
    return apiGetAnalysis(token, resumeId);
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
