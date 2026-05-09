import React from "react";
import Link from "next/link";

const Footer = () => (
  <footer className="bg-slate-200 p-4 text-center text-[10px] text-slate-600 border-t border-slate-300 mt-auto">
    <div className="max-w-7xl mx-auto">
      Copyright © 2026 JIESURT - International Journal of Innovative Engineering Science and Universal Research Trends. 
      <span className="mx-2 text-slate-300">|</span> 
      Powered by JIESURT Editorial Suite 
      <span className="mx-2 text-slate-300">|</span> 
      <span className="text-slate-500">Disclaimer</span>
      <span className="mx-2 text-slate-300">|</span> 
      <Link href="/admin" className="text-blue-700 hover:underline font-bold">Editor Login</Link>
    </div>
  </footer>
);

export default Footer;
