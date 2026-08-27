import { Pool } from 'pg';
import dotenv from 'dotenv';
import { z } from 'zod';
dotenv.config();

const connectionString = process.env.DATABASE_URL || '';
if (!connectionString) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('DATABASE_URL must be set in production');
  } else {
    console.warn('DATABASE_URL not set — DB operations will fail until configured');
  }
}

const pool = connectionString ? new Pool({ connectionString }) : null;

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function insertResume({ user_id, filename, storage_path, text_excerpt }: any) {
  if (!pool) throw new Error('Database not configured');
  if (user_id && typeof user_id === 'string' && !UUID_REGEX.test(user_id)) {
    throw new Error('Invalid user_id format');
  }
  const res = await pool.query(
    `INSERT INTO resumes (user_id, filename, storage_path, text_excerpt, uploaded_at, status) VALUES ($1,$2,$3,$4,now(),'uploaded') RETURNING id`,
    [user_id, filename, storage_path, text_excerpt]
  );
  return res.rows[0].id;
}

export async function insertAnalysis({ resume_id, analysis }: any) {
  if (!pool) throw new Error('Database not configured');
  // validate resume_id looks like uuid
  if (resume_id && typeof resume_id === 'string' && !UUID_REGEX.test(resume_id)) {
    throw new Error('Invalid resume_id format');
  }
  const res = await pool.query(
    `INSERT INTO resume_analyses (resume_id, analysis, created_at) VALUES ($1,$2,now()) RETURNING id`,
    [resume_id, analysis]
  );
  return res.rows[0].id;
}

export async function getAnalysisByResumeId(resumeId: string) {
  if (!pool) throw new Error('Database not configured');
  const res = await pool.query(`SELECT analysis FROM resume_analyses WHERE resume_id=$1 ORDER BY created_at DESC LIMIT 1`, [resumeId]);
  if (!res.rows[0]) return null;
  return res.rows[0].analysis;
}
