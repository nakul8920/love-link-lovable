const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const fallbackApiUrl = import.meta.env.DEV
  ? "http://localhost:5000"
  : window.location.origin;

export const API_BASE_URL = (configuredApiUrl || fallbackApiUrl).replace(/\/$/, "");
