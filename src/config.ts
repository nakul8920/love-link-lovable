const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

const normalizeUrl = (value: string) => {
  const trimmed = value.trim().replace(/\/$/, "");
  // Ensure absolute URL with protocol
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return `https://${trimmed}`;
  }
  return trimmed;
};

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

  // Always prioritize the configured API URL if it's set
  if (configuredApiUrl) {
    // Railway typo/rename guard: if env has "-production", use corrected URL first
    if (configuredApiUrl.includes("-production.up.railway.app")) {
      const correctedUrl = configuredApiUrl.replace("-production.up.railway.app", ".up.railway.app");
      pushUnique(correctedUrl);
      pushUnique(configuredApiUrl); // fallback
    } else {
      pushUnique(configuredApiUrl);
    }
  }

  // Always add Railway URLs as fallbacks, prioritizing newest first
  pushUnique("https://love-link-lovable-production.up.railway.app");
  pushUnique("https://love-link-lovable.up.railway.app");
  pushUnique("https://wishlink-express.up.railway.app");

  return out.length ? out : [normalizeUrl("https://love-link-lovable-production.up.railway.app")];
};

export const API_BASE_URL_CANDIDATES = buildApiCandidates();
export const API_BASE_URL = API_BASE_URL_CANDIDATES[0];
