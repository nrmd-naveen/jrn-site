import { getSubmissions } from '@/lib/db';
import { notFound } from 'next/navigation';
import PaymentClient from './PaymentClient';

export default async function PayPage({ params }: { params: Promise<{ paperId: string }> }) {
  const { paperId } = await params;
  const submissions = await getSubmissions();
  const paper = submissions.find((s: any) => s.id === paperId);

  if (!paper) {
    return notFound();
  }

  return (
    <div className="max-w-4xl mx-auto my-12 p-6 bg-white shadow-xl border-t-8 border-journal-navy mt-24">
      <h1 className="text-3xl font-black text-journal-navy uppercase tracking-tighter mb-6">Publication Payment</h1>
      
      <div className="bg-slate-50 p-6 border border-slate-200 mb-8 rounded shadow-sm">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3 border-b border-slate-200 pb-2">Manuscript Details</h2>
        <p className="text-2xl font-bold text-journal-blue mb-2 leading-tight">{paper.title}</p>
        <p className="text-sm text-slate-600 mb-4 font-medium">Authors: <span className="text-slate-800">{paper.authors}</span></p>
        <div className="flex gap-4">
          <span className="text-xs bg-slate-200 px-3 py-1.5 uppercase font-bold text-slate-700 tracking-wider">ID: {paper.id}</span>
          <span className="text-xs bg-blue-100 px-3 py-1.5 uppercase font-bold text-blue-700 tracking-wider">Status: {paper.status}</span>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded p-5 mb-8 shadow-sm">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 border-b border-amber-200 pb-2">Fee Breakdown</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600 font-medium">Publication Fee <span className="text-xs text-slate-400">(incl. GST)</span></span>
            <span className="font-bold text-slate-800">₹1,850</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600 font-medium">Payment Processing Fee</span>
            <span className="font-bold text-slate-800">₹149</span>
          </div>
          <div className="flex justify-between border-t border-amber-300 pt-3 mt-3">
            <span className="font-black text-slate-800 uppercase tracking-wide">Total Payable</span>
            <span className="font-black text-journal-navy text-base">₹1,999</span>
          </div>
        </div>
      </div>

      <PaymentClient paperId={paper.id} currentStatus={paper.paymentStatus} currentScreenshot={paper.paymentScreenshotUrl} />
    </div>
  );
}
