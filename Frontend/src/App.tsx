import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { FloatingWhatsApp } from './components/FloatingWhatsApp.js';
import { GrainOverlay } from './components/GrainOverlay.js';
import { CinematicCursor } from './components/CinematicCursor.js';
import { useLenis } from './hooks/useLenis.js';

import { HomePage } from './pages/HomePage.js';
import { CoursesPage } from './pages/CoursesPage.js';
import { CourseDetailPage } from './pages/CourseDetailPage.js';
import { PlacementsPage } from './pages/PlacementsPage.js';
import { VerifyCertificatePage } from './pages/VerifyCertificatePage.js';
import { ProgrammePage } from './pages/ProgrammePage.js';
import { PlansPage } from './pages/PlansPage.js';
import { EnrolPage } from './pages/EnrolPage.js';
import { AboutContactPage } from './pages/AboutContactPage.js';
import { PoliciesPage } from './pages/PoliciesPage.js';
import { PaymentSuccessPage } from './pages/PaymentSuccessPage.js';
import { PaymentFailedPage } from './pages/PaymentFailedPage.js';
import { AdminRedirectPage } from './pages/AdminRedirectPage.js';
import { StudentPortalPage } from './pages/StudentPortalPage.js';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function GlobalEffects() {
  useLenis();
  return <CinematicCursor />;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          
          {/* Multi-Course Academy Routes */}
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:slug" element={<CourseDetailPage />} />
          <Route path="/placements" element={<PlacementsPage />} />
          <Route path="/verify-certificate" element={<VerifyCertificatePage />} />

          {/* Flagship Mobile Internship & Details */}
          <Route path="/programme" element={<ProgrammePage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/enrol" element={<EnrolPage />} />
          <Route path="/about" element={<AboutContactPage />} />
          
          {/* Required Razorpay Compliance Policy Pages */}
          <Route path="/terms" element={<PoliciesPage />} />
          <Route path="/privacy" element={<PoliciesPage />} />
          <Route path="/refund" element={<PoliciesPage />} />
          
          {/* Payment Outcomes */}
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/payment/failed" element={<PaymentFailedPage />} />
          
          {/* Student Learning Portal */}
          <Route path="/portal" element={<StudentPortalPage />} />
          <Route path="/student" element={<StudentPortalPage />} />
          <Route path="/student-portal" element={<StudentPortalPage />} />
          
          {/* Dedicated Staff Admin Web Portal */}
          <Route path="/admin" element={<AdminRedirectPage />} />
          
          {/* Fallback */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <GlobalEffects />
      <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#111111] font-body selection:bg-[#43C170]/30 selection:text-[#111111]">
        <GrainOverlay />
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="grow">
          <AnimatedRoutes />
        </main>

        {/* Global Floating WhatsApp Contact Widget */}
        <FloatingWhatsApp />

        {/* Footer */}
        <Footer />
        
      </div>
    </BrowserRouter>
  );
}
