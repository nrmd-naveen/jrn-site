import { neon } from '@neondatabase/serverless';
import { Article } from './types';

const sql = neon(process.env.DATABASE_URL!);

async function initDB() {
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
}

function rowToArticle(row: any): Article {
  return {
    id: row.id,
    title: row.title,
    authors: row.authors,
    email: row.email,
    abstract: row.abstract,
    field: row.field,
    status: row.status,
    submissionDate: row.submission_date,
    publishedDate: row.published_date,
    pdfUrl: row.pdf_url,
    paymentStatus: row.payment_status,
    volume: row.volume,
    issue: row.issue,
    certificateUrl: row.certificate_url,
    paymentScreenshotUrl: row.payment_screenshot_url,
    teamMembers: row.team_members || [],
  };
}

export async function getSubmissions(): Promise<Article[]> {
  await initDB();
  const rows = await sql`SELECT * FROM submissions ORDER BY submission_date DESC`;
  return rows.map(rowToArticle);
}

export async function saveSubmissions(articles: Article[]) {
  await initDB();
  for (const s of articles) {
    await sql`
      INSERT INTO submissions (
        id, title, authors, email, abstract, field, status,
        submission_date, published_date, pdf_url, payment_status,
        volume, issue, certificate_url, payment_screenshot_url, team_members
      ) VALUES (
        ${s.id}, ${s.title}, ${s.authors}, ${s.email}, ${s.abstract},
        ${s.field}, ${s.status}, ${s.submissionDate}, ${s.publishedDate ?? null},
        ${s.pdfUrl ?? null}, ${s.paymentStatus}, ${s.volume ?? 0}, ${s.issue ?? 0},
        ${s.certificateUrl ?? null}, ${s.paymentScreenshotUrl ?? null},
        ${JSON.stringify(s.teamMembers ?? [])}
      )
      ON CONFLICT (id) DO NOTHING
    `;
  }
}

export async function updateSubmission(paperId: string, updates: Partial<Omit<Article, 'id'>>) {
  await initDB();
  const rows = await sql`SELECT * FROM submissions WHERE id = ${paperId}`;
  if (rows.length === 0) return;
  const current = rowToArticle(rows[0]);
  const merged = { ...current, ...updates };
  const publishedDate = merged.status === 'Published' && current.status !== 'Published'
    ? new Date().toISOString()
    : (merged.publishedDate ?? null);

  await sql`
    UPDATE submissions SET
      title                  = ${merged.title},
      authors                = ${merged.authors},
      email                  = ${merged.email},
      abstract               = ${merged.abstract},
      field                  = ${merged.field},
      status                 = ${merged.status},
      submission_date        = ${merged.submissionDate},
      published_date         = ${publishedDate},
      pdf_url                = ${merged.pdfUrl ?? null},
      payment_status         = ${merged.paymentStatus},
      volume                 = ${merged.volume ?? 0},
      issue                  = ${merged.issue ?? 0},
      certificate_url        = ${merged.certificateUrl ?? null},
      payment_screenshot_url = ${merged.paymentScreenshotUrl ?? null},
      team_members           = ${JSON.stringify(merged.teamMembers ?? [])}::jsonb
    WHERE id = ${paperId}
  `;
}

export async function deleteSubmission(paperId: string) {
  await initDB();
  await sql`DELETE FROM submissions WHERE id = ${paperId}`;
}
