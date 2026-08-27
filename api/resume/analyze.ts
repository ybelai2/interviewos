import { verifySupabaseAccessToken, getSupabaseServerClient } from '../_utils/supabaseServer';
import { analyzeResumeWithAI } from '../_utils/ai';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

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
    try {
      if (lower.endsWith('.pdf')) {
        const parsed = await pdfParse(buffer as Buffer);
        text = parsed.text || '';
      } else if (lower.endsWith('.docx')) {
        const result = await mammoth.extractRawText({ buffer });
        text = result.value || '';
      } else {
        return res.status(400).json({ error: 'Unsupported file type' });
      }
    } catch (err: any) {
      console.error('Extraction error', err?.message || err);
      return res.status(400).json({ error: 'Failed to extract text from document' });
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

    // Persist analysis using Supabase service client
    try {
      // Ensure resume exists and belongs to user
      const resumeQ = await supabase.from('resumes').select('id,user_id').eq('id', resumeId).single();
      if (resumeQ.error || !resumeQ.data) {
        console.error('Resume fetch failed', resumeQ.error);
        return res.status(404).json({ error: 'Resume not found' });
      }
      if (resumeQ.data.user_id !== user.id) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const insert = await supabase.from('resume_analyses').insert([{ resume_id: resumeId, analysis }]).select('id');
      if (insert.error) {
        console.error('Analysis insert failed', insert.error);
        return res.status(500).json({ error: 'Failed to save analysis' });
      }

      const update = await supabase.from('resumes').update({ status: 'analyzed' }).eq('id', resumeId);
      if (update.error) {
        console.error('Resume status update failed', update.error);
        // not fatal; continue
      }

      const analysisId = insert.data?.[0]?.id ?? null;
      res.json({ resumeId, analysisId, analysis });
    } catch (err: any) {
      console.error('DB error', err);
      return res.status(500).json({ error: 'Database error' });
    }
  } catch (err: any) {
    console.error(err);
    return res.status(401).json({ error: err.message || 'Unauthorized' });
  }
}
