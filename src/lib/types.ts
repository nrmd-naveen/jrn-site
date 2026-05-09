export interface Article {
  id: string;
  title: string;
  authors: string;
  email: string;
  abstract: string;
  field: string;
  status: 'Received' | 'Under Review' | 'Accepted' | 'Published' | 'Rejected';
  submissionDate: string;
  publishedDate?: string;
  pdfUrl?: string;
  paymentStatus: 'Pending' | 'Paid';
  volume: number;
  issue: number;
  certificateUrl?: string;
  paymentScreenshotUrl?: string;
  teamMembers?: { name: string; certificateUrl?: string }[];
}
