import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { CinematicTextReveal } from '../components/CinematicTextReveal.js';
import { LusionCrosshairRow, LusionMaskLine, LusionMagnetic, LUSION_EASE } from '../components/LusionMotionPrimitives.js';
import { getApiUrl } from '../config/api.js';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  Calendar,
  User,
  BookOpen,
  ExternalLink,
  Share2,
  Printer,
  AlertCircle,
  XCircle,
  Loader2
} from 'lucide-react';

interface VerifiedCert {
  id: string;
  enrolmentId?: string;
  studentName: string;
  studentEmail?: string;
  courseTitle: string;
  planLevel: string;
  completionDate: string;
  grade: string;
  projectTitle: string;
  skills: string[];
  authorizedSignatory: string;
  verificationStatus: 'verified' | 'revoked';
}

const SAMPLE_IDS = [
  'VGM-2026-0005',
  'VGM-2026-CERT-0107',
  'VGM-2026-0001',
  'VGM-2026-CERT-0104',
  'VGM-2026-CERT-0105'
];

export const VerifyCertificatePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryId = searchParams.get('id') || 'VGM-2026-CERT-0104';

  const [certInput, setCertInput] = useState<string>(queryId);
  const [searchedCert, setSearchedCert] = useState<VerifiedCert | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const fetchCertificate = async (id: string) => {
    const cleanId = id.trim().toUpperCase();
    if (!cleanId) return;

    setIsLoading(true);
    setNotFound(false);

    try {
      const res = await fetch(getApiUrl(`/api/certificates/${encodeURIComponent(cleanId)}`));
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.certificate) {
          setSearchedCert(data.certificate);
          setNotFound(false);
          setSearchParams({ id: cleanId }, { replace: true });
          setIsLoading(false);
          return;
        }
      }
      setSearchedCert(null);
      setNotFound(true);
    } catch (err) {
      setSearchedCert(null);
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (queryId) {
      setCertInput(queryId);
      fetchCertificate(queryId);
    }
  }, [queryId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCertificate(certInput);
  };

  const loadSample = (sampleId: string) => {
    setCertInput(sampleId);
    fetchCertificate(sampleId);
  };

  const handleShare = () => {
    const url = `${window.location.origin}/verify-certificate?id=${searchedCert?.id || certInput}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] pt-36 sm:pt-40 md:pt-44 pb-16 md:pb-20 font-body">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E9E54]/10 border border-[#1E9E54]/20 text-[#1E9E54] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Credential Registry</span>
          </div>
          <CinematicTextReveal
            text="Verify Student Certificate & Credentials"
            tag="h1"
            className="text-3xl sm:text-4xl font-heading font-black text-[#111111] tracking-tight justify-center"
          />
          <LusionMaskLine delay={0.1}>
            <p className="text-sm sm:text-base text-[#555555] max-w-xl mx-auto font-light">
              Employers, universities, and verification agencies can authenticate VGM Skill Hub internship credentials directly from our tamper-evident registry.
            </p>
          </LusionMaskLine>
          <LusionCrosshairRow count={4} label="TAMPER-EVIDENT LEDGER" className="pt-4" />
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-[#F7F8FA] rounded-2xl border border-black/10 p-6 space-y-4"
        >
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative grow">
              <Search className="w-5 h-5 text-[#999999] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={certInput}
                onChange={(e) => setCertInput(e.target.value)}
                placeholder="Enter Certificate ID or Enrollment Number (e.g. VGM-2026-0005 or VGM-2026-CERT-0107)"
                className="w-full pl-11 pr-4 py-3 text-sm font-mono uppercase rounded-xl bg-white border border-black/10 text-[#111111] placeholder:text-[#999999] focus:border-[#1E9E54] focus:outline-none focus:ring-1 focus:ring-[#1E9E54]"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-[#111111] hover:bg-[#1E9E54] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shrink-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Now</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Sample Links */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#777777] pt-1">
            <span>Try sample credentials:</span>
            {SAMPLE_IDS.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => loadSample(id)}
                className="text-[#14723B] font-mono hover:underline font-semibold bg-[#1E9E54]/10 px-2 py-0.5 rounded border border-[#1E9E54]/20 transition-colors cursor-pointer"
              >
                {id}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Not Found Result */}
        {notFound && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center space-y-2"
          >
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
            <h3 className="font-heading font-bold text-[#111111] text-base">Certificate Not Found</h3>
            <p className="text-xs sm:text-sm text-[#555555] max-w-md mx-auto">
              No record matches identifier <strong className="text-[#111111]">"{certInput}"</strong>. Please verify the code printed on the bottom of the certificate or contact the academic verification registry at <strong className="text-[#1E9E54]">intern@vgmsofttech.com</strong>.
            </p>
          </motion.div>
        )}

        {/* Certificate Display */}
        {searchedCert && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl border-2 border-[#1E9E54] shadow-[0_10px_40px_rgba(30,158,84,0.12)] overflow-hidden relative"
          >
            {/* Top Verification Ribbon */}
            <div className={`px-6 py-3 flex items-center justify-between text-xs font-semibold ${searchedCert.verificationStatus === 'revoked'
                ? 'bg-red-500/10 border-b border-red-500/30 text-red-600'
                : 'bg-[#1E9E54]/10 border-b border-[#1E9E54]/30 text-[#14723B]'
              }`}>
              <div className="flex items-center gap-2">
                {searchedCert.verificationStatus === 'revoked' ? (
                  <>
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span>CREDENTIAL STATUS: REVOKED BY ISSUING AUTHORITY</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#1E9E54]" />
                    <span>OFFICIALLY VERIFIED CREDENTIAL</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold">ID: {searchedCert.id}</span>
              </div>
            </div>

            {/* Certificate Body */}
            <div className="p-8 sm:p-12 space-y-8">

              <div className="text-center space-y-2 border-b border-black/10 pb-6">
                <div className="text-xs font-bold text-[#1E9E54] uppercase tracking-widest font-mono">
                  VGM SKILL HUB · TRAINING &amp; INTERNSHIP DIVISION
                </div>
                <div className="text-xs text-[#888888] font-medium">
                  VGM Soft Tech · Saibaba Colony, Coimbatore, Tamil Nadu, India
                </div>
                <h2 className="text-2xl sm:text-3xl font-heading font-black text-[#111111] pt-2 tracking-tight">
                  Certificate of Professional Achievement
                </h2>
                <p className="text-xs text-[#777777] italic font-serif">
                  This certifies that
                </p>
                <div className="text-3xl sm:text-4xl font-heading font-black text-[#1E9E54] tracking-tight">
                  {searchedCert.studentName}
                </div>
                <p className="text-xs text-[#555555] max-w-xl mx-auto pt-2 leading-relaxed">
                  has successfully completed the intensive practical curriculum and live production engineering sprint for
                </p>
                <div className="text-lg sm:text-xl font-heading font-bold text-[#111111] pt-1">
                  {searchedCert.courseTitle}
                </div>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <span className="inline-block px-3 py-1 bg-[#1E9E54]/10 text-[#14723B] font-semibold text-xs rounded-full border border-[#1E9E54]/20 font-mono">
                    {searchedCert.planLevel}
                  </span>
                  <span className="inline-block px-3 py-1 bg-black/5 text-[#111111] font-semibold text-xs rounded-full border border-black/10 font-mono">
                    {searchedCert.grade}
                  </span>
                </div>
              </div>

              {/* Capstone & Skills Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#F7F8FA] rounded-2xl p-6 border border-black/10 text-xs text-[#555555]">
                <div className="space-y-1">
                  <span className="font-bold text-[#111111] block uppercase tracking-wider text-[11px] font-mono">
                    Verified Capstone Project:
                  </span>
                  <p className="font-semibold text-[#111111] text-sm">{searchedCert.projectTitle}</p>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-[#111111] block uppercase tracking-wider text-[11px] font-mono">
                    Completion / Issue Date:
                  </span>
                  <p className="font-medium text-[#111111]">{searchedCert.completionDate}</p>
                </div>

                <div className="sm:col-span-2 space-y-2">
                  <span className="font-bold text-[#111111] block uppercase tracking-wider text-[11px] font-mono">
                    Competencies &amp; Technologies Assessed:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {searchedCert.skills?.map((s, idx) => (
                      <span key={idx} className="bg-white border border-black/10 px-2.5 py-1 rounded-md font-mono text-[11px] text-[#333333] shadow-xs">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Signatures & Seal */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-black/10">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full border-2 border-[#1E9E54] flex items-center justify-center text-[#1E9E54] font-heading font-black text-[10px] text-center p-1 uppercase shadow-xs">
                    VGM SEAL
                  </div>
                  <div className="text-left text-xs">
                    <span className="font-bold text-[#111111] block">Digitally Authenticated Registry</span>
                    <span className="text-[#888888] font-mono text-[11px]">Tamper-Evident Ledger Entry</span>
                  </div>
                </div>

                <div className="text-center sm:text-right text-xs">
                  <div className="font-serif italic text-base text-[#111111] font-bold">Authorized Signatory</div>
                  <span className="text-[#666666]">{searchedCert.authorizedSignatory}</span>
                </div>
              </div>

              {/* Action Buttons: Share & Print */}
              <div className="pt-4 flex flex-wrap items-center justify-end gap-3 border-t border-black/10">
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black/5 hover:bg-black/10 text-xs font-mono font-semibold text-[#111111] transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copied ? 'Link Copied!' : 'Copy Verification Link'}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111111] hover:bg-[#1E9E54] text-xs font-mono font-semibold text-white transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Certificate</span>
                </button>
              </div>

            </div>

          </motion.div>
        )}

      </div>
    </div>
  );
};

export default VerifyCertificatePage;
