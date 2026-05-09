import { NextResponse } from 'next/server';
import { getSubmissions } from '@/lib/db';

export async function GET() {
  // In real app, check token from headers
  return NextResponse.json(getSubmissions());
}
