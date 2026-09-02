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
