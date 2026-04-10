const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

const normalizeUrl = (value: string) => value.trim().replace(/\/$/, "");

const buildApiCandidates = (): string[] => {
  // In local development, always use local backend to avoid stale deployed API behavior.
  if (import.meta.env.DEV) return ["http://localhost:5000"];

  const out: string[] = [];
  const pushUnique = (url?: string | null) => {
    if (!url) return;
    const normalized = normalizeUrl(url);
    if (!normalized || out.includes(normalized)) return;
    out.push(normalized);
  };

  // Railway typo/rename guard: if env has "-production", use corrected URL first
  if (configuredApiUrl?.includes("-production.up.railway.app")) {
    const correctedUrl = configuredApiUrl.replace("-production.up.railway.app", ".up.railway.app");
    pushUnique(correctedUrl);
    pushUnique(configuredApiUrl); // fallback
  } else {
    pushUnique(configuredApiUrl);
  }

  // Add fallback Railway URLs in case the main one doesn't work
  pushUnique("https://love-link-lovable-production.up.railway.app");
  pushUnique("https://love-link-lovable.up.railway.app");
  pushUnique("https://wishlink-express.up.railway.app");
  
  pushUnique(window.location.origin);

  return out.length ? out : [normalizeUrl(window.location.origin)];
};

export const API_BASE_URL_CANDIDATES = buildApiCandidates();
export const API_BASE_URL = API_BASE_URL_CANDIDATES[0];
