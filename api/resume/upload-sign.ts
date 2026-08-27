import { NextRequest, NextResponse } from '@vercel/node';
import { verifySupabaseAccessToken, getSupabaseServerClient } from '../_utils/supabaseServer';

export default async function (req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const user = await verifySupabaseAccessToken(req.headers.authorization);
    const { filename, contentType, size } = req.body;
    if (!filename || !contentType || !size) return res.status(400).json({ error: 'Missing parameters' });
    const allowedExt = ['.pdf', '.docx'];
    const ext = filename.slice(filename.lastIndexOf('.')).toLowerCase();
    if (!allowedExt.includes(ext)) return res.status(400).json({ error: 'Unsupported file type' });
    const maxBytes = 10 * 1024 * 1024;
    if (size > maxBytes) return res.status(400).json({ error: 'File too large' });

    const resumeId = crypto.randomUUID();
    const path = `${user.id}/${resumeId}/${filename}`;

    const supabase = getSupabaseServerClient();
    // Create a signed upload URL that allows the browser to upload directly to Supabase Storage
    // Note: createSignedUploadUrl is a server-side helper; if unavailable you may choose signed PUT via S3 compatible API
    const { data, error } = await supabase.storage.from('resumes').createSignedUploadUrl(path, 60);
    if (error) {
      console.error('createSignedUploadUrl error', error.message || error);
      return res.status(500).json({ error: 'Failed to create signed upload URL' });
    }

    // Persist a resume row with status 'uploaded_pending'
    const { data: dbRes, error: dbErr } = await supabase.rpc('insert_resume_record', { p_resume_id: resumeId, p_user_id: user.id, p_filename: filename, p_storage_path: path });
    // If you don't have RPC, fallback to insert into resumes table directly
    if (dbErr) {
      // try direct insert
      const insert = await supabase.from('resumes').insert([{ id: resumeId, user_id: user.id, filename, storage_path: path, status: 'uploaded_pending' }]);
      if (insert.error) {
        console.error('DB insert failed', insert.error.message || insert.error);
        return res.status(500).json({ error: 'Failed to persist resume record' });
      }
    }

    return res.json({ resumeId, uploadUrl: data.signedUrl, storagePath: path });
  } catch (err: any) {
    console.error(err);
    return res.status(401).json({ error: err.message || 'Unauthorized' });
  }
}
