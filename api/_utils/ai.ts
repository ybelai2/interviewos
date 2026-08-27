import { z } from 'zod';
import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.warn('OPENAI_API_KEY not set — AI analysis will fail until configured');
}
const client = new OpenAI({ apiKey });

const ResumeAnalysisSchema = z.object({
  skills: z.array(z.object({
    name: z.string(),
    category: z.string().optional(),
    confidence: z.number().min(0).max(1).optional(),
    relatedConcepts: z.array(z.string()).optional(),
    evidence: z.string().optional(),
  })),
  projects: z.array(z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    technologies: z.array(z.string()).optional(),
  })).optional(),
  experience: z.array(z.object({
    title: z.string().optional(),
    company: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    responsibilities: z.array(z.string()).optional(),
    accomplishments: z.array(z.string()).optional(),
  })).optional(),
  education: z.array(z.object({
    institution: z.string().optional(),
    degree: z.string().optional(),
    graduationYear: z.string().optional(),
    coursework: z.array(z.string()).optional(),
  })).optional(),
  claims: z.array(z.object({
    text: z.string(),
    relatedTechnologies: z.array(z.string()).optional(),
    risk: z.enum(['low', 'medium', 'high']).optional(),
    potentialQuestions: z.array(z.string()).optional(),
  })).optional(),
});

export async function analyzeResumeWithAI(text: string) {
  if (!apiKey) throw new Error('OPENAI_API_KEY not configured on server');

  const system = `You are a resume analysis assistant. Given a plain-text resume, extract a structured JSON object containing skills, projects, experience, education, and claims. Output only valid JSON. Be conservative and only include what is explicitly present or strongly implied.`;
  const user = `Resume text:\n\n${text}\n\nReturn JSON that matches the schema: { skills: [{name,category,confidence,relatedConcepts,evidence}], projects: [...], experience: [...], education: [...], claims: [{text,relatedTechnologies,risk,potentialQuestions}] }`;

  const resp = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o',
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    temperature: 0,
    max_tokens: 2000,
  });

  const raw = resp.choices?.[0]?.message?.content ?? '';
  let parsed: any = null;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    const m = raw.match(/\{[\s\S]*\}$/);
    if (m) parsed = JSON.parse(m[0]);
    else throw new Error('AI returned non-JSON response');
  }
  const result = ResumeAnalysisSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error('AI returned invalid analysis schema');
  }
  return result.data;
}
