'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Search, ChevronRight, Download, Mail } from "lucide-react";
import axios from "axios";
import { Article } from "@/lib/types";

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get('/api/articles');
        setArticles(res.data);
      } catch (err) {
        console.error("Failed to fetch articles:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left Sidebar */}
      <aside className="w-[220px] bg-white border-r border-slate-300 p-3 flex flex-col gap-3 overflow-y-auto shrink-0 hidden lg:flex">
        <div className="border border-slate-200 rounded">
          <h3 className="bg-slate-100 p-2 text-[11px] font-bold border-b border-slate-200 uppercase tracking-tight">Paper Status Check</h3>
          <div className="p-2">
            <Link href="/author-home" className="w-full bg-journal-blue text-white text-[10px] py-2 uppercase font-bold hover:bg-blue-800 block text-center rounded-sm">Author Login</Link>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="text-[10px] bg-blue-50 p-2 border-l-4 border-journal-blue text-journal-blue font-bold tracking-widest uppercase">Quick Links</div>
          <Link href="/submit" className="block text-[11px] p-2 hover:bg-slate-50 border-b border-slate-100 flex items-center gap-2"><ChevronRight size={10} /> Submit Manuscript</Link>
          <Link href="/articles" className="block text-[11px] p-2 hover:bg-slate-50 border-b border-slate-100 flex items-center gap-2"><ChevronRight size={10} /> Current Issue</Link>
          <Link href="/author-home" className="block text-[11px] p-2 hover:bg-slate-50 border-b border-slate-100 flex items-center gap-2"><ChevronRight size={10} /> Author Portal</Link>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-100 italic text-[10px] text-slate-400">
          JIESURT is indexed in major academic databases.
        </div>
      </aside>

      {/* Center Content */}
      <main className="flex-1 p-6 bg-white overflow-y-auto border-r border-slate-300">
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4 font-serif italic">Welcome to JIESURT</h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-6 italic">
            JIESURT is a multidisciplinary, scholarly open access, peer-reviewed and refereed journal with an Impact Factor of 8.01 (SJIF). We publish monthly original research that advances innovation in engineering, science, and technology.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
             {[
               { label: 'Impact Factor', val: '8.01' },
               { label: 'ISSN', val: '2349-6002' },
               { label: 'Published Papers', val: '1240+' },
               { label: 'Review Time', val: '15 Days' }
             ].map(stat => (
               <div key={stat.label} className="bg-slate-50 border border-slate-200 p-3 text-center">
                 <div className="text-xl font-black text-journal-blue leading-none">{stat.val}</div>
                 <div className="text-[9px] uppercase font-bold text-slate-400 mt-1">{stat.label}</div>
               </div>
             ))}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-2">
            <h2 className="text-lg font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
              <Search size={18} className="text-journal-accent" /> Recently Published
            </h2>
            <div className="text-[10px] text-slate-400 font-bold">
              {loading ? "Indexing..." : `${articles.length} article${articles.length !== 1 ? 's' : ''} published`}
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-10 text-slate-400 text-sm">Loading...</div>
            ) : articles.length > 0 ? (
              articles.map(art => (
                <div key={art.id} className="border border-slate-200 p-4 rounded-none hover:bg-slate-50 transition-colors group">
                  <span className="text-[9px] bg-green-100 text-green-800 px-2 py-0.5 rounded-sm font-bold uppercase mb-2 inline-block tracking-tighter">Paper ID: {art.id}</span>
                  <h3 className="text-blue-700 font-bold leading-tight mb-1 cursor-pointer group-hover:underline text-[15px]">{art.title}</h3>
                  <p className="text-xs font-semibold text-slate-600 mb-2">{art.authors}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-2 italic mb-3">"{art.abstract}"</p>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                    <div className="flex gap-3 text-[10px] font-bold">
                      {art.pdfUrl && (
                        <a
                          href={art.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-red-700 flex items-center gap-1 uppercase tracking-tighter hover:text-red-900 border border-red-100 px-1 bg-red-50"
                        >
                          <Download size={10}/> [View PDF]
                        </a>
                      )}
                    </div>
                    <Link href={`/paper/${art.id}`} className="text-[10px] text-blue-600 hover:underline">Full Details →</Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400 italic text-sm">No published articles found in current index.</div>
            )}
          </div>
        </section>
      </main>

      {/* Right Sidebar */}
      <aside className="w-[300px] bg-slate-50 p-4 shrink-0 border-l border-slate-200 hidden xl:flex flex-col gap-6">
        <div className="bg-journal-navy p-4 text-white text-center border-b-4 border-journal-accent">
          <h3 className="font-bold text-xs uppercase tracking-widest mb-1">Call for Papers</h3>
          <p className="text-lg font-serif italic mb-3 leading-tight">May - June 2026 Issue</p>
          <Link href="/submit" className="w-full bg-journal-accent text-white py-2 text-xs font-black uppercase tracking-widest hover:bg-orange-600 shadow-inner block">Submit Manuscript</Link>
        </div>

        <div className="academic-card p-4">
          <h3 className="bg-slate-100 p-2 -m-4 mb-4 text-xs font-bold border-b border-slate-200 uppercase text-slate-700 flex items-center gap-2">
             <Mail size={14} className="text-journal-blue" /> Editorial Notifications
          </h3>
          <ul className="space-y-3">
            <li className="text-[11px] border-b pb-2 border-slate-100">
               <span className="text-journal-accent font-bold">●</span> DOI Assignment for Issue 04 completed.
            </li>
            <li className="text-[11px] border-b pb-2 border-slate-100">
               <span className="text-journal-accent font-bold">●</span> SJIF Impact Factor updated to 8.01.
            </li>
            <li className="text-[11px] border-b pb-2 border-slate-100">
               <span className="text-journal-accent font-bold">●</span> New metadata standards for indexing enforced.
            </li>
          </ul>
        </div>

        <div className="academic-card p-4 bg-yellow-50/50 border-yellow-200">
          <h3 className="text-xs font-bold uppercase text-yellow-800 mb-3 flex items-center gap-2 underline decoration-yellow-300 underline-offset-4">Spotlight Rewards</h3>
          <p className="text-[11px] text-yellow-900 leading-relaxed font-medium">
             Authors of published articles are eligible for a reward of <span className="font-bold">₹1000</span> for participating in our Digital Spotlight Initiative.
          </p>
          <Link href="/author-home" className="text-[10px] text-yellow-700 font-black uppercase mt-3 block hover:underline">Learn More & Record Snapshot →</Link>
        </div>
        
        <div className="mt-auto border border-dashed border-slate-300 p-4 text-center text-slate-400 italic text-[10px]">
          Global Citation Tracking and Indexing services connected.
        </div>
      </aside>
    </div>
  );
}

