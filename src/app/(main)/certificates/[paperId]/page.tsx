import { getSubmissions } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Download, FileText, User } from 'lucide-react';

export default async function CertificatesPage({ params }: { params: Promise<{ paperId: string }> }) {
  const { paperId } = await params;
  const submissions = await getSubmissions();
  const paper = submissions.find((s: any) => s.id === paperId);

  if (!paper) {
    return notFound();
  }

  const isPublished = paper.status === 'Published';
  const members = paper.teamMembers || [];

  return (
    <div className="max-w-4xl mx-auto my-12 p-6 bg-white shadow-xl border-t-8 border-journal-navy mt-24">
      <h1 className="text-3xl font-black text-journal-navy uppercase tracking-tighter mb-6 flex items-center gap-3">
        <FileText className="text-journal-blue" /> Publication Certificates
      </h1>
      
      <div className="bg-slate-50 p-6 border border-slate-200 mb-8 rounded shadow-sm">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3 border-b border-slate-200 pb-2">Manuscript Details</h2>
        <p className="text-2xl font-bold text-journal-blue mb-2 leading-tight">{paper.title}</p>
        <p className="text-sm text-slate-600 mb-4 font-medium">Authors: <span className="text-slate-800">{paper.authors}</span></p>
        <div className="flex gap-4 items-center">
          <span className="text-xs bg-slate-200 px-3 py-1.5 uppercase font-bold text-slate-700 tracking-wider">ID: {paper.id}</span>
          <span className={`text-xs px-3 py-1.5 uppercase font-bold tracking-wider ${isPublished ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
            Status: {paper.status}
          </span>
          {isPublished && <CheckCircle size={16} className="text-green-500" />}
        </div>
      </div>

      {!isPublished ? (
        <div className="p-6 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded text-center">
          <p className="font-bold">Certificates Not Available Yet</p>
          <p className="text-sm mt-1">Certificates will be available for download once the manuscript is officially published.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-2">Author Certificate</h2>
            <div className="border border-slate-200 p-4 rounded flex items-center justify-between bg-white shadow-sm">
              <div className="flex items-center gap-3">
                <div className="bg-slate-100 p-2 rounded-full text-slate-500">
                  <User size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-800">{paper.authors}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">Author</p>
                </div>
              </div>
              <div>
                {paper.certificateUrl ? (
                  <a
                    href={paper.certificateUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 bg-journal-blue text-white px-3 py-2 text-xs font-bold uppercase rounded hover:bg-journal-navy transition-colors"
                  >
                    <Download size={14} /> Download
                  </a>
                ) : (
                  <span className="text-xs bg-slate-100 text-slate-500 px-3 py-2 font-bold uppercase rounded border border-slate-200 inline-block">
                    Pending
                  </span>
                )}
              </div>
            </div>
          </div>

          {members.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-2">Team Member Certificates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {members.map((member: any, index: number) => (
                  <div key={index} className="border border-slate-200 p-4 rounded flex items-center justify-between bg-white shadow-sm hover:shadow transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-100 p-2 rounded-full text-slate-500">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{member.name}</p>
                        <p className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">Team Member</p>
                      </div>
                    </div>
                    <div>
                      {member.certificateUrl ? (
                        <a
                          href={member.certificateUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 bg-journal-blue text-white px-3 py-2 text-xs font-bold uppercase rounded hover:bg-journal-navy transition-colors"
                        >
                          <Download size={14} /> Download
                        </a>
                      ) : (
                        <span className="text-xs bg-slate-100 text-slate-500 px-3 py-2 font-bold uppercase rounded border border-slate-200 inline-block">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-12 text-center">
        <Link href="/" className="text-sm text-journal-blue hover:underline font-medium">
          &larr; Return to Homepage
        </Link>
      </div>
    </div>
  );
}
