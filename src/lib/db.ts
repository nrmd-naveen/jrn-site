import fs from 'fs';
import path from 'path';
import { Article } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');

export function initDB() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getSubmissions(): Article[] {
  initDB();
  if (!fs.existsSync(SUBMISSIONS_FILE)) return [];
  try {
    const data = fs.readFileSync(SUBMISSIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading submissions:', err);
    return [];
  }
}

export function saveSubmissions(submissions: Article[]) {
  initDB();
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2));
}
