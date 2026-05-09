import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  const { to, subject, htmlContent } = await req.json();
  const BREVO_API_KEY = process.env.BREVO_API_KEY;

  if (!BREVO_API_KEY) {
    return NextResponse.json({ error: 'Brevo API Key not configured' }, { status: 500 });
  }

  try {
    await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: {
          name: 'JIESURT Editor',
          email: 'editor@jiesurt.in.net'
        },
        to: [{ email: to }],
        subject: subject,
        htmlContent: htmlContent
      },
      {
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Brevo Error:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
