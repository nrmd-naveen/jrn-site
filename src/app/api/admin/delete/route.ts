import { NextResponse } from 'next/server';
import { deleteSubmission } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { paperId } = await req.json();
    await deleteSubmission(paperId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('delete error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
