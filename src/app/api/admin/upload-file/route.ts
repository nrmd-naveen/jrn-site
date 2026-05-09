import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = (formData.get('file') || formData.get('pdf')) as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const PAPERS_DIR = path.join(process.cwd(), 'public', 'papers');
    if (!fs.existsSync(PAPERS_DIR)) fs.mkdirSync(PAPERS_DIR, { recursive: true });
    
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(PAPERS_DIR, fileName);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);
    const pdfUrl = `/papers/${fileName}`;

    return NextResponse.json({ success: true, path: pdfUrl });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
