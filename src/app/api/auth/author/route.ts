import { NextResponse } from 'next/server';
import { getSubmissions } from '@/lib/db';

export async function POST(req: Request) {
  const { paperId, email } = await req.json();
  const submissions = await getSubmissions();
  const sub = submissions.find((s: any) => s.id === paperId && s.email === email);
  if (sub) {
    return NextResponse.json({ success: true, data: sub });
  } else {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
}
