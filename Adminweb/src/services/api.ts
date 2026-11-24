// ====================================================================
// ADMINWEB API CONFIGURATION
// ====================================================================
// Relative path /api automatically connects to the server in all environments:
// - Local Dev: localhost:3001 proxies /api to http://localhost:3000
// - Production: localhost:3000/adminweb and adminskillhub.vgmsofttech.com
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export interface AdminStats {
  totalEnrolments: number;
  paidCount: number;
  pendingCount: number;
  failedCount: number;
  totalRevenue: number;
  planBreakdown: Record<string, number>;
  paidPlanBreakdown: Record<string, number>;
  courseBreakdown: Record<string, number>;
  totalCertificates: number;
  totalProjects: number;
  reviewedProjectsCount: number;
}

export function getAdminToken(): string | null {
  return localStorage.getItem('vgm_admin_token');
}

export function setAdminToken(token: string) {
  localStorage.setItem('vgm_admin_token', token);
}

export function removeAdminToken() {
  localStorage.removeItem('vgm_admin_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAdminToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
  const res = await fetch(url, { ...options, headers });

  if (res.status === 401) {
    removeAdminToken();
    window.dispatchEvent(new Event('vgm_admin_unauthorized'));
    throw new Error('Unauthorized or session expired');
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return data as T;
}

export const AdminAPI = {
  // Auth
  async login(password: string) {
    const data = await request<{ success: boolean; token: string }>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
    if (data.token) {
      setAdminToken(data.token);
    }
    return data;
  },

  // Stats
  async getStats() {
    return request<AdminStats>('/api/admin/stats');
  },

  // Enrolments
  async getEnrolments(params?: { search?: string; status?: string; plan?: string }) {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.status) query.set('status', params.status);
    if (params?.plan) query.set('plan', params.plan);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return request<{ success: boolean; enrolments: any[] }>(`/api/admin/enrolments${qs}`);
  },

  async updateEnrolmentStatus(id: string, status: 'paid' | 'pending' | 'failed') {
    return request<{ success: boolean; enrolment: any }>(`/api/admin/enrolments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Courses
  async getCourses() {
    return request<{ courses: any[] }>('/api/courses');
  },

  async createCourse(courseData: any) {
    return request<{ success: boolean; course: any }>('/api/admin/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  },

  async updateCourse(id: string, courseData: any) {
    return request<{ success: boolean; course: any }>(`/api/admin/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  },

  async deleteCourse(id: string) {
    return request<{ success: boolean }>(`/api/admin/courses/${id}`, {
      method: 'DELETE',
    });
  },

  // Coupons
  async getCoupons() {
    return request<{ success: boolean; coupons: any[] }>('/api/admin/coupons');
  },

  async createCoupon(couponData: any) {
    return request<{ success: boolean; coupon: any }>('/api/admin/coupons', {
      method: 'POST',
      body: JSON.stringify(couponData),
    });
  },

  async deleteCoupon(code: string) {
    return request<{ success: boolean }>(`/api/admin/coupons/${code}`, {
      method: 'DELETE',
    });
  },

  // Certificates
  async getCertificates(search?: string) {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    return request<{ success: boolean; certificates: any[] }>(`/api/admin/certificates${qs}`);
  },

  async createCertificate(certData: any) {
    return request<{ success: boolean; certificate: any }>('/api/admin/certificates', {
      method: 'POST',
      body: JSON.stringify(certData),
    });
  },

  async updateCertificate(id: string, certData: any) {
    return request<{ success: boolean; certificate: any }>(`/api/admin/certificates/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(certData),
    });
  },

  async deleteCertificate(id: string) {
    return request<{ success: boolean }>(`/api/admin/certificates/${id}`, {
      method: 'DELETE',
    });
  },

  // Project Submissions
  async getProjects() {
    return request<{ success: boolean; projects: any[] }>('/api/admin/projects');
  },

  async reviewProject(enrolmentId: string, reviewData: { status: string; score: number; feedback: string; reviewerName: string }) {
    return request<{ success: boolean; submission: any }>(`/api/admin/projects/${enrolmentId}/review`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },
};
