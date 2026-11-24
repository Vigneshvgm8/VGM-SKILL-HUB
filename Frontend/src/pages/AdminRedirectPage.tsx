import React from 'react';
import { Shield, ArrowRight } from 'lucide-react';
import { ADMIN_PORTAL_URL, API_BASE_URL } from '../config/api.js';

// --- LOCALHOST CONFIGURATION (Commented out for live production) ---
// const adminUrl = 'http://localhost:3001';
// const apiUrl = 'http://localhost:3000/api';

// --- LIVE PRODUCTION CONFIGURATION (Active) ---
const adminUrl = ADMIN_PORTAL_URL;
const apiUrl = `${API_BASE_URL}/api`;

export const AdminRedirectPage: React.FC = () => {

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 pt-28 sm:pt-32 md:pt-36 pb-16 bg-[#F8F9FA]">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-black/10 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#1E9E54]/10 border border-[#1E9E54]/20 flex items-center justify-center mx-auto text-[#1E9E54]">
          <Shield className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#1E9E54]">
            Dedicated Admin Portal
          </span>
          <h1 className="text-2xl font-heading font-black text-[#111111]">
            VGM Skill Hub Adminweb
          </h1>
          <p className="text-xs text-[#666666] leading-relaxed">
            The Staff, Academic, and Course Administration Console has moved to its dedicated standalone application: <strong className="text-[#111111]">VGM-Skill-Hub/Adminweb</strong>.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-black/[0.03] border border-black/5 text-left text-xs space-y-1.5 font-mono">
          <div className="flex items-center justify-between text-[#888888]">
            <span>Architecture:</span>
            <span className="text-[#111111] font-bold">Individual Webapp</span>
          </div>
          <div className="flex items-center justify-between text-[#888888]">
            <span>Admin URL:</span>
            <span className="text-[#1E9E54] font-bold">{adminUrl}</span>
          </div>
          <div className="flex items-center justify-between text-[#888888]">
            <span>API Server:</span>
            <span className="text-[#111111] font-bold">{apiUrl}</span>
          </div>
        </div>

        <div className="pt-2">
          <a
            href={adminUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#111111] hover:bg-[#1E9E54] text-white font-heading font-bold text-sm rounded-xl transition-all shadow-md group cursor-pointer"
          >
            <span>Launch Adminweb Console</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminRedirectPage;
