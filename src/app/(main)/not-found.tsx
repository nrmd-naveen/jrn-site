import Link from 'next/link';
import { FileSearch, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center bg-[#f8fafc] p-8">
      <div className="max-w-lg w-full bg-white border-t-8 border-journal-navy shadow-2xl p-12 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-slate-100 rounded-full p-5 border border-slate-200">
            <FileSearch size={40} className="text-journal-navy" />
          </div>
        </div>

        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">
          Error 404
        </div>
        <h1 className="text-3xl font-black text-slate-800 font-serif italic mb-4 leading-tight">
          Article Not Found
        </h1>
        <div className="h-1 w-16 bg-journal-accent mx-auto mb-6"></div>

        <p className="text-sm text-slate-500 leading-relaxed mb-8 italic">
          The manuscript or page you requested could not be located in our publication index. It may have been removed, not yet published, or the identifier may be incorrect.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-journal-navy text-white px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-black transition-all"
          >
            <ArrowLeft size={14} /> Return to Home
          </Link>
          <Link
            href="/articles"
            className="flex items-center justify-center gap-2 border border-journal-navy text-journal-navy px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-journal-navy hover:text-white transition-all"
          >
            Browse Archives
          </Link>
        </div>

        <p className="mt-10 text-[10px] text-slate-300 font-mono">
          JIESURT Publication Index — Vol 12 (2026)
        </p>
      </div>
    </div>
  );
}
