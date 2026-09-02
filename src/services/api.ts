// Frontend API client adapted for signed uploads and serverless endpoints
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

async function jsonFetch(url: string, opts: any = {}) {
  const res = await fetch(url, opts);
  const text = await res.text();
  try { return JSON.parse(text); } catch (e) { return text; }
}

export async function requestUploadSigned(token: string, filename: string, contentType: string, size: number) {
  const url = `${API_BASE}/api/resume/upload-sign`;
  console.debug('requestUploadSigned ->', { url, filename, contentType, size });

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ filename, contentType, size }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('requestUploadSigned failed:', res.status, errorText);
    throw new Error(`Upload sign failed: ${errorText}`);
  }

  const json = await res.json();
  console.debug('requestUploadSigned success:', json);
  return json;
}

export async function uploadToSignedUrl(uploadUrl: string, file: File) {
  console.debug('uploadToSignedUrl ->', { uploadUrl, size: file.size, type: file.type });

  const res = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('uploadToSignedUrl failed:', res.status, errorText);
    throw new Error('Upload to storage failed: ' + errorText);
  }

  console.debug('uploadToSignedUrl success:', res.status);
  return true;
}

export async function requestAnalyze(token: string, resumeId: string, storagePath: string) {
  const url = `${API_BASE}/api/resume/analyze`;
  console.debug('requestAnalyze ->', { url, resumeId, storagePath });
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ resumeId, storagePath }),
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error('requestAnalyze failed:', res.status, errorText);
    throw new Error(`Analyze failed: ${errorText}`);
  }
  const json = await res.json();
  console.debug('requestAnalyze success:', json);
  return json;
}

export async function getAnalysis(token: string, resumeId: string) {
  const url = `${API_BASE}/api/resume/${resumeId}/analysis`;
  console.debug('getAnalysis ->', { url });
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error('getAnalysis failed:', res.status, errorText);
    throw new Error(`Get analysis failed: ${errorText}`);
  }
  const json = await res.json();
  console.debug('getAnalysis success:', json);
  return json;
}
