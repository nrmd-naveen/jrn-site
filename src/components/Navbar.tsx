'use client';
import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const Navbar = ({ isAdmin = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex flex-col shrink-0">
      <header className="bg-journal-blue text-white p-4 flex justify-between items-center border-b-4 border-journal-accent">
        <div className="flex items-center gap-4">
          <img src="/papers/JIESURT_Logo.png" alt="JIESURT Logo" className="w-16 h-16 bg-white rounded-full object-cover border-2 border-white" />
          <div>
            <h1 className="text-2xl font-serif font-bold tracking-tight leading-tight">JIESURT</h1>
            <p className="text-[10px] opacity-90 uppercase tracking-widest font-semibold italic">International Journal of Innovative Engineering Science and Universal Research Trends</p>
            <p className="text-[9px] mt-1 opacity-80">Peer-Reviewed | Refereed | Open Access | ISSN: 2278-0183</p>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <div className="bg-journal-accent text-white px-3 py-1 rounded text-[10px] font-bold mb-2 inline-block">IMPACT FACTOR: 8.01 (SJIF)</div>
          <div className="flex gap-2 text-[10px] justify-end">
            <span className="bg-journal-navy px-2 py-1 border border-white/10 uppercase font-medium">Volume 12, Issue 05</span>
            <span className="bg-journal-navy px-2 py-1 border border-white/10 uppercase font-medium">May 2026</span>
          </div>
        </div>
      </header>

      <nav className="bg-journal-navy text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-0 flex items-center justify-between">
          <div className="flex items-center">
            <div className="hidden md:flex items-center">
              {!isAdmin ? (
                <>
                  <Link href="/" className="nav-link">Home</Link>
                  <Link href="/articles" className="nav-link">Current Issue</Link>
                  <Link href="/articles" className="nav-link">Archives</Link>
                  <Link href="/submit" className="nav-link bg-journal-accent hover:bg-orange-600">Submission</Link>
                  <Link href="/author-home" className="nav-link">Author Portal</Link>
                </>
              ) : (
                <>
                  <Link href="/admin" className="nav-link bg-journal-accent hover:bg-orange-600">Admin Dashboard</Link>
                  <button onClick={() => { localStorage.removeItem('adminToken'); window.location.href = '/'; }} className="nav-link bg-red-800 hover:bg-red-700">Logout</button>
                </>
              )}
            </div>
          </div>
          
          <div className="ml-auto pr-4 hidden md:flex items-center">
             <span className="text-[10px] text-orange-300 animate-pulse font-bold uppercase tracking-wider flex items-center gap-1">
               <span className="h-1.5 w-1.5 bg-orange-400 rounded-full"></span> 
               Call for Papers: May 2026
             </span>
          </div>

          <div className="md:hidden p-2">
            <button onClick={() => setIsOpen(!isOpen)} className="p-1">
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="md:hidden bg-journal-navy border-t border-white/10 overflow-hidden"
            >
               <div className="flex flex-col">
                  <Link href="/" className="p-3 border-b border-white/5 text-xs font-bold uppercase">Home</Link>
                  <Link href="/articles" className="p-3 border-b border-white/5 text-xs font-bold uppercase">Current Issue</Link>
                  <Link href="/submit" className="p-3 border-b border-white/5 text-xs font-bold uppercase bg-orange-600">Submission</Link>
                  <Link href="/author-home" className="p-3 border-b border-white/5 text-xs font-bold uppercase">Author Portal</Link>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
};

export default Navbar;
