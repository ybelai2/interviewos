import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || '';
if (!connectionString) {
  console.warn('DATABASE_URL not set — DB operations will fail until configured');
}

const pool = new Pool({ connectionString });

export async function insertResume({ user_id, filename, storage_path, text_excerpt }: any) {
  const res = await pool.query(
    `INSERT INTO resumes (user_id, filename, storage_path, text_excerpt, uploaded_at, status) VALUES ($1,$2,$3,$4,now(),'uploaded') RETURNING id`,
    [user_id, filename, storage_path, text_excerpt]
  );
  return res.rows[0].id;
}

export async function insertAnalysis({ resume_id, analysis }: any) {
  const res = await pool.query(
    `INSERT INTO resume_analyses (resume_id, analysis, created_at) VALUES ($1,$2,now()) RETURNING id`,
    [resume_id, JSON.stringify(analysis)]
  );
  return res.rows[0].id;
}

export async function getAnalysisByResumeId(resumeId: string) {
  const res = await pool.query(`SELECT analysis FROM resume_analyses WHERE resume_id=$1 ORDER BY created_at DESC LIMIT 1`, [resumeId]);
  if (!res.rows[0]) return null;
  return res.rows[0].analysis;
}
