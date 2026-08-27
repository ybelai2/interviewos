import fs from 'fs/promises';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export async function extractTextFromPdf(filePath: string): Promise<string> {
  const data = await fs.readFile(filePath);
  const result = await pdfParse(data as Buffer);
  return result.text || '';
}

export async function extractTextFromDocx(filePath: string): Promise<string> {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value || '';
}
