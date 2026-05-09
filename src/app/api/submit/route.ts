import { NextResponse } from 'next/server';
import { getSubmissions, saveSubmissions } from '@/lib/db';
import fs from 'fs';
import path from 'path';
import { Article } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const authors = formData.get('authors') as string;
    const email = formData.get('email') as string;
    const abstract = formData.get('abstract') as string;
    const field = formData.get('field') as string;
    const teamMembersStr = formData.get('teamMembers') as string;
    const teamMembers = teamMembersStr ? JSON.parse(teamMembersStr).map((name: string) => ({ name })) : [];
    const file = formData.get('pdf') as File;

    const paperId = Math.floor(100000 + Math.random() * 900000).toString();
    
    let pdfUrl = undefined;

    if (file) {
      const PAPERS_DIR = path.join(process.cwd(), 'public', 'papers');
      if (!fs.existsSync(PAPERS_DIR)) fs.mkdirSync(PAPERS_DIR, { recursive: true });
      
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(PAPERS_DIR, fileName);
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(filePath, buffer);
      pdfUrl = `/papers/${fileName}`;
    }

    const newSubmission: Article = {
      id: paperId,
      title,
      authors,
      email,
      abstract,
      field,
      status: 'Received',
      submissionDate: new Date().toISOString(),
      pdfUrl,
      paymentStatus: 'Pending',
      volume: 12,
      issue: 5,
      teamMembers,
    };

    const submissions = getSubmissions();
    submissions.push(newSubmission);
    saveSubmissions(submissions);

    return NextResponse.json({ success: true, paperId });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json({ error: 'Failed to process submission' }, { status: 500 });
  }
}
