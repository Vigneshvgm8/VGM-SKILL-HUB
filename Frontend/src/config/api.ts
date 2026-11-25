// ====================================================================
// FRONTEND URL & API CONFIGURATION
// ====================================================================

// --- LOCALHOST CONFIGURATION (Commented out for live production) ---
// export const FRONTEND_URL = 'http://localhost:3000';
// export const API_BASE_URL = 'http://localhost:3000';
// export const ADMIN_PORTAL_URL = 'http://localhost:3001';

// --- LIVE PRODUCTION CONFIGURATION (Active Render Backend) ---
export const FRONTEND_URL = 'https://skillhub.vgmsofttech.com';
export const API_BASE_URL = 'https://vgm-skill-hub.onrender.com';
export const ADMIN_PORTAL_URL = 'https://adminskillhub.vgmsofttech.com';

/**
 * Returns the correct API endpoint URL.
 * Automatically targets the live Render API server when hosted on static hosts like Hostinger.
 */
export function getApiUrl(path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (typeof window !== 'undefined') {
    const host = window.location.hostname.toLowerCase();
    // If running on local development with proxy
    if (host === 'localhost' || host === '127.0.0.1') {
      return clean;
    }
  }
  return `${API_BASE_URL}${clean}`;
}
