import { NextResponse } from 'next/server';
import { getSubmissions, saveSubmissions } from '@/lib/db';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Article } from '@/lib/types';

const s3 = new S3Client({
  region: process.env.S3_REGION!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

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
      const fileName = `papers/${Date.now()}-${file.name}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      await s3.send(new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: fileName,
        Body: buffer,
        ContentType: file.type || 'application/pdf',
      }));
      pdfUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${fileName}`;
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

    const submissions = await getSubmissions();
    submissions.push(newSubmission);
    await saveSubmissions(submissions);

    return NextResponse.json({ success: true, paperId });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json({ error: 'Failed to process submission' }, { status: 500 });
  }
}
