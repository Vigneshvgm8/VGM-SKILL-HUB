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
  LogOut, 
  Lock, 
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
  Sparkles
} from 'lucide-react';

interface EnrolmentData {
  id: string;
  courseId?: string;
  courseTitle?: string;
  planId: string;
  planName: string;
  batchId: string;
  batchLabel: string;
  student: {
    fullName: string;
    email: string;
    mobile: string;
    dob?: string;
    city: string;
    college: string;
    degreeStream: string;
    yearOfStudy: string;
    languages: string[];
  };
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
    status: 'submitted' | 'under_review' | 'approved';
  };
}

export const StudentPortalPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialEnrolmentId = searchParams.get('enrolmentId') || '';

  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [enrolmentIdInput, setEnrolmentIdInput] = useState<string>(initialEnrolmentId || 'VGM-2026-0001');
  const [credentialInput, setCredentialInput] = useState<string>('kavitha.r@psgtech.ac.in');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Student & Course Data
  const [student, setStudent] = useState<EnrolmentData | null>(null);
  const [course, setCourse] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'roadmap' | 'projects' | 'payments' | 'certificate' | 'mentor'>('roadmap');

  // Submission Form State
  const [githubUrl, setGithubUrl] = useState<string>('');
  const [liveUrl, setLiveUrl] = useState<string>('');
  const [projectNotes, setProjectNotes] = useState<string>('');
  const [isSubmittingProject, setIsSubmittingProject] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);

  // Try auto-login if student ID is stored in sessionStorage
  useEffect(() => {
    const savedId = sessionStorage.getItem('vgm_student_id');
    const savedCred = sessionStorage.getItem('vgm_student_cred');
    if (savedId && savedCred) {
      performLogin(savedId, savedCred);
    } else if (initialEnrolmentId) {
      // auto-fetch if passed directly
      fetch(`/api/student/details/${initialEnrolmentId}`)
        .then(r => r.json())
        .then(d => {
          if (d.success && d.enrolment) {
            setStudent(d.enrolment);
            setCourse(d.course);
            setIsLoggedIn(true);
            if (d.enrolment.projectSubmission) {
              setGithubUrl(d.enrolment.projectSubmission.githubUrl || '');
              setLiveUrl(d.enrolment.projectSubmission.liveUrl || '');
              setProjectNotes(d.enrolment.projectSubmission.notes || '');
            }
          }
        })
        .catch(() => {});
    }
  }, [initialEnrolmentId]);

  const performLogin = async (id: string, cred: string) => {
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/student/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrolmentId: id, credential: cred })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStudent(data.enrolment);
        setCourse(data.course);
        setIsLoggedIn(true);
        sessionStorage.setItem('vgm_student_id', id);
        sessionStorage.setItem('vgm_student_cred', cred);
        if (data.enrolment.projectSubmission) {
          setGithubUrl(data.enrolment.projectSubmission.githubUrl || '');
          setLiveUrl(data.enrolment.projectSubmission.liveUrl || '');
          setProjectNotes(data.enrolment.projectSubmission.notes || '');
        }
      } else {
        setLoginError(data.error || 'Invalid credentials.');
      }
    } catch (e) {
      setLoginError('Network error logging into student portal.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performLogin(enrolmentIdInput, credentialInput);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setStudent(null);
    setCourse(null);
    sessionStorage.removeItem('vgm_student_id');
    sessionStorage.removeItem('vgm_student_cred');
  };

  // Toggle Module Progress
  const toggleWeekCompletion = async (weekNumber: number) => {
    if (!student) return;
    const currentCompleted = student.completedWeeks || [];
    const newCompleted = currentCompleted.includes(weekNumber)
      ? currentCompleted.filter(w => w !== weekNumber)
      : [...currentCompleted, weekNumber];

    try {
      const res = await fetch('/api/student/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrolmentId: student.id,
          completedWeeks: newCompleted
        })
      });
      const data = await res.json();
      if (data.success && data.enrolment) {
        setStudent(data.enrolment);
      }
    } catch (e) {
      console.error('Error updating progress:', e);
    }
  };

  // Submit Capstone Project
  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student || !githubUrl.trim()) return;

    setIsSubmittingProject(true);
    setSubmissionSuccess(false);

    try {
      const res = await fetch('/api/student/submit-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrolmentId: student.id,
          githubUrl: githubUrl.trim(),
          liveUrl: liveUrl.trim(),
          notes: projectNotes.trim()
        })
      });
      const data = await res.json();
      if (data.success && data.enrolment) {
        setStudent(data.enrolment);
        setSubmissionSuccess(true);
      }
    } catch (e) {
      console.error('Error submitting project:', e);
    } finally {
      setIsSubmittingProject(false);
    }
  };

  // Quick Demo Login Helper
  const loadDemoStudent = () => {
    setEnrolmentIdInput('VGM-2026-0001');
    setCredentialInput('kavitha.r@psgtech.ac.in');
    performLogin('VGM-2026-0001', 'kavitha.r@psgtech.ac.in');
  };

  // If not logged in, render Student Login Screen
  if (!isLoggedIn || !student) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center text-[#111111]">
        <div className="w-full max-w-md space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#1E9E54]/15 text-[#1E9E54] flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(30,158,84,0.3)] border border-[#1E9E54]/30">
              <GraduationCap className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#111111] tracking-tight">
              Student Learning Portal
            </h1>
            <p className="text-xs sm:text-sm text-[#555555] leading-relaxed font-light">
              Access your enrolled internship curriculum, live classes, project submissions, and verifiable credentials.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-black/10 shadow-2xl space-y-5">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#555555] mb-1.5">
                  Enrolment ID *
                </label>
                <input
                  type="text"
                  required
                  value={enrolmentIdInput}
                  onChange={(e) => setEnrolmentIdInput(e.target.value.toUpperCase())}
                  placeholder="e.g. VGM-2026-0001"
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-[#F0F2F4] font-mono text-sm uppercase text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#1E9E54]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#555555] mb-1.5">
                  Registered Email or Mobile *
                </label>
                <input
                  type="text"
                  required
                  value={credentialInput}
                  onChange={(e) => setCredentialInput(e.target.value)}
                  placeholder="e.g. student@psgtech.ac.in or 9876543210"
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-[#F0F2F4] text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#1E9E54]"
                />
              </div>

              {loginError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3.5 bg-[#111111] hover:bg-[#1E9E54] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(30,158,84,0.35)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isLoggingIn ? 'Verifying Student...' : 'Access My Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Button for effortless testing */}
            <div className="border-t border-black/10 pt-4 text-center">
              <button
                type="button"
                onClick={loadDemoStudent}
                className="text-xs text-[#1E9E54] hover:underline font-semibold bg-[#1E9E54]/10 px-3.5 py-2 rounded-xl border border-[#1E9E54]/30 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Test Demo Login (Kavitha Ramasamy)</span>
              </button>
            </div>

            <div className="text-center text-xs text-[#AAAAAA]">
              Lost your Enrolment ID? Check your fee receipt email or contact <a href="mailto:intern@vgmsofttech.com" className="underline text-[#555555]">intern@vgmsofttech.com</a>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Calculate Progress
  const totalWeeks = course?.durationWeeks || 8;
  const completedCount = (student.completedWeeks || []).length;
  const progressPercent = Math.min(100, Math.round((completedCount / totalWeeks) * 100));

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#111111] pb-24">
      
      {/* 1. Portal Student Header Banner */}
      <section className="bg-gradient-to-r from-[#F7F8FA] via-[#eef7f1] to-[#F7F8FA] text-[#111111] py-8 border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-700 font-heading font-bold text-xl flex items-center justify-center shrink-0">
                {student.student.fullName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-heading font-bold text-[#111111]">
                    {student.student.fullName}
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1E9E54] text-white uppercase">
                    Active Intern
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  {student.student.college} · {student.student.degreeStream}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-700 pt-1 font-mono">
                  <span>ID: {student.id}</span>
                  <span>·</span>
                  <span>{student.courseTitle || 'AI-Powered Mobile App Internship'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://meet.google.com/new"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Join Daily Standup (10:00 AM)</span>
              </a>

              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-2 bg-black/10 hover:bg-black/20 border border-black/10 text-[#111111] rounded-xl text-xs flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>

          </div>

          {/* Quick Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block">Enrolled Plan:</span>
              <span className="text-[#111111] font-semibold text-sm">{student.planName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Assigned Batch:</span>
              <span className="text-[#111111] font-semibold text-sm truncate">{student.batchLabel.split('—')[0]}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Syllabus Progress:</span>
              <span className="text-[#1E9E54] font-semibold text-sm">{progressPercent}% Completed</span>
            </div>
            <div>
              <span className="text-slate-500 block">Fee Status:</span>
              <span className="text-emerald-700 font-semibold text-sm uppercase">Paid (₹{student.pricing.finalAmount.toLocaleString('en-IN')})</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Navigation Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex items-center gap-2 border-b border-black/10 overflow-x-auto pb-2 scrollbar-thin">
          {[
            { id: 'roadmap', label: 'Curriculum & Live Modules', icon: BookOpen },
            { id: 'projects', label: 'Project Submissions', icon: Github },
            { id: 'payments', label: 'Fee Invoices & Receipts', icon: FileText },
            { id: 'certificate', label: 'Certificate & Credentials', icon: Award },
            { id: 'mentor', label: 'Mentor Helpdesk', icon: MessageSquare },
          ].map((tab) => {
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
                    : 'text-[#555555] hover:bg-black/[0.06] hover:text-[#111111]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Main Tab Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* TAB 1: CURRICULUM ROADMAP & PROGRESS */}
        {activeTab === 'roadmap' && (
          <div className="space-y-6">
            
            {/* Progress Bar Card */}
            <div className="bg-white rounded-2xl border border-black/10 p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-heading font-black text-[#111111]">
                    Your Practical Learning Milestones
                  </h3>
                  <p className="text-xs text-[#555555]">
                    Tick off completed modules after finishing the daily code assignment and mentor review.
                  </p>
                </div>
                <span className="font-heading font-black text-2xl text-[#1E9E54]">
                  {completedCount} / {totalWeeks} Weeks
                </span>
              </div>

              <div className="w-full bg-[#F0F2F4] border border-black/10 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#1E9E54] h-full rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(30,158,84,0.5)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Weekly Modules List */}
            <div className="space-y-3">
              {course?.curriculum && course.curriculum.length > 0 ? (
                course.curriculum.map((mod: any, idx: number) => {
                  const weekNum = idx + 1;
                  const isDone = (student.completedWeeks || []).includes(weekNum);

                  return (
                    <div
                      key={idx}
                      className={`rounded-2xl border p-5 transition-all shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                        isDone ? 'border-[#1E9E54]/40 bg-[#1E9E54]/10' : 'border-black/10 bg-white'
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
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {(mod.topics || []).slice(0, 4).map((t: string, tidx: number) => (
                              <span key={tidx} className="bg-black/[0.06] text-[#444444] border border-black/[0.08] text-[10px] font-mono px-2 py-0.5 rounded-md">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-mono uppercase text-[10px] ${
                          isDone ? 'bg-[#1E9E54]/20 text-[#1E9E54] border border-[#1E9E54]/40' : 'bg-black/[0.06] text-[#555555] border border-black/[0.08]'
                        }`}>
                          {isDone ? 'Completed' : 'In Progress'}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                // Fallback standard 8 weeks if course curriculum is minimal
                Array.from({ length: totalWeeks }).map((_, idx) => {
                  const weekNum = idx + 1;
                  const isDone = (student.completedWeeks || []).includes(weekNum);
                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl border border-black/10 p-5 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => toggleWeekCompletion(weekNum)}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5 text-[#1E9E54]" />
                          ) : (
                            <Circle className="w-5 h-5 text-black/20" />
                          )}
                        </button>
                        <div>
                          <h4 className="text-sm font-bold text-[#111111]">Sprint Week {weekNum} Deliverables</h4>
                          <p className="text-xs text-[#555555]">Live feature coding and mentor code review</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-[#AAAAAA]">{isDone ? 'Completed' : 'Pending'}</span>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        )}

        {/* TAB 2: CAPSTONE & ASSIGNMENT SUBMISSION */}
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <div className="lg:col-span-7 bg-white rounded-3xl border border-black/10 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h3 className="text-xl font-heading font-black text-[#111111]">
                  Submit Production Project Repository
                </h3>
                <p className="text-xs sm:text-sm text-[#555555] mt-1 leading-relaxed font-light">
                  Provide your public GitHub repository URL for senior staff code audit. Ensure your README contains setup instructions and demo screenshots.
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
                    Live Demo / Published Link (Google Play / Vercel / Netlify / APK)
                  </label>
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://play.google.com/store/apps/details?id=... or web demo"
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

            {/* Submission Status Box */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-3xl border border-black/10 p-6 shadow-sm space-y-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#AAAAAA]">
                  Current Submission Status
                </span>

                {student.projectSubmission ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#555555]">Status:</span>
                      <span className="px-2.5 py-1 bg-[#FFC83D]/15 text-[#FFC83D] border border-[#FFC83D]/30 rounded-full font-mono font-bold text-[10px] uppercase">
                        {student.projectSubmission.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="text-xs text-[#444444] space-y-1 bg-[#F0F2F4] p-3.5 rounded-xl border border-black/10">
                      <p className="font-mono text-[#1E9E54] break-all">{student.projectSubmission.githubUrl}</p>
                      {student.projectSubmission.liveUrl && (
                        <p className="text-[#555555] break-all">{student.projectSubmission.liveUrl}</p>
                      )}
                      <p className="text-[11px] text-[#AAAAAA] pt-1 font-mono">
                        Submitted on: {new Date(student.projectSubmission.submittedAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 space-y-2">
                    <Laptop className="w-10 h-10 text-black/20 mx-auto" />
                    <p className="text-xs text-[#555555] leading-relaxed font-light">
                      No project repository submitted yet. Submit your repo using the form to trigger certificate evaluation.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: FEE INVOICES & RECEIPTS */}
        {activeTab === 'payments' && (
          <div className="max-w-3xl space-y-6">
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
                <span className="px-3 py-1 bg-[#1E9E54]/10 text-[#1E9E54] border border-[#1E9E54]/30 rounded-full text-xs font-mono font-bold uppercase">
                  {student.payment.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[#AAAAAA] block">Enrolment ID:</span>
                  <span className="font-mono font-bold text-[#111111]">{student.id}</span>
                </div>
                <div>
                  <span className="text-[#AAAAAA] block">Transaction Reference:</span>
                  <span className="font-mono text-[#444444]">{student.payment.paymentId || student.payment.orderId}</span>
                </div>
                <div>
                  <span className="text-[#AAAAAA] block">Student Name:</span>
                  <span className="font-bold text-[#111111]">{student.student.fullName}</span>
                </div>
                <div>
                  <span className="text-[#AAAAAA] block">Payment Date:</span>
                  <span className="text-[#444444]">
                    {student.payment.paidAt ? new Date(student.payment.paidAt).toLocaleDateString('en-IN') : 'Confirmed'}
                  </span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-[#F0F2F4] rounded-2xl p-4 border border-black/10 space-y-2 text-xs">
                <div className="flex justify-between text-[#555555]">
                  <span>Course Fee ({student.planName}):</span>
                  <span className="font-mono text-[#111111]">₹{student.pricing.baseAmount.toLocaleString('en-IN')}</span>
                </div>
                {student.pricing.discountAmount > 0 && (
                  <div className="flex justify-between text-[#1E9E54] font-medium">
                    <span>Coupon Applied ({student.pricing.couponCode}):</span>
                    <span className="font-mono">-₹{student.pricing.discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#111111] font-bold border-t border-black/10 pt-2 text-sm">
                  <span>Net Paid Amount:</span>
                  <span className="font-mono text-[#1E9E54]">₹{student.pricing.finalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-[11px] text-[#AAAAAA]">
                  Official GST Registered Tax Receipt · Division of VGM Soft Tech, Coimbatore
                </span>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-white hover:bg-white/90 text-black rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-black/10"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: CERTIFICATE & CREDENTIAL VERIFICATION */}
        {activeTab === 'certificate' && (
          <div className="max-w-3xl space-y-6">
            <div className="bg-white rounded-3xl border border-[#1E9E54]/30 p-8 shadow-sm space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-[#1E9E54]/10 text-[#1E9E54] flex items-center justify-center mx-auto border border-[#1E9E54]/30 shadow-[0_0_25px_rgba(30,158,84,0.3)]">
                <Award className="w-8 h-8 text-[#1E9E54]" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-[#1E9E54] uppercase tracking-widest">
                  VGM SKILL HUB · VERIFIED CREDENTIAL
                </span>
                <h3 className="text-2xl font-heading font-black text-[#111111]">
                  {student.student.fullName}
                </h3>
                <p className="text-xs text-[#555555]">
                  {student.courseTitle || 'AI-Powered Mobile App Internship'} · {student.planName}
                </p>
              </div>

              <div className="p-4 bg-[#F0F2F4] rounded-2xl border border-black/10 text-xs text-[#555555] max-w-lg mx-auto font-light leading-relaxed">
                <p>
                  This verifiable credential attests that the student has completed the practical software engineering sprint, adhered to team Git pull request reviews, and deployed production code under VGM Soft Tech.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  to={`/verify-certificate`}
                  className="px-5 py-2.5 bg-[#1E9E54] hover:bg-[#14723B] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-[0_0_20px_rgba(30,158,84,0.35)]"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify on Public Ledger</span>
                </Link>

                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin + '/verify-certificate')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-black/[0.08] hover:bg-black/[0.15] text-[#111111] font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors border border-black/10"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Share on LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: MENTOR HELPDESK & COMMUNITY */}
        {activeTab === 'mentor' && (
          <div className="max-w-2xl bg-white rounded-3xl border border-black/10 p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-heading font-black text-[#111111]">
                Mentor Support &amp; Technical Helpdesk
              </h3>
              <p className="text-xs sm:text-sm text-[#555555] mt-1 leading-relaxed font-light">
                Stuck on a bug, Git merge conflict, or API integration? Connect with our senior engineering team directly.
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-[#444444]">
              <div className="p-4 bg-[#1E9E54]/10 rounded-2xl border border-[#1E9E54]/30 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#111111] block">Batch WhatsApp Community Group</span>
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
                  className="px-4 py-2 bg-white hover:bg-white/90 text-black font-semibold rounded-xl text-xs shrink-0 transition-colors border border-black/10"
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
          </div>
        )}

      </section>

    </div>
  );
};
