import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CONTACT_INFO } from '../config/programData.js';
import { CinematicTextReveal } from '../components/CinematicTextReveal.js';
import { CinematicCard } from '../components/CinematicCard.js';
import { CinematicImageExpand } from '../components/CinematicImageExpand.js';
import { Phone, Mail, MapPin, MessageCircle, Clock, Send, CheckCircle2, Sparkles } from 'lucide-react';

const sectionAnim = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
};

export const AboutContactPage: React.FC = () => {
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    mobile: '',
    question: ''
  });

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] space-y-20 pt-28 sm:pt-32 md:pt-36 pb-16 md:pb-24 font-body">
      
      {/* 1. Header Section */}
      <motion.section
        {...sectionAnim}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1E9E54]/10 border border-[#1E9E54]/30 text-[#14723B] text-xs font-mono font-bold uppercase tracking-[0.2em]">
            <Sparkles className="w-3.5 h-3.5 text-[#1E9E54]" />
            <span>CAMPUS LOCATION &amp; INQUIRY DESK</span>
          </div>

          <CinematicTextReveal
            text="VGM Skill Hub · Coimbatore"
            tag="h1"
            className="text-4xl sm:text-6xl font-black text-[#111111] tracking-[-0.03em] leading-tight"
          />

          <p className="text-base sm:text-lg text-[#555555] leading-relaxed font-light">
            The specialized software training and internship wing of <strong className="text-[#111111] font-semibold">VGM Soft Tech</strong>. Located in Saibaba Colony, Coimbatore, we mentor upcoming developers in production software engineering and modern AI tooling.
          </p>
        </div>
      </motion.section>

      {/* 2. Main Details Grid */}
      <motion.section
        {...sectionAnim}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            <CinematicCard>
              <div className="space-y-6">
                <h2 className="font-heading font-black text-lg text-[#111111] border-b border-black/10 pb-3">
                  Direct Contact Information
                </h2>

                <div className="space-y-5 text-sm text-[#555555]">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#1E9E54]/10 text-[#1E9E54] flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-[#888888] block">
                        LOCATION &amp; LAB ADDRESS
                      </span>
                      <p className="font-semibold text-[#111111] mt-0.5">
                        VGM Soft Tech / VGM Skill Hub
                      </p>
                      <p className="text-[#555555] text-xs mt-0.5">
                        Saibaba Colony, Coimbatore, Tamil Nadu, 641011, India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#1E9E54]/10 text-[#1E9E54] flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-[#888888] block">
                        PHONE / ADMISSIONS DESK
                      </span>
                      <a
                        href={`tel:${CONTACT_INFO.phone}`}
                        className="font-semibold text-[#111111] hover:text-[#1E9E54] transition-colors mt-0.5 block"
                      >
                        {CONTACT_INFO.phone}
                      </a>
                      <p className="text-[11px] text-[#888888]">Available Mon–Sat, 9:00 AM – 6:30 PM IST</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#1E9E54]/10 text-[#1E9E54] flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-[#888888] block">
                        EMAIL INQUIRIES
                      </span>
                      <a
                        href={`mailto:${CONTACT_INFO.email}`}
                        className="font-semibold text-[#111111] hover:text-[#1E9E54] transition-colors mt-0.5 block"
                      >
                        {CONTACT_INFO.email}
                      </a>
                      <p className="text-[11px] text-[#888888]">Official inquiries, receipts &amp; college tie-ups</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center shrink-0">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-[#888888] block">
                        INSTANT WHATSAPP SUPPORT
                      </span>
                      <a
                        href={CONTACT_INFO.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-[#1E9E54] hover:underline mt-0.5 inline-block"
                      >
                        Open WhatsApp Chat (+91 9345615913) →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </CinematicCard>

            {/* About VGM Soft Tech Division */}
            <CinematicCard>
              <div className="text-xs text-[#555555] space-y-3">
                <h3 className="font-heading font-black uppercase tracking-[0.1em] text-[#111111] text-sm">
                  About the Organization
                </h3>
                <p className="leading-relaxed">
                  VGM Soft Tech delivers enterprise software, mobile applications, and AI integrations for regional and global clients. VGM Skill Hub was founded to bridge the gap between textbook university syllabi and modern, fast-paced industry engineering.
                </p>
                <p className="leading-relaxed">
                  Every intern at VGM Skill Hub is treated as a junior apprentice engineer — submitting pull requests, participating in sprint standups, and deploying tested features under lead developer review.
                </p>
              </div>
            </CinematicCard>

          </div>

          {/* Right Column: Google Map & Fast Inquiry Form */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Campus & Facility Photo Banner with Cinematic Image Expand */}
            <CinematicImageExpand
              src="/assets/hero_building.png"
              alt="VGM Soft Tech Campus Saibaba Colony Coimbatore"
              caption="Saibaba Colony, Coimbatore, Tamil Nadu, 641011 — VGM Soft Tech & Skill Hub Campus"
            />

            {/* Embedded Google Map */}
            <CinematicCard className="p-0 overflow-hidden">
              <div className="p-5 border-b border-black/10 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-[#111111] font-heading">
                    Campus &amp; Tech Hub Location
                  </h3>
                  <p className="text-xs text-[#888888]">Saibaba Colony, Coimbatore, Tamil Nadu</p>
                </div>
                <span className="text-[11px] font-mono bg-white border border-black/10 text-[#555555] px-3 py-1 rounded-full font-bold">
                  GPS: 11.028° N, 76.945° E
                </span>
              </div>
              <div className="relative w-full h-72 bg-[#F7F8FA]">
                <iframe
                  title="VGM Skill Hub Coimbatore Location"
                  className="w-full h-full border-0"
                  src="https://maps.google.com/maps?q=Saibaba+Colony+Coimbatore+Tamil+Nadu&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </CinematicCard>

            {/* Quick Inquiry Form */}
            <CinematicCard>
              <div className="space-y-4">
                <h3 className="font-heading font-black text-xl text-[#111111]">
                  Send an Admission Inquiry
                </h3>
                <p className="text-xs text-[#777777] font-light">
                  Have questions regarding batch timings, syllabus, group discounts, or college tie-ups? Our team will get back within 4 business hours.
                </p>

                {inquirySubmitted ? (
                  <div className="p-4 bg-[#1E9E54]/10 border border-[#1E9E54]/30 rounded-2xl text-xs text-[#1E9E54] flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#1E9E54] shrink-0" />
                    <div>
                      <strong className="block text-[#111111]">Thank you! Your message has been received.</strong>
                      <span className="text-[#555555]">An admissions mentor will reply to <strong className="text-[#111111]">{inquiryForm.email}</strong> shortly.</span>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitInquiry} className="space-y-3.5 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <input
                        type="text"
                        required
                        placeholder="Your Name *"
                        value={inquiryForm.name}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                        className="px-4 py-3 bg-white border border-black/10 rounded-xl text-xs text-[#111111] placeholder:text-[#888888] focus:border-[#1E9E54] focus:outline-none transition-colors"
                      />
                      <input
                        type="email"
                        required
                        placeholder="Your Email Address *"
                        value={inquiryForm.email}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                        className="px-4 py-3 bg-white border border-black/10 rounded-xl text-xs text-[#111111] placeholder:text-[#888888] focus:border-[#1E9E54] focus:outline-none transition-colors"
                      />
                    </div>

                    <input
                      type="tel"
                      placeholder="Mobile Number (Optional)"
                      value={inquiryForm.mobile}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, mobile: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-xs text-[#111111] placeholder:text-[#888888] focus:border-[#1E9E54] focus:outline-none transition-colors"
                    />

                    <textarea
                      rows={3}
                      required
                      placeholder="Your Question (e.g. Can I attend the weekend batch? Does this fulfill college internship requirements?) *"
                      value={inquiryForm.question}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, question: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-xs text-[#111111] placeholder:text-[#888888] focus:border-[#1E9E54] focus:outline-none transition-colors"
                    />

                    <button
                      type="submit"
                      className="px-8 py-3.5 bg-[#111111] hover:bg-[#1E9E54] text-white text-xs font-bold rounded-full transition-all flex items-center gap-2 uppercase tracking-wider shadow-md hover:scale-105 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Inquiry</span>
                    </button>
                  </form>
                )}
              </div>
            </CinematicCard>

          </div>

        </div>
      </motion.section>

    </div>
  );
};
