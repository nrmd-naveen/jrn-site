import { NextResponse } from 'next/server';
import { getSubmissions } from '@/lib/db';

export async function GET() {
  const submissions = getSubmissions();
  const published = submissions.filter((s: any) => s.status === 'Published');
  return NextResponse.json(published);
}
