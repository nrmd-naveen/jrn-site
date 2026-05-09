'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { Upload, CheckCircle } from 'lucide-react';
import Image from 'next/image';

export default function PaymentClient({ paperId, currentStatus, currentScreenshot }: { paperId: string, currentStatus: string, currentScreenshot?: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState(currentScreenshot || null);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/api/admin/upload-file', formData);
      const url = res.data.path;
      await axios.post('/api/admin/update-status', { paperId, paymentScreenshotUrl: url });
      setScreenshotUrl(url);
      alert("Payment screenshot uploaded successfully. Our team will verify it shortly.");
    } catch (err) {
      alert("Failed to upload screenshot.");
    }
    setUploading(false);
  };

  if (currentStatus === 'Paid') {
    return (
      <div className="p-12 text-center bg-green-50 border border-green-200 rounded-lg shadow-inner">
        <CheckCircle className="mx-auto text-green-500 mb-6" size={64} />
        <h3 className="text-2xl font-black text-green-700 mb-3 uppercase tracking-wider">Payment Confirmed</h3>
        <p className="text-green-600 text-base font-medium">Your payment for this manuscript has been successfully verified. It is now proceeding to publication.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-10">
      <div className="flex flex-col">
        <h3 className="text-xl font-bold text-slate-800 mb-4 border-b-2 border-journal-blue pb-2 uppercase tracking-tight">1. Scan QR to Pay</h3>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed flex-1">
          Please complete the publication fee payment by scanning the securely generated QR code below. Ensure that you note down the transaction reference number from your banking application.
        </p>
        <div className="bg-slate-100 p-8 flex justify-center border border-slate-200 rounded-lg shadow-inner mt-auto">
          <Image src="/papers/payment_qr.png" alt="Payment QR Code" width={280} height={280} className="rounded-lg shadow-md hover:scale-105 transition-transform" />
        </div>
      </div>
      
      <div className="flex flex-col">
        <h3 className="text-xl font-bold text-slate-800 mb-4 border-b-2 border-journal-navy pb-2 uppercase tracking-tight">2. Upload Screenshot</h3>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          After completing the payment, please upload the clear payment confirmation screenshot below for verification. Our editorial team will review the transaction.
        </p>
        
        <div className="mt-auto">
          {screenshotUrl ? (
            <div className="bg-blue-50 p-8 border border-blue-200 rounded-lg text-center shadow-inner h-full flex flex-col justify-center">
               <CheckCircle className="mx-auto text-journal-blue mb-4" size={48} />
               <p className="font-black text-xl text-journal-navy mb-2 uppercase tracking-widest">Screenshot Uploaded</p>
               <p className="text-sm font-bold text-blue-600 mb-6">Pending verification by editorial team</p>
               <a href={screenshotUrl} target="_blank" rel="noreferrer" className="text-xs bg-white border border-blue-200 px-6 py-3 font-bold text-journal-blue hover:bg-journal-blue hover:text-white transition-colors inline-block rounded uppercase tracking-widest mx-auto">View Uploaded Image</a>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="border-2 border-dashed border-slate-300 p-10 text-center bg-slate-50 hover:bg-slate-100 transition-colors rounded-lg group">
                <input 
                  type="file" 
                  accept="image/*" 
                  id="screenshot-upload"
                  className="hidden" 
                  onChange={e => setFile(e.target.files?.[0] || null)}
                />
                <label htmlFor="screenshot-upload" className="cursor-pointer flex flex-col items-center">
                  <Upload className="text-slate-400 group-hover:text-journal-blue mb-4 transition-colors" size={48} />
                  <span className="text-base font-bold text-journal-blue">{file ? file.name : 'Click to browse image'}</span>
                  <span className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">Supports JPG, PNG</span>
                </label>
              </div>
              
              <button 
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-full bg-journal-navy text-white font-black py-4 px-6 uppercase tracking-widest text-sm hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded shadow-md"
              >
                {uploading ? 'Uploading securely...' : 'Submit Payment Proof'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
