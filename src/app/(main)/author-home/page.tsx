'use client';
import React, { useState } from "react";
import { User, LayoutDashboard, Download, CheckCircle, AlertCircle, ExternalLink, Settings } from "lucide-react";
import axios from "axios";
import { Article } from "@/lib/types";

export default function AuthorHome() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ paperId: '', email: '' });
  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/author', credentials);
      setArticle(res.data.data);
      setIsLoggedIn(true);
    } catch (err) {
      setError('Invalid Paper ID or Email');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto mt-24 p-8 academic-card shadow-2xl border-t-8 border-journal-navy bg-white">
        <div className="text-center mb-8 border-b pb-6">
          <User className="mx-auto h-12 w-12 text-white bg-journal-blue p-2 rounded-full mb-3" />
          <h2 className="text-xl font-bold text-journal-navy uppercase tracking-tight">Author Home Portal</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Authenticated Manuscript Tracking</p>
        </div>
        {error && <div className="bg-red-50 text-red-600 p-3 mb-6 text-[10px] font-black border border-red-200 uppercase tracking-tighter">ERROR: {error}</div>}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Paper ID</label>
            <input required className="w-full border border-slate-300 p-2.5 text-sm focus:outline-journal-blue bg-slate-50 font-mono" placeholder="e.g. 201488" value={credentials.paperId} onChange={e => setCredentials({...credentials, paperId: e.target.value})} />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Author Email Address</label>
            <input required className="w-full border border-slate-300 p-2.5 text-sm focus:outline-journal-blue bg-slate-50" type="email" value={credentials.email} onChange={e => setCredentials({...credentials, email: e.target.value})} />
          </div>
          <button className="btn-primary w-full py-3 text-[11px] tracking-widest">Connect to Manuscript</button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex-1 flex overflow-hidden">
      <aside className="w-[180px] bg-journal-navy text-white p-3 flex flex-col gap-1 overflow-y-auto shrink-0 hidden lg:flex border-r border-white/10 uppercase font-bold text-[10px] tracking-wider">
        <div className="p-3 bg-white/5 border border-white/10 mb-4 rounded-sm">
           <p className="opacity-50 text-[9px] mb-1">Authenticated As</p>
           <p className="truncate text-orange-400">{article?.authors}</p>
        </div>
        <button className="w-full text-left p-2.5 hover:bg-orange-500 flex items-center gap-2 border-b border-white/5 transition-all"><LayoutDashboard size={14}/> Dashboard</button>
        <button className="w-full text-left p-2.5 hover:bg-orange-500 flex items-center gap-2 border-b border-white/5 transition-all"><Download size={14}/> Downloads</button>
        <button className="w-full text-left p-2.5 hover:bg-orange-500 flex items-center gap-2 border-b border-white/5 transition-all font-normal opacity-70 cursor-not-allowed"><Settings size={14}/> Profile Index</button>
        <button onClick={() => setIsLoggedIn(false)} className="mt-auto w-full text-left p-2.5 hover:bg-red-700 text-red-300 transition-all border-t border-white/10 italic">Term. Session</button>
      </aside>

      <main className="flex-1 p-6 bg-white overflow-y-auto border-r border-slate-300">
        <div className="mb-8 border-b border-slate-200 pb-4 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-serif font-bold text-slate-800 leading-tight">Author Publication Dashboard</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1 italic">Real-time relational status tracking</p>
          </div>
          <div className="flex gap-2">
            <span className="bg-blue-50 text-blue-800 text-[10px] font-black px-2 py-1 border border-blue-100 uppercase">Paper ID: {article?.id}</span>
            <span className={`text-white text-[10px] font-black px-2 py-1 uppercase tracking-tighter ${article?.status === 'Published' ? 'bg-green-600' : 'bg-orange-500'}`}>Status: {article?.status}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="academic-card p-5 border-l-4 border-journal-blue bg-[#f8fafc]">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 italic">Manuscript Core Information</h3>
              <p className="text-lg font-bold text-slate-800 mb-4 leading-snug">"{article?.title}"</p>
              <div className="grid grid-cols-2 gap-4 text-[11px] font-medium border-t border-slate-200 pt-4">
                <div>
                   <p className="text-slate-400 uppercase text-[9px] font-black mb-1">Field of Research</p>
                   <p className="text-slate-700">{article?.field}</p>
                </div>
                <div>
                   <p className="text-slate-400 uppercase text-[9px] font-black mb-1">Submission Date</p>
                   <p className="text-slate-700">{article?.submissionDate ? new Date(article.submissionDate).toLocaleDateString() : 'Pending'}</p>
                </div>
                <div>
                   <p className="text-slate-400 uppercase text-[9px] font-black mb-1">Reviewing Office</p>
                   <p className="text-slate-700">Editorial Board (Central)</p>
                </div>
                <div>
                   <p className="text-slate-400 uppercase text-[9px] font-black mb-1">DOI Handle</p>
                   <p className="text-slate-700 italic underline text-blue-600">Pending Assignment</p>
                </div>
              </div>
            </div>

            <div className="academic-card p-5 border-l-4 border-journal-accent bg-orange-50/30">
               <h3 className="text-xs font-black text-journal-accent uppercase tracking-widest mb-3 flex items-center gap-2">
                 <CheckCircle size={14}/> Relational Review Log
               </h3>
               <div className="space-y-4">
                 <div className="bg-white p-3 border border-orange-100 italic text-[11px] text-slate-600 font-medium">
                   {article?.status === 'Received' ? '1. SYSTEM: Initial scanning complete. Manuscript queued for peer evaluation.' : ''}
                   {article?.status === 'Published' ? 'FINAL: Peer review complete. Manuscript published and indexed under volume 12 issue 05.' : ''}
                   {article?.status === 'Accepted' ? 'STAGE 2: Acceptance granted. Processing for layout and indexing initialised.' : ''}
                 </div>
                 <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-slate-400">
                    <span>Scan Relay Active</span>
                    <span className="text-journal-blue">Server Tick: 09/05/2026</span>
                 </div>
               </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className={`academic-card p-5 ${article?.paymentStatus === 'Paid' ? 'border-green-300 bg-green-50/30' : 'border-red-200 bg-red-50/20'}`}>
               <h3 className="text-xs font-black uppercase text-slate-500 mb-4 flex items-center gap-2 tracking-widest font-serif">
                 <AlertCircle size={14} className={article?.paymentStatus === 'Paid' ? 'text-green-600' : 'text-red-500'} /> Processing Fee
               </h3>
               <div className="space-y-3">
                 <p className="text-[10px] font-black tracking-widest uppercase flex justify-between">
                    Status: <span className={article?.paymentStatus === 'Paid' ? 'text-green-600' : 'text-red-600'}>{article?.paymentStatus}</span>
                 </p>
                 <div className="p-3 bg-white border border-slate-100 rounded-sm space-y-1">
                   <div className="text-[10px] text-slate-500 uppercase font-black flex justify-between">
                     <span>Base Amount</span>
                     <span>₹1850.00</span>
                   </div>
                   <div className="text-[10px] text-slate-500 uppercase font-black flex justify-between border-b pb-2 mb-2">
                     <span>Processing Fee + GST</span>
                     <span>₹149.00</span>
                   </div>
                   <div className="text-[10px] text-slate-800 uppercase font-black flex justify-between items-end mt-2">
                     <span>Calculated Total</span>
                     <span className="text-xl font-black text-slate-800">₹1999.00</span>
                   </div>
                 </div>
                 {article?.paymentStatus === 'Pending' && (
                    <div className="bg-white p-4 border border-slate-200 text-center">
                      <p className="text-[10px] font-black text-slate-800 uppercase mb-3 tracking-widest">Scan QR to Pay</p>
                      <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=jiesurt@upi&pn=JIESURT&am=1999.00" alt="Payment QR" className="mx-auto" />
                    </div>
                 )}
               </div>
            </div>

            {article?.status === 'Published' && (
               <div className="academic-card p-5 bg-indigo-50 border-indigo-200 shadow-lg">
                  <h3 className="text-xs font-black text-indigo-700 uppercase tracking-widest mb-3 flex items-center gap-2 italic">
                    <ExternalLink size={14}/> Spotlight Reward Hub
                  </h3>
                  <p className="text-[11px] text-indigo-900 mb-4 leading-relaxed font-medium">Record snapshots of your certificate on social media for earn <span className="font-bold underline">₹1000</span> compensation reward.</p>
                  <button className="w-full bg-indigo-700 text-white py-2 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-800">Launch Claim Portal</button>
               </div>
            )}
            
            <div className="academic-card p-5 border-t-4 border-slate-800">
               <h3 className="text-[10px] font-black uppercase text-slate-500 mb-4 tracking-widest">Download Center</h3>
               <div className="space-y-2">
                  <a 
                    href={article?.pdfUrl || '#'} 
                    target="_blank" 
                    rel="noreferrer"
                    className={`w-full p-2 border text-[10px] font-bold flex items-center gap-2 ${article?.pdfUrl ? 'text-slate-600 hover:bg-slate-50' : 'text-slate-300 cursor-not-allowed'}`}
                  >
                    <Download size={12}/> Manuscript PDF
                  </a>
                  <a 
                    href={article?.certificateUrl || '#'} 
                    target="_blank" 
                    rel="noreferrer"
                    className={`w-full p-2 border text-[10px] font-bold flex items-center gap-2 ${article?.certificateUrl ? 'text-slate-600 hover:bg-slate-50' : 'text-slate-300 cursor-not-allowed'}`}
                  >
                    <Download size={12}/> Review Certificate
                  </a>
                  <button className="w-full p-2 border text-[10px] font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                    <Download size={12}/> Ethical Standards
                  </button>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
