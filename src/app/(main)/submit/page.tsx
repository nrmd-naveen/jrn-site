'use client';
import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle, ShieldCheck } from "lucide-react";
import axios from "axios";

export default function SubmissionPage() {
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    email: '',
    field: 'Engineering',
    abstract: ''
  });
  const [teamMembers, setTeamMembers] = useState(['', '', '', '']);
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [paperId, setPaperId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("PDF Manuscript is mandatory for peer review.");
    
    setLoading(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('authors', formData.authors);
    data.append('email', formData.email);
    data.append('field', formData.field);
    data.append('abstract', formData.abstract);
    data.append('teamMembers', JSON.stringify(teamMembers.filter(m => m.trim() !== '')));
    data.append('pdf', file);

    try {
      const res = await axios.post('/api/submit', data);
      setPaperId(res.data.paperId);
      setSubmitted(true);
    } catch (err) {
      alert("Submission failed. Check network or file size.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto mt-24 p-12 academic-card text-center border-t-8 border-green-600 bg-white shadow-2xl">
        <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-6 animate-bounce" />
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-4">Submission Successful</h2>
        <div className="bg-slate-50 border border-slate-200 p-6 rounded mb-6">
           <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Authenticated Paper ID</p>
           <p className="text-4xl font-mono font-black text-journal-blue">{paperId}</p>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed mb-8 italic">
          Your manuscript has been queued for indexing and initial scan. A formal acceptance notification will be transmitted to <strong>{formData.email}</strong> following peer evaluation.
        </p>
        <Link href="/author-home" className="btn-primary inline-block px-10 py-3 text-xs tracking-[0.2em]">Enter Author Portal</Link>
      </div>
    );
  }

  return (
    <div className="flex-1 flex overflow-hidden">
      <aside className="w-[280px] bg-slate-50 border-r border-slate-200 p-6 shrink-0 hidden lg:flex flex-col gap-6">
        <div className="bg-journal-blue text-white p-4 rounded shadow-lg">
          <h3 className="font-bold text-xs uppercase tracking-widest mb-2">Protocol 4.2</h3>
          <p className="text-[11px] leading-relaxed opacity-80 italic">Manuscripts must be submitted in PDF format. Ensure all author affiliations are clearly indexed in the head matter.</p>
        </div>

        <div className="space-y-4">
           <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-200 pb-2">Mandatory Checklist</h4>
           <ul className="space-y-3">
             {[
               'Originality Statement',
               'Conflict of Interest',
               'Plagiarism Scan (<15%)',
               'Author Affiliations',
               'APA 7th Citations'
             ].map(item => (
               <li key={item} className="flex items-start gap-2 text-[11px] font-medium text-slate-600">
                 <div className="mt-0.5 h-3 w-3 border border-slate-300 rounded-sm shrink-0 bg-white"></div>
                 {item}
               </li>
             ))}
           </ul>
        </div>

        <div className="mt-auto p-4 bg-orange-50 border border-orange-100 rounded text-[10px] text-orange-800 italic leading-relaxed">
           Submission to JIESURT implies exclusive rights for publication in volume 12.
        </div>
      </aside>

      <main className="flex-1 p-10 bg-white overflow-y-auto">
        <div className="max-w-3xl">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-2 font-serif italic">Manuscript Submission Portal</h1>
            <div className="h-1.5 w-24 bg-journal-accent mb-4 mx-auto lg:mx-0"></div>
            <p className="text-sm text-slate-500 italic max-w-xl leading-relaxed">
              Complete the secure relational transmission form below to initiate the peer-review process. Fields marked with <span className="text-red-500">*</span> are indexed mandatory fields.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex justify-between">
                  Full Manuscript Title <span className="text-red-500">*</span>
                </label>
                <input 
                  required 
                  className="w-full border-b-2 border-slate-200 p-3 text-lg font-bold text-slate-800 focus:outline-none focus:border-journal-blue bg-slate-50/30 transition-all" 
                  placeholder="Enter the complete title of your research paper..."
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Author(s) <span className="text-red-500">*</span></label>
                <input 
                  required 
                  className="w-full border border-slate-200 p-3 text-sm font-medium focus:outline-journal-blue bg-slate-50"
                  placeholder="Full name, Co-author(s)..."
                  value={formData.authors}
                  onChange={e => setFormData({...formData, authors: e.target.value})}
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Primary Contact Email <span className="text-red-500">*</span></label>
                <input 
                  required 
                  type="email"
                  className="w-full border border-slate-200 p-3 text-sm font-medium focus:outline-journal-blue bg-slate-50"
                  placeholder="editor-correspondant@domain.com"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Team Members (Up to 4)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teamMembers.map((member, index) => (
                    <input 
                      key={index}
                      className="w-full border border-slate-200 p-3 text-sm font-medium focus:outline-journal-blue bg-slate-50"
                      placeholder={`Team Member ${index + 1} Name`}
                      value={member}
                      onChange={e => {
                        const newMembers = [...teamMembers];
                        newMembers[index] = e.target.value;
                        setTeamMembers(newMembers);
                      }}
                    />
                  ))}
                </div>
              </div>


              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Field of Research <span className="text-red-500">*</span></label>
                <select 
                  className="w-full border border-slate-200 p-3 text-sm font-bold focus:outline-journal-blue bg-slate-50"
                  value={formData.field}
                  onChange={e => setFormData({...formData, field: e.target.value})}
                >
                  <option>Engineering</option>
                  <option>Science & Tech</option>
                  <option>Humanities</option>
                  <option>Medical Sciences</option>
                  <option>Business & Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Manuscript File (PDF Only) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input 
                    required 
                    type="file" 
                    accept=".pdf"
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                  />
                  <div className={`border-2 border-dashed p-3 text-xs font-bold uppercase text-center transition-all ${file ? 'border-green-400 bg-green-50 text-green-700' : 'border-slate-300 bg-slate-50 text-slate-400'}`}>
                    {file ? `File Attached: ${file.name.substring(0, 20)}...` : 'Select PDF Manuscript'}
                  </div>
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Abstract Summary (Indexed)</label>
                <textarea 
                  className="w-full border border-slate-200 p-3 text-sm font-medium focus:outline-journal-blue bg-slate-50 h-32 italic" 
                  placeholder="Provide a brief summary of your research findings..."
                  value={formData.abstract}
                  onChange={e => setFormData({...formData, abstract: e.target.value})}
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
               <div className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-2 tracking-widest">
                  <ShieldCheck size={14} className="text-green-500" /> Secure SSL Transmission Active
               </div>
               <button disabled={loading} className="btn-primary px-12 py-4 text-xs tracking-[0.3em] font-black shadow-xl hover:shadow-journal-accent/20 transition-all disabled:opacity-50">
                 {loading ? 'Transmitting Data...' : 'Execute Submission'}
               </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
