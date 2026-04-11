const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

const normalizeUrl = (value: string) => {
  const trimmed = value.trim().replace(/\/$/, "");
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return `https://${trimmed}`;
  }
  return trimmed;
};

// In local development, use local backend. In production use the specific Railway domain.
const getBaseUrl = () => {
  if (import.meta.env.DEV) return "http://localhost:5000";
  if (configuredApiUrl) return normalizeUrl(configuredApiUrl);
  return "https://wishlink-express.up.railway.app";
};

export const API_BASE_URL = getBaseUrl();
