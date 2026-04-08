const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

// In local development, always use local backend to avoid stale deployed API behavior.
const resolvedApiUrl = import.meta.env.DEV
  ? "http://localhost:5000"
  : configuredApiUrl || window.location.origin;

export const API_BASE_URL = resolvedApiUrl.replace(/\/$/, "");
