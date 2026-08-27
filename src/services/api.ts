// Frontend API client adapted for signed uploads and serverless endpoints
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

async function jsonFetch(url: string, opts: any = {}) {
  const res = await fetch(url, opts);
  const text = await res.text();
  try { return JSON.parse(text); } catch (e) { return text; }
}

export async function requestUploadSigned(token: string, filename: string, contentType: string, size: number) {
  const res = await fetch(`${API_BASE}/api/resume/upload-sign`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ filename, contentType, size }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function uploadToSignedUrl(uploadUrl: string, file: File) {
  const res = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error('Upload failed: ' + text);
  }
  return true;
}

export async function requestAnalyze(token: string, resumeId: string, storagePath: string) {
  const res = await fetch(`${API_BASE}/api/resume/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ resumeId, storagePath }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function getAnalysis(token: string, resumeId: string) {
  const res = await fetch(`${API_BASE}/api/resume/${resumeId}/analysis`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw await res.json();
  return res.json();
}
