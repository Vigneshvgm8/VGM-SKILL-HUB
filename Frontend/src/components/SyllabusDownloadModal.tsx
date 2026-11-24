import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Download, 
  CheckCircle2, 
  Sparkles, 
  Phone, 
  Mail, 
  User, 
  GraduationCap, 
  ShieldCheck,
  Building2,
  FileText
} from 'lucide-react';
import { COURSES_CATALOG } from '../config/coursesData.js';

interface SyllabusModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCourseSlug?: string;
}

export const SyllabusDownloadModal: React.FC<SyllabusModalProps> = ({
  isOpen,
  onClose,
  defaultCourseSlug = 'ai-mobile-app'
}) => {
  const [selectedCourse, setSelectedCourse] = useState(defaultCourseSlug);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [college, setCollege] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate saving lead and prepare download
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);

      // Auto trigger brochure download
      const link = document.createElement('a');
      link.href = '/assets/aistudio/AI-Powered_Mobile_App_Development_Internship_26822b03.pdf';
      link.download = `VGM_Skill_Hub_${selectedCourse}_2026_Syllabus.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white text-[#111111] rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.2)] border border-black/10 overflow-hidden"
        >
          {/* Header Banner */}
          <div className="bg-[#F7F8FA] p-6 sm:p-7 relative border-b border-black/5">
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-[#777777] hover:text-[#111111] rounded-full bg-black/5 hover:bg-black/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#1E9E54] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Syllabus &amp; Placement Report</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-heading font-black text-[#111111] tracking-tight">
              Download 2026 Curriculum Syllabus
            </h3>
            <p className="text-xs text-[#666666] mt-1 leading-relaxed">
              Get the complete module breakdown, live client projects list, and salary benchmark report.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#555555] mb-1.5">
                    Select Program / Track *
                  </label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F0F2F4] border border-black/10 rounded-xl text-xs sm:text-sm font-medium text-[#111111] focus:outline-none focus:border-[#1E9E54]"
                  >
                    {COURSES_CATALOG.map((c) => (
                      <option key={c.slug} value={c.slug} className="bg-white text-[#111111]">
                        {c.title} ({c.duration})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#555555] mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#888888] absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full pl-9 pr-3 py-2.5 bg-[#F0F2F4] border border-black/10 rounded-xl text-xs sm:text-sm text-[#111111] placeholder:text-[#888888] focus:outline-none focus:border-[#1E9E54]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#555555] mb-1.5">
                      Mobile Number (WhatsApp) *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#888888] absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        pattern="[0-9]{10}"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="10-digit mobile"
                        className="w-full pl-9 pr-3 py-2.5 bg-[#F0F2F4] border border-black/10 rounded-xl text-xs sm:text-sm text-[#111111] placeholder:text-[#888888] focus:outline-none focus:border-[#1E9E54]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#555555] mb-1.5">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#888888] absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@college.edu"
                        className="w-full pl-9 pr-3 py-2.5 bg-[#F0F2F4] border border-black/10 rounded-xl text-xs sm:text-sm text-[#111111] placeholder:text-[#888888] focus:outline-none focus:border-[#1E9E54]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#555555] mb-1.5">
                      College / Qualification
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-[#888888] absolute left-3 top-3" />
                      <input
                        type="text"
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        placeholder="College name or degree"
                        className="w-full pl-9 pr-3 py-2.5 bg-[#F0F2F4] border border-black/10 rounded-xl text-xs sm:text-sm text-[#111111] placeholder:text-[#888888] focus:outline-none focus:border-[#1E9E54]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 bg-[#111111] hover:bg-[#1E9E54] text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <span>Preparing Syllabus PDF...</span>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Download 2026 Syllabus &amp; Placement Report</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-center gap-4 text-[11px] font-mono text-[#888888] pt-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#1E9E54]" />
                    <span>No spam guarantee</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-[#1E9E54]" />
                    <span>Coimbatore Tech Campus</span>
                  </span>
                </div>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#1E9E54]/15 text-[#1E9E54] mx-auto flex items-center justify-center border border-[#1E9E54]/30 shadow-xs">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-heading font-black text-[#111111]">
                    Syllabus Download Initiated!
                  </h4>
                  <p className="text-xs sm:text-sm text-[#666666] max-w-sm mx-auto leading-relaxed">
                    Your PDF curriculum guide has started downloading. A copy has also been sent to your details ({phone || email}).
                  </p>
                </div>

                <div className="bg-[#F7F8FA] border border-black/5 rounded-2xl p-4 text-left text-xs space-y-2">
                  <p className="font-semibold text-[#111111] flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#1E9E54]" />
                    <span>Need a 1-on-1 career consultation?</span>
                  </p>
                  <p className="text-[#666666]">
                    Speak directly with a Senior Technical Lead at our Saibaba Colony center in Coimbatore to discuss batch timings, scholarships, and project allocation.
                  </p>
                  <a
                    href="https://wa.me/919345615913?text=Hi%20VGM%20Skill%20Hub,%20I%20just%20downloaded%20the%202026%20Syllabus%20and%20would%20like%20to%20schedule%20a%20free%20technical%20counseling%20session."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-bold text-[#1E9E54] hover:underline pt-1"
                  >
                    <span>Connect on WhatsApp (+91 9345615913) &rarr;</span>
                  </a>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 bg-[#111111] hover:bg-[#1E9E54] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
