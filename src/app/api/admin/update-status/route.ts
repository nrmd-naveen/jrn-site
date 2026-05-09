import { NextResponse } from 'next/server';
import { updateSubmission } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { paperId, ...updates } = data;
    await updateSubmission(paperId, updates);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('update-status error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
