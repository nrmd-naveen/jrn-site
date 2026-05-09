import { NextResponse } from 'next/server';
import { getSubmissions, saveSubmissions } from '@/lib/db';

export async function POST(req: Request) {
  const { paperId } = await req.json();
  let submissions = getSubmissions();
  submissions = submissions.filter((s: any) => s.id !== paperId);
  saveSubmissions(submissions);
  return NextResponse.json({ success: true });
}
