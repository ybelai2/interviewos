import * as seed from '@/data/seed';
import { requestUploadSigned, uploadToSignedUrl, requestAnalyze, getAnalysis as apiGetAnalysis } from './api';

const USE_MOCK = (import.meta.env.VITE_USE_MOCK_DATA === 'true');
const API_BASE_CONFIGURED = !!import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_CONFIGURED && !USE_MOCK) {
  console.warn('VITE_API_BASE_URL is not set and VITE_USE_MOCK_DATA is not true. The app will not show mocked data and requests to backend will fail.');
}

function deriveToken(maybe?: string | null): string | null {
  // If caller passed a full token, use it. We accept JWT-like strings (3 segments) or any non-empty string.
  if (maybe && typeof maybe === 'string') {
    return maybe;
  }

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('ios-user');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed?.accessToken || parsed?.token || parsed?.authToken || parsed?.supabaseToken || null;
    } catch (e) {
      return null;
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
   * uploadResume(file, userOrToken?, onProgress?)
   * - Accepts either an auth token or a user id. If a token is not provided the service will
   *   attempt to derive one from localStorage (ios-user). When running with USE_MOCK, returns seed data.
   */
  async uploadResume(file: File, userOrToken?: string | null, onProgress?: (p: number) => void) {
    if (!API_BASE_CONFIGURED) {
      if (USE_MOCK) {
        // Simulate successful upload/analysis in mock mode
        return { analysis: null };
      }
      throw new Error('Backend not configured (VITE_API_BASE_URL)');
    }

    const token = deriveToken(userOrToken ?? null);
    if (!token) {
      throw new Error('Missing authentication token. Please sign in before uploading a resume.');
    }

    // 1) request signed upload URL from backend
    const signed = await requestUploadSigned(token, file.name, file.type, file.size);
    // Expecting { resumeId, uploadUrl, storagePath }
    const { resumeId, uploadUrl, storagePath } = signed as any;

    // 2) upload file to signed URL; uploadToSignedUrl throws on failure
    await uploadToSignedUrl(uploadUrl, file);

    // 3) request the backend to analyze uploaded resume
    const analysis = await requestAnalyze(token, resumeId, storagePath);
    return analysis;
  },

  async getAnalysis(resumeId: string, userOrToken?: string | null) {
    if (!API_BASE_CONFIGURED) {
      if (USE_MOCK) return { analysis: null };
      throw new Error('Backend not configured (VITE_API_BASE_URL)');
    }
    const token = deriveToken(userOrToken ?? null);
    if (!token) throw new Error('Missing authentication token.');
    return apiGetAnalysis(token, resumeId);
  },

  async getProjects() {
    if (!API_BASE_CONFIGURED) {
      if (USE_MOCK) return seed.seedProjects;
      throw new Error('Backend not configured (VITE_API_BASE_URL)');
    }
    // placeholder until real endpoint
    return seed.seedProjects;
  },

  async getClaims() {
    if (!API_BASE_CONFIGURED) {
      if (USE_MOCK) return seed.seedClaims;
      throw new Error('Backend not configured (VITE_API_BASE_URL)');
    }
    return seed.seedClaims;
  },

  async getTechnologies() {
    if (!API_BASE_CONFIGURED) {
      if (USE_MOCK) return seed.seedSkills.map((s) => s.name);
      throw new Error('Backend not configured (VITE_API_BASE_URL)');
    }
    return seed.seedSkills.map((s) => s.name);
  },
};

export const skillService = {
  async getSkills() { if (!API_BASE_CONFIGURED && !USE_MOCK) throw new Error('Backend not configured'); return seed.seedSkills; },
  async getSkill(id: string) { return seed.seedSkills.find((s) => s.id === id); },
  async getRoots() { return seed.seedSkills.filter((s) => s.parentId === null); },
  async getChildren(parentId: string) { return seed.seedSkills.filter((s) => s.parentId === parentId); },
};

export const questionService = {
  async getQuestions() { return seed.seedQuestions; },
  async getQuestionsForSkill(skillId: string) { return seed.seedQuestions.filter((q) => (q.relatedSkillIds || []).includes(skillId)); },
  async getQuestionsForClaim(claimId: string) { return seed.seedQuestions.filter((q) => q.relatedClaimId === claimId); },
};

export const flashcardService = { async getFlashcards() { return seed.seedFlashcards; }, async getFlashcardsForSkill(skillId: string) { return seed.seedFlashcards.filter((f) => f.skillId === skillId); } };

export const resourceService = { async getResources() { return seed.seedResources; }, async getResourcesForSkill(skillId: string) { return seed.seedResources.filter((r) => r.skillId === skillId); } };

export const learningService = { async getTopics() { return seed.seedLearningTopics; } };

export const assessmentService = { async evaluate(_answer: string, _questionId: string) { return seed.seedEvaluation; } };

export const progressService = { async getHistory() { return seed.seedProgress; }, async getStats() { return seed.seedStats; } };

export const jobMatchService = { async analyze(_jobDescription: string) { return { score: 78, matched: ['Java','Spring Boot','AWS','REST APIs','Docker'], partial: ['System Design','Kubernetes'], missing: ['TypeScript','React'] }; } };
