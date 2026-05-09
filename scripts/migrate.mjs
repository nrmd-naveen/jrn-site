import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { neon } from '@neondatabase/serverless';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const BUCKET = process.env.AWS_S3_BUCKET_NAME;
const REGION = process.env.AWS_REGION;

const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const sql = neon(process.env.DATABASE_URL);

function localPathToKey(pdfUrl) {
  // /papers/filename.pdf → papers/filename.pdf
  return pdfUrl.replace(/^\//, '');
}

function s3Url(key) {
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
}

async function uploadFile(localPath, key) {
  const fullPath = join(ROOT, 'public', localPath);
  if (!existsSync(fullPath)) {
    console.log(`  SKIP (not found): ${fullPath}`);
    return null;
  }
  const body = readFileSync(fullPath);
  const ext = localPath.split('.').pop().toLowerCase();
  const contentTypeMap = { pdf: 'application/pdf', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg' };
  const contentType = contentTypeMap[ext] || 'application/octet-stream';
  await s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: body, ContentType: contentType }));
  console.log(`  Uploaded: ${key}`);
  return s3Url(key);
}

async function main() {
  // Create table
  await sql`
    CREATE TABLE IF NOT EXISTS submissions (
      id TEXT PRIMARY KEY,
      title TEXT,
      authors TEXT,
      email TEXT,
      abstract TEXT,
      field TEXT,
      status TEXT DEFAULT 'Received',
      submission_date TEXT,
      published_date TEXT,
      pdf_url TEXT,
      payment_status TEXT DEFAULT 'Pending',
      volume INTEGER,
      issue INTEGER,
      certificate_url TEXT,
      payment_screenshot_url TEXT,
      team_members JSONB DEFAULT '[]'
    )
  `;
  console.log('Table ready.');

  const submissions = JSON.parse(readFileSync(join(ROOT, 'data', 'submissions.json'), 'utf-8'));

  for (const s of submissions) {
    console.log(`\nProcessing [${s.id}] ${s.title}`);

    // Upload pdfUrl
    if (s.pdfUrl?.startsWith('/papers/')) {
      const key = localPathToKey(s.pdfUrl);
      const url = await uploadFile(s.pdfUrl, key);
      if (url) s.pdfUrl = url;
    }

    // Upload paymentScreenshotUrl
    if (s.paymentScreenshotUrl?.startsWith('/papers/')) {
      const key = localPathToKey(s.paymentScreenshotUrl);
      const url = await uploadFile(s.paymentScreenshotUrl, key);
      if (url) s.paymentScreenshotUrl = url;
    }

    // Upload team member certificate URLs
    if (s.teamMembers?.length) {
      for (const member of s.teamMembers) {
        if (member.certificateUrl?.startsWith('/papers/')) {
          const key = localPathToKey(member.certificateUrl);
          const url = await uploadFile(member.certificateUrl, key);
          if (url) member.certificateUrl = url;
        }
      }
    }

    // Insert into DB
    await sql`
      INSERT INTO submissions (
        id, title, authors, email, abstract, field, status,
        submission_date, published_date, pdf_url, payment_status,
        volume, issue, certificate_url, payment_screenshot_url, team_members
      ) VALUES (
        ${s.id}, ${s.title}, ${s.authors}, ${s.email}, ${s.abstract ?? null},
        ${s.field}, ${s.status}, ${s.submissionDate}, ${s.publishedDate ?? null},
        ${s.pdfUrl ?? null}, ${s.paymentStatus}, ${s.volume}, ${s.issue},
        ${s.certificateUrl ?? null}, ${s.paymentScreenshotUrl ?? null},
        ${JSON.stringify(s.teamMembers ?? [])}
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        authors = EXCLUDED.authors,
        status = EXCLUDED.status,
        pdf_url = EXCLUDED.pdf_url,
        payment_status = EXCLUDED.payment_status,
        payment_screenshot_url = EXCLUDED.payment_screenshot_url,
        team_members = EXCLUDED.team_members,
        published_date = EXCLUDED.published_date
    `;
    console.log(`  Inserted into DB.`);
  }

  console.log('\nMigration complete!');
}

main().catch(err => { console.error(err); process.exit(1); });
