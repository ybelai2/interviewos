// Simple API client for resume upload and analysis
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export async function uploadResume(file: File, userId: string, onProgress?: (p: number) => void) {
  const form = new FormData();
  form.append('file', file);
  form.append('userId', userId);

  return new Promise<any>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE}/upload-resume`, true);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch (err) {
            resolve(xhr.responseText);
          }
        } else {
          try {
            reject(JSON.parse(xhr.responseText));
          } catch (err) {
            reject({ error: 'Upload failed' });
          }
        }
      }
    };
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.send(form);
  });
}

export async function getAnalysis(resumeId: string) {
  const res = await fetch(`${API_BASE}/resumes/${resumeId}/analysis`);
  if (!res.ok) throw new Error('Failed to fetch analysis');
  return res.json();
}
