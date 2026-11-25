import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard.js';

export default function App() {
  // Use '/' as basename when hosted at domain root (Hostinger subdomain or root)
  // Use '/adminweb' only when served under that subpath (local dev at /adminweb/)
  const basename = (typeof window !== 'undefined' && window.location.pathname.startsWith('/adminweb'))
    ? '/adminweb'
    : '/';

  return (
    <BrowserRouter basename={basename}>
      <div className="min-h-screen bg-[#F8F9FA] text-[#111111]">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<AdminDashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
