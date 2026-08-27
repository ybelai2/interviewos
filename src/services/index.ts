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

function deriveToken(maybe?: string | null): string | null {
  // If caller passed a token (JWT-like), use it
  if (maybe && typeof maybe === 'string' && maybe.split('.').length === 3) return maybe;
  // Try reading common token locations from localStorage at runtime
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('ios-user');
      if (raw) {
        const parsed = JSON.parse(raw);
        // common token property names
        return parsed?.accessToken || parsed?.token || parsed?.authToken || parsed?.supabaseToken || null;
      }
    } catch (e) {
      // ignore
    }
  }
  return null;
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
  /**
   * uploadResume accepts either an auth token (preferred) or a userId when running in mock/local mode.
   * For production it will attempt to derive a token from the provided second argument or from localStorage.
   */
  async uploadResume(file: File, userOrToken?: string, onProgress?: (p: number) => void) {
    if (!API_BASE_CONFIGURED) {
      if (USE_MOCK) return seed.resumeProfile; // preserved mock behavior
      throw new Error('Backend not configured (VITE_API_BASE_URL)');
    }

    // Determine an auth token for server endpoints. Prefer an explicit token, else try to derive it from localStorage.
    const token = deriveToken(userOrToken ?? null);
    if (!token) {
      throw new Error('Missing authentication token. Please sign in before uploading a resume.');
    }

    // 1) request signed upload URL
    const signed = await requestUploadSigned(token, file.name, file.type, file.size);
    // API may return different shapes; support common fields
    const resumeId = signed?.resumeId || signed?.id || signed?.resume_id;
    const uploadUrl = signed?.uploadUrl || signed?.upload_url || signed?.url;
    const storagePath = signed?.storagePath || signed?.storage_path || signed?.path;

    if (!resumeId || !uploadUrl || !storagePath) {
      throw new Error('Invalid signed upload response from server');
    }

    // 2) upload directly to storage
    await uploadToSignedUrl(uploadUrl, file);

    // 3) trigger analysis
    const analysis = await requestAnalyze(token, resumeId, storagePath);
    // Optionally report progress via onProgress hook (upload complete -> 100)
    try {
      onProgress?.(100);
    } catch (e) {
      // ignore progress errors
    }

    return analysis;
  },
  async getAnalysis(resumeId: string, token?: string) {
    if (!API_BASE_CONFIGURED) {
      if (USE_MOCK) return { analysis: null };
      throw new Error('Backend not configured (VITE_API_BASE_URL)');
    }
    const t = token ?? deriveToken();
    if (!t) throw new Error('Missing authentication token.');
    return apiGetAnalysis(t, resumeId);
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
    if (!API_BASE_CONFIGURED && !USE_MOCK) throw new Error('Backend not configured');
    return seed.seedQuestions;
  },
  async getQuestionsForSkill(skillId: string): Promise<Question[]> {
    return seed.seedQuestions.filter((q) => q.relatedSkillIds?.includes(skillId));
  },
  async getQuestionsForClaim(claimId: string): Promise<Question[]> {
    return seed.seedQuestions.filter((q) => q.relatedClaimId === claimId);
  },
};

export const flashcardService = {
  async getFlashcards(): Promise<Flashcard[]> {
    if (!API_BASE_CONFIGURED && !USE_MOCK) throw new Error('Backend not configured');
    return seed.seedFlashcards;
  },
  async getFlashcardsForSkill(skillId: string): Promise<Flashcard[]> {
    return seed.seedFlashcards.filter((f) => f.skillId === skillId);
  },
};

export const resourceService = {
  async getResources(): Promise<LearningResource[]> {
    if (!API_BASE_CONFIGURED && !USE_MOCK) throw new Error('Backend not configured');
    return seed.seedResources;
  },
  async getResourcesForSkill(skillId: string): Promise<LearningResource[]> {
    return seed.seedResources.filter((r) => r.skillId === skillId);
  },
};

export const learningService = {
  async getTopics(): Promise<LearningTopic[]> {
    if (!API_BASE_CONFIGURED && !USE_MOCK) throw new Error('Backend not configured');
    return seed.seedLearningTopics;
  },
};

export const assessmentService = {
  async evaluate(_answer: string, _questionId: string): Promise<AnswerEvaluation> {
    if (!API_BASE_CONFIGURED && !USE_MOCK) return seed.seedEvaluation as AnswerEvaluation;
    return seed.seedEvaluation as AnswerEvaluation;
  },
};

export const progressService = {
  async getHistory(): Promise<ProgressSnapshot[]> {
    if (!API_BASE_CONFIGURED && !USE_MOCK) throw new Error('Backend not configured');
    return seed.seedProgress;
  },
  async getStats(): Promise<ProgressStats> {
    if (!API_BASE_CONFIGURED && !USE_MOCK) throw new Error('Backend not configured');
    return seed.seedStats;
  },
};

export const jobMatchService = {
  async analyze(_jobDescription: string): Promise<JobMatchResult> {
    if (!API_BASE_CONFIGURED && !USE_MOCK) throw new Error('Backend not configured');
    return {
      score: 78,
      matched: ['Java', 'Spring Boot', 'AWS', 'REST APIs', 'Docker'],
      partial: ['System Design', 'Kubernetes'],
      missing: ['TypeScript', 'React'],
    } as unknown as JobMatchResult;
  },
};
