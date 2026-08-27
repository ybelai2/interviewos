import { verifySupabaseAccessToken, getSupabaseServerClient } from '../_utils/supabaseServer';
import { analyzeResumeWithAI } from '../_utils/ai';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { Pool } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL || '';
const pool = DATABASE_URL ? new Pool({ connectionString: DATABASE_URL }) : null;

export default async function (req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const user = await verifySupabaseAccessToken(req.headers.authorization);
    const { resumeId, storagePath } = req.body;
    if (!resumeId || !storagePath) return res.status(400).json({ error: 'Missing resumeId or storagePath' });

    // Verify ownership: storagePath should start with user.id/
    if (!storagePath.startsWith(`${user.id}/`)) return res.status(403).json({ error: 'Unauthorized' });

    const supabase = getSupabaseServerClient();
    const bucket = 'resumes';
    const { data, error: dlErr } = await supabase.storage.from(bucket).download(storagePath);
    if (dlErr || !data) {
      console.error('Download failed', dlErr);
      return res.status(500).json({ error: 'Failed to retrieve stored resume' });
    }

    // Read into buffer
    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Determine extraction by extension
    const lower = storagePath.toLowerCase();
    let text = '';
    if (lower.endsWith('.pdf')) {
      const parsed = await pdfParse(buffer);
      text = parsed.text || '';
    } else if (lower.endsWith('.docx')) {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value || '';
    }

    if (!text || text.trim().length < 10) {
      return res.status(400).json({ error: 'Could not extract text from resume; scanned PDF or unsupported format' });
    }

    let analysis;
    try {
      analysis = await analyzeResumeWithAI(text);
    } catch (err: any) {
      console.error('AI analysis failed', err?.message || err);
      return res.status(502).json({ error: 'AI analysis failed: ' + (err?.message || 'unknown') });
    }

    // Persist analysis to Postgres
    if (!pool) return res.status(500).json({ error: 'Database not configured' });
    try {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        // Ensure resume exists and belongs to user
        const r = await client.query('SELECT id, user_id FROM resumes WHERE id=$1', [resumeId]);
        if (r.rowCount === 0) {
          await client.query('ROLLBACK');
          return res.status(404).json({ error: 'Resume not found' });
        }
        if (r.rows[0].user_id !== user.id) {
          await client.query('ROLLBACK');
          return res.status(403).json({ error: 'Unauthorized' });
        }
        const insert = await client.query('INSERT INTO resume_analyses (resume_id, analysis, created_at) VALUES ($1,$2,now()) RETURNING id', [resumeId, analysis]);
        await client.query("UPDATE resumes SET status='analyzed' WHERE id=$1", [resumeId]);
        await client.query('COMMIT');
        const analysisId = insert.rows[0].id;
        res.json({ resumeId, analysisId, analysis });
      } finally {
        client.release();
      }
    } catch (err: any) {
      console.error('DB error', err);
      return res.status(500).json({ error: 'Database error' });
    }
  } catch (err: any) {
    console.error(err);
    return res.status(401).json({ error: err.message || 'Unauthorized' });
  }
}
