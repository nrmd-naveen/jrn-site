import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { id, pass } = await req.json();
  if (id === 'editor' && pass === 'editor@2026') {
    return NextResponse.json({ success: true, token: 'mock-token' });
  } else {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
