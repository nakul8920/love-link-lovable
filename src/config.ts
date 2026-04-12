const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

const normalizeUrl = (value: string) => {
  const trimmed = value.trim().replace(/\/$/, "");
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return `https://${trimmed}`;
  }
  return trimmed;
};

/**
 * Dev: Express on :5000.
 * Production on Vercel: leave VITE_API_URL unset → "" so requests go to same origin
 * (/api/*, /uploads/*) and root middleware.ts proxies to RAILWAY_API_BASE_URL.
 * Set VITE_API_URL only if the browser must call the API host directly (not needed for Vercel+Railway).
 *
 * Railway-only API: set PUBLIC_ASSET_BASE_URL (or FRONTEND_URL) on the server to your live site
 * (e.g. https://yourapp.vercel.app) so JSON image URLs match where the browser loads /uploads.
 */
const getBaseUrl = () => {
  if (import.meta.env.DEV) return "http://localhost:5000";
  if (configuredApiUrl) return normalizeUrl(configuredApiUrl);
  return "";
};

export const API_BASE_URL = getBaseUrl();
