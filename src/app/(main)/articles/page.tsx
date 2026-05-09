'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Download, FileText, Calendar, User } from "lucide-react";
import axios from "axios";
import { Article } from "@/lib/types";

export default function ArchivesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get('/api/articles');
        setArticles(res.data);
      } catch (err) {
        console.error("Failed to fetch archives:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc] p-6 lg:p-10 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-journal-navy font-serif italic mb-2 tracking-tight">Publication Archives</h1>
          <div className="h-1 bg-journal-accent w-24 mx-auto mb-4"></div>
          <p className="text-slate-500 text-sm max-w-xl mx-auto italic">
            Browse our catalog of peer-reviewed innovations in engineering and science. All articles are open access under Creative Commons licensing.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
             <div className="h-10 w-10 border-4 border-journal-blue border-t-transparent rounded-full animate-spin"></div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic animate-pulse">Reconstructing Index...</p>
          </div>
        ) : articles.length > 0 ? (
          <div className="grid gap-6">
            {articles.map((art) => (
              <div key={art.id} className="academic-card p-6 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow border-l-4 border-journal-blue bg-white">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span className="bg-slate-100 px-2 py-0.5 border border-slate-200">Paper ID: {art.id}</span>
                    <span className="flex items-center gap-1"><Calendar size={12}/> Published {art.publishedDate ? new Date(art.publishedDate).toLocaleDateString() : 'N/A'}</span>
                    <span className="text-journal-accent">Vol {art.volume}, Iss {art.issue}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2 leading-tight group cursor-pointer">
                    <Link href={`/paper/${art.id}`} className="hover:text-journal-blue hover:underline">{art.title}</Link>
                  </h3>
                  <div className="flex items-center gap-1 text-sm font-semibold text-slate-600 mb-4 italic">
                    <User size={14} className="text-slate-400" /> {art.authors}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-6 bg-slate-50 p-3 italic border-l-2 border-slate-200">
                    "{art.abstract}"
                  </p>
                  <div className="flex items-center gap-4">
                    <a 
                      href={art.pdfUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="bg-red-700 text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-red-800 transition-colors"
                    >
                      <Download size={14}/> Download PDF
                    </a>
                    <Link href={`/paper/${art.id}`} className="text-[10px] font-black uppercase text-journal-blue hover:underline tracking-widest flex items-center gap-1">
                      <FileText size={14}/> Full Metadata →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-dashed border-slate-300 rounded text-slate-400 italic">
             No archived articles found. Please check back later.
          </div>
        )}

        <div className="mt-12 text-center text-[10px] text-slate-400 border-t pt-8 border-slate-200">
          Current indexing covers Volume 12 (2026). For older archives, please contact the editorial department.
        </div>
      </div>
    </div>
  );
}

