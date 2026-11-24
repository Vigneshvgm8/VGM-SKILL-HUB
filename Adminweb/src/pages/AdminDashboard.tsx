import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Enrolment, Coupon } from '../../../API/db.js';
import { 
  Lock, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Tag, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign, 
  Users, 
  Layers, 
  Trash2, 
  Plus, 
  LogOut,
  RefreshCw,
  X,
  ExternalLink,
  Award,
  ShieldCheck,
  FileCode,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Menu
} from 'lucide-react';
import { BATCH_OPTIONS } from '../config/programData.js';
import { ASSESSMENT_QUESTIONS } from '../config/assessmentQuestions.js';
import { COURSES_CATALOG } from '../config/coursesData.js';

interface AdminStats {
  totalEnrolments: number;
  paidCount: number;
  pendingCount: number;
  failedCount: number;
  totalRevenue: number;
  planBreakdown: Record<string, number>;
  paidPlanBreakdown: Record<string, number>;
  totalCertificates?: number;
  totalProjects?: number;
  reviewedProjectsCount?: number;
}

export const AdminDashboard: React.FC = () => {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem('vgm_admin_token'));
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Dashboard Data
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [enrolments, setEnrolments] = useState<Enrolment[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCourse, setFilterCourse] = useState<string>('all');
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterBatch, setFilterBatch] = useState<string>('all');

  // Active Tab & Sidebar Navigation State
  const [activeTab, setActiveTab] = useState<'enrolments' | 'courses' | 'certificates' | 'projects' | 'coupons'>('enrolments');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Detail Modal
  const [selectedEnrolment, setSelectedEnrolment] = useState<Enrolment | null>(null);

  // Course Modal State
  const [showCourseModal, setShowCourseModal] = useState<boolean>(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [courseFormData, setCourseFormData] = useState({
    title: '',
    slug: '',
    category: 'Full-Stack Web',
    badge: 'Trending Track 2026',
    level: 'Beginner to Advanced',
    duration: '12 Weeks (3 Months)',
    durationWeeks: 12,
    startingFee: 7999,
    mode: 'Hybrid (Coimbatore Campus + Online Live)',
    nextBatch: '15th December 2026',
    shortDescription: '',
    fullDescription: '',
    toolsInput: 'React, Node.js, TypeScript, PostgreSQL',
    highlightsInput: '400+ Hours Live Project Training, 1-on-1 Code Review, Official Experience Letter',
    status: 'enrolling' as 'enrolling' | 'upcoming' | 'waitlist'
  });

  // Certificate Modal State
  const [showCertModal, setShowCertModal] = useState<boolean>(false);
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [certFormData, setCertFormData] = useState({
    id: '',
    enrolmentId: '',
    studentName: '',
    studentEmail: '',
    courseTitle: 'AI-Powered Mobile App Development Internship',
    planLevel: 'Builder Plan (8 Weeks)',
    completionDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    grade: 'Distinction (Grade A+)',
    projectTitle: '',
    skillsInput: 'Flutter, Dart, Firebase, Git',
    authorizedSignatory: 'Director of Academic Engineering, VGM Soft Tech',
    verificationStatus: 'verified' as 'verified' | 'revoked'
  });

  // Project Review Modal State
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [reviewFormData, setReviewFormData] = useState({
    status: 'approved' as 'approved' | 'rework_needed' | 'under_review',
    score: 90,
    feedback: 'Excellent implementation of requirements with clean architecture and solid documentation.',
    reviewerName: 'Senior Academic Reviewer'
  });

  // Coupon Creation Form
  const [showNewCouponModal, setShowNewCouponModal] = useState<boolean>(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'flat',
    discountValue: 10,
    expiresAt: '2026-12-31',
    usageLimit: 50,
    description: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setToken(data.token);
        sessionStorage.setItem('vgm_admin_token', data.token);
      } else {
        setLoginError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setLoginError('Server error while authenticating');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    sessionStorage.removeItem('vgm_admin_token');
  };

  const fetchDashboardData = async () => {
    if (!token) return;
    setLoadingData(true);

    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch Stats
      const statsRes = await fetch('/api/admin/stats', { headers });
      if (statsRes.status === 401) {
        handleLogout();
        return;
      }
      const statsData = await statsRes.json();
      setStats(statsData);

      // Fetch Enrolments
      const url = new URL('/api/admin/enrolments', window.location.origin);
      if (searchQuery) url.searchParams.set('search', searchQuery);
      if (filterCourse !== 'all') url.searchParams.set('course', filterCourse);
      if (filterPlan !== 'all') url.searchParams.set('plan', filterPlan);
      if (filterStatus !== 'all') url.searchParams.set('status', filterStatus);
      if (filterBatch !== 'all') url.searchParams.set('batch', filterBatch);

      const enrolRes = await fetch(url.toString(), { headers });
      const enrolData = await enrolRes.json();
      setEnrolments(enrolData.enrolments || []);

      // Fetch Coupons
      const couponRes = await fetch('/api/admin/coupons', { headers });
      const couponData = await couponRes.json();
      setCoupons(couponData.coupons || []);

      // Fetch Dynamic Courses
      const coursesRes = await fetch('/api/courses');
      const coursesData = await coursesRes.json();
      setCoursesList(coursesData.courses || []);

      // Fetch Certificates
      const certRes = await fetch('/api/admin/certificates', { headers });
      const certData = await certRes.json();
      setCertificates(certData.certificates || []);

      // Fetch Projects
      const projRes = await fetch('/api/admin/projects', { headers });
      const projData = await projRes.json();
      setProjects(projData.projects || []);
    } catch (e) {
      console.error('Error fetching admin data:', e);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token, filterCourse, filterPlan, filterStatus, filterBatch, searchQuery]);

  // Course Handlers
  const openNewCourseModal = () => {
    setEditingCourseId(null);
    setCourseFormData({
      title: '',
      slug: '',
      category: 'Full-Stack Web',
      badge: 'Trending Track 2026',
      level: 'Beginner to Advanced',
      duration: '12 Weeks (3 Months)',
      durationWeeks: 12,
      startingFee: 7999,
      mode: 'Hybrid (Coimbatore Campus + Online Live)',
      nextBatch: '15th December 2026',
      shortDescription: '',
      fullDescription: '',
      toolsInput: 'React, Node.js, TypeScript, PostgreSQL',
      highlightsInput: '400+ Hours Live Project Training, 1-on-1 Code Review, Official Experience Letter',
      status: 'enrolling'
    });
    setShowCourseModal(true);
  };

  const openEditCourseModal = (c: any) => {
    setEditingCourseId(c.id);
    setCourseFormData({
      title: c.title || '',
      slug: c.slug || '',
      category: c.category || 'Full-Stack Web',
      badge: c.badge || 'New Track',
      level: c.level || 'Beginner to Advanced',
      duration: c.duration || '12 Weeks',
      durationWeeks: c.durationWeeks || 12,
      startingFee: c.startingFee || 5999,
      mode: c.mode || 'Hybrid (Coimbatore Campus + Online Live)',
      nextBatch: c.nextBatch || 'Coming Soon',
      shortDescription: c.shortDescription || '',
      fullDescription: c.fullDescription || '',
      toolsInput: (c.tools || []).join(', '),
      highlightsInput: (c.highlights || []).join(', '),
      status: c.status || 'enrolling'
    });
    setShowCourseModal(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const payload = {
      ...courseFormData,
      startingFeeFormatted: `₹${Number(courseFormData.startingFee).toLocaleString('en-IN')}`,
      tools: courseFormData.toolsInput.split(',').map(s => s.trim()).filter(Boolean),
      highlights: courseFormData.highlightsInput.split(',').map(s => s.trim()).filter(Boolean)
    };

    try {
      const url = editingCourseId
        ? `/api/admin/courses/${editingCourseId}`
        : '/api/admin/courses';
      const method = editingCourseId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setShowCourseModal(false);
        fetchDashboardData();
      } else {
        alert(data.error || 'Failed to save course');
      }
    } catch (err) {
      alert('Network error saving course');
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!token || !window.confirm('Are you sure you want to delete this course from the database?')) return;

    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchDashboardData();
      } else {
        alert('Failed to delete course');
      }
    } catch (err) {
      alert('Network error deleting course');
    }
  };

  const handleExportCSV = () => {
    if (!token) return;
    window.location.href = `/api/admin/export-csv?auth=${token}`;
    // alternatively fetch blob
    fetch('/api/admin/export-csv', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vgm_skillhub_enrolments_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newCoupon,
          expiresAt: new Date(newCoupon.expiresAt).toISOString()
        })
      });

      if (res.ok) {
        setShowNewCouponModal(false);
        setNewCoupon({
          code: '',
          discountType: 'percentage',
          discountValue: 10,
          expiresAt: '2026-12-31',
          usageLimit: 50,
          description: ''
        });
        fetchDashboardData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to create coupon');
      }
    } catch (e) {
      alert('Error creating coupon');
    }
  };

  const handleToggleCoupon = async (coupon: Coupon) => {
    if (!token) return;
    await fetch(`/api/admin/coupons/${coupon.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ isActive: !coupon.isActive })
    });
    fetchDashboardData();
  };

  const handleDeleteCoupon = async (couponId: string) => {
    if (!token) return;
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    await fetch(`/api/admin/coupons/${couponId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchDashboardData();
  };

  // Certificate Handlers
  const openNewCertModal = () => {
    setEditingCertId(null);
    setCertFormData({
      id: '',
      enrolmentId: '',
      studentName: '',
      studentEmail: '',
      courseTitle: 'AI-Powered Mobile App Development Internship',
      planLevel: 'Builder Plan (8 Weeks)',
      completionDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      grade: 'Distinction (Grade A+)',
      projectTitle: '',
      skillsInput: 'Flutter, Dart, Firebase, Git',
      authorizedSignatory: 'Director of Academic Engineering, VGM Soft Tech',
      verificationStatus: 'verified'
    });
    setShowCertModal(true);
  };

  const openEditCertModal = (cert: any) => {
    setEditingCertId(cert.id);
    setCertFormData({
      id: cert.id,
      enrolmentId: cert.enrolmentId || '',
      studentName: cert.studentName || '',
      studentEmail: cert.studentEmail || '',
      courseTitle: cert.courseTitle || '',
      planLevel: cert.planLevel || '',
      completionDate: cert.completionDate || '',
      grade: cert.grade || 'Distinction (Grade A+)',
      projectTitle: cert.projectTitle || '',
      skillsInput: (cert.skills || []).join(', '),
      authorizedSignatory: cert.authorizedSignatory || 'Director of Academic Engineering, VGM Soft Tech',
      verificationStatus: cert.verificationStatus || 'verified'
    });
    setShowCertModal(true);
  };

  const handleSaveCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const payload = {
      ...certFormData,
      skills: certFormData.skillsInput.split(',').map(s => s.trim()).filter(Boolean)
    };

    try {
      const url = editingCertId
        ? `/api/admin/certificates/${editingCertId}`
        : '/api/admin/certificates';
      const method = editingCertId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setShowCertModal(false);
        fetchDashboardData();
      } else {
        alert(data.error || 'Failed to save certificate');
      }
    } catch (err) {
      alert('Network error saving certificate');
    }
  };

  const handleToggleCertStatus = async (cert: any) => {
    if (!token) return;
    const nextStatus = cert.verificationStatus === 'verified' ? 'revoked' : 'verified';
    try {
      const res = await fetch(`/api/admin/certificates/${cert.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ verificationStatus: nextStatus })
      });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      alert('Error updating certificate status');
    }
  };

  const handleDeleteCert = async (certId: string) => {
    if (!token || !window.confirm(`Delete certificate ${certId} permanently?`)) return;
    try {
      const res = await fetch(`/api/admin/certificates/${certId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      alert('Error deleting certificate');
    }
  };

  // Project Review Handlers
  const handleOpenReviewModal = (proj: any) => {
    setSelectedProject(proj);
    setReviewFormData({
      status: proj.submission.status === 'submitted' ? 'approved' : proj.submission.status,
      score: proj.submission.score !== undefined ? proj.submission.score : 90,
      feedback: proj.submission.reviewerFeedback || 'Great work on this capstone submission. Code quality and tests meet the production engineering bar.',
      reviewerName: proj.submission.reviewedBy || 'Senior Academic Reviewer'
    });
    setShowReviewModal(true);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedProject) return;

    try {
      const res = await fetch(`/api/admin/projects/${selectedProject.enrolmentId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(reviewFormData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setShowReviewModal(false);
        fetchDashboardData();
      } else {
        alert(data.error || 'Failed to submit review');
      }
    } catch (err) {
      alert('Network error saving review');
    }
  };

  const handleApproveAndIssueCert = (proj: any) => {
    setShowReviewModal(false);
    setEditingCertId(null);
    setCertFormData({
      id: '',
      enrolmentId: proj.enrolmentId,
      studentName: proj.student.fullName,
      studentEmail: proj.student.email,
      courseTitle: proj.courseTitle || 'AI-Powered Mobile App Development Internship',
      planLevel: proj.planName || 'Builder Plan (8 Weeks)',
      completionDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      grade: reviewFormData.score >= 85 ? 'Distinction (Grade A+)' : 'First Class with Honors',
      projectTitle: proj.submission.notes ? `Capstone: ${proj.submission.notes.slice(0, 60)}` : 'Production Capstone Project',
      skillsInput: (proj.student.languages || ['Full-Stack', 'Git', 'Clean Architecture']).join(', '),
      authorizedSignatory: 'Director of Academic Engineering, VGM Soft Tech',
      verificationStatus: 'verified'
    });
    setActiveTab('certificates');
    setShowCertModal(true);
  };

  const handleUpdateEnrolmentStatus = async (enrolmentId: string, newStatus: 'paid' | 'pending' | 'failed') => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/enrolments/${enrolmentId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchDashboardData();
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      alert('Network error updating status');
    }
  };

  // LOGIN SCREEN
  if (!token) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-[#111111]">
        <div className="bg-white border border-black/10 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#1E9E54]/15 text-[#1E9E54] flex items-center justify-center mx-auto border border-[#1E9E54]/30 shadow-[0_0_20px_rgba(30,158,84,0.3)]">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-heading font-black text-[#111111] tracking-tight">
              VGM Staff Admin Portal
            </h1>
            <p className="text-xs text-[#555555] leading-relaxed font-light">
              Access the admission roster, curriculum management, and Razorpay payment records.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#555555] mb-1.5">
                Admin Password
              </label>
              <input
                type="password"
                placeholder="Enter ADMIN_PASSWORD"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-[#F0F2F4] border border-black/10 rounded-xl text-sm text-[#111111] focus:outline-none focus:border-[#1E9E54]"
              />
              <p className="text-[11px] text-[#AAAAAA] mt-1 font-mono">
                Default password configured in environment: <code>vgm_admin_2026</code>
              </p>
            </div>

            {loginError && (
              <p className="text-xs text-red-400 bg-red-500/10 p-2.5 rounded-xl border border-red-500/30">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-[#111111] hover:bg-[#1E9E54] text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(30,158,84,0.35)] cursor-pointer"
            >
              {isLoggingIn ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // AUTHENTICATED DASHBOARD - ENTERPRISE SIDEBAR LAYOUT
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col md:flex-row text-[#111111]">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1E9E54]/15 text-[#1E9E54] flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-sm text-slate-900 leading-tight">VGM Staff Console</h1>
            <p className="text-[10px] text-slate-500 font-mono">Academic Admissions</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Desktop & Mobile Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out md:static md:translate-x-0 md:h-screen md:sticky md:top-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1E9E54]/15 border border-[#1E9E54]/30 text-[#1E9E54] flex items-center justify-center font-bold shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-black text-sm text-slate-900 tracking-tight">VGM SKILL HUB</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-[#1E9E54]/10 text-[#1E7A46] font-bold">STAFF</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Academic Admissions Console</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sidebar Navigation Items */}
        <div className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-heading font-bold text-slate-400 uppercase tracking-wider">
            Management & Registry
          </div>

          {/* Enrolments Item */}
          <button
            type="button"
            onClick={() => { setActiveTab('enrolments'); setSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer ${
              activeTab === 'enrolments'
                ? 'bg-[#1E9E54] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4" />
              <span>Enrolments</span>
            </div>
            <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
              activeTab === 'enrolments' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {enrolments.length}
            </span>
          </button>

          {/* Courses Item */}
          <button
            type="button"
            onClick={() => { setActiveTab('courses'); setSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer ${
              activeTab === 'courses'
                ? 'bg-[#1E9E54] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4" />
              <span>Courses & Tracks</span>
            </div>
            <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
              activeTab === 'courses' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {coursesList.length}
            </span>
          </button>

          {/* Certificates Item */}
          <button
            type="button"
            onClick={() => { setActiveTab('certificates'); setSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer ${
              activeTab === 'certificates'
                ? 'bg-[#1E9E54] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Award className="w-4 h-4" />
              <span>Certificates</span>
            </div>
            <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
              activeTab === 'certificates' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {certificates.length}
            </span>
          </button>

          {/* Project Analysis Item */}
          <button
            type="button"
            onClick={() => { setActiveTab('projects'); setSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-[#1E9E54] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileCode className="w-4 h-4" />
              <span>Project Analysis</span>
            </div>
            <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
              activeTab === 'projects' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {projects.length}
            </span>
          </button>

          {/* Coupons Item */}
          <button
            type="button"
            onClick={() => { setActiveTab('coupons'); setSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer ${
              activeTab === 'coupons'
                ? 'bg-[#1E9E54] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Tag className="w-4 h-4" />
              <span>Discount Coupons</span>
            </div>
            <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
              activeTab === 'coupons' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {coupons.length}
            </span>
          </button>

          {/* Quick Actions in Sidebar */}
          <div className="pt-5 px-1 space-y-2">
            <div className="px-2 text-[10px] font-heading font-bold text-slate-400 uppercase tracking-wider">
              Quick Actions
            </div>
            <button
              type="button"
              onClick={openNewCourseModal}
              className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#1E9E54]" />
              <span>Add New Course</span>
            </button>
            <button
              type="button"
              onClick={openNewCertModal}
              className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#1E9E54]" />
              <span>Issue Certificate</span>
            </button>
            <button
              type="button"
              onClick={() => setShowNewCouponModal(true)}
              className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#1E9E54]" />
              <span>Create Coupon</span>
            </button>
          </div>
        </div>

        {/* Sidebar Footer with Live Status & Logout */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 space-y-3">
          <div className="space-y-1.5 text-[11px] font-mono">
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Database</span>
              </span>
              <span className="font-semibold text-emerald-700">Supabase Live</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Razorpay</span>
              </span>
              <span className="font-semibold text-emerald-700">Live Mode</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold font-mono">
                A
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 leading-tight">Admin Staff</p>
                <p className="text-[10px] text-slate-400">vgmsofttech.com</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden backdrop-blur-xs"
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-[#1E7A46]">
                MANAGEMENT CONSOLE
              </span>
              <span className="text-slate-300">/</span>
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-slate-500">
                {activeTab}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 mt-1 capitalize">
              {activeTab === 'enrolments' && 'Student Enrolments & Admissions'}
              {activeTab === 'courses' && 'Curriculum Tracks & Course Catalogue'}
              {activeTab === 'certificates' && 'Academic Credential Verification'}
              {activeTab === 'projects' && 'Capstone Engineering Project Submissions'}
              {activeTab === 'coupons' && 'Promotional Discount Coupons'}
            </h1>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={fetchDashboardData}
              className="px-3 py-2 border border-slate-300 text-slate-700 hover:bg-white bg-slate-50 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              title="Refresh data from live database"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            {activeTab === 'courses' && (
              <button
                type="button"
                onClick={openNewCourseModal}
                className="px-3.5 py-2 bg-[#1E9E54] hover:bg-[#14723B] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Course</span>
              </button>
            )}

            {activeTab === 'certificates' && (
              <button
                type="button"
                onClick={openNewCertModal}
                className="px-3.5 py-2 bg-[#1E9E54] hover:bg-[#14723B] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Issue Certificate</span>
              </button>
            )}

            {activeTab === 'coupons' && (
              <button
                type="button"
                onClick={() => setShowNewCouponModal(true)}
                className="px-3.5 py-2 bg-[#1E9E54] hover:bg-[#14723B] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Coupon</span>
              </button>
            )}
          </div>
        </div>

        {/* KPI Summary Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span className="font-heading font-bold uppercase tracking-wider">Total Enrolments</span>
                <Users className="w-4 h-4 text-slate-400" />
              </div>
              <p className="text-3xl font-heading font-bold text-slate-900 tabular-nums">
                {stats.totalEnrolments}
              </p>
              <span className="text-[11px] text-slate-400">
                {stats.paidCount} Paid · {stats.pendingCount} Pending
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span className="font-heading font-bold uppercase tracking-wider">Total Revenue</span>
                <DollarSign className="w-4 h-4 text-[#1E7A46]" />
              </div>
              <p className="text-3xl font-heading font-bold text-[#1E7A46] tabular-nums">
                ₹{stats.totalRevenue.toLocaleString('en-IN')}
              </p>
              <span className="text-[11px] text-slate-400">
                Verified Razorpay Collections
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span className="font-heading font-bold uppercase tracking-wider">Plan Distribution</span>
                <Layers className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-xs space-y-0.5 mt-2">
                <p className="flex justify-between">
                  <span>Explorer (1 Mo):</span>
                  <strong className="font-mono">{stats.planBreakdown.explorer || 0}</strong>
                </p>
                <p className="flex justify-between">
                  <span>Builder (2 Mo):</span>
                  <strong className="font-mono">{stats.planBreakdown.builder || 0}</strong>
                </p>
                <p className="flex justify-between">
                  <span>Professional (3 Mo):</span>
                  <strong className="font-mono">{stats.planBreakdown.professional || 0}</strong>
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span className="font-heading font-bold uppercase tracking-wider">Payment Health</span>
                <CheckCircle className="w-4 h-4 text-[#43C170]" />
              </div>
              <p className="text-2xl font-heading font-bold text-slate-900 tabular-nums mt-1">
                {stats.totalEnrolments > 0
                  ? `${Math.round((stats.paidCount / stats.totalEnrolments) * 100)}%`
                  : '100%'}
              </p>
              <span className="text-[11px] text-slate-400">
                Conversion rate to Paid status
              </span>
            </div>
          </div>
        )}

      {/* TAB 1: ENROLMENTS TABLE */}
      {activeTab === 'enrolments' && (
        <div className="space-y-4">
          
          {/* Search & Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            {/* Search query */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search name, email, ID, college..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#1E9E54] focus:outline-hidden"
              />
            </div>

            {/* Course filter */}
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-hidden"
            >
              <option value="all">All Courses ({COURSES_CATALOG.length})</option>
              {COURSES_CATALOG.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>

            {/* Plan filter */}
            <select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-hidden"
            >
              <option value="all">All Plans</option>
              <option value="explorer">Explorer / Standard</option>
              <option value="builder">Builder / Pro</option>
              <option value="professional">Professional / Career</option>
            </select>

            {/* Status filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-hidden"
            >
              <option value="all">All Payment Statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>

            {/* Batch filter */}
            <select
              value={filterBatch}
              onChange={(e) => setFilterBatch(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-hidden"
            >
              <option value="all">All Batches</option>
              {BATCH_OPTIONS.map(b => (
                <option key={b.id} value={b.id}>{b.label}</option>
              ))}
            </select>
          </div>

          {/* Table Container */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 font-heading text-slate-600 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Enrolment ID</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Institution</th>
                    <th className="py-3 px-4">Plan &amp; Batch</th>
                    <th className="py-3 px-4 text-center">Score</th>
                    <th className="py-3 px-4">Fee Paid</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {enrolments.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        No enrolment records match your search or filter criteria.
                      </td>
                    </tr>
                  ) : (
                    enrolments.map((e) => (
                      <tr key={e.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 whitespace-nowrap">
                          {e.id}
                        </td>
                        <td className="py-3.5 px-4">
                          <strong className="text-slate-900 block">{e.student.fullName}</strong>
                          <span className="text-[11px] text-slate-500 block">{e.student.email}</span>
                          <span className="text-[10px] text-slate-400 font-mono">+91 {e.student.mobile}</span>
                        </td>
                        <td className="py-3.5 px-4 max-w-xs truncate">
                          <span className="block truncate">{e.student.college}</span>
                          <span className="text-[11px] text-slate-500 block truncate">{e.student.degreeStream}</span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-semibold text-emerald-900 block text-xs truncate max-w-[200px]">{e.courseTitle || 'AI Mobile App'}</span>
                          <span className="font-medium text-slate-800 text-[11px] block">{e.planName}</span>
                          <span className="text-[10px] text-slate-400 block">{e.batchLabel.split('—')[0]}</span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-block font-mono font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-800">
                            {e.assessment.score} / {e.assessment.total}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                          <span className="font-semibold text-slate-900 block">
                            ₹{e.pricing.finalAmount.toLocaleString('en-IN')}
                          </span>
                          {e.pricing.couponCode && (
                            <span className="text-[10px] text-emerald-700 block">
                              Coupon: {e.pricing.couponCode}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <select
                            value={e.payment.status}
                            onChange={(evt) => handleUpdateEnrolmentStatus(e.id, evt.target.value as any)}
                            className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border text-center cursor-pointer transition-colors ${
                              e.payment.status === 'paid'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : e.payment.status === 'pending'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-red-50 text-red-800 border-red-200'
                            }`}
                          >
                            <option value="paid">Paid</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setSelectedEnrolment(e)}
                            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900"
                            title="View student dossier"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: DYNAMIC COURSES & INTERNSHIPS MANAGEMENT */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-xs text-slate-500 block uppercase font-heading">Total Internship Tracks</span>
              <span className="text-2xl font-bold font-heading text-slate-900">{coursesList.length}</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-xs text-slate-500 block uppercase font-heading">Database State</span>
              <span className="text-2xl font-bold font-heading text-[#1E7A46]">Active in db.json</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-xs text-slate-500 block uppercase font-heading">Coimbatore Campus Hub</span>
              <span className="text-2xl font-bold font-heading text-slate-900">Saibaba Colony</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coursesList.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:border-[#1E9E54] transition-all space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-[#1E7A46] border border-emerald-200">
                      {course.badge}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{course.startingFeeFormatted}</span>
                  </div>

                  <h4 className="font-heading font-bold text-base text-slate-900">
                    {course.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {course.shortDescription || course.headline}
                  </p>

                  <div className="text-[11px] text-slate-400 space-y-1 pt-2 border-t border-slate-100">
                    <div><strong>Category:</strong> {course.category}</div>
                    <div><strong>Duration:</strong> {course.duration}</div>
                    <div><strong>Slug:</strong> /courses/{course.slug}</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    to={`/courses/${course.slug}`}
                    target="_blank"
                    className="text-xs text-[#1E7A46] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>View Live</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditCourseModal(course)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCourse(course.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                      title="Delete course"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: COUPONS MANAGEMENT */}
      {activeTab === 'coupons' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-heading text-slate-600 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Coupon Code</th>
                  <th className="py-3 px-4">Discount</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Expiry Date</th>
                  <th className="py-3 px-4 text-center">Usage Count</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {c.code}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-[#1E7A46]">
                      {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                      {c.description || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {new Date(c.expiresAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">
                      {c.timesUsed} / {c.usageLimit}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleCoupon(c)}
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                          c.isActive
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {c.isActive ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteCoupon(c.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                        title="Delete coupon"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CERTIFICATES MANAGEMENT */}
      {activeTab === 'certificates' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="relative grow max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search certificate ID, student name, email, track..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#1E9E54] focus:outline-hidden"
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 font-mono">
              <ShieldCheck className="w-4 h-4 text-[#1E9E54]" />
              <span>Public verification: </span>
              <Link to="/verify-certificate" target="_blank" className="text-[#1E9E54] underline font-semibold flex items-center gap-1">
                <span>/verify-certificate</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-heading text-slate-600 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Certificate ID</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Curriculum Track</th>
                  <th className="py-3 px-4">Grade</th>
                  <th className="py-3 px-4">Capstone Project</th>
                  <th className="py-3 px-4">Issue Date</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {certificates.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No certificates issued yet. Click "Issue Certificate" to generate an official credential.
                    </td>
                  </tr>
                ) : (
                  certificates.map((cert) => (
                    <tr key={cert.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {cert.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <strong className="text-slate-900 block">{cert.studentName}</strong>
                        <span className="text-[11px] text-slate-500">{cert.studentEmail}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-900 block">{cert.courseTitle}</span>
                        <span className="text-[11px] text-slate-500">{cert.planLevel}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                          {cert.grade}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs truncate text-[11px] text-slate-600">
                        {cert.projectTitle}
                      </td>
                      <td className="py-3.5 px-4 text-[11px] text-slate-500 whitespace-nowrap">
                        {cert.completionDate}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleCertStatus(cert)}
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                            cert.verificationStatus === 'verified'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-red-50 text-red-800 border border-red-200 hover:bg-red-100'
                          }`}
                          title="Click to toggle Verified / Revoked status"
                        >
                          {cert.verificationStatus === 'verified' ? 'Verified' : 'Revoked'}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/verify-certificate?id=${cert.id}`}
                            target="_blank"
                            className="p-1 text-slate-400 hover:text-[#1E9E54] transition-colors"
                            title="Verify on live public registry"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => openEditCertModal(cert)}
                            className="p-1 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                            title="Edit certificate details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCert(cert.id)}
                            className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                            title="Delete certificate"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: STUDENT PROJECTS & CODE ANALYSIS */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-heading font-bold text-slate-900 text-sm">
                Capstone Engineering Project Submissions
              </h3>
              <p className="text-xs text-slate-500">
                Analyze student repository code, test live deployments, score submissions (0-100), leave mentorship feedback, and issue credentials.
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-[#1E9E54] bg-[#1E9E54]/10 border border-[#1E9E54]/20 px-3 py-1 rounded-full shrink-0">
              {projects.length} Total Submissions
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-heading text-slate-600 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Enrolment ID</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Track &amp; Plan</th>
                  <th className="py-3 px-4">GitHub &amp; Live Demo</th>
                  <th className="py-3 px-4 text-center">Score</th>
                  <th className="py-3 px-4 text-center">Review Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No student project submissions recorded yet. Submissions made via the Student Portal will appear here for staff review.
                    </td>
                  </tr>
                ) : (
                  projects.map((p) => {
                    const sub = p.submission;
                    return (
                      <tr key={p.enrolmentId} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                          {p.enrolmentId}
                        </td>
                        <td className="py-3.5 px-4">
                          <strong className="text-slate-900 block">{p.student.fullName}</strong>
                          <span className="text-[11px] text-slate-500 block">{p.student.email}</span>
                          <span className="text-[10px] text-slate-400">{p.student.college}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-900 block">{p.courseTitle || 'AI-Powered Mobile App'}</span>
                          <span className="text-[11px] text-slate-500">{p.planName}</span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <a
                              href={sub.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-mono font-medium"
                            >
                              <span>GitHub Repo</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                            {sub.liveUrl && (
                              <a
                                href={sub.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-[#1E9E54] hover:underline flex items-center gap-1 font-mono font-medium"
                              >
                                <span>Live App Demo</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono">
                          {sub.score !== undefined ? (
                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                              {sub.score} / 100
                            </span>
                          ) : (
                            <span className="text-slate-400">Not Scored</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                            sub.status === 'approved'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : sub.status === 'rework_needed'
                              ? 'bg-red-50 text-red-800 border border-red-200'
                              : sub.status === 'under_review'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            {sub.status ? sub.status.toUpperCase().replace('_', ' ') : 'SUBMITTED'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleOpenReviewModal(p)}
                            className="px-3.5 py-1.5 bg-[#111111] hover:bg-[#1E9E54] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                          >
                            Analyze &amp; Review
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* STUDENT DOSSIER MODAL */}
      {selectedEnrolment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl space-y-5 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono text-[#1E7A46] font-bold">
                  {selectedEnrolment.id}
                </span>
                <h3 className="text-xl font-heading font-bold text-slate-900">
                  {selectedEnrolment.student.fullName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEnrolment(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-heading font-bold uppercase text-slate-400 block text-[10px]">
                  ACADEMIC &amp; CONTACT
                </span>
                <p><strong>Email:</strong> {selectedEnrolment.student.email}</p>
                <p><strong>Mobile:</strong> +91 {selectedEnrolment.student.mobile}</p>
                <p><strong>City:</strong> {selectedEnrolment.student.city}</p>
                <p><strong>College:</strong> {selectedEnrolment.student.college}</p>
                <p><strong>Stream:</strong> {selectedEnrolment.student.degreeStream}</p>
                <p><strong>Year:</strong> {selectedEnrolment.student.yearOfStudy}</p>
                <p><strong>Languages:</strong> {selectedEnrolment.student.languages.join(', ') || 'None specified'}</p>
                <p><strong>Referral:</strong> {selectedEnrolment.student.referralSource}</p>
              </div>

              <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-heading font-bold uppercase text-slate-400 block text-[10px]">
                  ENROLMENT &amp; PAYMENT
                </span>
                <p><strong>Plan:</strong> {selectedEnrolment.planName}</p>
                <p><strong>Batch:</strong> {selectedEnrolment.batchLabel}</p>
                <p><strong>Status:</strong> <span className="uppercase font-bold text-[#1E7A46]">{selectedEnrolment.payment.status}</span></p>
                <p><strong>Base Amount:</strong> ₹{selectedEnrolment.pricing.baseAmount}</p>
                <p><strong>Discount:</strong> ₹{selectedEnrolment.pricing.discountAmount} ({selectedEnrolment.pricing.couponCode || 'No coupon'})</p>
                <p><strong>Final Amount:</strong> ₹{selectedEnrolment.pricing.finalAmount}</p>
                <p><strong>Order ID:</strong> {selectedEnrolment.payment.orderId || 'N/A'}</p>
                <p><strong>Payment ID:</strong> {selectedEnrolment.payment.paymentId || 'N/A'}</p>
              </div>
            </div>

            {/* Assessment Breakdown */}
            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-slate-900 uppercase">
                  Pre-Assessment Results
                </span>
                <span className="font-mono font-bold text-sm text-[#1E7A46]">
                  {selectedEnrolment.assessment.score} / {selectedEnrolment.assessment.total} (Recorded)
                </span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Completed at {new Date(selectedEnrolment.assessment.completedAt).toLocaleString('en-IN')}. Questions answered:
              </p>
              <div className="space-y-1.5 pt-1 text-[11px]">
                {ASSESSMENT_QUESTIONS.map(q => {
                  const studentAnsIdx = selectedEnrolment.assessment.answers[q.id];
                  const isCorrect = studentAnsIdx === q.correctIndex;
                  return (
                    <div key={q.id} className="flex items-start justify-between border-b border-emerald-100 pb-1">
                      <span className="text-slate-700 max-w-sm truncate">{q.question}</span>
                      <span className={isCorrect ? 'text-emerald-700 font-semibold' : 'text-slate-500'}>
                        {studentAnsIdx !== undefined ? q.options[studentAnsIdx] : 'Unanswered'} {isCorrect ? '✓' : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedEnrolment(null)}
                className="px-5 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW COUPON MODAL */}
      {showNewCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-heading font-bold text-slate-900">
                Create New Promo Coupon
              </h3>
              <button
                type="button"
                onClick={() => setShowNewCouponModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block font-heading font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DIWALI2026, CAMPUSOFFER"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-heading font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Discount Type
                  </label>
                  <select
                    value={newCoupon.discountType}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-heading font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Value *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newCoupon.discountValue}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-heading font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newCoupon.expiresAt}
                    onChange={(e) => setNewCoupon({ ...newCoupon, expiresAt: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-heading font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newCoupon.usageLimit}
                    onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-heading font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Description / Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. Special 10% College Discount"
                  value={newCoupon.description}
                  onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewCouponModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1E9E54] hover:bg-[#14723B] text-white font-semibold rounded-lg"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT COURSE MODAL */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xl font-heading font-bold text-slate-900">
                  {editingCourseId ? 'Edit Internship Course' : 'Create New Internship Track'}
                </h3>
                <p className="text-xs text-slate-500">
                  Changes will be saved directly into data/db.json and updated immediately across the site.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCourseModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Course / Internship Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Applied AI &amp; Generative Large Language Models"
                    value={courseFormData.title}
                    onChange={(e) => setCourseFormData({ ...courseFormData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. applied-ai-llm"
                    value={courseFormData.slug}
                    onChange={(e) => setCourseFormData({ ...courseFormData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Category Domain *
                  </label>
                  <select
                    value={courseFormData.category}
                    onChange={(e) => setCourseFormData({ ...courseFormData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Mobile Development">Mobile Development</option>
                    <option value="Full-Stack Web">Full-Stack Web</option>
                    <option value="AI & Data Science">AI &amp; Data Science</option>
                    <option value="Cloud & DevOps">Cloud &amp; DevOps</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 100% Placement Track"
                    value={courseFormData.badge}
                    onChange={(e) => setCourseFormData({ ...courseFormData, badge: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 12 Weeks (3 Months)"
                    value={courseFormData.duration}
                    onChange={(e) => setCourseFormData({ ...courseFormData, duration: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Starting Fee (INR) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1000}
                    value={courseFormData.startingFee}
                    onChange={(e) => setCourseFormData({ ...courseFormData, startingFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Next Batch Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 15th December 2026"
                    value={courseFormData.nextBatch}
                    onChange={(e) => setCourseFormData({ ...courseFormData, nextBatch: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Short Description *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Brief overview displayed on course cards..."
                    value={courseFormData.shortDescription}
                    onChange={(e) => setCourseFormData({ ...courseFormData, shortDescription: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Tools &amp; Tech Stack (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Python, PyTorch, LangChain, FastAPI, Docker"
                    value={courseFormData.toolsInput}
                    onChange={(e) => setCourseFormData({ ...courseFormData, toolsInput: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Key Highlights (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Live client project work, 1-on-1 code reviews, Experience Letter"
                    value={courseFormData.highlightsInput}
                    onChange={(e) => setCourseFormData({ ...courseFormData, highlightsInput: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg text-xs hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1E9E54] hover:bg-[#14723B] text-white font-bold rounded-lg text-xs transition-colors shadow-xs"
                >
                  {editingCourseId ? 'Update Course' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ISSUE / EDIT CERTIFICATE MODAL */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xl font-heading font-bold text-slate-900">
                  {editingCertId ? 'Edit Issued Certificate' : 'Issue Official Certificate'}
                </h3>
                <p className="text-xs text-slate-500">
                  This credential will be written to the registry and immediately verifiable on /verify-certificate.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCertModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCertificate} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Certificate ID (optional or custom)
                  </label>
                  <input
                    type="text"
                    disabled={!!editingCertId}
                    placeholder="Auto-generated e.g. VGM-2026-CERT-0105"
                    value={certFormData.id}
                    onChange={(e) => setCertFormData({ ...certFormData, id: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono uppercase disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Enrolment Reference ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. VGM-2026-ENR-0101"
                    value={certFormData.enrolmentId}
                    onChange={(e) => setCertFormData({ ...certFormData, enrolmentId: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={certFormData.studentName}
                    onChange={(e) => setCertFormData({ ...certFormData, studentName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Student Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. rahul@example.com"
                    value={certFormData.studentEmail}
                    onChange={(e) => setCertFormData({ ...certFormData, studentEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Curriculum Track *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AI-Powered Mobile App Dev"
                    value={certFormData.courseTitle}
                    onChange={(e) => setCertFormData({ ...certFormData, courseTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Plan Level *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Builder Plan (8 Weeks)"
                    value={certFormData.planLevel}
                    onChange={(e) => setCertFormData({ ...certFormData, planLevel: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Completion Date *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 18 November 2026"
                    value={certFormData.completionDate}
                    onChange={(e) => setCertFormData({ ...certFormData, completionDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Grade Awarded *
                  </label>
                  <select
                    value={certFormData.grade}
                    onChange={(e) => setCertFormData({ ...certFormData, grade: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Distinction (Grade A+)">Distinction (Grade A+)</option>
                    <option value="First Class with Honors (Grade A)">First Class with Honors (Grade A)</option>
                    <option value="First Class (Grade B+)">First Class (Grade B+)</option>
                    <option value="Passing Certificate">Passing Certificate</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Capstone Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Multi-Modal Local AI Assistant for Offline Diagnostics"
                    value={certFormData.projectTitle}
                    onChange={(e) => setCertFormData({ ...certFormData, projectTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Skills & Competencies (comma-separated) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flutter, Dart, Firebase, Gemini API, Riverpod, Offline Caching"
                    value={certFormData.skillsInput}
                    onChange={(e) => setCertFormData({ ...certFormData, skillsInput: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Authorized Signatory
                  </label>
                  <input
                    type="text"
                    value={certFormData.authorizedSignatory}
                    onChange={(e) => setCertFormData({ ...certFormData, authorizedSignatory: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Verification Status
                  </label>
                  <select
                    value={certFormData.verificationStatus}
                    onChange={(e) => setCertFormData({ ...certFormData, verificationStatus: e.target.value as 'verified' | 'revoked' })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="verified">Verified (Active & Valid)</option>
                    <option value="revoked">Revoked (Invalidated)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCertModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg text-xs hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1E9E54] hover:bg-[#14723B] text-white font-bold rounded-lg text-xs transition-colors shadow-xs"
                >
                  {editingCertId ? 'Update Certificate' : 'Issue & Publish Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STUDENT PROJECT CODE & ARTIFACT REVIEW MODAL */}
      {showReviewModal && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-[#1E7A46]">
                  {selectedProject.enrolmentId}
                </span>
                <h3 className="text-xl font-heading font-bold text-slate-900">
                  Review Capstone: {selectedProject.student.fullName}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedProject.courseTitle || 'AI-Powered Mobile App Dev'} · {selectedProject.planName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Submission Links Preview */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <span className="font-heading font-bold uppercase tracking-wider text-slate-500 block text-[10px]">
                Student Artifacts & Notes
              </span>
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <a
                  href={selectedProject.submission.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg font-mono text-xs hover:bg-[#1E9E54] transition-colors"
                >
                  <span>Open GitHub Repo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {selectedProject.submission.liveUrl && (
                  <a
                    href={selectedProject.submission.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1E9E54]/10 text-[#1E7A46] border border-[#1E9E54]/30 rounded-lg font-mono text-xs hover:bg-[#1E9E54] hover:text-white transition-colors"
                  >
                    <span>View Live Deployment</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {selectedProject.submission.notes && (
                <div className="mt-2 text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
                  <span className="font-semibold text-slate-900 block mb-0.5">Submission Notes:</span>
                  <p>{selectedProject.submission.notes}</p>
                </div>
              )}
            </div>

            {/* Review Evaluation Form */}
            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Review Decision *
                  </label>
                  <select
                    value={reviewFormData.status}
                    onChange={(e) => setReviewFormData({ ...reviewFormData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                  >
                    <option value="approved">Approved (Meets Engineering Standard)</option>
                    <option value="under_review">Under Review (In Progress)</option>
                    <option value="rework_needed">Rework Needed (Corrections Required)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Quality Score (0 - 100) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    required
                    value={reviewFormData.score}
                    onChange={(e) => setReviewFormData({ ...reviewFormData, score: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Reviewer Name / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewFormData.reviewerName}
                    onChange={(e) => setReviewFormData({ ...reviewFormData, reviewerName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Mentorship Feedback &amp; Code Review Notes *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={reviewFormData.feedback}
                    onChange={(e) => setReviewFormData({ ...reviewFormData, feedback: e.target.value })}
                    placeholder="Provide constructive feedback on code structure, architecture, test coverage, and documentation..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleApproveAndIssueCert(selectedProject)}
                  className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1E9E54]" />
                  <span>Approve &amp; Issue Certificate</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg text-xs hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#1E9E54] hover:bg-[#14723B] text-white font-bold rounded-lg text-xs transition-colors shadow-xs"
                  >
                    Save Review
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      </main>
    </div>
  );
};

export default AdminDashboard;
