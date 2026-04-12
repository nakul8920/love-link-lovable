const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

const normalizeUrl = (value: string) => {
  const trimmed = value.trim().replace(/\/$/, "");
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return `https://${trimmed}`;
  }
  return trimmed;
};

// Local dev → Express on :5000. Production → set VITE_API_URL when you build/deploy the frontend (your Railway/backend URL).
const getBaseUrl = () => {
  if (import.meta.env.DEV) return "http://localhost:5000";
  if (configuredApiUrl) return normalizeUrl(configuredApiUrl);
  if (import.meta.env.PROD && typeof console !== "undefined") {
    console.warn(
      "[Wishlink] VITE_API_URL is not set. Using default API host; set VITE_API_URL to your deployed backend URL."
    );
  }
  return "https://love-link-lovable-production.up.railway.app";
};

export const API_BASE_URL = getBaseUrl();
