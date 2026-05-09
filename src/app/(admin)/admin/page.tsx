'use client';
import React, { useState, useEffect } from "react";
import { LayoutDashboard, FileText, CheckCircle, Mail, X, Send, Plus, Trash2, AlertTriangle } from "lucide-react";
import axios from "axios";
import { Article } from "@/lib/types";

export default function AdminDashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [loginCreds, setLoginCreds] = useState({ id: '', pass: '' });
  const [selectedSub, setSelectedSub] = useState<Article | null>(null);
  const [emailCompose, setEmailCompose] = useState<{ isOpen: boolean; subject: string; body: string; to: string } | null>(null);
  const [emailSending, setEmailSending] = useState(false);
  const [editModal, setEditModal] = useState<Article | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem('adminToken'));
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/submissions');
      setSubmissions(res.data);
      if (selectedSub) {
        const refreshed = res.data.find((s: Article) => s.id === selectedSub.id);
        if (refreshed) setSelectedSub(refreshed);
      } else if (res.data.length > 0) {
        setSelectedSub(res.data[0]);
      }
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => { if (token) fetchSubmissions(); }, [token]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/admin/login', loginCreds);
      localStorage.setItem('adminToken', res.data.token);
      setToken(res.data.token);
    } catch (err) {
      alert("Invalid Admin Credentials");
    }
  };

  const openEmailModal = (type: string, sub: Article) => {
    let subject = "";
    let body = "";
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    if (type === 'received') {
      subject = `Submission Received - Paper ID: ${sub.id}`;
      body = `Dear ${sub.authors},

Greetings from JIESURT.

Thank you for submitting your manuscript titled:

"${sub.title}"

We are pleased to confirm that your submission has been successfully received and is currently under review by our editorial team.

Submission Details:

Submission ID: ${sub.id}
Date of Submission: ${today}
Current Status: Under Review

Our review team has initiated the evaluation process. You can expect an update regarding the review outcome within the next 24-48 working hours.

If additional information or clarification is required during the review process, our team will contact you through this email address.

Thank you for choosing JIESURT.

Best Regards,
Editorial Team
JIESURT
https://jiesurt.in.net`;
    } else if (type === 'accepted') {
      subject = `Manuscript Accepted for Publication - Paper ID: ${sub.id}`;
      body = `Dear ${sub.authors},

Greetings from JIESURT.

We are pleased to inform you that your manuscript titled:

"${sub.title}"

has successfully completed the review process and has been officially ACCEPTED for publication in our journal.

Acceptance Details:

Submission ID: ${sub.id}
Review Status: Accepted
Acceptance Date: ${today}

The reviewers appreciated the quality and relevance of your work. Your manuscript has now been forwarded to the publication processing stage.

To proceed with publication, kindly complete the publication/payment process using the link provided below:

https://jiesurt.in.net/pay/${sub.id}

Upon successful payment confirmation, your paper will move to the final publication stage.

Congratulations, and thank you for publishing with JIESURT.

Best Regards,
Editorial Team
JIESURT
https://jiesurt.in.net`;
    } else if (type === 'payment') {
      subject = `Payment Successful - Paper ID: ${sub.id}`;
      body = `Dear ${sub.authors},

Greetings from JIESURT.

We are pleased to confirm that your publication/payment process has been completed successfully for the manuscript titled:

"${sub.title}"

Payment Details:

Submission ID: ${sub.id}
Payment Status: Successful
Transaction ID: [Enter Transaction ID]
Payment Date: ${today}

Your manuscript has now been forwarded to the final publication and indexing process.

The publication team is currently preparing:

- Final publication formatting
- DOI/Reference processing
- Publication certificate generation
- Online journal indexing

You will receive the publication link and certificate shortly after the publication process is completed.

Thank you for your cooperation and trust in JIESURT.

Best Regards,
Accounts & Publication Team
JIESURT
https://jiesurt.in.net`;
    } else if (type === 'published') {
      subject = `Paper Published Successfully - Paper ID: ${sub.id}`;
      body = `Dear ${sub.authors},

Greetings from JIESURT.

We are delighted to inform you that your manuscript titled:

"${sub.title}"

has been successfully published in our journal.

Publication Details:

Submission ID: ${sub.id}
Publication Date: ${today}
Volume/Issue: [Enter Volume & Issue]
DOI/Reference ID: [Enter DOI]

Access Your Published Paper:
https://jiesurt.in.net/paper/${sub.id}

Download Publication Certificates:
https://jiesurt.in.net/certificates/${sub.id}

We sincerely thank you for choosing JIESURT for your publication. We appreciate your contribution to the research community and look forward to receiving your future submissions.

Congratulations on your successful publication.

Best Regards,
Editorial & Publication Team
JIESURT
https://jiesurt.in.net`;
    }

    setEmailCompose({ isOpen: true, subject, body, to: sub.email });
  };

  const sendEmailFromModal = async () => {
    if (!emailCompose) return;
    setEmailSending(true);

    const formattedBodyText = emailCompose.body.split('\n').map(line => 
      line.trim() === '' ? '<br/>' : `<p style="margin: 0 0 8px 0;">${line}</p>`
    ).join('');

    const htmlContent = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="background-color: #002244; padding: 25px 30px; text-align: center; border-bottom: 4px solid #1e3a8a;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 1px;">JIESURT</h1>
          <p style="color: #93c5fd; margin: 5px 0 0 0; font-size: 13px; font-weight: 500;">Journal of International Engineering, Science, and Unified Research Technologies</p>
        </div>
        <div style="padding: 30px; background-color: #ffffff; color: #334155; font-size: 15px; line-height: 1.6;">
          ${formattedBodyText}
        </div>
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} JIESURT. All rights reserved.</p>
          <p style="margin: 5px 0 0 0;"><a href="https://jiesurt.in.net" style="color: #002244; text-decoration: none; font-weight: 600;">jiesurt.in.net</a></p>
        </div>
      </div>
    `;

    try {
      await axios.post('/api/email/send', { 
        to: emailCompose.to, 
        subject: emailCompose.subject, 
        htmlContent 
      });
      alert("Trigger success: Email sent to " + emailCompose.to);
      setEmailCompose(null);
    } catch (err) {
      alert("Failed to send email trigger");
    }
    setEmailSending(false);
  };

  const updateStatus = async (paperId: string, status: string, paymentStatus?: string) => {
    try {
      await axios.post('/api/admin/update-status', { paperId, status, paymentStatus });
      await fetchSubmissions();
    } catch (err: any) {
      alert('Update failed: ' + (err?.response?.data?.error ?? err?.message ?? 'Unknown error'));
    }
  };

  const uploadFileAndUpdate = async (paperId: string, file: File, field: 'pdfUrl' | 'certificateUrl' | 'paymentScreenshotUrl') => {
    const formData = new FormData();
    formData.append('pdf', file);
    try {
      const res = await axios.post('/api/admin/upload-file', formData);
      await axios.post('/api/admin/update-status', { paperId, [field]: res.data.path });
      fetchSubmissions();
      alert(`Asset linked to ${paperId}`);
      if (editModal && editModal.id === paperId) {
          setEditModal({ ...editModal, [field]: res.data.path });
      }
      if (selectedSub && selectedSub.id === paperId) {
          setSelectedSub({ ...selectedSub, [field]: res.data.path });
      }
    } catch (err) {
      alert("Upload error");
    }
  };

  const uploadMemberCertificateAndUpdate = async (paperId: string, memberIndex: number, file: File) => {
    if (!editModal || !editModal.teamMembers) return;
    const formData = new FormData();
    formData.append('pdf', file);
    try {
      const res = await axios.post('/api/admin/upload-file', formData);
      const updatedMembers = [...editModal.teamMembers];
      updatedMembers[memberIndex] = { ...updatedMembers[memberIndex], certificateUrl: res.data.path };
      
      await axios.post('/api/admin/update-status', { paperId, teamMembers: updatedMembers });
      fetchSubmissions();
      alert(`Certificate uploaded for ${updatedMembers[memberIndex].name}`);
      
      setEditModal({ ...editModal, teamMembers: updatedMembers });
      if (selectedSub && selectedSub.id === paperId) {
          setSelectedSub({ ...selectedSub, teamMembers: updatedMembers });
      }
    } catch (err) {
      alert("Upload error");
    }
  };

  const deletePaper = async (paperId: string) => {
    if (!confirm(`Permanently delete paper ${paperId}? This cannot be undone.`)) return;
    try {
      await axios.post('/api/admin/delete', { paperId });
      setSelectedSub(null);
      setEditModal(null);
      fetchSubmissions();
    } catch (err) {
      alert("Failed to delete paper");
    }
  };

  const saveEditedSub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModal) return;
    setIsUpdating(true);
    try {
      await axios.post('/api/admin/update-status', { paperId: editModal.id, ...editModal });
      fetchSubmissions();
      alert("Manuscript updated successfully");
      if (selectedSub?.id === editModal.id) {
          setSelectedSub(editModal);
      }
      setEditModal(null);
    } catch (err) {
      alert("Failed to update manuscript");
    }
    setIsUpdating(false);
  };

  if (!token) {
    return (
      <div className="max-w-md mx-auto mt-24 p-8 academic-card shadow-2xl border-t-8 border-journal-navy">
        <h2 className="text-xl font-bold uppercase text-center mb-6 text-journal-navy tracking-tight">Editor Access Terminal</h2>
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <input required className="w-full border p-3 border-slate-300 text-sm focus:outline-journal-blue" placeholder="Editor ID" value={loginCreds.id} onChange={e => setLoginCreds({...loginCreds, id: e.target.value})} />
          <input required className="w-full border p-3 border-slate-300 text-sm focus:outline-journal-blue" type="password" placeholder="Passkey" value={loginCreds.pass} onChange={e => setLoginCreds({...loginCreds, pass: e.target.value})} />
          <button className="w-full bg-journal-navy text-white font-bold p-3 hover:bg-black transition-all uppercase text-xs tracking-widest">Authenticate & Connect</button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Main Terminal View */}
      <main className="flex-1 p-6 bg-white overflow-y-auto border-r border-slate-300">
        <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter flex items-center gap-3">
             <LayoutDashboard className="text-journal-blue" /> Editorial Worklist
          </h1>
          <button onClick={fetchSubmissions} className="text-[10px] font-bold bg-slate-100 border border-slate-200 px-3 py-1 hover:bg-slate-200 uppercase">Sync Server Data</button>
        </div>

        <div className="academic-card overflow-hidden">
          <table className="w-full text-[11px] text-left border-collapse">
            <thead className="bg-[#f8fafc] text-slate-500 uppercase text-[9px] font-black border-b">
              <tr>
                <th className="p-3">Paper ID</th>
                <th className="p-3">Author & Title</th>
                <th className="p-3">Status</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Assets</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map(sub => (
                <tr 
                  key={sub.id} 
                  onClick={() => setSelectedSub(sub)}
                  className={`border-b hover:bg-blue-50/50 cursor-pointer transition-colors ${selectedSub?.id === sub.id ? 'bg-blue-50 border-journal-blue/20' : ''}`}
                >
                  <td className="p-3 font-mono font-bold text-journal-blue">{sub.id}</td>
                  <td className="p-3">
                    <p className="font-bold text-slate-800">
                      {[sub.authors, ...(sub.teamMembers?.map(m => m.name).filter(Boolean) ?? [])].join(', ')}
                    </p>
                    <p className="text-[10px] text-slate-400 italic truncate w-64">"{sub.title}"</p>
                  </td>
                  <td className="p-3">
                    <span className="bg-slate-100 px-2 py-0.5 border border-slate-200 font-bold uppercase text-[9px]">
                      {sub.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className={`text-[9px] font-bold uppercase ${sub.paymentStatus === 'Paid' ? 'text-green-600' : 'text-red-500'}`}>
                       {sub.paymentStatus}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2 items-center">
                       {sub.pdfUrl && <FileText size={14} className="text-red-500" />}
                       {sub.certificateUrl && <CheckCircle size={14} className="text-green-500" />}
                       {sub.paymentScreenshotUrl && <span className="text-[8px] bg-blue-100 text-blue-700 font-bold px-1 py-0.5 rounded uppercase leading-none">Proof</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Editor Terminal Sidebar */}
      <aside className="w-[340px] bg-slate-50 p-4 shrink-0 border-l border-slate-200 overflow-y-auto">
        <div className="bg-journal-blue text-white p-3 rounded-t-md font-bold text-xs uppercase flex items-center justify-between tracking-widest">
           <span>Editor Terminal</span>
           <span className="bg-green-500 h-2 w-2 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
        </div>
        <div className="bg-white border border-slate-300 p-4 rounded-b-md shadow-sm space-y-6">
          {selectedSub ? (
            <>
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Active Manuscript</label>
                <div className="p-2 bg-blue-50 border border-blue-100 rounded-sm">
                  <p className="text-xs font-bold text-journal-blue">ID: {selectedSub.id}</p>
                  <p className="text-[10px] text-slate-600 font-medium truncate">{selectedSub.authors}</p>
                  <button onClick={() => setEditModal(selectedSub)} className="mt-2 text-[10px] bg-journal-blue text-white px-2 py-1 uppercase font-bold w-full hover:bg-journal-navy transition-colors">Edit Details & Files</button>
                  <button onClick={() => deletePaper(selectedSub.id)} className="mt-1 text-[10px] bg-red-50 text-red-600 border border-red-200 px-2 py-1 uppercase font-bold w-full hover:bg-red-100 transition-colors flex items-center justify-center gap-1"><Trash2 size={10} /> Delete Paper</button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-2 border-b border-slate-100 pb-1">Manual Email Triggers</label>
                <div className="grid grid-cols-1 gap-1.5">
                  <button onClick={() => openEmailModal('received', selectedSub)} className="text-left p-2 border border-slate-200 rounded text-[11px] hover:bg-slate-50 hover:border-slate-300 transition-colors group">
                    <div className="font-bold text-slate-700 flex items-center gap-2"><Mail size={12}/> 1. Submission Received</div>
                    <div className="text-[9px] text-slate-400 mt-0.5 ml-5">Under review notification</div>
                  </button>
                  <button onClick={() => openEmailModal('accepted', selectedSub)} className="text-left p-2 border border-orange-200 bg-orange-50/30 rounded text-[11px] hover:bg-orange-50 hover:border-orange-300 transition-colors group">
                    <div className="font-bold text-orange-700 flex items-center gap-2"><CheckCircle size={12}/> 2. Paper Accepted</div>
                    <div className="text-[9px] text-orange-400/80 mt-0.5 ml-5">Acceptance & Pay Link</div>
                  </button>
                  <button onClick={() => openEmailModal('payment', selectedSub)} className="text-left p-2 border border-emerald-200 bg-emerald-50/30 rounded text-[11px] hover:bg-emerald-50 hover:border-emerald-300 transition-colors group">
                    <div className="font-bold text-emerald-700 flex items-center gap-2"><CheckCircle size={12}/> 3. Payment Successful</div>
                    <div className="text-[9px] text-emerald-400/80 mt-0.5 ml-5">Processing notification</div>
                  </button>
                  <button onClick={() => openEmailModal('published', selectedSub)} className="text-left p-2 border border-blue-200 bg-blue-50/30 rounded text-[11px] hover:bg-blue-50 hover:border-blue-300 transition-colors group">
                    <div className="font-bold text-blue-700 flex items-center gap-2"><FileText size={12}/> 4. Paper Published</div>
                    <div className="text-[9px] text-blue-400/80 mt-0.5 ml-5">Certificates & Live Link</div>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-slate-300 italic text-[10px]">Select a submission to manage</div>
          )}
        </div>
      </aside>
      
      {/* Email Composer Modal */}
      {emailCompose && emailCompose.isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-journal-navy text-white p-4 flex justify-between items-center shrink-0">
              <h3 className="font-bold tracking-widest uppercase text-sm flex items-center gap-2">
                <Mail size={16} /> Edit Email Template
              </h3>
              <button onClick={() => setEmailCompose(null)} className="text-slate-300 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">To</label>
                <input 
                  type="email" 
                  className="w-full border border-slate-300 p-2 text-sm bg-slate-50 font-mono text-slate-700" 
                  value={emailCompose.to} 
                  disabled 
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Subject</label>
                <input 
                  type="text" 
                  className="w-full border border-slate-300 p-2 text-sm focus:outline-journal-blue focus:border-journal-blue font-bold text-slate-800" 
                  value={emailCompose.subject} 
                  onChange={e => setEmailCompose({...emailCompose, subject: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex justify-between">
                  <span>Body Message</span>
                  <span className="text-orange-500 normal-case tracking-normal">Modify placeholders in [Brackets]</span>
                </label>
                <textarea 
                  className="w-full border border-slate-300 p-3 text-sm focus:outline-journal-blue min-h-[300px] font-sans leading-relaxed text-slate-700"
                  value={emailCompose.body}
                  onChange={e => setEmailCompose({...emailCompose, body: e.target.value})}
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setEmailCompose(null)}
                className="px-4 py-2 border border-slate-300 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-colors"
                disabled={emailSending}
              >
                Cancel
              </button>
              <button 
                onClick={sendEmailFromModal}
                disabled={emailSending}
                className="px-6 py-2 bg-journal-blue text-white font-bold text-xs uppercase tracking-widest hover:bg-journal-navy transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {emailSending ? 'Sending...' : <><Send size={14} /> Send Email</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Manuscript Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-journal-navy text-white p-4 flex justify-between items-center shrink-0">
              <h3 className="font-bold tracking-widest uppercase text-sm flex items-center gap-2">
                <FileText size={16} /> Edit Manuscript: {editModal.id}
              </h3>
              <button onClick={() => setEditModal(null)} className="text-slate-300 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={saveEditedSub} className="flex-1 flex flex-col overflow-hidden">
              <div className="p-6 overflow-y-auto flex-1 space-y-4">

                {/* Stage Management — immediate save */}
                <div className="bg-slate-50 border border-slate-200 rounded p-3">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Stage Management</label>
                  <div className="flex gap-2">
                    <select
                      className="flex-1 border p-2 text-xs font-bold bg-white focus:outline-journal-blue"
                      value={editModal.status}
                      onChange={async e => {
                        const newStatus = e.target.value as Article['status'];
                        setEditModal({ ...editModal, status: newStatus });
                        await updateStatus(editModal.id, newStatus);
                      }}
                    >
                      <option>Received</option>
                      <option>Under Review</option>
                      <option>Accepted</option>
                      <option>Published</option>
                      <option>Rejected</option>
                    </select>
                    <button
                      type="button"
                      onClick={async () => {
                        const newPayment = editModal.paymentStatus === 'Paid' ? 'Pending' : 'Paid';
                        setEditModal({ ...editModal, paymentStatus: newPayment });
                        await updateStatus(editModal.id, editModal.status, newPayment);
                      }}
                      className={`text-[9px] px-3 border font-bold uppercase transition-all shrink-0 ${editModal.paymentStatus === 'Paid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-500 border-red-200'}`}
                    >
                      {editModal.paymentStatus === 'Paid' ? 'Revoke Payment' : 'Confirm Payment'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Title</label>
                    <input 
                      required type="text" 
                      className="w-full border border-slate-300 p-2 text-sm focus:outline-journal-blue text-slate-800" 
                      value={editModal.title} 
                      onChange={e => setEditModal({...editModal, title: e.target.value})}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Authors</label>
                    <input 
                      required type="text" 
                      className="w-full border border-slate-300 p-2 text-sm focus:outline-journal-blue text-slate-800" 
                      value={editModal.authors} 
                      onChange={e => setEditModal({...editModal, authors: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Email</label>
                    <input 
                      required type="email" 
                      className="w-full border border-slate-300 p-2 text-sm focus:outline-journal-blue text-slate-800" 
                      value={editModal.email} 
                      onChange={e => setEditModal({...editModal, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Field/Domain</label>
                    <input 
                      required type="text" 
                      className="w-full border border-slate-300 p-2 text-sm focus:outline-journal-blue text-slate-800" 
                      value={editModal.field} 
                      onChange={e => setEditModal({...editModal, field: e.target.value})}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Abstract</label>
                    <textarea 
                      required
                      className="w-full border border-slate-300 p-2 text-sm focus:outline-journal-blue text-slate-800 min-h-[100px]" 
                      value={editModal.abstract} 
                      onChange={e => setEditModal({...editModal, abstract: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Volume</label>
                    <input
                      type="number"
                      className="w-full border border-slate-300 p-2 text-sm focus:outline-journal-blue text-slate-800"
                      value={editModal.volume}
                      onChange={e => setEditModal({...editModal, volume: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Issue</label>
                    <input
                      type="number"
                      className="w-full border border-slate-300 p-2 text-sm focus:outline-journal-blue text-slate-800"
                      value={editModal.issue}
                      onChange={e => setEditModal({...editModal, issue: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Submission Date</label>
                    <input
                      type="text"
                      className="w-full border border-slate-300 p-2 text-sm focus:outline-journal-blue text-slate-800"
                      value={editModal.submissionDate}
                      onChange={e => setEditModal({...editModal, submissionDate: e.target.value})}
                    />
                  </div>

                  {/* File Uploads */}
                  <div className="col-span-2 mt-4 pt-4 border-t border-slate-200">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Manage Files</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border border-slate-200 p-3 bg-slate-50 rounded">
                        <p className="text-[10px] font-bold text-slate-600 mb-1">Manuscript PDF</p>
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            accept=".pdf"
                            className="text-[10px] w-full"
                            onChange={e => e.target.files?.[0] && uploadFileAndUpdate(editModal.id, e.target.files[0], 'pdfUrl')}
                          />
                        </div>
                        {editModal.pdfUrl && <a href={editModal.pdfUrl} target="_blank" rel="noreferrer" className="text-[9px] text-journal-blue hover:underline mt-1 inline-block">View Current PDF</a>}
                      </div>

                      <div className="border border-slate-200 p-3 bg-slate-50 rounded">
                        <p className="text-[10px] font-bold text-slate-600 mb-1">Author Certificate</p>
                        <p className="text-[9px] text-slate-400 mb-1">{editModal.authors}</p>
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          className="text-[10px] w-full"
                          onChange={e => e.target.files?.[0] && uploadFileAndUpdate(editModal.id, e.target.files[0], 'certificateUrl')}
                        />
                        {editModal.certificateUrl && <a href={editModal.certificateUrl} target="_blank" rel="noreferrer" className="text-[9px] text-green-600 hover:underline mt-1 inline-block font-bold">View Certificate</a>}
                      </div>
                      
                      <div className="border border-slate-200 p-3 bg-slate-50 rounded col-span-2">
                        <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
                          <p className="text-[10px] font-bold text-slate-600">Team Members</p>
                          <button
                            type="button"
                            onClick={() => setEditModal({ ...editModal, teamMembers: [...(editModal.teamMembers || []), { name: '' }] })}
                            className="flex items-center gap-1 text-[9px] font-bold text-journal-blue hover:text-journal-navy uppercase tracking-wide"
                          >
                            <Plus size={11} /> Add Member
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {editModal.teamMembers && editModal.teamMembers.length > 0 ? editModal.teamMembers.map((member, index) => (
                            <div key={index} className="border border-slate-200 p-2 bg-white rounded flex flex-col gap-1">
                              <div className="flex items-center gap-1">
                                <input
                                  type="text"
                                  className="flex-1 border border-slate-200 p-1.5 text-[10px] font-bold text-slate-700 focus:outline-journal-blue bg-slate-50"
                                  placeholder={`Member ${index + 1} Name`}
                                  value={member.name}
                                  onChange={e => {
                                    const updated = [...(editModal.teamMembers || [])];
                                    updated[index] = { ...updated[index], name: e.target.value };
                                    setEditModal({ ...editModal, teamMembers: updated });
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = (editModal.teamMembers || []).filter((_, i) => i !== index);
                                    setEditModal({ ...editModal, teamMembers: updated });
                                  }}
                                  className="text-red-400 hover:text-red-600 shrink-0"
                                  title="Remove member"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                               <input
                                  type="file"
                                  accept=".pdf,image/*"
                                  className="text-[9px] w-full mt-1"
                                  onChange={e => e.target.files?.[0] && uploadMemberCertificateAndUpdate(editModal.id, index, e.target.files[0])}
                                />
                                {member.certificateUrl && <a href={member.certificateUrl} target="_blank" rel="noreferrer" className="text-[9px] text-green-600 hover:underline mt-1 inline-block font-bold">View Certificate</a>}
                            </div>
                          )) : <p className="text-[10px] text-slate-400 italic py-2">No team members. Click &quot;Add Member&quot; to add one.</p>}
                        </div>
                      </div>

                      <div className="border border-slate-200 p-3 bg-slate-50 rounded col-span-2 md:col-span-1">
                        <p className="text-[10px] font-bold text-slate-600 mb-1">Payment Proof Screenshot</p>
                        <div className="flex items-center gap-2">
                          <input 
                            type="file" 
                            accept="image/*"
                            className="text-[10px] w-full"
                            onChange={e => e.target.files?.[0] && uploadFileAndUpdate(editModal.id, e.target.files[0], 'paymentScreenshotUrl')}
                          />
                        </div>
                        {editModal.paymentScreenshotUrl && <a href={editModal.paymentScreenshotUrl} target="_blank" rel="noreferrer" className="text-[9px] text-blue-600 hover:underline mt-1 inline-block">View Proof Screenshot</a>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center shrink-0">
                <button
                  type="button"
                  onClick={() => deletePaper(editModal.id)}
                  disabled={isUpdating}
                  className="px-4 py-2 bg-red-50 border border-red-200 text-red-600 font-bold text-xs uppercase tracking-widest hover:bg-red-100 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <AlertTriangle size={13} /> Delete Paper
                </button>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEditModal(null)}
                    className="px-4 py-2 border border-slate-300 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-colors"
                    disabled={isUpdating}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-6 py-2 bg-journal-blue text-white font-bold text-xs uppercase tracking-widest hover:bg-journal-navy transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
