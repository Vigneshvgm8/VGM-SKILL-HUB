import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  FileText, 
  ExternalLink, 
  Download, 
  User, 
  Calendar, 
  Clock, 
  Laptop, 
  Github, 
  Award, 
  MessageSquare, 
  ShieldCheck, 
  ArrowRight,
  Send,
  AlertCircle,
  Video,
  Sparkles,
  Search,
  Printer,
  Copy,
  Check,
  QrCode,
  Layers,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

interface StudentDetails {
  fullName: string;
  email: string;
  mobile: string;
  dob?: string;
  city?: string;
  college?: string;
  degreeStream?: string;
  yearOfStudy?: string;
  languages?: string[];
  referralSource?: string;
}

interface EnrolmentItem {
  id: string;
  enrollmentNumber?: string;
  courseId?: string;
  courseTitle?: string;
  planId: string;
  planName: string;
  batchId: string;
  batchLabel: string;
  student: StudentDetails;
  pricing: {
    baseAmount: number;
    discountAmount: number;
    couponCode: string | null;
    finalAmount: number;
    currency: string;
  };
  payment: {
    status: 'paid' | 'pending' | 'failed';
    orderId: string;
    paymentId?: string;
    paidAt?: string;
  };
  completedWeeks?: number[];
  projectSubmission?: {
    githubUrl: string;
    liveUrl?: string;
    notes?: string;
    submittedAt: string;
    status: 'submitted' | 'under_review' | 'approved' | 'rework_needed';
    score?: number;
    reviewerFeedback?: string;
    reviewedBy?: string;
    reviewedAt?: string;
  };
  createdAt: string;
}

interface CertificateItem {
  id: string;
  enrolmentId?: string;
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  planLevel: string;
  completionDate: string;
  grade: string;
  projectTitle: string;
  skills: string[];
  authorizedSignatory: string;
  verificationStatus: 'verified' | 'revoked';
  createdAt: string;
}

export const StudentPortalPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('enrolmentId') || searchParams.get('id') || '';

  // Search / Lookup state
  const [enrollmentInput, setEnrollmentInput] = useState<string>(initialQuery || '');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  // Student Data state (Loaded strictly from Live Database)
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [masterEnrollmentNumber, setMasterEnrollmentNumber] = useState<string>('');
  const [studentProfile, setStudentProfile] = useState<StudentDetails | null>(null);
  const [enrolments, setEnrolments] = useState<EnrolmentItem[]>([]);
  const [selectedEnrolmentIndex, setSelectedEnrolmentIndex] = useState<number>(0);
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [selectedCertIndex, setSelectedCertIndex] = useState<number>(0);
  const [course, setCourse] = useState<any | null>(null);

  // Navigation state
  const [activeTab, setActiveTab] = useState<'certificate' | 'courses' | 'project' | 'receipts' | 'helpdesk'>('certificate');

  // Project Submission Form
  const [githubUrl, setGithubUrl] = useState<string>('');
  const [liveUrl, setLiveUrl] = useState<string>('');
  const [projectNotes, setProjectNotes] = useState<string>('');
  const [isSubmittingProject, setIsSubmittingProject] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);

  // UI helpers
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const activeEnrolment = enrolments[selectedEnrolmentIndex] || enrolments[0] || null;
  const activeCertificate = certificates[selectedCertIndex] || certificates[0] || null;

  // Auto-verify on mount if param present
  useEffect(() => {
    const q = initialQuery || sessionStorage.getItem('vgm_student_enr') || '';
    if (q) {
      setEnrollmentInput(q);
      verifyStudentByEnrollment(q);
    }
  }, [initialQuery]);

  const verifyStudentByEnrollment = async (query: string) => {
    const clean = query.trim().toUpperCase();
    if (!clean) return;

    setIsVerifying(true);
    setVerifyError(null);

    try {
      // 1. Fetch live student and course data directly from live database API
      const res = await fetch(`/api/student/details/${encodeURIComponent(clean)}`);
      const data = await res.json();

      if (res.ok && data.success) {
        const studentEnrolments: EnrolmentItem[] = data.enrolments || (data.enrolment ? [data.enrolment] : []);
        setEnrolments(studentEnrolments);
        setSelectedEnrolmentIndex(0);

        const enrNum = data.enrollmentNumber || studentEnrolments[0]?.enrollmentNumber || studentEnrolments[0]?.id || clean;
        setMasterEnrollmentNumber(enrNum);
        setStudentProfile(data.student || studentEnrolments[0]?.student || null);
        setCourse(data.course || null);

        // Populate project submission form if exists in database
        const sub = studentEnrolments[0]?.projectSubmission;
        if (sub) {
          setGithubUrl(sub.githubUrl || '');
          setLiveUrl(sub.liveUrl || '');
          setProjectNotes(sub.notes || '');
        }

        // Fetch or assign live certificates
        let certList: CertificateItem[] = data.certificates || [];
        if (certList.length === 0) {
          const cRes = await fetch(`/api/certificates/${encodeURIComponent(enrNum)}`);
          if (cRes.ok) {
            const cData = await cRes.json();
            if (cData.certificates && cData.certificates.length > 0) {
              certList = cData.certificates;
            } else if (cData.certificate) {
              certList = [cData.certificate];
            }
          }
        }

        setCertificates(certList);
        setSelectedCertIndex(0);
        setIsLoaded(true);
        sessionStorage.setItem('vgm_student_enr', enrNum);
        setSearchParams({ enrolmentId: enrNum }, { replace: true });

        // Set active tab to certificate if verified cert exists, else courses
        if (certList.length > 0) {
          setActiveTab('certificate');
        } else {
          setActiveTab('courses');
        }
      } else {
        // Fallback: try certificate endpoint directly
        const certRes = await fetch(`/api/certificates/${encodeURIComponent(clean)}`);
        if (certRes.ok) {
          const cData = await certRes.json();
          if (cData.success && (cData.certificate || (cData.certificates && cData.certificates.length > 0))) {
            const certList = cData.certificates || [cData.certificate];
            setCertificates(certList);
            setSelectedCertIndex(0);
            setMasterEnrollmentNumber(certList[0]?.enrolmentId || clean);
            setStudentProfile(cData.student || {
              fullName: certList[0]?.studentName || '',
              email: certList[0]?.studentEmail || '',
              mobile: '',
              college: '',
              degreeStream: '',
              yearOfStudy: '',
              city: '',
              languages: []
            });
            setIsLoaded(true);
            setActiveTab('certificate');
            return;
          }
        }
        setVerifyError(data.error || 'No student or certificate record found with this Enrollment Number. Please check your admission confirmation.');
      }
    } catch (err: any) {
      setVerifyError('Network error connecting to live credential registry. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyStudentByEnrollment(enrollmentInput);
  };

  const handleResetSearch = () => {
    setIsLoaded(false);
    setEnrolments([]);
    setCertificates([]);
    setStudentProfile(null);
    setMasterEnrollmentNumber('');
    setEnrollmentInput('');
    sessionStorage.removeItem('vgm_student_enr');
    setSearchParams({}, { replace: true });
  };

  // Switch between courses for this student and fetch course curriculum
  const handleSelectEnrolment = (idx: number) => {
    setSelectedEnrolmentIndex(idx);
    const sel = enrolments[idx];
    if (sel && sel.courseId) {
      fetch(`/api/courses/${sel.courseId}`)
        .then(r => r.json())
        .then(d => {
          if (d.course) setCourse(d.course);
        })
        .catch(() => {});
    }
  };

  // Toggle Module Progress
  const toggleWeekCompletion = async (weekNumber: number) => {
    if (!activeEnrolment) return;
    const currentCompleted = activeEnrolment.completedWeeks || [];
    const newCompleted = currentCompleted.includes(weekNumber)
      ? currentCompleted.filter(w => w !== weekNumber)
      : [...currentCompleted, weekNumber];

    try {
      const res = await fetch('/api/student/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrolmentId: activeEnrolment.id,
          completedWeeks: newCompleted
        })
      });
      const data = await res.json();
      if (data.success && data.enrolment) {
        setEnrolments(prev => prev.map((e, idx) => idx === selectedEnrolmentIndex ? { ...e, completedWeeks: newCompleted } : e));
      }
    } catch (e) {
      console.error('Error updating progress:', e);
    }
  };

  // Submit Capstone Project
  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEnrolment || !githubUrl.trim()) return;

    setIsSubmittingProject(true);
    setSubmissionSuccess(false);

    try {
      const res = await fetch('/api/student/submit-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrolmentId: activeEnrolment.id,
          githubUrl: githubUrl.trim(),
          liveUrl: liveUrl.trim(),
          notes: projectNotes.trim()
        })
      });
      const data = await res.json();
      if (data.success && data.enrolment) {
        setEnrolments(prev => prev.map((e, idx) => idx === selectedEnrolmentIndex ? { ...e, projectSubmission: data.enrolment.projectSubmission } : e));
        setSubmissionSuccess(true);
      }
    } catch (e) {
      console.error('Error submitting project:', e);
    } finally {
      setIsSubmittingProject(false);
    }
  };

  const handleCopyVerificationUrl = () => {
    const certId = activeCertificate?.id || activeEnrolment?.id || masterEnrollmentNumber;
    const url = `${window.location.origin}/verify-certificate?id=${certId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const totalWeeks = course?.durationWeeks || (course?.curriculum ? course.curriculum.length : 8);
  const completedWeeksCount = (activeEnrolment?.completedWeeks || []).length;
  const progressPercent = totalWeeks > 0 ? Math.min(100, Math.round((completedWeeksCount / totalWeeks) * 100)) : 0;

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#111111] pb-24 font-body">

      {/* ── TOP SEARCH & VERIFICATION HERO ── */}
      <section className="bg-gradient-to-b from-[#F7F8FA] via-[#F0F7F3] to-[#FFFFFF] border-b border-black/10 pt-36 sm:pt-40 md:pt-44 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

          <div className="text-center space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1E9E54]/10 border border-[#1E9E54]/30 text-[#1E9E54] text-xs font-bold uppercase tracking-wider shadow-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Official Student Credential &amp; Certificate Registry</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-black text-[#111111] tracking-tight">
              Verify Certificate with Enrollment Number
            </h1>
            <p className="text-xs sm:text-sm text-[#555555] max-w-2xl mx-auto font-light leading-relaxed">
              Every VGM Skill Hub student receives a unique lifetime <strong className="text-[#111111] font-semibold">Enrollment Number</strong> when registering. If you take multiple courses with the same Name, Email, and Mobile, all your courses and certificates remain unified under that same number.
            </p>
          </div>

          {/* Search Box */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-black/10 shadow-lg max-w-2xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative grow">
                <Search className="w-5 h-5 text-[#999999] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={enrollmentInput}
                  onChange={(e) => setEnrollmentInput(e.target.value.toUpperCase())}
                  placeholder="Enter Enrollment Number (e.g. VGM-2026-0005)"
                  className="w-full pl-11 pr-4 py-3 text-sm font-mono uppercase rounded-xl bg-[#F0F2F4] border border-black/10 text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#1E9E54] focus:ring-2 focus:ring-[#1E9E54]/20 transition-all font-semibold"
                />
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="px-6 py-3 bg-[#111111] hover:bg-[#1E9E54] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(30,158,84,0.35)] flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
              >
                {isVerifying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4" />
                    <span>Verify Certificate</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-3.5 pt-3 border-t border-black/10 flex items-center justify-between text-xs text-[#777777]">
              <span>Real-time authenticated records directly from VGM Skill Hub live database.</span>
              <span className="font-mono text-[11px] text-[#1E9E54] font-semibold">Live Database Verified</span>
            </div>

            {verifyError && (
              <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{verifyError}</span>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* ── MAIN PORTAL BODY (WHEN VERIFIED) ── */}
      {isLoaded && studentProfile && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">

          {/* 1. Student Identity Verified Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-black/10 p-6 sm:p-8 shadow-sm space-y-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-black/10">
              
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 text-[#1E9E54] font-heading font-black text-2xl flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(30,158,84,0.2)]">
                  {studentProfile.fullName ? studentProfile.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'ST'}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="text-2xl font-heading font-black text-[#111111]">
                      {studentProfile.fullName}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#1E9E54] text-white uppercase tracking-wider flex items-center gap-1 shadow-xs">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Live DB Verified</span>
                    </span>
                  </div>

                  {(studentProfile.college || studentProfile.degreeStream) && (
                    <p className="text-xs text-[#555555]">
                      {studentProfile.college}{studentProfile.college && studentProfile.degreeStream ? ' · ' : ''}{studentProfile.degreeStream}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#1E9E54] font-mono pt-0.5">
                    <span className="bg-[#1E9E54]/10 px-2 py-0.5 rounded-md font-bold">
                      Enrollment #: {masterEnrollmentNumber}
                    </span>
                    {studentProfile.email && (
                      <>
                        <span>·</span>
                        <span>{studentProfile.email}</span>
                      </>
                    )}
                    {studentProfile.mobile && (
                      <>
                        <span>·</span>
                        <span>{studentProfile.mobile}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions & Course count */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="px-3.5 py-2 bg-[#F0F2F4] rounded-xl text-center border border-black/10">
                  <span className="text-[10px] uppercase font-bold text-[#777777] block">Courses Enrolled</span>
                  <span className="text-lg font-heading font-black text-[#111111]">{enrolments.length || 1}</span>
                </div>

                <div className="px-3.5 py-2 bg-[#1E9E54]/10 rounded-xl text-center border border-[#1E9E54]/30">
                  <span className="text-[10px] uppercase font-bold text-[#1E9E54] block">Certificates</span>
                  <span className="text-lg font-heading font-black text-[#1E9E54]">{certificates.length}</span>
                </div>

                <button
                  type="button"
                  onClick={handleResetSearch}
                  className="px-3.5 py-2.5 bg-[#F0F2F4] hover:bg-[#E2E8F0] border border-black/10 text-[#444444] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Switch Student</span>
                </button>
              </div>

            </div>

            {/* Course Selector Strip if student has multiple courses registered under this Enrollment Number */}
            {enrolments.length > 1 && (
              <div className="bg-[#F0F7F3] p-4 rounded-2xl border border-[#1E9E54]/20 space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1E9E54] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Courses Enrolled under Master Enrollment #{masterEnrollmentNumber}:</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {enrolments.map((enr, idx) => (
                    <button
                      key={enr.id}
                      type="button"
                      onClick={() => handleSelectEnrolment(idx)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                        selectedEnrolmentIndex === idx
                          ? 'bg-[#111111] text-white shadow-xs font-bold'
                          : 'bg-white text-[#444444] hover:bg-[#E2E8F0] border border-black/10'
                      }`}
                    >
                      <span>{enr.courseTitle || `Course ${idx + 1}`}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md uppercase font-mono ${
                        enr.payment.status === 'paid' ? 'bg-[#1E9E54]/20 text-[#1E9E54]' : 'bg-black/10 text-[#666666]'
                      }`}>
                        {enr.payment.status}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-black/10 overflow-x-auto pb-2 scrollbar-thin">
              {[
                { id: 'certificate', label: 'Verified Certificate', icon: Award, badge: certificates.length > 0 ? `${certificates.length}` : 'Pending' },
                { id: 'courses', label: 'Curriculum & Progress', icon: BookOpen },
                { id: 'project', label: 'Capstone Project & Code Review', icon: Github },
                { id: 'receipts', label: 'Fee Receipt & Admission Record', icon: FileText },
                { id: 'helpdesk', label: 'Mentor Helpdesk & Physical Lab', icon: MessageSquare }
              ].map(tab => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                      active
                        ? 'bg-[#111111] text-white shadow-[0_0_15px_rgba(30,158,84,0.3)] font-bold'
                        : 'text-[#555555] hover:bg-black/[0.05] hover:text-[#111111]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                        active ? 'bg-[#1E9E54] text-white' : 'bg-black/10 text-[#666666]'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

          </motion.div>

          {/* ── TAB 1: OFFICIAL VERIFIED CERTIFICATE ── */}
          {activeTab === 'certificate' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {certificates.length > 0 && activeCertificate ? (
                <div className="space-y-6">

                  {/* Certificate Selector if multiple */}
                  {certificates.length > 1 && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#555555] font-semibold">Select Certificate:</span>
                      {certificates.map((c, idx) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setSelectedCertIndex(idx)}
                          className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                            selectedCertIndex === idx
                              ? 'bg-[#1E9E54] text-white font-bold'
                              : 'bg-[#F0F2F4] text-[#333333] hover:bg-[#E2E8F0]'
                          }`}
                        >
                          {c.id} ({c.courseTitle.split(' ')[0]})
                        </button>
                      ))}
                    </div>
                  )}

                  {/* High-Fidelity Verifiable Certificate Card */}
                  <div
                    id="official-certificate-container"
                    className="relative bg-gradient-to-b from-[#FCFDFD] via-white to-[#F8FAF9] rounded-3xl border-4 border-[#1E9E54]/30 p-8 sm:p-12 shadow-2xl space-y-8 overflow-hidden"
                  >
                    {/* Background Guilloche Watermark Pattern */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#1E9E54_1px,transparent_1px)] [background-size:16px_16px]" />

                    {/* Top Ribbon & Seal */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-black/10 pb-6 text-center sm:text-left">
                      <div className="space-y-1">
                        <div className="flex items-center justify-center sm:justify-start gap-2">
                          <span className="font-heading font-black text-2xl text-[#1E9E54] tracking-wider">VGM</span>
                          <span className="font-heading font-black text-2xl text-[#111111] tracking-wider">SKILL HUB</span>
                        </div>
                        <p className="text-xs font-mono uppercase tracking-widest text-[#777777]">
                          Industrial Software Engineering &amp; AI Academy · VGM Soft Tech
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="px-3.5 py-1.5 rounded-full bg-[#1E9E54]/10 border border-[#1E9E54]/30 text-[#1E9E54] font-mono text-xs font-bold uppercase flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4" />
                          <span>Official Verified Credential</span>
                        </div>
                      </div>
                    </div>

                    {/* Certificate Body */}
                    <div className="text-center space-y-4 max-w-3xl mx-auto py-4">
                      <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#888888] block">
                        CERTIFICATE OF INDUSTRIAL EXCELLENCE &amp; COMPLETION
                      </span>

                      <p className="text-xs sm:text-sm text-[#555555] font-light italic">
                        This tamper-evident academic credential is proudly awarded to
                      </p>

                      <h3 className="text-3xl sm:text-4xl font-heading font-black text-[#111111] tracking-tight">
                        {activeCertificate.studentName || studentProfile.fullName}
                      </h3>

                      <p className="text-xs font-mono text-[#1E9E54] font-bold">
                        Enrollment Number: {activeCertificate.enrolmentId || masterEnrollmentNumber}
                      </p>

                      <div className="max-w-2xl mx-auto text-xs sm:text-sm text-[#444444] leading-relaxed pt-2">
                        For successfully completing the comprehensive professional internship in{' '}
                        <strong className="text-[#111111] font-bold underline decoration-[#1E9E54] decoration-2">
                          {activeCertificate.courseTitle}
                        </strong>{' '}
                        under the <strong className="text-[#111111]">{activeCertificate.planLevel}</strong>
                        {activeCertificate.grade ? (
                          <>
                            {', achieving a grade of '}
                            <strong className="text-[#1E9E54] font-bold">{activeCertificate.grade}</strong>.
                          </>
                        ) : '.'}
                      </div>

                      {/* Capstone Project Highlight */}
                      {activeCertificate.projectTitle && (
                        <div className="p-4 bg-[#F0F7F3] rounded-2xl border border-[#1E9E54]/20 max-w-xl mx-auto space-y-1">
                          <span className="text-[10px] font-mono uppercase font-bold text-[#1E9E54] block">
                            Production Capstone Project Audited
                          </span>
                          <p className="text-xs font-semibold text-[#111111]">
                            {activeCertificate.projectTitle}
                          </p>
                        </div>
                      )}

                      {/* Skills Badges */}
                      {activeCertificate.skills && activeCertificate.skills.length > 0 && (
                        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
                          {activeCertificate.skills.map((skill, sIdx) => (
                            <span key={sIdx} className="px-2.5 py-1 rounded-lg bg-black/[0.05] border border-black/10 text-[11px] font-mono text-[#333333]">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Certificate Footer: Seal, Signatures & QR */}
                    <div className="border-t-2 border-black/10 pt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center text-center sm:text-left">
                      
                      {/* Left: Issue Date & Cert ID */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase text-[#888888] block">Date of Conferment</span>
                        <p className="text-xs font-bold text-[#111111]">{activeCertificate.completionDate}</p>
                        <span className="text-[11px] font-mono text-[#1E9E54] block font-semibold">
                          ID: {activeCertificate.id}
                        </span>
                      </div>

                      {/* Middle: Official Authorized Seal */}
                      <div className="text-center flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#1E9E54] bg-[#1E9E54]/10 flex flex-col items-center justify-center p-2 text-center shadow-inner">
                          <Award className="w-6 h-6 text-[#1E9E54]" />
                          <span className="text-[7px] font-black uppercase tracking-tighter text-[#1E9E54] mt-0.5">VGM SOFT TECH</span>
                        </div>
                        <span className="text-[9px] font-mono uppercase text-[#777777] mt-1 font-bold">DIGITALLY CERTIFIED</span>
                      </div>

                      {/* Right: Authorized Signatory */}
                      <div className="sm:text-right space-y-1">
                        <div className="font-serif italic text-base text-[#111111] font-bold">
                          Academic Board of Directors
                        </div>
                        <p className="text-xs text-[#555555] font-light">
                          {activeCertificate.authorizedSignatory}
                        </p>
                      </div>

                    </div>

                  </div>

                  {/* Certificate Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#F0F2F4] rounded-2xl border border-black/10">
                    <div className="flex items-center gap-2 text-xs text-[#555555]">
                      <ShieldCheck className="w-4 h-4 text-[#1E9E54]" />
                      <span>Tamper-evident verification link active for prospective employers &amp; colleges.</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-4 py-2 bg-white hover:bg-black hover:text-white border border-black/10 text-[#111111] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print / Save PDF</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCopyVerificationUrl}
                        className="px-4 py-2 bg-white hover:bg-black hover:text-white border border-black/10 text-[#111111] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5 text-[#1E9E54]" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedLink ? 'Link Copied!' : 'Copy Verification Link'}</span>
                      </button>

                      <Link
                        to={`/verify-certificate?id=${activeCertificate.id}`}
                        className="px-4 py-2 bg-[#1E9E54] hover:bg-[#14723B] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(30,158,84,0.3)]"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Public Registry Page</span>
                      </Link>
                    </div>
                  </div>

                </div>
              ) : (
                /* In Progress State if certificate not yet issued */
                <div className="bg-white rounded-3xl border border-black/10 p-10 shadow-sm text-center space-y-5">
                  <div className="w-16 h-16 rounded-2xl bg-[#FFC83D]/15 text-[#B45309] border border-[#FFC83D]/30 flex items-center justify-center mx-auto shadow-md">
                    <Award className="w-8 h-8 text-[#B45309]" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-heading font-black text-[#111111]">
                      Course in Progress ({progressPercent}% Completed)
                    </h3>
                    <p className="text-xs sm:text-sm text-[#555555] max-w-md mx-auto font-light leading-relaxed">
                      Your certificate will be automatically minted and published here once you complete the sprint modules and pass your capstone project evaluation.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('courses')}
                    className="px-6 py-2.5 bg-[#1E9E54] hover:bg-[#14723B] text-white font-bold rounded-xl text-xs inline-flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>View Syllabus Modules</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* ── TAB 2: CURRICULUM ROADMAP & PROGRESS ── */}
          {activeTab === 'courses' && activeEnrolment && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Progress Summary Card */}
              <div className="bg-white rounded-3xl border border-black/10 p-6 sm:p-8 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#1E9E54]">
                      {activeEnrolment.courseTitle || 'Industrial Internship'} · {activeEnrolment.planName}
                    </span>
                    <h3 className="text-xl font-heading font-black text-[#111111]">
                      Weekly Sprints &amp; Practical Milestones
                    </h3>
                    <p className="text-xs text-[#555555] font-light">
                      Check off completed modules after finishing the daily code assignment and mentor review.
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-3xl font-heading font-black text-[#1E9E54]">
                      {completedWeeksCount} / {totalWeeks}
                    </span>
                    <span className="text-xs text-[#777777] block font-mono">Weeks Completed</span>
                  </div>
                </div>

                <div className="w-full bg-[#F0F2F4] border border-black/10 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-[#1E9E54] h-full rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(30,158,84,0.5)]"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Weekly Modules List from Database */}
              <div className="space-y-3">
                {course?.curriculum && course.curriculum.length > 0 ? (
                  course.curriculum.map((mod: any, idx: number) => {
                    const weekNum = idx + 1;
                    const isDone = (activeEnrolment.completedWeeks || []).includes(weekNum);

                    return (
                      <div
                        key={idx}
                        className={`rounded-2xl border p-5 transition-all shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                          isDone ? 'border-[#1E9E54]/40 bg-[#1E9E54]/5' : 'border-black/10 bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          <button
                            type="button"
                            onClick={() => toggleWeekCompletion(weekNum)}
                            className="mt-0.5 text-black/20 hover:text-[#1E9E54] transition-colors cursor-pointer"
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-6 h-6 text-[#1E9E54] fill-[#1E9E54]/20" />
                            ) : (
                              <Circle className="w-6 h-6 text-black/20" />
                            )}
                          </button>
                          <div>
                            <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-[#1E9E54] uppercase">
                              <span>Module {mod.moduleNumber || weekNum}</span>
                              <span className="text-black/20">·</span>
                              <span className="text-[#555555]">{mod.duration || `Week ${weekNum}`}</span>
                            </div>
                            <h4 className="text-base font-heading font-bold text-[#111111] mt-0.5">
                              {mod.title}
                            </h4>
                            <p className="text-xs text-[#555555] mt-1 line-clamp-2 max-w-2xl font-light">
                              {mod.description}
                            </p>
                            {mod.topics && mod.topics.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {mod.topics.map((t: string, tidx: number) => (
                                  <span key={tidx} className="bg-black/[0.05] text-[#444444] border border-black/10 text-[10px] font-mono px-2 py-0.5 rounded-md">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-mono uppercase text-[10px] font-bold ${
                            isDone ? 'bg-[#1E9E54]/20 text-[#1E9E54] border border-[#1E9E54]/40' : 'bg-black/[0.05] text-[#555555] border border-black/10'
                          }`}>
                            {isDone ? 'Completed' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  Array.from({ length: totalWeeks }).map((_, idx) => {
                    const weekNum = idx + 1;
                    const isDone = (activeEnrolment.completedWeeks || []).includes(weekNum);
                    return (
                      <div
                        key={idx}
                        className={`rounded-2xl border p-5 flex items-center justify-between ${
                          isDone ? 'border-[#1E9E54]/40 bg-[#1E9E54]/5' : 'border-black/10 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => toggleWeekCompletion(weekNum)}
                            className="cursor-pointer"
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-5 h-5 text-[#1E9E54]" />
                            ) : (
                              <Circle className="w-5 h-5 text-black/20" />
                            )}
                          </button>
                          <div>
                            <h4 className="text-sm font-bold text-[#111111]">Sprint Week {weekNum} Deliverables</h4>
                            <p className="text-xs text-[#555555]">Live code sprints, mentor review &amp; pull requests</p>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#777777]">{isDone ? 'Completed' : 'Pending'}</span>
                      </div>
                    );
                  })
                )}
              </div>

            </motion.div>
          )}

          {/* ── TAB 3: CAPSTONE PROJECT & REVIEWS ── */}
          {activeTab === 'project' && activeEnrolment && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              <div className="lg:col-span-7 bg-white rounded-3xl border border-black/10 p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <h3 className="text-xl font-heading font-black text-[#111111]">
                    Submit Capstone Project for Evaluation
                  </h3>
                  <p className="text-xs sm:text-sm text-[#555555] mt-1 font-light leading-relaxed">
                    Provide your public GitHub repository URL for senior staff code audit. Ensure your repository has a comprehensive README, clean commit history, and test instructions.
                  </p>
                </div>

                {submissionSuccess && (
                  <div className="p-4 bg-[#1E9E54]/10 border border-[#1E9E54]/30 rounded-2xl flex items-center gap-3 text-[#1E9E54] text-xs sm:text-sm font-medium">
                    <CheckCircle2 className="w-5 h-5 text-[#1E9E54] shrink-0" />
                    <span>Project submitted successfully! Senior engineers will review and schedule your feedback call.</span>
                  </div>
                )}

                <form onSubmit={handleSubmitProject} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#555555] mb-1.5">
                      GitHub Repository URL *
                    </label>
                    <div className="relative">
                      <Github className="w-4 h-4 text-[#AAAAAA] absolute left-3.5 top-3" />
                      <input
                        type="url"
                        required
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        placeholder="https://github.com/yourusername/vgm-capstone-project"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-black/10 bg-[#F0F2F4] text-xs sm:text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#1E9E54]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#555555] mb-1.5">
                      Live Deployment URL (Vercel / Play Store / Netlify / Render)
                    </label>
                    <input
                      type="url"
                      value={liveUrl}
                      onChange={(e) => setLiveUrl(e.target.value)}
                      placeholder="https://your-live-app.vercel.app or demo link"
                      className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-[#F0F2F4] text-xs sm:text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#1E9E54]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#555555] mb-1.5">
                      Implementation Notes / Architecture Highlights
                    </label>
                    <textarea
                      rows={4}
                      value={projectNotes}
                      onChange={(e) => setProjectNotes(e.target.value)}
                      placeholder="Mention the key architecture decisions, APIs integrated, test coverage, and any AI features built..."
                      className="w-full p-4 rounded-xl border border-black/10 bg-[#F0F2F4] text-xs sm:text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#1E9E54]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingProject}
                    className="px-6 py-3 bg-[#1E9E54] hover:bg-[#14723B] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(30,158,84,0.35)] flex items-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmittingProject ? 'Submitting Code...' : 'Submit for Senior Review'}</span>
                  </button>
                </form>
              </div>

              {/* Status Box from Live Database */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white rounded-3xl border border-black/10 p-6 shadow-sm space-y-4">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#777777]">
                    Current Review Status
                  </span>

                  {activeEnrolment.projectSubmission ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#555555]">Status:</span>
                        <span className={`px-2.5 py-1 rounded-full font-mono font-bold text-[10px] uppercase ${
                          activeEnrolment.projectSubmission.status === 'approved'
                            ? 'bg-[#1E9E54]/20 text-[#1E9E54] border border-[#1E9E54]/40'
                            : 'bg-[#FFC83D]/15 text-[#B45309] border border-[#FFC83D]/30'
                        }`}>
                          {activeEnrolment.projectSubmission.status.replace('_', ' ')}
                        </span>
                      </div>

                      {activeEnrolment.projectSubmission.score !== undefined && (
                        <div className="flex items-center justify-between border-t border-black/10 pt-2 text-xs">
                          <span className="text-[#555555]">Evaluation Score:</span>
                          <span className="font-heading font-black text-lg text-[#1E9E54]">
                            {activeEnrolment.projectSubmission.score} / 100
                          </span>
                        </div>
                      )}

                      {activeEnrolment.projectSubmission.reviewerFeedback && (
                        <div className="p-3.5 bg-[#F0F2F4] rounded-xl border border-black/10 space-y-1 text-xs">
                          <span className="font-bold text-[#111111] block">Reviewer Feedback:</span>
                          <p className="text-[#555555] font-light italic">
                            "{activeEnrolment.projectSubmission.reviewerFeedback}"
                          </p>
                          {activeEnrolment.projectSubmission.reviewedBy && (
                            <span className="text-[10px] text-[#777777] block font-mono pt-1">
                              Audited by: {activeEnrolment.projectSubmission.reviewedBy}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="text-xs text-[#444444] space-y-1 bg-[#F0F2F4] p-3.5 rounded-xl border border-black/10 font-mono">
                        <p className="text-[#1E9E54] break-all">{activeEnrolment.projectSubmission.githubUrl}</p>
                        {activeEnrolment.projectSubmission.liveUrl && (
                          <p className="text-[#555555] break-all">{activeEnrolment.projectSubmission.liveUrl}</p>
                        )}
                        <p className="text-[11px] text-[#AAAAAA] pt-1">
                          Submitted on: {new Date(activeEnrolment.projectSubmission.submittedAt).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 space-y-2">
                      <Laptop className="w-10 h-10 text-black/20 mx-auto" />
                      <p className="text-xs text-[#555555] font-light">
                        No project repository submitted yet. Submit your repo using the form to trigger certificate evaluation.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── TAB 4: FEE RECEIPTS & INVOICES ── */}
          {activeTab === 'receipts' && activeEnrolment && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl space-y-6"
            >
              <div className="bg-white rounded-3xl border border-black/10 p-6 sm:p-8 shadow-sm space-y-6">
                
                <div className="flex items-center justify-between border-b border-black/10 pb-4">
                  <div>
                    <h3 className="text-lg font-heading font-black text-[#111111]">
                      Official Fee Invoice &amp; Payment Record
                    </h3>
                    <p className="text-xs text-[#555555]">
                      Verified through Razorpay merchant gateway for VGM Soft Tech.
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase ${
                    activeEnrolment.payment.status === 'paid'
                      ? 'bg-[#1E9E54]/10 text-[#1E9E54] border border-[#1E9E54]/30'
                      : 'bg-[#FFC83D]/15 text-[#B45309] border border-[#FFC83D]/30'
                  }`}>
                    {activeEnrolment.payment.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#777777] block">Enrollment Number:</span>
                    <span className="font-mono font-bold text-[#111111]">{masterEnrollmentNumber}</span>
                  </div>
                  <div>
                    <span className="text-[#777777] block">Course Enrolment ID:</span>
                    <span className="font-mono text-[#444444]">{activeEnrolment.id}</span>
                  </div>
                  <div>
                    <span className="text-[#777777] block">Razorpay Order ID:</span>
                    <span className="font-mono text-[#444444]">{activeEnrolment.payment.orderId}</span>
                  </div>
                  {activeEnrolment.payment.paymentId && (
                    <div>
                      <span className="text-[#777777] block">Payment ID:</span>
                      <span className="font-mono text-[#444444]">{activeEnrolment.payment.paymentId}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-[#777777] block">Student Name:</span>
                    <span className="font-bold text-[#111111]">{studentProfile.fullName}</span>
                  </div>
                  {activeEnrolment.payment.paidAt && (
                    <div>
                      <span className="text-[#777777] block">Paid Date:</span>
                      <span className="text-[#444444]">{new Date(activeEnrolment.payment.paidAt).toLocaleDateString('en-IN')}</span>
                    </div>
                  )}
                </div>

                <div className="bg-[#F0F2F4] rounded-2xl p-4 border border-black/10 space-y-2 text-xs">
                  <div className="flex justify-between text-[#555555]">
                    <span>Course Fee ({activeEnrolment.planName}):</span>
                    <span className="font-mono text-[#111111]">₹{activeEnrolment.pricing.baseAmount.toLocaleString('en-IN')}</span>
                  </div>
                  {activeEnrolment.pricing.discountAmount > 0 && (
                    <div className="flex justify-between text-[#1E9E54] font-medium">
                      <span>Applied Discount ({activeEnrolment.pricing.couponCode || 'Promo'}):</span>
                      <span className="font-mono">-₹{activeEnrolment.pricing.discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#111111] font-bold border-t border-black/10 pt-2 text-sm">
                    <span>Net Amount:</span>
                    <span className="font-mono text-[#1E9E54] text-lg">₹{activeEnrolment.pricing.finalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-[11px] text-[#777777]">
                    Official GST Registered Tax Receipt · Division of VGM Soft Tech, Coimbatore
                  </span>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-black text-white hover:bg-[#1E9E54] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Print Receipt</span>
                  </button>
                </div>

              </div>
            </motion.div>
          )}

          {/* ── TAB 5: MENTOR HELPDESK & LAB ── */}
          {activeTab === 'helpdesk' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl bg-white rounded-3xl border border-black/10 p-8 shadow-sm space-y-6"
            >
              <div>
                <h3 className="text-xl font-heading font-black text-[#111111]">
                  Mentor Support &amp; Technical Helpdesk
                </h3>
                <p className="text-xs sm:text-sm text-[#555555] mt-1 leading-relaxed font-light">
                  Connect with our senior engineering team directly for technical doubt clearing, code audits, or architecture advice.
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-[#444444]">
                <div className="p-4 bg-[#1E9E54]/10 rounded-2xl border border-[#1E9E54]/30 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#111111] block">Batch WhatsApp Community</span>
                    <span className="text-[#555555] text-xs">Direct channel with batch peers &amp; mentors</span>
                  </div>
                  <a
                    href="https://wa.me/919345615913?text=Hi%20Mentor,%20I%20am%20an%20active%20student%20at%20VGM%20Skill%20Hub"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#1E9E54] hover:bg-[#14723B] text-white font-bold rounded-xl text-xs shrink-0 transition-all shadow-[0_0_15px_rgba(30,158,84,0.3)]"
                  >
                    Join WhatsApp
                  </a>
                </div>

                <div className="p-4 bg-[#F0F2F4] rounded-2xl border border-black/10 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#111111] block">Schedule 1-on-1 Code Review</span>
                    <span className="text-[#555555] text-xs">30-minute private debug session with Staff Engineer</span>
                  </div>
                  <a
                    href="mailto:intern@vgmsofttech.com?subject=Schedule%201-on-1%20Code%20Review"
                    className="px-4 py-2 bg-white hover:bg-black hover:text-white text-[#111111] font-semibold rounded-xl text-xs shrink-0 transition-colors border border-black/10"
                  >
                    Request Slot
                  </a>
                </div>

                <div className="p-4 border border-black/10 bg-[#F0F2F4] rounded-2xl space-y-1">
                  <span className="font-bold text-[#111111] block">Coimbatore Physical Lab Hours</span>
                  <p className="text-xs text-[#555555]">
                    Saibaba Colony Campus: Monday – Saturday (9:00 AM – 6:30 PM IST). Bring your laptop for in-person pair programming.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      )}

    </div>
  );
};
