import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase: ReturnType<typeof createSupabaseClient> | null = null;
if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createSupabaseClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'server', 'uploads');

export async function uploadFileToStorage(localPath: string, destFilename: string) {
  // If Supabase configured, upload to private bucket 'resumes'
  if (supabase) {
    // read file
    const data = await fs.readFile(localPath);
    const bucket = 'resumes';
    const { data: uploadResult, error } = await supabase.storage.from(bucket).upload(destFilename, data, {
      contentType: getContentType(destFilename),
      upsert: false,
    });
    if (error) throw error;
    // return storage path (object path) for DB
    return uploadResult?.path;
  }

  // Supabase not configured: allow local disk only in non-production
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Storage not configured for production. Set SUPABASE_SERVICE_ROLE_KEY.');
  }

  // Ensure uploads dir exists and return local path
  await fs.mkdir(TEMP_UPLOAD_DIR, { recursive: true });
  // Move file into server/uploads (it should already be there), return relative path
  // Use normalized path for DB reference
  return localPath;
}

function getContentType(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return 'application/pdf';
  if (ext === 'docx') return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  return 'application/octet-stream';
}
