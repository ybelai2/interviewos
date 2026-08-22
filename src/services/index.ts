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

// Service interfaces. Mock implementations return seed data.
// Real implementations can be swapped in by replacing these functions
// with API calls (e.g. to Supabase or an AI backend) without changing callers.

export const resumeService = {
  async getProfile() {
    return seed.resumeProfile;
  },
  async getProjects(): Promise<Project[]> {
    return seed.seedProjects;
  },
  async getClaims(): Promise<ResumeClaim[]> {
    return seed.seedClaims;
  },
  async getTechnologies(): Promise<string[]> {
    return [
      'Java',
      'Spring Boot',
      'Python',
      'React',
      'TypeScript',
      'AWS',
      'Docker',
      'PostgreSQL',
      'MongoDB',
      'GitHub Actions',
      'Gemini',
    ];
  },
};

export const skillService = {
  async getSkills(): Promise<Skill[]> {
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
