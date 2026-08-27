import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs/promises';

import { extractTextFromPdf, extractTextFromDocx } from './extract';
import { analyzeResumeWithAI } from './ai';
import { insertResume, insertAnalysis, getAnalysisByResumeId } from './db';
import { uploadFileToStorage } from './storage';

dotenv.config();

const PORT = Number(process.env.SERVER_PORT || 4000);
const uploadDir = path.join(process.cwd(), 'server', 'tmp_uploads');

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadDir);
  },
  filename: function (_req, file, cb) {
    const name = `${Date.now()}-${file.originalname}`;
    cb(null, name);
  },
});

const upload = multer({ storage });

async function ensureUploadDir() {
  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (err) {
    // ignore
  }
}

const app = express();
app.use(cors());
app.use(express.json());

app.post('/upload-resume', upload.single('file'), async (req, res) => {
  try {
    await ensureUploadDir();

    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const allowedExt = ['.pdf', '.docx'];
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    if (!allowedExt.includes(fileExt)) {
      await fs.unlink(req.file.path).catch(() => {});
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    const maxBytes = 10 * 1024 * 1024; // 10MB
    if (req.file.size > maxBytes) {
      await fs.unlink(req.file.path).catch(() => {});
      return res.status(400).json({ error: 'File too large (max 10 MB)' });
    }

    // Extract text
    let text = '';
    if (fileExt === '.pdf') {
      text = await extractTextFromPdf(req.file.path);
    } else if (fileExt === '.docx') {
      text = await extractTextFromDocx(req.file.path);
    }

    if (!text || text.trim().length < 10) {
      await fs.unlink(req.file.path).catch(() => {});
      return res.status(400).json({ error: 'Could not extract text from resume; scanned PDF or unsupported format' });
    }

    // Upload file to permanent storage (Supabase Storage) or fail in production
    const destFilename = `${Date.now()}-${req.file.originalname}`;
    let storagePath: string;
    try {
      storagePath = await uploadFileToStorage(req.file.path, destFilename);
    } catch (err: any) {
      console.error('storage upload failed', err?.message || err);
      await fs.unlink(req.file.path).catch(() => {});
      return res.status(500).json({ error: 'Failed to store resume. Please try again later.' });
    }

    // Ensure user_id present and is a UUID. We expect the client to pass the supabase auth uid.
    const userId = (req.body.userId as string) || null;
    if (!userId) {
      // For security, do not default to a placeholder in production
      if (process.env.NODE_ENV === 'production') {
        return res.status(401).json({ error: 'Authentication required' });
      }
    }

    // Persist resume row
    const resumeId = await insertResume({
      user_id: userId,
      filename: req.file.originalname,
      storage_path: storagePath,
      text_excerpt: text.slice(0, 1024),
    });

    // Call AI to analyze resume
    let analysis;
    try {
      analysis = await analyzeResumeWithAI(text);
    } catch (err: any) {
      console.error('AI analysis failed', err?.message || err);
      // Do not persist an empty or invalid analysis; return error to caller
      return res.status(502).json({ error: 'AI analysis failed: ' + (err?.message || 'unknown') });
    }

    // Persist analysis
    try {
      await insertAnalysis({ resume_id: resumeId, analysis });
    } catch (err: any) {
      console.error('Persisting analysis failed', err?.message || err);
      return res.status(500).json({ error: 'Failed to save analysis' });
    } finally {
      // Remove temp file
      await fs.unlink(req.file.path).catch(() => {});
    }

    return res.json({ resumeId, analysis });
  } catch (err) {
    console.error('upload error', err);
    return res.status(500).json({ error: 'Server error during upload' });
  }
});

app.get('/resumes/:id/analysis', async (req, res) => {
  try {
    const id = req.params.id;
    const analysis = await getAnalysisByResumeId(id);
    if (!analysis) return res.status(404).json({ error: 'Not found' });
    res.json({ analysis });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Resume API server listening on ${PORT}`);
});
