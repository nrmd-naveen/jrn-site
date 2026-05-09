import { NextResponse } from 'next/server';
import { getSubmissions, saveSubmissions } from '@/lib/db';

export async function POST(req: Request) {
  const data = await req.json();
  const { paperId, ...updates } = data;
  let submissions = getSubmissions();
  submissions = submissions.map((s: any) => {
    if (s.id === paperId) {
      return { 
          ...s, 
          ...updates,
          publishedDate: updates.status === 'Published' && s.status !== 'Published' ? new Date().toISOString() : s.publishedDate
      };
    }
    return s;
  });
  saveSubmissions(submissions);
  return NextResponse.json({ success: true });
}
