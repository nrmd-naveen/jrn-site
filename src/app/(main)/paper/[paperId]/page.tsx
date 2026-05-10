import { getSubmissions } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FileText, Download, Calendar, Tag, BookOpen } from 'lucide-react';

export default async function PaperPage({ params }: { params: Promise<{ paperId: string }> }) {
  const { paperId } = await params;
  const submissions = await getSubmissions();
  const paper = submissions.find((s: any) => s.id === paperId);

  if (!paper || paper.status !== 'Published') {
    return notFound();
  }

  return (
    <div className="max-w-4xl mx-auto my-12 p-8 bg-white shadow-2xl border-t-8 border-journal-navy mt-24">
      <div className="mb-8 border-b border-slate-100 pb-6">
        <h1 className="text-3xl font-black text-slate-800 leading-tight mb-4 font-serif italic">
          {paper.title}
        </h1>
        
        <div className="flex flex-wrap gap-4 text-sm text-slate-500 font-medium">
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded">
            <Calendar size={14} /> 
            {paper.publishedDate ? new Date(paper.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recently Published'}
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded">
            <Tag size={14} /> 
            {paper.field}
          </div>
          <div className="flex items-center gap-1.5 bg-blue-50 text-journal-blue px-3 py-1 rounded font-bold">
            <BookOpen size={14} /> 
            Vol {paper.volume}, Issue {paper.issue}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <section>
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Abstract</h2>
            <p className="text-slate-600 leading-relaxed text-justify italic font-light whitespace-pre-line">
              {paper.abstract || "No abstract available for this manuscript."}
            </p>
          </section>

          <section>
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Authors</h2>
            <div className="space-y-1">
              <p className="text-lg font-bold text-slate-800">{paper.authors}</p>
              {paper.teamMembers && paper.teamMembers.length > 0 && (
                paper.teamMembers.map((member: { name: string; certificateUrl?: string }, i: number) => (
                  <p key={i} className="text-lg font-bold text-slate-800">{member.name}</p>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">Paper Assets</h3>
            
            {paper.pdfUrl ? (
              <a 
                href={paper.pdfUrl} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-journal-navy text-white py-4 rounded font-bold text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg mb-3"
              >
                <Download size={16} /> Download Full Text
              </a>
            ) : (
              <div className="text-center p-4 border-2 border-dashed border-slate-300 text-slate-400 text-xs font-bold uppercase rounded">
                PDF Not Linked
              </div>
            )}
            
            <Link 
              href={`/certificates/${paper.id}`}
              className="flex items-center justify-center gap-3 w-full border border-journal-navy text-journal-navy py-3 rounded font-bold text-[10px] uppercase tracking-widest hover:bg-journal-navy hover:text-white transition-all"
            >
              <FileText size={14} /> View Certificates
            </Link>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-100 rounded text-[10px] text-blue-800 italic leading-relaxed">
            Index: {paper.id} | Journal of International Engineering, Science, and Unified Research Technologies
          </div>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
        <Link href="/" className="hover:text-journal-blue font-bold uppercase tracking-tighter">
          &larr; Return to Repository
        </Link>
        <p>© {new Date().getFullYear()} JIESURT Publications</p>
      </div>
    </div>
  );
}
